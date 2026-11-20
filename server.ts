import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface YouTubeResult {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
}

function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace(/^\//, '').split('/')[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      const embedIdx = parts.findIndex((p) => p === 'embed' || p === 'shorts' || p === 'live');
      if (embedIdx !== -1 && parts[embedIdx + 1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[embedIdx + 1])) {
        return parts[embedIdx + 1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

function collectVideoRenderers(node: unknown, out: YouTubeResult[], seen: Set<string>): void {
  if (!node || typeof node !== 'object' || out.length >= 10) return;

  if (Array.isArray(node)) {
    for (const item of node) {
      collectVideoRenderers(item, out, seen);
      if (out.length >= 10) return;
    }
    return;
  }

  const obj = node as Record<string, unknown>;
  if (obj.videoRenderer && typeof obj.videoRenderer === 'object') {
    const vr = obj.videoRenderer as Record<string, unknown>;
    const videoId = typeof vr.videoId === 'string' ? vr.videoId : '';
    if (videoId && !seen.has(videoId)) {
      const titleRuns = (vr.title as { runs?: Array<{ text?: string }> } | undefined)?.runs;
      const title = titleRuns?.map((r) => r.text ?? '').join('').trim() || '';
      const ownerRuns = (vr.ownerText as { runs?: Array<{ text?: string }> } | undefined)?.runs;
      const channel = ownerRuns?.map((r) => r.text ?? '').join('').trim() || 'YouTube';
      const duration =
        (vr.lengthText as { simpleText?: string } | undefined)?.simpleText || 'LIVE';

      if (title) {
        seen.add(videoId);
        out.push({
          id: videoId,
          title,
          channel,
          duration,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        });
      }
    }
  }

  for (const value of Object.values(obj)) {
    collectVideoRenderers(value, out, seen);
    if (out.length >= 10) return;
  }
}

async function searchYouTube(query: string): Promise<YouTubeResult[]> {
  const directId = extractYoutubeId(query);
  if (directId) {
    return [
      {
        id: directId,
        title: '직접 입력한 유튜브 영상',
        channel: 'YouTube 링크',
        duration: '',
        thumbnail: `https://i.ytimg.com/vi/${directId}/mqdefault.jpg`,
      },
    ];
  }

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const response = await fetch(searchUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    },
  });

  if (!response.ok) {
    throw new Error(`YouTube search HTTP ${response.status}`);
  }

  const html = await response.text();
  const marker = 'var ytInitialData = ';
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) {
    throw new Error('Could not locate ytInitialData in response');
  }

  const jsonStart = startIdx + marker.length;
  const endIdx = html.indexOf(';</script>', jsonStart);
  if (endIdx === -1) {
    throw new Error('Could not find end of ytInitialData');
  }

  const parsed = JSON.parse(html.slice(jsonStart, endIdx));
  const results: YouTubeResult[] = [];
  const seen = new Set<string>();
  collectVideoRenderers(parsed, results, seen);
  return results;
}

interface SeoulWeatherResponse {
  condition: 'clear' | 'rain';
  isDay: boolean;
  weatherCode: number | null;
  temperatureC: number | null;
  seoulHour: number;
  source: 'open-meteo' | 'fallback';
}

const RAIN_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
]);

let cachedWeather: { data: SeoulWeatherResponse; expiresAt: number } | null = null;

function getSeoulHourNow(): number {
  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    hour12: false,
  }).format(new Date());
  const parsed = Number.parseInt(formatted, 10);
  return Number.isNaN(parsed) ? 12 : parsed % 24;
}

async function fetchSeoulWeather(): Promise<SeoulWeatherResponse> {
  const now = Date.now();
  if (cachedWeather && cachedWeather.expiresAt > now) {
    return cachedWeather.data;
  }

  const seoulHour = getSeoulHourNow();
  const fallbackIsDay = seoulHour >= 6 && seoulHour < 18;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=weather_code,is_day,temperature_2m&timezone=Asia%2FSeoul',
      { signal: controller.signal }
    );
    clearTimeout(timer);

    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const json = (await res.json()) as {
      current?: {
        weather_code?: number;
        is_day?: number;
        temperature_2m?: number;
      };
    };

    const code = typeof json.current?.weather_code === 'number' ? json.current.weather_code : 0;
    const isDay =
      typeof json.current?.is_day === 'number'
        ? json.current.is_day === 1
        : fallbackIsDay;
    const temp =
      typeof json.current?.temperature_2m === 'number'
        ? Math.round(json.current.temperature_2m * 10) / 10
        : null;

    const data: SeoulWeatherResponse = {
      condition: RAIN_CODES.has(code) ? 'rain' : 'clear',
      isDay,
      weatherCode: code,
      temperatureC: temp,
      seoulHour,
      source: 'open-meteo',
    };
    cachedWeather = { data, expiresAt: now + 10 * 60 * 1000 };
    return data;
  } catch {
    return {
      condition: 'clear',
      isDay: fallbackIsDay,
      weatherCode: null,
      temperatureC: null,
      seoulHour,
      source: 'fallback',
    };
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/weather/seoul', async (_req, res) => {
    const weather = await fetchSeoulWeather();
    res.json(weather);
  });

  app.get('/api/youtube/search', async (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!q) {
      res.status(400).json({ error: '검색어를 입력해 주세요.', items: [] });
      return;
    }

    try {
      const items = await searchYouTube(q);
      res.json({ items });
    } catch (err) {
      console.error('YouTube search error:', err);
      res.status(502).json({
        error: '유튜브 검색 결과를 불러오지 못했습니다. 링크를 직접 붙여넣거나 잠시 후 다시 시도해 주세요.',
        items: [],
      });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const templatePath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`CHERISH DESK server running on http://0.0.0.0:${port}`);
  });
}

void startServer();

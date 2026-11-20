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
      const embedIdx = parts.findIndex(
        (p) => p === 'embed' || p === 'shorts' || p === 'live'
      );
      if (
        embedIdx !== -1 &&
        parts[embedIdx + 1] &&
        /^[a-zA-Z0-9_-]{11}$/.test(parts[embedIdx + 1])
      ) {
        return parts[embedIdx + 1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

function collectVideoRenderers(
  node: unknown,
  out: YouTubeResult[],
  seen: Set<string>
): void {
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
      const titleRuns = (vr.title as { runs?: Array<{ text?: string }> } | undefined)
        ?.runs;
      const title = titleRuns?.map((r) => r.text ?? '').join('').trim() || '';
      const ownerRuns = (vr.ownerText as { runs?: Array<{ text?: string }> } | undefined)
        ?.runs;
      const channel =
        ownerRuns?.map((r) => r.text ?? '').join('').trim() || 'YouTube';
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

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim();
  if (!q) {
    return Response.json(
      { error: '검색어를 입력해 주세요.', items: [] },
      { status: 400 }
    );
  }

  const directId = extractYoutubeId(q);
  if (directId) {
    return Response.json({
      items: [
        {
          id: directId,
          title: '직접 입력한 유튜브 영상',
          channel: 'YouTube 링크',
          duration: '',
          thumbnail: `https://i.ytimg.com/vi/${directId}/mqdefault.jpg`,
        },
      ],
    });
  }

  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
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
    const items: YouTubeResult[] = [];
    const seen = new Set<string>();
    collectVideoRenderers(parsed, items, seen);
    return Response.json({ items });
  } catch {
    return Response.json(
      {
        error:
          '유튜브 검색 결과를 불러오지 못했습니다. 링크를 직접 붙여넣거나 잠시 후 다시 시도해 주세요.',
        items: [],
      },
      { status: 502 }
    );
  }
}

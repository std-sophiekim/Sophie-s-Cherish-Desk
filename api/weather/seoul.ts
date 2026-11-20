const RAIN_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
]);

function getSeoulHourNow(): number {
  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    hour12: false,
  }).format(new Date());
  const parsed = Number.parseInt(formatted, 10);
  return Number.isNaN(parsed) ? 12 : parsed % 24;
}

export async function GET(): Promise<Response> {
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

    const code =
      typeof json.current?.weather_code === 'number' ? json.current.weather_code : 0;
    const isDay =
      typeof json.current?.is_day === 'number'
        ? json.current.is_day === 1
        : fallbackIsDay;
    const temp =
      typeof json.current?.temperature_2m === 'number'
        ? Math.round(json.current.temperature_2m * 10) / 10
        : null;

    return Response.json({
      condition: RAIN_CODES.has(code) ? 'rain' : 'clear',
      isDay,
      weatherCode: code,
      temperatureC: temp,
      seoulHour,
      source: 'open-meteo',
    });
  } catch {
    return Response.json({
      condition: 'clear',
      isDay: fallbackIsDay,
      weatherCode: null,
      temperatureC: null,
      seoulHour,
      source: 'fallback',
    });
  }
}

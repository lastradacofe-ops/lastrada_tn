import type { CorsOptions } from 'cors';

function normalizeOrigin(value: string): string | null {
  try {
    const parsed = new URL(value.trim());
    if ((parsed.protocol !== 'https:' && parsed.protocol !== 'http:') || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

function allowedOrigins() {
  const configured = [process.env.CLIENT_ORIGIN, process.env.CORS_ORIGINS]
    .filter((value): value is string => Boolean(value))
    .flatMap(value => value.split(','))
    .map(normalizeOrigin)
    .filter((origin): origin is string => origin !== null);

  if (process.env.NODE_ENV !== 'production') {
    configured.push('http://localhost:5173', 'http://127.0.0.1:5173');
  }
  return new Set(configured);
}

const origins = allowedOrigins();

export const corsOptions: CorsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }
    callback(null, origins.has(origin));
  },
};

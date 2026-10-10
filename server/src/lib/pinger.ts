/**
 * Keep-alive self-pinger for Render free tier.
 *
 * Render spins down free web services after 15 min of inactivity.
 * This pinger hits /api/healthz every 10 minutes — 24/7 — so the
 * server is always warm and responsive.
 *
 * Set RENDER_EXTERNAL_URL on Render to your service URL.
 * Example: https://lastrada-tn.onrender.com
 */

import { logger } from "./logger";

const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

async function ping(url: string): Promise<void> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    logger.info({ status: res.status }, "keep-alive ping sent");
  } catch (err) {
    logger.warn({ err }, "keep-alive ping failed");
  }
}

export function startPinger(): void {
  const base = process.env.RENDER_EXTERNAL_URL?.trim();

  if (!base) {
    // Not running on Render — skip silently
    return;
  }

  const healthUrl = `${base}/api/healthz`;
  logger.info({ healthUrl }, "keep-alive pinger started (24/7)");

  setInterval(() => {
    void ping(healthUrl);
  }, PING_INTERVAL_MS);
}


/**
 * Keep-alive self-pinger for Render free tier.
 *
 * Render spins down free web services after 15 min of inactivity.
 * This pinger hits /api/healthz every 10 minutes during business hours
 * (06:00 – 00:00 Africa/Tunis = UTC+1) so the server stays warm.
 *
 * Set the environment variable RENDER_EXTERNAL_URL to the Render service URL.
 * Example: https://lastrada-tn.onrender.com
 *
 * Outside business hours (00:00 – 06:00) the pinger is silent to conserve
 * the free monthly compute quota.
 */

import { logger } from "./logger";

const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const ACTIVE_START_HOUR = 6;             // 06:00 Tunis time
const ACTIVE_END_HOUR   = 24;            // 00:00 (midnight) Tunis time
const TUNIS_TZ = "Africa/Tunis";

function tunisHour(): number {
  const now = new Date();
  const localStr = now.toLocaleString("en-US", { timeZone: TUNIS_TZ, hour: "numeric", hour12: false });
  return parseInt(localStr, 10);
}

function isActiveHour(): boolean {
  const h = tunisHour();
  return h >= ACTIVE_START_HOUR && h < ACTIVE_END_HOUR;
}

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
  logger.info({ healthUrl }, "keep-alive pinger initialised");

  setInterval(() => {
    if (isActiveHour()) {
      void ping(healthUrl);
    } else {
      logger.info({ hour: tunisHour() }, "keep-alive pinger quiet (off-hours)");
    }
  }, PING_INTERVAL_MS);
}

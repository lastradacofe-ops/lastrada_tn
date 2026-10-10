import type { NextFunction, Request, Response } from 'express';

const windowMs = 15 * 60 * 1000;
const maxAttempts = 10;
const maxTrackedAddresses = 10_000;
type AttemptWindow = { attempts: number; resetsAt: number };
const attemptsByAddress = new Map<string, AttemptWindow>();

function clientAddress(request: Request) {
  return request.ip || request.socket.remoteAddress || 'unknown';
}

function pruneExpired(now: number) {
  for (const [address, window] of attemptsByAddress) {
    if (window.resetsAt <= now) attemptsByAddress.delete(address);
  }
}

export function resetLoginAttempts(address: string) {
  attemptsByAddress.delete(address);
}

export function limitLoginAttempts(request: Request, response: Response, next: NextFunction) {
  const now = Date.now();
  const address = clientAddress(request);
  let current = attemptsByAddress.get(address);

  if (!current || current.resetsAt <= now) {
    if (attemptsByAddress.size >= maxTrackedAddresses) pruneExpired(now);
    if (attemptsByAddress.size >= maxTrackedAddresses) {
      const oldestAddress = attemptsByAddress.keys().next().value;
      if (oldestAddress) attemptsByAddress.delete(oldestAddress);
    }
    current = { attempts: 0, resetsAt: now + windowMs };
    attemptsByAddress.set(address, current);
  }

  if (current.attempts >= maxAttempts) {
    response.setHeader('Retry-After', String(Math.max(1, Math.ceil((current.resetsAt - now) / 1000))));
    response.status(429).json({ error: 'Too many sign-in attempts. Try again later.' });
    return;
  }

  current.attempts += 1;
  next();
}

import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const cookieName = "lastrada_admin";
const sessionDurationMs = 12 * 60 * 60 * 1000;

function configured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET);
}

function safeEqual(left: string, right: string) {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function signature(expiresAt: string) {
  return createHmac("sha256", process.env.SESSION_SECRET || "")
    .update(expiresAt)
    .digest("base64url");
}

function isValidSession(token: unknown) {
  if (!configured() || typeof token !== "string") return false;
  const [expiresAt, suppliedSignature, extra] = token.split(".");
  if (!expiresAt || !suppliedSignature || extra || !/^\d+$/.test(expiresAt)) return false;
  return Number(expiresAt) > Date.now() && safeEqual(signature(expiresAt), suppliedSignature);
}

export function verifyAdminCredentials(email: unknown, password: unknown) {
  if (!configured() || typeof email !== "string" || typeof password !== "string") return false;
  return safeEqual(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase()) &&
    safeEqual(password, process.env.ADMIN_PASSWORD!);
}

export function createAdminSession(response: Response) {
  const expiresAt = String(Date.now() + sessionDurationMs);
  response.cookie(cookieName, `${expiresAt}.${signature(expiresAt)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionDurationMs,
    path: "/api/admin",
  });
}

export function clearAdminSession(response: Response) {
  response.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/admin",
  });
}

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  if (isValidSession(request.cookies?.[cookieName])) return next();
  response.status(401).json({ error: "Admin sign-in required." });
}

export function adminAuthConfigured() {
  return configured();
}

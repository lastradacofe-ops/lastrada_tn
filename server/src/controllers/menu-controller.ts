import type { Request, Response } from 'express';
import { adminAuthConfigured, clearAdminSession, createAdminSession, verifyAdminCredentials } from '../lib/admin-session';
import { resetLoginAttempts } from '../lib/login-rate-limit';
import { loadMenu, saveMenu } from '../menu/menu-store';
import type { Offer } from '../menu/seed-data';

// Offers use inclusive local-time bounds. Dates are `YYYY-MM-DD`, recurring hours
// are `HH:MM`, and precise windows are `YYYY-MM-DDTHH:MM`.
function todayStamp(now: Date) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
function timeStamp(now: Date) {
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}
function dateTimeStamp(now: Date) {
  return `${todayStamp(now)}T${timeStamp(now)}`;
}

function isOfferLive(offer: Offer, now: Date) {
  if (offer.available === false) return false;
  const day = todayStamp(now);
  if (offer.validFrom && day < offer.validFrom) return false;
  if (offer.validTo && day > offer.validTo) return false;
  const time = timeStamp(now);
  if (offer.dailyFrom && time < offer.dailyFrom) return false;
  if (offer.dailyTo && time > offer.dailyTo) return false;
  const stamp = dateTimeStamp(now);
  if (offer.startsAt && stamp < offer.startsAt) return false;
  if (offer.endsAt && stamp > offer.endsAt) return false;
  return true;
}

export async function getPublicMenu(_request: Request, response: Response) {
  const menu = await loadMenu();
  const activeCategoryIds = new Set(menu.categories.filter(category => category.available !== false).map(category => category.id));
  const products = menu.products.filter(product => product.available && activeCategoryIds.has(product.categoryId));
  const visibleCategoryIds = new Set(products.map(product => product.categoryId));
  const productIds = new Set(products.map(product => product.id));
  // Only publish offers that are live today and whose products are all still visible.
  const offers = (menu.offers ?? [])
    .filter(offer => isOfferLive(offer, new Date()))
    .filter(offer => offer.products.length > 0 && offer.products.every(id => productIds.has(id)))
    .sort((a, b) => a.position - b.position)
    .map(offer => ({ ...offer, products: offer.products.filter(id => productIds.has(id)) }));
  response.json({
    categories: menu.categories.filter(category => visibleCategoryIds.has(category.id)),
    products,
    offers,
  });
}

export function login(request: Request, response: Response) {
  if (!adminAuthConfigured()) {
    response.status(503).json({ error: 'Admin credentials are not configured on the server.' });
    return;
  }
  if (!verifyAdminCredentials(request.body?.email, request.body?.password)) {
    response.status(401).json({ error: 'Email or password is incorrect.' });
    return;
  }
  resetLoginAttempts(request.ip || request.socket.remoteAddress || 'unknown');
  createAdminSession(response);
  response.json({ authenticated: true });
}

export function logout(_request: Request, response: Response) {
  clearAdminSession(response);
  response.status(204).end();
}

export async function getAdminMenu(_request: Request, response: Response) {
  response.json(await loadMenu());
}

export async function updateAdminMenu(request: Request, response: Response) {
  response.json(await saveMenu(request.body));
}

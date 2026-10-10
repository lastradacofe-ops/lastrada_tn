import type { Request, Response } from 'express';
import { adminAuthConfigured, clearAdminSession, createAdminSession, verifyAdminCredentials } from '../lib/admin-session';
import { resetLoginAttempts } from '../lib/login-rate-limit';
import { loadMenu, saveMenu } from '../menu/menu-store';

export async function getPublicMenu(_request: Request, response: Response) {
  const menu = await loadMenu();
  const activeCategoryIds = new Set(menu.categories.filter(category => category.available !== false).map(category => category.id));
  const products = menu.products.filter(product => product.available && activeCategoryIds.has(product.categoryId));
  const visibleCategoryIds = new Set(products.map(product => product.categoryId));
  response.json({
    categories: menu.categories.filter(category => visibleCategoryIds.has(category.id)),
    products,
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

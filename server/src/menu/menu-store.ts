import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MenuPayloadSchema } from '@workspace/api-zod';
import { seededCategories, seededProducts, type Category, type Offer, type Product } from './seed-data';

export type MenuStore = { categories: Category[]; products: Product[]; offers: Offer[] };

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(moduleDirectory, path.basename(moduleDirectory) === 'menu' ? '../../data' : '../data');
const dataFile = path.join(dataDirectory, 'menu.json');
let pendingWrite: Promise<void> = Promise.resolve();

export class MenuValidationError extends Error {
  constructor() {
    super('Menu payload is invalid.');
    this.name = 'MenuValidationError';
  }
}

function initialMenu(): MenuStore {
  return {
    categories: structuredClone(seededCategories),
    products: structuredClone(seededProducts),
    offers: [],
  };
}

function hasValidReferences(menu: MenuStore) {
  const categoryIds = new Set<string>();
  for (const category of menu.categories) {
    if (!category || typeof category.id !== 'string' || !category.id ||
      typeof category.name !== 'string' || !category.name.trim() ||
      !Number.isFinite(category.position) ||
      (category.available !== undefined && typeof category.available !== 'boolean') ||
      categoryIds.has(category.id)) return false;
    categoryIds.add(category.id);
  }
  const productIds = new Set<string>();
  for (const product of menu.products) {
    if (!product || typeof product.id !== 'string' || !product.id ||
      !categoryIds.has(product.categoryId) || typeof product.name !== 'string' ||
      !product.name.trim() || !Number.isFinite(product.price) || product.price < 0 ||
      typeof product.available !== 'boolean' || productIds.has(product.id)) return false;
    productIds.add(product.id);
  }
  // Offers must reference existing products only, and cannot reuse a product twice.
  for (const offer of menu.offers ?? []) {
    if (!offer || typeof offer.id !== 'string' || !offer.id ||
      typeof offer.name !== 'string' || !offer.name.trim() ||
      !Number.isFinite(offer.currentPrice) || offer.currentPrice < 0 ||
      (offer.originalPrice !== undefined &&
        (!Number.isFinite(offer.originalPrice) || offer.originalPrice < 0)) ||
      (offer.validFrom !== undefined && offer.validTo !== undefined && offer.validFrom > offer.validTo) ||
      (offer.dailyFrom !== undefined && offer.dailyTo !== undefined && offer.dailyFrom > offer.dailyTo) ||
      (offer.startsAt !== undefined && offer.endsAt !== undefined && offer.startsAt > offer.endsAt) ||
      (offer.dailyFrom === undefined) !== (offer.dailyTo === undefined) ||
      (offer.startsAt === undefined) !== (offer.endsAt === undefined) ||
      !Array.isArray(offer.products) || offer.products.length === 0) return false;
    const referenced = new Set<string>();
    for (const productId of offer.products) {
      if (!productIds.has(productId) || referenced.has(productId)) return false;
      referenced.add(productId);
    }
  }
  return true;
}

function validMenu(value: unknown): value is MenuStore {
  const parsed = MenuPayloadSchema.safeParse(value);
  return parsed.success && hasValidReferences(parsed.data);
}

async function writeMenu(menu: MenuStore) {
  await mkdir(dataDirectory, { recursive: true });
  const tempFile = `${dataFile}.${process.pid}.${Date.now()}.tmp`;
  try {
    await writeFile(tempFile, JSON.stringify(menu, null, 2), 'utf8');
    await rename(tempFile, dataFile);
  } catch (error) {
    await unlink(tempFile).catch(() => undefined);
    throw error;
  }
}

export async function loadMenu(): Promise<MenuStore> {
  try {
    const parsed: unknown = JSON.parse(await readFile(dataFile, 'utf8'));
    if (validMenu(parsed)) return parsed;
    throw new Error('Saved menu data is invalid.');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    const seeded = initialMenu();
    await writeMenu(seeded);
    return seeded;
  }
}

export async function saveMenu(value: unknown): Promise<MenuStore> {
  const parsed = MenuPayloadSchema.safeParse(value);
  if (!parsed.success) throw new MenuValidationError();
  const next: MenuStore = structuredClone(parsed.data);
  if (!hasValidReferences(next)) throw new MenuValidationError();
  const write = pendingWrite.then(() => writeMenu(next));
  pendingWrite = write.catch(() => undefined);
  await write;
  return next;
}

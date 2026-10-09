import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seededCategories, seededProducts, type Category, type Product } from './seed-data';

export type MenuStore = { categories: Category[]; products: Product[] };

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(moduleDirectory, path.basename(moduleDirectory) === 'menu' ? '../../data' : '../data');
const dataFile = path.join(dataDirectory, 'menu.json');
let pendingWrite: Promise<void> = Promise.resolve();

function initialMenu(): MenuStore {
  return {
    categories: structuredClone(seededCategories),
    products: structuredClone(seededProducts),
  };
}

function validMenu(value: unknown): value is MenuStore {
  if (!value || typeof value !== 'object') return false;
  const menu = value as Partial<MenuStore>;
  if (!Array.isArray(menu.categories) || !Array.isArray(menu.products)) return false;
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
  return true;
}

async function writeMenu(menu: MenuStore) {
  await mkdir(dataDirectory, { recursive: true });
  const tempFile = `${dataFile}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tempFile, JSON.stringify(menu, null, 2), 'utf8');
  await rename(tempFile, dataFile);
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
  if (!validMenu(value)) throw new Error('Menu payload is invalid.');
  const next: MenuStore = structuredClone(value);
  const write = pendingWrite.then(() => writeMenu(next));
  pendingWrite = write.catch(() => undefined);
  await write;
  return next;
}

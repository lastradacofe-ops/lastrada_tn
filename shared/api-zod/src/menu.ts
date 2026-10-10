import { z } from 'zod';

const localeTextSchema = z.object({
  fr: z.string().max(500).optional(),
  en: z.string().max(500).optional(),
  ar: z.string().max(500).optional(),
}).strict();

const categorySchema = z.object({
  id: z.string().trim().min(1).max(128),
  name: z.string().trim().min(1).max(160),
  position: z.number().finite().min(-1_000_000_000).max(1_000_000_000),
  available: z.boolean().optional(),
  translations: localeTextSchema.optional(),
}).strict();

const productImageSchema = z.string().max(7_500_000).refine(value => {
  if (value.startsWith('/assets/menu/')) {
    try {
      const decodedPath = decodeURIComponent(value);
      return !decodedPath.includes('\\') && !decodedPath.split('/').includes('..') && !/[?#\u0000-\u001f]/.test(decodedPath);
    } catch {
      return false;
    }
  }
  return /^data:image\/(?:webp|png|jpeg);base64,[a-z\d+/]+=*$/i.test(value);
}, 'Product image must be a menu asset path or a supported base64 image.');

const productSchema = z.object({
  id: z.string().trim().min(1).max(128),
  categoryId: z.string().trim().min(1).max(128),
  name: z.string().trim().min(1).max(160),
  description: z.string().max(2_000).optional(),
  price: z.number().finite().min(0).max(1_000_000),
  image: productImageSchema.optional(),
  available: z.boolean(),
  translations: localeTextSchema.optional(),
  descriptions: localeTextSchema.optional(),
  position: z.number().finite().min(-1_000_000_000).max(1_000_000_000).optional(),
}).strict();

export const MenuPayloadSchema = z.object({
  categories: z.array(categorySchema).max(250),
  products: z.array(productSchema).max(2_000),
}).strict();

export type MenuPayload = z.infer<typeof MenuPayloadSchema>;

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

/**
 * The full standard base64 alphabet, including `+` and `/`.
 * The previous pattern used `[a-z\d\/]`, which silently omitted `+` — so any
 * photo whose encoding happened to contain one was rejected with
 * "payload invalid" and could not be uploaded at all.
 */
const BASE64_IMAGE = /^data:image\/(?:webp|png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/;

/** A menu asset path is served from /public, so it must not escape that root. */
function isSafeMenuAssetPath(value: string) {
  if (!value.startsWith('/assets/menu/')) return false;
  try {
    const decodedPath = decodeURIComponent(value);
    return !decodedPath.includes('\\') && !decodedPath.split('/').includes('..') && !/[?#\u0000-\u001f]/.test(decodedPath);
  } catch {
    return false;
  }
}

function imageIsAcceptable(value: string) {
  return isSafeMenuAssetPath(value) || BASE64_IMAGE.test(value);
}

const productImageSchema = z.string().max(7_500_000).refine(imageIsAcceptable, 'Product image must be a menu asset path or a supported base64 image.');

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

// Calendar dates are stored as `YYYY-MM-DD` and interpreted in the café's local
// timezone. `validFrom` is inclusive, `validTo` is inclusive.
const offerDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Offer dates must use the YYYY-MM-DD format.');

// Wall-clock times as `HH:MM`, used for the daily recurring window.
const offerTimeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Offer times must use the HH:MM format.');

// Precise local datetimes as `YYYY-MM-DDTHH:MM`, for one-off windows.
const offerDateTimeSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/, 'Offer timestamps must use the YYYY-MM-DDTHH:MM format.');

/**
 * Sanity ceiling for offer prices. A café bundle is never anywhere near this,
 * and an unbounded number field is how "7000 dinars" silently becomes
 * "7,000,000 DT" on the public menu.
 */
export const MAX_OFFER_PRICE = 10_000;

const offerSchema = z.object({
  id: z.string().trim().min(1).max(128),
  name: z.string().trim().min(1).max(160),
  position: z.number().finite().min(-1_000_000_000).max(1_000_000_000),
  validFrom: offerDateSchema.optional(),
  validTo: offerDateSchema.optional(),
  // Recurring daily window, e.g. every day 07:00–11:00 across the whole period.
  dailyFrom: offerTimeSchema.optional(),
  dailyTo: offerTimeSchema.optional(),
  // Precise one-off window, e.g. 2026-10-20T18:00 to 2026-10-20T23:00.
  startsAt: offerDateTimeSchema.optional(),
  endsAt: offerDateTimeSchema.optional(),
  originalPrice: z.number().finite().min(0).max(MAX_OFFER_PRICE).optional(),
  currentPrice: z.number().finite().min(0).max(MAX_OFFER_PRICE),
  image: z.string().max(7_500_000).refine(imageIsAcceptable, 'Offer image must be a menu asset path or a supported base64 image.').optional(),
  products: z.array(z.string()).min(1).max(100),
  translations: localeTextSchema.optional(),
  available: z.boolean().optional(),
}).strict();

export const MenuPayloadSchema = z.object({
  categories: z.array(categorySchema).max(250),
  products: z.array(productSchema).max(2_000),
  offers: z.array(offerSchema).max(100).default([]),
}).strict();

export type MenuPayload = z.infer<typeof MenuPayloadSchema>;

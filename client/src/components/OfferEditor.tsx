import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Check, ImagePlus, X } from 'lucide-react';
import {
  adminText,
  MAX_OFFER_PRICE,
  offerBlockReason,
  type Category,
  type Locale,
  type Offer,
  type Product,
  translated,
} from '../menu-data';
import { formatPrice } from './menu/menu-ui';
import { runImagePicker } from '../image-picker';

/** How an offer is limited in time. Only the chosen mode's fields are shown. */
export const SCHEDULE_MODES = ['all', 'daily', 'dates', 'exact'] as const;
export type ScheduleMode = (typeof SCHEDULE_MODES)[number];

/** Reads the mode back off a stored offer so editing never silently loses it. */
export function scheduleModeOf(offer: Offer): ScheduleMode {
  if (offer.dailyFrom || offer.dailyTo) return 'daily';
  if (offer.startsAt || offer.endsAt) return 'exact';
  if (offer.validFrom || offer.validTo) return 'dates';
  return 'all';
}

/** `YYYY-MM-DD` for an `<input type="date">`, or undefined when blank. */
function fromDateInputValue(value: FormDataEntryValue | null) {
  const raw = typeof value === 'string' ? value.trim() : '';
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : undefined;
}

/** `HH:MM` for an `<input type="time">`, or undefined when blank. */
function fromTimeInputValue(value: FormDataEntryValue | null) {
  const raw = typeof value === 'string' ? value.trim() : '';
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(raw) ? raw : undefined;
}

/** `YYYY-MM-DDTHH:MM` for an `<input type="datetime-local">`, or undefined. */
function fromDateTimeInputValue(value: FormDataEntryValue | null) {
  const raw = typeof value === 'string' ? value.trim() : '';
  return /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/.test(raw) ? raw : undefined;
}

function toDateInputValue(date?: string) {
  return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '';
}

/** Sum of the member product prices — the struck-through "before" price. */
export function offerTotalPrice(offer: Offer, products: Product[]) {
  const byId = new Map(products.map(product => [product.id, product]));
  return offer.products.reduce((sum, id) => sum + (byId.get(id)?.price ?? 0), 0);
}

type Draft = { image?: string };

type OfferEditorProps = {
  draft: Offer;
  products: Product[];
  categories: Category[];
  visibleProductIds: Set<string>;
  locale: Locale;
  notify: (message: string) => void;
  onChange: (next: Offer) => void;
  onToggleProduct: (productId: string) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

/**
 * The offer composer, mounted only while an offer is being edited.
 *
 * Keeping it separate means the product picker — which normalises and sorts the
 * entire catalogue on every keystroke — only does that work while the owner
 * actually has the composer open, instead of on every public page view.
 */
export function OfferEditor({
  draft,
  products,
  categories,
  visibleProductIds,
  locale,
  notify,
  onChange,
  onToggleProduct,
  onSave,
  onClose,
}: OfferEditorProps) {
  const a = adminText[locale];
  const [query, setQuery] = useState('');
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>(() => scheduleModeOf(draft));

  const selectedProducts = useMemo(
    () => draft.products.map(id => products.find(p => p.id === id)).filter((p): p is Product => Boolean(p)),
    [draft.products, products],
  );

  const autoTotal = useMemo(() => Math.round(offerTotalPrice(draft, products) * 1000) / 1000, [draft, products]);

  const categoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return translated(category?.name || '', category?.translations, locale);
  };

  const candidates = useMemo(() => {
    const normalize = (value: string) =>
      value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase(locale);
    const needle = normalize(query.trim());
    const byCategory = new Map(categories.map(c => [c.id, c]));
    return products
      .filter(product => !needle || normalize(
        [product.name, byCategory.get(product.categoryId)?.name || '', ...Object.values(product.translations || {})].join(' '),
      ).includes(needle))
      .sort((l, r) =>
        (byCategory.get(l.categoryId)?.position ?? 0) - (byCategory.get(r.categoryId)?.position ?? 0) ||
        l.name.localeCompare(r.name, locale));
  }, [products, query, categories, locale]);

  const pickImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = ''; // allow re-picking the same file
    await runImagePicker(
      file,
      dataUrl => onChange({ ...draft, image: dataUrl }),
      {
        notAnImage: a.image,
        failed: locale === 'fr' ? 'Impossible de préparer cette image sur cet appareil.'
          : locale === 'ar' ? 'تعذر تجهيز الصورة على هذا الجهاز.'
          : 'This image could not be prepared on this device.',
      },
      notify,
    );
  };

  const update = (patch: Partial<Offer>) => onChange({ ...draft, ...patch });

  // Explicit maps rather than indexing the text bundle by a computed key, which
  // the union of the three locales cannot be narrowed for.
  const modeLabel: Record<ScheduleMode, string> = {
    all: a.modeAll, daily: a.modeDaily, dates: a.modeDates, exact: a.modeExact,
  };
  const modeHint: Record<ScheduleMode, string> = {
    all: a.offerNoWindowHint, daily: a.dailyHint, dates: a.datesHint, exact: a.exactHint,
  };

  // What the customer will actually see, using the same rule as the API.
  const blockReason = offerBlockReason(draft, visibleProductIds);
  const blockMessage: Record<string, string> = {
    hidden: a.offerHiddenHint,
    scheduled: a.offerScheduledHint,
    expired: a.offerExpiredHint,
    'between-hours': `${a.offerBeforeHours} ${draft.dailyFrom}.`,
    'today-done': a.offerFinishedToday,
    'not-started': draft.startsAt ? `${a.offerNotStartedYet} ${a.offerHiddenUntil} ${draft.startsAt.replace('T', ' ')}.` : a.offerNotStartedYet,
    'one-off-ended': a.offerOneOffEnded,
    'no-products': a.offerNoProducts,
    'hidden-products': a.offerHiddenProductsHint,
  };

  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    {/* noValidate: native bubbles give no readable feedback here, so every rule
        is checked on save with a translated, specific message. */}
    <form className="modal-card" onSubmit={onSave} noValidate style={{ maxHeight: '92dvh', overflow: 'auto' }} data-testid="dialog-offer-editor">
      <div className="admin-panel-head">
        <div><div className="admin-kicker">{a.offers}</div><h2>{draft.id ? a.editOffer : a.addOffer}</h2></div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label={a.cancel} data-testid="button-close-offer-editor"><X size={16} /></button>
      </div>

      <label className="image-picker" data-testid="picker-offer-image">
        {draft.image && <img src={draft.image} alt={a.offerImage} />}
        <span><ImagePlus size={15} style={{ verticalAlign: 'middle', marginInlineEnd: 6 }} />{a.offerImage}</span>
        <input type="file" accept="image/*" onChange={pickImage} aria-label={a.offerImage} data-testid="input-offer-image" />
      </label>
      {draft.image && <button type="button" className="btn btn-quiet image-remove" onClick={() => update({ image: undefined })} data-testid="button-remove-offer-image">{a.removeImage}</button>}
      <div className="notice">{a.imageNote}</div>

      <div className="field">
        <label htmlFor="offer-name">{a.offerName}</label>
        <input id="offer-name" name="name" defaultValue={draft.name} required maxLength={60} autoFocus data-testid="input-offer-name" />
      </div>

      <div className="form-grid">
        <div className="field offer-price-field">
          <label htmlFor="offer-original-price">{a.offerOriginalPrice}</label>
          <input id="offer-original-price" name="originalPrice" type="number" inputMode="decimal" step="0.001" min="0" max={MAX_OFFER_PRICE} defaultValue={draft.originalPrice ?? ''} placeholder={String(autoTotal)} data-testid="input-offer-original-price" />
          <span className="field-hint">{a.offerPriceAuto} · {formatPrice(autoTotal)}</span>
        </div>
        <div className="field offer-price-field">
          <label htmlFor="offer-current-price">{a.offerCurrentPrice}</label>
          <input id="offer-current-price" name="currentPrice" type="number" inputMode="decimal" step="0.001" min="0" max={MAX_OFFER_PRICE} defaultValue={draft.currentPrice || ''} required data-testid="input-offer-current-price" />
          <span className="field-hint">{locale === 'fr' ? `Maximum ${MAX_OFFER_PRICE} DT` : locale === 'ar' ? `الحد الأقصى ${MAX_OFFER_PRICE} دينار` : `Up to ${MAX_OFFER_PRICE} DT`}</span>
        </div>
      </div>

      {/* One scheduling mode at a time. Showing all three groups at once made
          the form look far more complicated than the task is. */}
      <fieldset className="offer-schedule">
        <legend>{a.offerSchedule}</legend>
        <div className="offer-modes" role="radiogroup" aria-label={a.offerSchedule}>
          {SCHEDULE_MODES.map(mode => <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={scheduleMode === mode}
            className={`offer-mode${scheduleMode === mode ? ' active' : ''}`}
            onClick={() => setScheduleMode(mode)}
            data-testid={`button-schedule-${mode}`}>
            {modeLabel[mode]}
          </button>)}
        </div>

        {scheduleMode === 'daily' && <div className="form-grid offer-schedule-fields">
          <div className="field"><label htmlFor="offer-daily-from">{a.offerValidFrom}</label><input id="offer-daily-from" name="dailyFrom" type="time" defaultValue={draft.dailyFrom || ''} data-testid="input-offer-daily-from" /></div>
          <div className="field"><label htmlFor="offer-daily-to">{a.offerValidTo}</label><input id="offer-daily-to" name="dailyTo" type="time" defaultValue={draft.dailyTo || ''} data-testid="input-offer-daily-to" /></div>
        </div>}

        {scheduleMode === 'dates' && <div className="form-grid offer-schedule-fields">
          <div className="field"><label htmlFor="offer-valid-from">{a.offerValidFrom}</label><input id="offer-valid-from" name="validFrom" type="date" defaultValue={toDateInputValue(draft.validFrom)} data-testid="input-offer-valid-from" /></div>
          <div className="field"><label htmlFor="offer-valid-to">{a.offerValidTo}</label><input id="offer-valid-to" name="validTo" type="date" defaultValue={toDateInputValue(draft.validTo)} data-testid="input-offer-valid-to" /></div>
        </div>}

        {scheduleMode === 'exact' && <div className="form-grid offer-schedule-fields">
          <div className="field"><label htmlFor="offer-starts-at">{a.offerOneOffFrom}</label><input id="offer-starts-at" name="startsAt" type="datetime-local" defaultValue={draft.startsAt || ''} data-testid="input-offer-starts-at" /></div>
          <div className="field"><label htmlFor="offer-ends-at">{a.offerOneOffTo}</label><input id="offer-ends-at" name="endsAt" type="datetime-local" defaultValue={draft.endsAt || ''} data-testid="input-offer-ends-at" /></div>
        </div>}

        <p className="field-hint">{modeHint[scheduleMode]}</p>
      </fieldset>

      <div className="field">
        <span className="field-label" id="offer-products-label">{a.offerProducts} · {selectedProducts.length}</span>
        {selectedProducts.length > 0 && <ul className="offer-selected-list" aria-labelledby="offer-products-label">
          {selectedProducts.map(product => <li key={product.id}>
            <span className="offer-selected-name">
              {translated(product.name, product.translations, locale)}
              {!visibleProductIds.has(product.id) && <span className="offer-hidden-tag">{a.unavailable}</span>}
            </span>
            <span className="offer-selected-price">{formatPrice(product.price)}</span>
            <button type="button" className="icon-btn" aria-label={`${a.offerRemoveProduct}: ${product.name}`} title={a.offerRemoveProduct} onClick={() => onToggleProduct(product.id)} data-testid={`button-remove-offer-product-${product.id}`}><X size={14} /></button>
          </li>)}
        </ul>}
        {selectedProducts.length === 0 && <p className="field-hint">{a.offerNoProducts}</p>}
      </div>

      {/* Flag members that are hidden, since they will silently hide the offer. */}
      {selectedProducts.some(p => !visibleProductIds.has(p.id)) && (
        <p className="notice notice-warning" role="status" data-testid="offer-hidden-member-warning">
          {a.offerHiddenProductsHint}
        </p>
      )}

      <div className="field">
        <label htmlFor="offer-product-search">{a.offerSearchProducts}</label>
        <input id="offer-product-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={a.offerSearchProducts} data-testid="input-offer-product-search" />
      </div>
      <div className="offer-candidates">
        {candidates.map(product => {
          const selected = draft.products.includes(product.id);
          // Mark members the customer cannot see, so the owner is not surprised later.
          const hidden = !visibleProductIds.has(product.id);
          return <button key={product.id} type="button" className={`offer-candidate${selected ? ' selected' : ''}${hidden ? ' is-hidden' : ''}`} aria-pressed={selected} onClick={() => onToggleProduct(product.id)} data-testid={`button-toggle-offer-product-${product.id}`}>
            <span className="offer-candidate-name">{translated(product.name, product.translations, locale)}</span>
            <span className="offer-candidate-meta">{categoryName(product.categoryId)} · {formatPrice(product.price)}{hidden ? ` · ${a.unavailable}` : ''}</span>
          </button>;
        })}
      </div>

      {blockReason && <p className="notice notice-warning" role="status" data-testid="offer-visibility-warning">{blockMessage[blockReason]}</p>}

      <div className="toggle-line"><span>{a.availableToggle}</span><button type="button" className={`switch ${draft.available === false ? '' : 'on'}`} role="switch" aria-checked={draft.available !== false} aria-label={a.availableToggle} onClick={() => update({ available: draft.available === false })} data-testid="toggle-editor-offer-availability" /></div>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onClose} data-testid="button-cancel-offer">{a.cancel}</button>
        <button className="btn btn-primary" type="submit" disabled={draft.products.length === 0} data-testid="button-save-offer"><Check size={15} /> {a.save}</button>
      </div>
    </form>
  </div>;
}

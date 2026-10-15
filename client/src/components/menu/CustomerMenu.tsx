import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Clock3, Coffee, ChevronLeft, ChevronRight, MapPin, Search, X, CalendarDays, ArrowUp } from 'lucide-react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { copyText, isOfferLive, type Category, type Locale, type Offer, type Product, translated } from '../../menu-data';
import { formatPrice, MenuLanguage, ThemeToggle, type Theme, Brand } from './menu-ui';
import { heroPicture, menuImage, SHEET_SIZES, THUMB_SIZES } from './menu-images';

type CustomerMenuProps = {
  categories: Category[];
  products: Product[];
  offers?: Offer[];
  locale: Locale;
  onLocale: (locale: Locale) => void;
  loading?: boolean;
  preview?: boolean;
  theme: Theme;
  onThemeToggle: () => void;
};

function normalizeSearch(value: string, locale: Locale) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase(locale).trim();
}

function SearchField({ value, onChange, locale, label }: {
  value: string; onChange: (value: string) => void; locale: Locale; label: string;
}) {
  const clearLabel = locale === 'fr' ? 'Effacer la recherche' : locale === 'ar' ? 'مسح البحث' : 'Clear search';
  return <div className="search-row">
    <Search size={18} aria-hidden="true" />
    <input type="search" value={value} onChange={event => onChange(event.target.value)} placeholder={label} aria-label={label} data-testid="input-menu-search" />
    {value && <button type="button" className="search-clear" onClick={() => onChange('')} aria-label={clearLabel} title={clearLabel} data-testid="button-clear-search"><X size={17} aria-hidden="true" /></button>}
    <span className="search-overline" aria-hidden="true">{copyText[locale].menu.toUpperCase()}</span>
  </div>;
}

function CategoryNavigation({ categories, locale, activeCategory, onSelect, rtl }: {
  categories: Category[]; locale: Locale; activeCategory: string; onSelect: (id: string) => void; rtl: boolean;
}) {
  const navRef = useRef<HTMLElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const updateOverflow = () => setHasOverflow(nav.scrollWidth > nav.clientWidth + 2);
    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [categories]);

  // Follow the section the reader is actually looking at. Scrolling the page
  // moves the strip so the current category stays visible; scrolling the strip
  // by hand suspends this, otherwise the two would fight each other.
  const userScrollingRef = useRef(false);
  const autoScrollingRef = useRef(false);
  const suspendTimer = useRef<number | null>(null);
  const autoTimer = useRef<number | null>(null);
  const onStripScroll = () => {
    // Ignore the scroll events our own sync produces, otherwise it marks itself
    // as "the user is scrolling" and then refuses to sync ever again.
    if (autoScrollingRef.current) return;
    userScrollingRef.current = true;
    if (suspendTimer.current !== null) window.clearTimeout(suspendTimer.current);
    suspendTimer.current = window.setTimeout(() => { userScrollingRef.current = false; }, 900);
  };
  useEffect(() => () => {
    if (suspendTimer.current !== null) window.clearTimeout(suspendTimer.current);
    if (autoTimer.current !== null) window.clearTimeout(autoTimer.current);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !activeCategory || userScrollingRef.current) return;
    const chip = nav.querySelector<HTMLElement>(`[data-testid="chip-category-${CSS.escape(activeCategory)}"]`);
    if (!chip) return;
    // Only move when the chip has drifted out of view — never on every tick.
    const navRect = nav.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const fullyVisible = chipRect.left >= navRect.left && chipRect.right <= navRect.right;
    if (fullyVisible) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    autoScrollingRef.current = true;
    if (autoTimer.current !== null) window.clearTimeout(autoTimer.current);
    autoTimer.current = window.setTimeout(() => { autoScrollingRef.current = false; }, 700);
    nav.scrollTo({
      left: nav.scrollLeft + (chipRect.left - navRect.left) - (navRect.width - chipRect.width) / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [activeCategory, rtl]);

  const scrollCategories = () => navRef.current?.scrollBy({
    left: (rtl ? -1 : 1) * (navRef.current?.clientWidth || 0) * 0.72,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });

  return <div className="category-navigation">
    <nav ref={navRef} className="category-sticky" aria-label={copyText[locale].menu} onScroll={onStripScroll}>
      {categories.map(category => <button key={category.id} type="button" className={activeCategory === category.id ? 'active' : ''} aria-current={activeCategory === category.id ? 'location' : undefined} onClick={() => onSelect(category.id)} data-testid={`chip-category-${category.id}`}>
        {translated(category.name, category.translations, locale)}
      </button>)}
    </nav>
    {hasOverflow && <button type="button" className="category-next" onClick={scrollCategories} aria-label={locale === 'fr' ? 'Afficher les catégories suivantes' : locale === 'ar' ? 'عرض الفئات التالية' : 'Show more categories'} title={locale === 'fr' ? 'Autres catégories' : locale === 'ar' ? 'فئات أخرى' : 'More categories'} data-testid="button-scroll-categories">
      {rtl ? <ChevronLeft size={19} aria-hidden="true" /> : <ChevronRight size={19} aria-hidden="true" />}
    </button>}
  </div>;
}

function ProductCard({ product, category, locale, unavailableLabel, onSelect }: {
  product: Product; category: Category; locale: Locale; unavailableLabel: string; onSelect: (product: Product, target: HTMLButtonElement) => void;
}) {
  const name = translated(product.name, product.translations, locale);
  const thumb = menuImage(product.image, THUMB_SIZES);
  return <button type="button" disabled={!product.available} className={`product-row ${!product.available ? 'unavailable' : ''}`} onClick={event => onSelect(product, event.currentTarget)} aria-label={`${name}, ${formatPrice(product.price)}${product.available ? '' : `, ${unavailableLabel}`}`} data-testid={`product-card-${product.id}`}>
    <span className="product-thumb" aria-hidden="true">{thumb ? <img {...thumb} alt="" loading="lazy" decoding="async" width="88" height="88" /> : <span className="placeholder-glyph">{category.id.slice(0, 1).toLocaleUpperCase(locale)}</span>}</span>
    <span className="product-info">
      <span className="product-category-badge">{translated(category.name, category.translations, locale)}</span>
      <span className="product-name">{name}</span>
      {product.description && <span className="product-description">{translated(product.description, product.descriptions, locale)}</span>}
      {!product.available && <span className="unavailable-tag">{unavailableLabel}</span>}
      <span className="product-divider" />
    </span>
    <span className="product-price">{formatPrice(product.price)}</span>
  </button>;
}

function ProductDetails({ product, categoryLabel, locale, rtl, closeRef, dialogRef, closeLabel, onClose }: {
  product: Product; categoryLabel: string; locale: Locale; rtl: boolean; closeRef: RefObject<HTMLButtonElement | null>; dialogRef: RefObject<HTMLElement | null>; closeLabel: string; onClose: () => void;
}) {
  const name = translated(product.name, product.translations, locale);
  const availableLabel = locale === 'fr' ? 'Disponible' : locale === 'ar' ? 'متوفر' : 'Available';
  const sheet = menuImage(product.image, SHEET_SIZES);
  return <div className="detail-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose(); }} role="presentation">
    <section ref={dialogRef} className="detail-sheet" dir={rtl ? 'rtl' : 'ltr'} role="dialog" aria-modal="true" aria-labelledby="product-detail-title" tabIndex={-1} data-testid="dialog-product-details">
      <div className={`sheet-image${product.image ? '' : ' sheet-image-placeholder'}`}>{sheet ? <img {...sheet} alt="" decoding="async" /> : <span className="placeholder-glyph" aria-hidden="true">{product.categoryId === 'coffee' ? 'L' : 'S'}</span>}<span className="sheet-image-category">{categoryLabel}</span></div>
      <div className="sheet-detail-body">
        <div className="sheet-detail-topline"><div className="eyebrow">{categoryLabel}</div><button ref={closeRef} type="button" className="close-sheet" onClick={onClose} aria-label={closeLabel} data-testid="button-close-details"><X size={23} aria-hidden="true" /></button></div>
        <h2 id="product-detail-title">{name}</h2>
        {product.description && <p className="sheet-desc">{translated(product.description, product.descriptions, locale)}</p>}
        <div className="sheet-product-summary"><div className="sheet-price">{formatPrice(product.price)}</div><span className="availability-pill"><i aria-hidden="true" />{availableLabel}</span></div>
        <div className="sheet-separator" aria-hidden="true" />
        <button type="button" className="sheet-close-action" onClick={onClose} data-testid="button-close-details-action">{closeLabel}</button>
      </div>
    </section>
  </div>;
}

/** Formats an inclusive `YYYY-MM-DD` bound in the active locale. */
function formatOfferDate(value: string, locale: Locale) {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  try {
    return new Date(year, month - 1, day).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  } catch {
    return value;
  }
}

function OfferEntry({ offer, memberProducts, locale }: {
  offer: Offer; memberProducts: Product[]; locale: Locale;
}) {
  const name = translated(offer.name, offer.translations, locale);
  const total = memberProducts.reduce((sum, product) => sum + product.price, 0);
  // Prefer the stored "before" price; fall back to the live sum of member products.
  const originalPrice = offer.originalPrice ?? total;
  const saving = Math.max(0, Math.round((1 - offer.currentPrice / originalPrice) * 100));

  const dailyLabel = locale === 'fr' ? 'Chaque jour' : locale === 'ar' ? 'كل يوم' : 'Every day';
  const periodLabel = locale === 'fr' ? 'Période' : locale === 'ar' ? 'الفترة' : 'Dates';
  const untilLabel = locale === 'fr' ? 'Le' : locale === 'ar' ? 'في' : 'On';

  // Windows are collected first so they can be shown as one legible block
  // instead of three separate footnotes the eye has to stitch together.
  const windows: { key: string; icon: 'clock' | 'calendar'; label: string; value: string }[] = [];
  if (offer.dailyFrom) {
    windows.push({ key: 'daily', icon: 'clock', label: dailyLabel, value: `${offer.dailyFrom} – ${offer.dailyTo}` });
  }
  if (offer.startsAt) {
    windows.push({ key: 'oneoff', icon: 'clock', label: untilLabel, value: `${offer.startsAt.replace('T', ' ')} → ${offer.endsAt ? offer.endsAt.replace('T', ' ') : '…'}` });
  }
  if (offer.validFrom || offer.validTo) {
    windows.push({
      key: 'dates',
      icon: 'calendar',
      label: periodLabel,
      value: `${offer.validFrom ? formatOfferDate(offer.validFrom, locale) : '…'} → ${offer.validTo ? formatOfferDate(offer.validTo, locale) : '…'}`,
    });
  }

  return <article className={`offer-entry${offer.image ? '' : ' is-imageless'}`} data-testid={`offer-card-${offer.id}`}>
    {offer.image && <div className="offer-plate"><img src={offer.image} alt="" loading="lazy" decoding="async" /></div>}
    <div className="offer-main">
      <p className="offer-kicker">
        <span>{locale === 'fr' ? 'Offre' : locale === 'ar' ? 'عرض' : 'Offer'}</span>
        {saving > 0 && <span className="offer-saving">−{saving}%</span>}
      </p>
      <h3 className="offer-name">{name}</h3>
      <ul className="offer-lines">
        {memberProducts.map(product => <li className="offer-line" key={product.id}>
          <span className="offer-line-name">{translated(product.name, product.translations, locale)}</span>
          <span className="offer-line-leader" aria-hidden="true" />
          <span className="offer-line-price">{formatPrice(product.price)}</span>
        </li>)}
      </ul>
      <p className="offer-figures">
        {saving > 0 && <s className="offer-was">{formatPrice(originalPrice)}</s>}
        <strong className="offer-now">{formatPrice(offer.currentPrice)}</strong>
      </p>
      {windows.length > 0 && <dl className="offer-when">
        {windows.map(window => <div className="offer-when-row" key={window.key}>
          <dt>{window.icon === 'clock' ? <Clock3 aria-hidden="true" /> : <CalendarDays aria-hidden="true" />}<span>{window.label}</span></dt>
          <dd>{window.value}</dd>
        </div>)}
      </dl>}
    </div>
  </article>;
}

export function CustomerMenu({ categories, products, offers = [], locale, onLocale, loading = false, preview = false, theme, onThemeToggle }: CustomerMenuProps) {
  const text = copyText[locale];
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [offline, setOffline] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const rtl = locale === 'ar';

  const visibleCategories = useMemo(() => [...categories].sort((a, b) => a.position - b.position), [categories]);
  const productsByCategory = useMemo(() => {
    const categoryById = new Map(categories.map(category => [category.id, category]));
    const grouped = new Map<string, Product[]>();
    const normalizedQuery = normalizeSearch(query, locale);
    for (const product of products) {
      const category = categoryById.get(product.categoryId);
      const searchableText = [
        product.name,
        product.description || '',
        ...Object.values(product.translations || {}),
        ...Object.values(product.descriptions || {}),
        ...(category ? [category.name, ...Object.values(category.translations || {})] : []),
      ].join(' ');
      if (normalizedQuery && !normalizeSearch(searchableText, locale).includes(normalizedQuery)) continue;
      const items = grouped.get(product.categoryId) || [];
      items.push(product);
      grouped.set(product.categoryId, items);
    }
    return grouped;
  }, [categories, products, query, locale]);

  const resultCount = useMemo(() => [...productsByCategory.values()].reduce((count, items) => count + items.length, 0), [productsByCategory]);

  // Offers pinned above the categories; hidden when hidden, not started, or finished.
  const liveOffers = useMemo(() => {
    const productById = new Map(products.map(product => [product.id, product]));
    return offers
      .filter(offer => isOfferLive(offer) && offer.products.length > 0)
      .map(offer => ({ offer, members: offer.products.map(id => productById.get(id)).filter((p): p is Product => Boolean(p)) }))
      .filter(entry => entry.members.length > 0)
      .sort((l, r) => l.offer.position - r.offer.position);
  }, [offers, products]);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener('offline', update);
    window.addEventListener('online', update);
    update();
    return () => { window.removeEventListener('offline', update); window.removeEventListener('online', update); };
  }, []);

  // Reveal the back-to-top control once the guest is well past the hero.
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > Math.max(600, window.innerHeight * 0.9));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    if (!visibleCategories.length) return;
    const nodes = document.querySelectorAll('.menu-category');
    if (!nodes.length) return;
    const observer = new IntersectionObserver(entries => {
      const current = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (current) setActiveCategory(current.target.id.replace('category-', ''));
    }, { rootMargin: '-100px 0px -72% 0px' });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [visibleCategories, productsByCategory]);

  useEffect(() => {
    if (!selected) {
      // preventScroll matters: unlocking the body can drop the scroll position,
      // and a plain focus() would then drag the guest back to this row.
      openerRef.current?.focus({ preventScroll: true });
      openerRef.current = null;
      return;
    }
    const previousOverflow = document.body.style.overflow;
    const lockedScrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelected(null);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      // Re-assert where the guest was, so closing a sheet never scrolls the page.
      if (window.scrollY !== lockedScrollY) window.scrollTo({ top: lockedScrollY, behavior: 'auto' });
    };
  }, [selected]);

  const openDetails = (product: Product, target: HTMLButtonElement) => {
    openerRef.current = target;
    setSelected(product);
  };
  const jumpTo = (id: string) => {
    setActiveCategory(id);
    document.getElementById(`category-${id}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  const skipLabel = locale === 'fr' ? 'Aller directement à la carte' : locale === 'ar' ? 'انتقل مباشرة إلى القائمة' : 'Skip to menu';
  const topLabel = locale === 'fr' ? 'Revenir en haut' : locale === 'ar' ? 'العودة إلى الأعلى' : 'Back to top';
  const resultLabel = locale === 'fr' ? 'résultats' : locale === 'ar' ? 'نتائج' : 'results';

  return <div className={`menu-shell${preview ? ' menu-preview' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
    {!preview && <a className="skip-link" href="#menu-main">{skipLabel}</a>}
    {!preview && <header className="menu-topbar">
      <a href={import.meta.env.BASE_URL} className="brand-lockup" data-testid="link-brand-home"><Brand /></a>
      <div className="menu-topbar-actions"><ThemeToggle theme={theme} onToggle={onThemeToggle} locale={locale} /><MenuLanguage locale={locale} onChange={onLocale} /></div>
    </header>}
    <section className="hero" aria-labelledby="menu-hero-title">
      <div className="hero-visual">
        <div className="hero-art">
          <img className="hero-photo" src={heroPicture.src} srcSet={heroPicture.srcSet} sizes={heroPicture.sizes} width={2048} height={1534} alt={locale === 'fr' ? 'Intérieur du café LASTRADA' : locale === 'ar' ? 'الديكور الداخلي لمقهى لاستـرادا' : 'Interior of LASTRADA café'} fetchPriority="high" decoding="async" data-testid="img-menu-hero" />
          <span className="hero-art-orbit" aria-hidden="true"><span className="hero-art-orbit-path" /><span className="hero-art-orbit-dot" /><Coffee size={20} strokeWidth={1.5} /></span>
          <span className="art-caption">{text.tagline}</span>
        </div>
        <div className="hero-copy">
          <div className="eyebrow">CAFÉ · RESTO</div>
          <h1 id="menu-hero-title">LASTRADA<br />Café-Resto</h1>
          <p>{text.intro}</p>
          <a className="hero-menu-link" href="#menu-main">{locale === 'fr' ? 'Découvrir la carte' : locale === 'ar' ? 'اكتشفوا القائمة' : 'Explore the menu'} <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-hours"><Clock3 size={17} aria-hidden="true" /><span>{text.open}</span></div>
      </div>
    </section>
    <main id="menu-main" className="menu-content" tabIndex={-1}>
      <SearchField value={query} onChange={setQuery} locale={locale} label={text.search} />
      {query.trim() && <p className="search-result-count" role="status" aria-live="polite">{resultCount} {resultLabel}</p>}
      <CategoryNavigation categories={visibleCategories} locale={locale} activeCategory={activeCategory} onSelect={jumpTo} rtl={rtl} />
      {!loading && liveOffers.length > 0 && (
        <section className="menu-offers" id="menu-offers" data-testid="section-offers" aria-labelledby="menu-offers-title">
          <div className="category-heading">
            <h2 id="menu-offers-title">{text.offers}</h2>
            <span>{String(liveOffers.length).padStart(2, '0')} {locale === 'fr' ? 'OFFRES' : locale === 'ar' ? 'عروض' : 'OFFERS'}</span>
          </div>
          <div className="offer-list">
            {liveOffers.map(({ offer, members }) => <OfferEntry key={offer.id} offer={offer} memberProducts={members} locale={locale} />)}
          </div>
        </section>
      )}
      {loading ? <div className="menu-loading" aria-label={text.loading} aria-busy="true">{[1, 2, 3].map(n => <div className="skeleton" key={n} />)}</div> : resultCount === 0 ? <div className="empty-state" data-testid="empty-menu-search"><Search size={24} aria-hidden="true" /><p>{text.noResults}</p>{query && <button type="button" className="btn btn-quiet" onClick={() => setQuery('')}>{locale === 'fr' ? 'Effacer la recherche' : locale === 'ar' ? 'مسح البحث' : 'Clear search'}</button>}</div> :
        visibleCategories.map(category => {
          const items = productsByCategory.get(category.id) || [];
          if (!items.length) return null;
          return <section className="menu-category" id={`category-${category.id}`} key={category.id} data-testid={`section-category-${category.id}`}>
            <div className="category-heading"><h2>{translated(category.name, category.translations, locale)}</h2><span>{String(items.length).padStart(2, '0')} {locale === 'fr' ? 'ARTICLES' : locale === 'ar' ? 'أصناف' : 'ITEMS'}</span></div>
            {items.map(product => <ProductCard key={product.id} product={product} category={category} locale={locale} unavailableLabel={text.unavailable} onSelect={openDetails} />)}
          </section>;
        })}
      {!preview && <div className="notice" data-testid="status-cached-menu">{offline ? text.cached : (locale === 'fr' ? 'Votre carte reste disponible, même lorsque le réseau s’éclipse.' : locale === 'ar' ? 'القائمة متاحة حتى عند انقطاع الشبكة.' : 'Your menu stays close, even when the network wanders.')}</div>}
    </main>
    {!preview && <footer className="menu-footer">
      <div className="footer-inner">
        <section><div className="footer-brand">LASTRADA · CAFÉ-RESTO</div><p>{text.footer}</p><a href={`${import.meta.env.BASE_URL}admin`} data-testid="link-admin-entry">{text.adminEntry}</a></section>
        <section><h3>{text.hoursTitle}</h3><p data-testid="text-hours-placeholder">{text.hours}</p></section>
        <section><h3>{text.addressTitle}</h3><p><MapPin size={13} style={{ verticalAlign: 'middle', marginInlineEnd: 6 }} aria-hidden="true" />{text.address} · LASTRADA20 P2, 3100</p><a className="placeholder-link" href="https://maps.app.goo.gl/nen9bnFSdq4LyJB98" target="_blank" rel="noreferrer" data-testid="link-itinerary">{text.itinerary}</a></section>
        <section><h3>{text.phoneTitle}</h3><p data-testid="text-phone-placeholder"><a href="tel:+21651524107">+216 51 524 107</a></p><h3 className="social-title">{text.socialTitle}</h3><div className="social-links" data-testid="text-social-placeholder"><a href="https://www.facebook.com/Lastrada24/" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF size={17} aria-hidden="true" /><span>Facebook</span></a><a href="https://www.instagram.com/lastrada_lounge/?hl=en" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram size={18} aria-hidden="true" /><span>Instagram</span></a></div></section>
      </div>
    </footer>}
    {/* Hidden while a product sheet is open: it would otherwise float over the
        dialog and compete with it for taps. */}
    {!preview && !selected && showTop && <button type="button" className="to-top is-visible" onClick={scrollToTop}
      aria-label={topLabel} title={topLabel} data-testid="button-to-top">
      <ArrowUp size={19} strokeWidth={1.8} aria-hidden="true" />
    </button>}
    {selected && <ProductDetails product={selected} categoryLabel={translated(visibleCategories.find(category => category.id === selected.categoryId)?.name || '', visibleCategories.find(category => category.id === selected.categoryId)?.translations, locale)} locale={locale} rtl={rtl} closeRef={closeRef} dialogRef={dialogRef} closeLabel={text.close} onClose={() => setSelected(null)} />}
  </div>;
}

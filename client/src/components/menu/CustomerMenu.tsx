import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Clock3, Coffee, ChevronLeft, ChevronRight, MapPin, Search, X } from 'lucide-react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { copyText, type Category, type Locale, type Product, translated } from '../../menu-data';
import { formatPrice, MenuLanguage, ThemeToggle, type Theme, Brand } from './menu-ui';

type CustomerMenuProps = {
  categories: Category[];
  products: Product[];
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

  const scrollCategories = () => navRef.current?.scrollBy({
    left: (rtl ? -1 : 1) * (navRef.current?.clientWidth || 0) * 0.72,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });

  return <div className="category-navigation">
    <div className="category-strip-heading" aria-hidden="true">
      <span>{locale === 'fr' ? 'À découvrir' : locale === 'ar' ? 'اكتشفوا' : 'Explore'}</span>
      <i />
    </div>
    <nav ref={navRef} className="category-sticky" aria-label={copyText[locale].menu}>
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
  return <button type="button" disabled={!product.available} className={`product-row ${!product.available ? 'unavailable' : ''}`} onClick={event => onSelect(product, event.currentTarget)} aria-label={`${name}, ${formatPrice(product.price)}${product.available ? '' : `, ${unavailableLabel}`}`} data-testid={`product-card-${product.id}`}>
    <span className="product-thumb" aria-hidden="true">{product.image ? <img src={product.image} alt="" loading="lazy" width="88" height="88" /> : <span className="placeholder-glyph">{category.id.slice(0, 1).toLocaleUpperCase(locale)}</span>}</span>
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

function ProductDetails({ product, locale, rtl, closeRef, dialogRef, closeLabel, detailLabel, onClose }: {
  product: Product; locale: Locale; rtl: boolean; closeRef: RefObject<HTMLButtonElement | null>; dialogRef: RefObject<HTMLElement | null>; closeLabel: string; detailLabel: string; onClose: () => void;
}) {
  const name = translated(product.name, product.translations, locale);
  return <div className="detail-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose(); }} role="presentation">
    <section ref={dialogRef} className="detail-sheet" dir={rtl ? 'rtl' : 'ltr'} role="dialog" aria-modal="true" aria-labelledby="product-detail-title" tabIndex={-1} data-testid="dialog-product-details">
      <div className="sheet-handle" aria-hidden="true" />
      <div className="sheet-image">{product.image ? <img src={product.image} alt="" /> : <span className="placeholder-glyph" aria-hidden="true">{product.categoryId === 'coffee' ? 'L' : 'S'}</span>}</div>
      <div className="sheet-titleline"><div><div className="eyebrow">{detailLabel}</div><h2 id="product-detail-title">{name}</h2></div><button ref={closeRef} type="button" className="close-sheet" onClick={onClose} aria-label={closeLabel} data-testid="button-close-details"><X size={17} aria-hidden="true" /></button></div>
      {product.description && <p className="sheet-desc">{translated(product.description, product.descriptions, locale)}</p>}
      <div className="product-price">{formatPrice(product.price)}</div>
    </section>
  </div>;
}

export function CustomerMenu({ categories, products, locale, onLocale, loading = false, preview = false, theme, onThemeToggle }: CustomerMenuProps) {
  const text = copyText[locale];
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [offline, setOffline] = useState(false);
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

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener('offline', update);
    window.addEventListener('online', update);
    update();
    return () => { window.removeEventListener('offline', update); window.removeEventListener('online', update); };
  }, []);

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
      openerRef.current?.focus();
      openerRef.current = null;
      return;
    }
    const previousOverflow = document.body.style.overflow;
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
          <img className="hero-photo" src={`${import.meta.env.BASE_URL}lastrada-interior.jpg`} alt={locale === 'fr' ? 'Intérieur du café LASTRADA' : locale === 'ar' ? 'الديكور الداخلي لمقهى لاستـرادا' : 'Interior of LASTRADA café'} fetchPriority="high" data-testid="img-menu-hero" />
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
    {selected && <ProductDetails product={selected} locale={locale} rtl={rtl} closeRef={closeRef} dialogRef={dialogRef} closeLabel={text.close} detailLabel={text.detail} onClose={() => setSelected(null)} />}
  </div>;
}

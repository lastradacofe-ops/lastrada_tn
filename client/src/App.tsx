import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Router as WouterRouter, useLocation } from 'wouter';
import { ArrowDown, ArrowLeft, ArrowUp, Check, ChevronRight, Coffee, Eye, GripVertical, Pencil, Plus, Trash2, Utensils, X, ImagePlus, Smartphone, LogOut, Tag, LayoutList } from 'lucide-react';
import { adminText, Category, Locale, Product, translated } from './menu-data';
import { CustomerMenu } from './components/menu/CustomerMenu';
import { Brand, formatPrice, MenuLanguage, ThemeToggle, type Theme } from './components/menu/menu-ui';

type AdminTab = 'categories' | 'products' | 'preview';
type ConfirmState = { title: string; message: string; action: () => void } | null;
type StoreState = { categories: Category[]; products: Product[] };

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
const adminToasts = {
  fr: { welcome:'Bienvenue dans votre éditeur local.', categoryRemoved:'Catégorie supprimée.', productRemoved:'Produit supprimé.', categoryUpdated:'Catégorie mise à jour.', categoryAdded:'Catégorie ajoutée.', productUpdated:'Produit mis à jour.', productAdded:'Produit ajouté.', reset:'Carte de démonstration restaurée.', signout:'Déconnexion démo' },
  en: { welcome:'Welcome to your local editor.', categoryRemoved:'Category deleted.', productRemoved:'Product deleted.', categoryUpdated:'Category updated.', categoryAdded:'Category added.', productUpdated:'Product updated.', productAdded:'Product added.', reset:'Demo menu restored.', signout:'Demo sign out' },
  ar: { welcome:'مرحباً بك في المحرر المحلي.', categoryRemoved:'تم حذف الفئة.', productRemoved:'تم حذف المنتج.', categoryUpdated:'تم تحديث الفئة.', categoryAdded:'تمت إضافة الفئة.', productUpdated:'تم تحديث المنتج.', productAdded:'تمت إضافة المنتج.', reset:'تمت استعادة قائمة التجربة.', signout:'الخروج من التجربة' },
} as const;

function RoutedApp() {
  const [location, setLocation] = useLocation();
  const [locale, setLocale] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem('lastrada-locale');
    return savedLocale === 'en' || savedLocale === 'ar' || savedLocale === 'fr' ? savedLocale : 'fr';
  });
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('lastrada-theme') as Theme) || 'light');
  const [store, setStore] = useState<StoreState>({ categories: [], products: [] });
  const [tab, setTab] = useState<AdminTab>('categories');
  const [signedIn, setSignedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [modal, setModal] = useState<ConfirmState>(null);
  const [categoryDraft, setCategoryDraft] = useState<Category | null>(null);
  const [productDraft, setProductDraft] = useState<Product | null>(null);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const isAdmin = location.startsWith('/admin');
  const a = adminText[locale];
  useEffect(() => {
    const root = document.documentElement;
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    root.lang = locale;
    if (isAdmin) {
      document.title = 'LASTRADA Menu Admin';
      if (robots) robots.content = 'noindex, nofollow';
    } else {
      document.title = locale === 'en'
        ? 'LASTRADA Café-Resto in Kairouan | Menu'
        : locale === 'ar'
          ? 'لاستـرادا كافيه ريستو في القيروان | القائمة'
          : 'LASTRADA Café-Resto à Kairouan | Menu';
      if (robots) robots.content = 'index, follow';
    }
  }, [isAdmin, locale]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const saveStore = async (next: StoreState) => {
    try {
      const saved = await apiRequest<StoreState>('/api/admin/menu', { method: 'PUT', body: JSON.stringify(next) });
      setStore(saved);
      return true;
    } catch (error) {
      notify(error instanceof Error ? error.message : 'The menu could not be saved.');
      return false;
    }
  };
  const chooseLocale = (next: Locale) => { setLocale(next); localStorage.setItem('lastrada-locale', next); };
  const toggleTheme = () => setTheme(current => current === 'light' ? 'dark' : 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('lastrada-theme', theme);
  }, [theme]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setAuthChecked(!isAdmin);
    const load = async () => {
      try {
        if (isAdmin) {
          try {
            await apiRequest<{ authenticated: boolean }>('/api/admin/session');
            if (active) setSignedIn(true);
          } catch {
            if (active) setSignedIn(false);
            return;
          }
        }
        const menu = await apiRequest<StoreState>(isAdmin ? '/api/admin/menu' : '/api/menu');
        if (active) setStore(menu);
      } catch (error) {
        if (active) notify(error instanceof Error ? error.message : 'The menu could not be loaded.');
      } finally {
        if (active) {
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };
    void load();
    return () => { active = false; };
  }, [isAdmin]);
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register(`${import.meta.env.BASE_URL}service-worker.js`).catch(() => undefined);
  }, []);
  const sortedCategories = useMemo(() => [...store.categories].sort((a,b) => a.position-b.position), [store.categories]);
  const changeTab = (next: AdminTab) => setTab(next);
  const loginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const values = new FormData(event.currentTarget);
    try {
      await apiRequest<{ authenticated: boolean }>('/api/admin/login', { method: 'POST', body: JSON.stringify({ email: values.get('email'), password: values.get('password') }) });
      const menu = await apiRequest<StoreState>('/api/admin/menu');
      setStore(menu); setSignedIn(true); setAuthChecked(true); notify(adminToasts[locale].welcome);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Sign-in failed.');
    }
  };
  const signOut = async () => {
    try { await apiRequest<void>('/api/admin/logout', { method: 'POST' }); }
    finally { setSignedIn(false); setAuthChecked(true); setLocation('/admin'); }
  };
  const applyMenu = async (next: StoreState, successMessage: string) => {
    if (await saveStore(next)) {
      setModal(null);
      setCategoryDraft(null);
      setProductDraft(null);
      notify(successMessage);
    }
  };
  const moveCategory = (id: string, offset: number) => {
    const next = [...sortedCategories]; const i = next.findIndex(c => c.id === id); const target = i + offset;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    saveStore({ ...store, categories: next.map((c, position) => ({ ...c, position: (position + 1) * 1000 })) });
  };
  const moveCategoryFirst = (id: string) => {
    const next = [...sortedCategories]; const index = next.findIndex(c => c.id === id);
    if (index <= 0) return;
    const [category] = next.splice(index, 1); next.unshift(category);
    saveStore({ ...store, categories: next.map((c, position) => ({ ...c, position: (position + 1) * 1000 })) });
  };
  const moveProduct = (id: string, offset: number) => {
    const item = store.products.find(p => p.id === id); if (!item) return;
    const group = store.products.filter(p => p.categoryId === item.categoryId); const index = group.findIndex(p => p.id === id); const to = index + offset;
    if (to < 0 || to >= group.length) return;
    [group[index],group[to]] = [group[to],group[index]];
    const next = [...store.products.filter(p => p.categoryId !== item.categoryId), ...group];
    saveStore({ ...store, products: next });
  };
  const toggleProduct = (id: string) => saveStore({ ...store, products: store.products.map(p => p.id === id ? { ...p, available: !p.available } : p) });
  const toggleCategory = (id: string) => saveStore({ ...store, categories: store.categories.map(c => c.id === id ? { ...c, available: c.available === false } : c) });
  const removeCategory = (id: string) => {
    const category = store.categories.find(c => c.id === id);
    setModal({ title:a.deleteCategory, message:`${category?.name || ''} — ${a.removedCategory}`, action:() => {
      void applyMenu({ categories: store.categories.filter(c => c.id !== id).sort((left,right) => left.position-right.position).map((c,position) => ({...c,position:(position+1)*1000})), products: store.products.filter(p => p.categoryId !== id) }, adminToasts[locale].categoryRemoved);
    }});
  };
  const removeProduct = (id: string) => {
    const product = store.products.find(p => p.id === id);
    setModal({ title:a.deleteProduct, message:`${product?.name || ''} — ${a.removedProduct}`, action:() => {
      void applyMenu({ ...store, products: store.products.filter(p => p.id !== id) }, adminToasts[locale].productRemoved);
    }});
  };
  const saveCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget); const name = String(form.get('name')).trim();
    if (!name) return;
    if (categoryDraft?.id) void applyMenu({ ...store, categories: store.categories.map(c => c.id === categoryDraft.id ? {...c,name} : c) }, adminToasts[locale].categoryUpdated);
    else { const id = `cat-${Date.now()}`; void applyMenu({ ...store, categories:[...store.categories,{id,name,position:(store.categories.length+1)*1000,available:true}] }, adminToasts[locale].categoryAdded); }
  };
  const saveProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const name = String(form.get('name')).trim(); const categoryId = String(form.get('categoryId')); const price = Number(form.get('price'));
    if (!name || !categoryId || !Number.isFinite(price) || price < 0) return;
    const item: Product = { id:productDraft?.id || `product-${Date.now()}`, categoryId, name, description:String(form.get('description')).trim(), price, available:productDraft?.available ?? true, image:productDraft?.image, translations:productDraft?.translations, descriptions:productDraft?.descriptions };
    void applyMenu({ ...store, products:productDraft?.id ? store.products.map(p => p.id === item.id ? item : p) : [...store.products,item] }, productDraft?.id ? adminToasts[locale].productUpdated : adminToasts[locale].productAdded);
  };
  const imageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notify(locale === 'fr' ? 'Choisissez un fichier image.' : locale === 'ar' ? 'يرجى اختيار ملف صورة.' : 'Please choose an image file.');
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = 800; canvas.height = 800;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable');
      const scale = Math.min(800 / bitmap.width, 800 / bitmap.height);
      const width = bitmap.width * scale;
      const height = bitmap.height * scale;
      context.fillStyle = '#f7f3eb';
      context.fillRect(0, 0, 800, 800);
      context.drawImage(bitmap, (800 - width) / 2, (800 - height) / 2, width, height);
      bitmap.close();
      const previewBlob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('WebP preview failed')), 'image/webp', 0.82));
      const previewUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Image preview failed'));
        reader.onerror = () => reject(new Error('Image preview failed'));
        reader.readAsDataURL(previewBlob);
      });
      setProductDraft(draft => draft ? {...draft,image:previewUrl} : draft);
    } catch {
      notify(locale === 'fr' ? 'Impossible de préparer cette image sur cet appareil.' : locale === 'ar' ? 'تعذر تجهيز الصورة على هذا الجهاز.' : 'This image could not be prepared on this device.');
    }
  };
  if (!isAdmin) return <CustomerMenu categories={store.categories} products={store.products} locale={locale} onLocale={chooseLocale} loading={loading} theme={theme} onThemeToggle={toggleTheme} />;
  if (!authChecked || loading) return <main className="admin-login" aria-live="polite"><div className="login-card">{a.loading}</div></main>;
  if (!signedIn) return <main className="admin-login" dir={locale === 'ar' ? 'rtl' : 'ltr'}><form className="login-card" onSubmit={loginSubmit}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}><Brand /><div className="menu-topbar-actions"><ThemeToggle theme={theme} onToggle={toggleTheme} locale={locale} /><MenuLanguage locale={locale} onChange={chooseLocale} /></div></div><div className="admin-kicker" style={{marginTop:28}}>{a.loginEyebrow}</div><h1>{a.loginTitle}</h1>
    <p className="login-description">{a.loginBody}</p>
    <div className="field"><label htmlFor="admin-email">{a.email}</label><input id="admin-email" type="email" name="email" autoComplete="username" required data-testid="input-login-email" /></div>
    <div className="field"><label htmlFor="admin-password">{a.password}</label><input id="admin-password" type="password" name="password" autoComplete="current-password" required data-testid="input-login-password" /></div>
    <button className="btn btn-primary" type="submit" style={{width:'100%',padding:13}} data-testid="button-admin-login">{a.enter} <ChevronRight size={15} /></button>
    <button type="button" className="btn btn-quiet" style={{width:'100%',marginTop:9}} onClick={() => setLocation('/')} data-testid="button-back-menu"><ArrowLeft size={14} /> {a.back}</button>
  </form></main>;

  return <div className="admin-shell" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <header className="admin-header"><a href={import.meta.env.BASE_URL} className="brand-lockup" data-testid="link-admin-brand"><Brand small /></a>
      <div style={{display:'flex',gap:8,alignItems:'center'}}><ThemeToggle theme={theme} onToggle={toggleTheme} locale={locale} /><MenuLanguage locale={locale} onChange={chooseLocale}/><button className="btn btn-quiet" onClick={() => setLocation('/')} data-testid="button-view-menu"><Eye size={15} /> <span className="optional-action">{a.view}</span></button>
      <button className="icon-btn" onClick={signOut} aria-label={adminToasts[locale].signout} title={adminToasts[locale].signout} data-testid="button-admin-signout"><LogOut size={16} /></button></div>
    </header>
    <main className="admin-main">
      <div className="install-hint"><Smartphone size={18} /><span><strong>{a.installTitle}</strong><br />{a.installBody}</span></div>
      <div className="admin-title-row"><div><div className="admin-kicker">{a.editor}</div><h1>{tab === 'categories' ? a.categories : tab === 'products' ? a.products : a.preview}</h1></div>
      </div>
      <nav className="admin-nav" aria-label={a.editor}>{([[ 'categories',a.tabCategories,LayoutList],['products',a.tabProducts,Coffee],['preview',a.tabPreview,Eye]] as const).map(([key,label,Icon]) => <button key={key} className={tab === key ? 'active' : ''} onClick={() => changeTab(key)} data-testid={`tab-${key}`}><Icon size={15} style={{verticalAlign:'middle',marginInlineEnd:7}} />{label}</button>)}</nav>
      {tab === 'categories' && <section className="admin-panel">
        <div className="admin-panel-head"><div><h2>{a.sections}</h2><p>{a.order}</p></div><button className="btn btn-primary" onClick={() => setCategoryDraft({id:'',name:'',position:store.categories.length})} data-testid="button-add-category"><Plus size={15} /> {a.add}</button></div>
        {!sortedCategories.length ? <div className="empty-state"><Tag size={25}/><p>{a.emptyCategory}</p></div> : sortedCategories.map((category,index) => <div className="admin-list-row" key={category.id} data-testid={`row-category-${category.id}`}>
          <GripVertical size={15} className="row-grip" /><div className="row-grow"><div className="row-title">{translated(category.name,category.translations,locale)}</div><div className="row-sub">{store.products.filter(p => p.categoryId === category.id).length} {a.items} · {a.position} {index + 1}</div></div>
          <div className="row-actions"><button className={`switch ${category.available !== false ? 'on' : ''}`} onClick={() => toggleCategory(category.id)} role="switch" aria-checked={category.available !== false} aria-label={`${a.availableToggle}: ${category.name}`} data-testid={`toggle-category-availability-${category.id}`} /><button className="icon-btn" title={locale === 'fr' ? 'Monter' : locale === 'ar' ? 'تحريك للأعلى' : 'Move up'} aria-label={locale === 'fr' ? 'Monter' : locale === 'ar' ? 'تحريك للأعلى' : 'Move up'} disabled={!index} onClick={() => moveCategory(category.id,-1)} data-testid={`button-category-up-${category.id}`}><ArrowUp size={15}/></button><button className="icon-btn" title={locale === 'fr' ? 'Descendre' : locale === 'ar' ? 'تحريك للأسفل' : 'Move down'} aria-label={locale === 'fr' ? 'Descendre' : locale === 'ar' ? 'تحريك للأسفل' : 'Move down'} disabled={index === sortedCategories.length-1} onClick={() => moveCategory(category.id,1)} data-testid={`button-category-down-${category.id}`}><ArrowDown size={15}/></button><button className="btn btn-first" disabled={!index} onClick={() => moveCategoryFirst(category.id)} data-testid={`button-category-first-${category.id}`}><ArrowUp size={13}/>{a.moveFirst}</button><button className="icon-btn" title={a.editCategory} aria-label={a.editCategory} onClick={() => setCategoryDraft(category)} data-testid={`button-edit-category-${category.id}`}><Pencil size={15}/></button><button className="icon-btn" title={a.delete} aria-label={a.delete} onClick={() => removeCategory(category.id)} data-testid={`button-delete-category-${category.id}`}><Trash2 size={15}/></button></div>
        </div>)}
      </section>}
      {tab === 'products' && <section className="admin-panel">
        <div className="admin-panel-head"><div><h2>{a.products}</h2><p>{a.productNote}</p></div><button className="btn btn-primary" onClick={() => setProductDraft({id:'',categoryId:sortedCategories[0]?.id || '',name:'',description:'',price:0,available:true})} disabled={!sortedCategories.length} data-testid="button-add-product"><Plus size={15}/> {a.add}</button></div>
        {sortedCategories.length === 0 ? <div className="empty-state"><Tag size={24}/><p>{a.createCategoryFirst}</p><button className="btn" onClick={() => setTab('categories')} data-testid="button-go-categories">{a.createCategory}</button></div> :
          sortedCategories.map(category => {
            const items = store.products.filter(p => p.categoryId === category.id);
            return <div key={category.id} style={{marginTop:20}}><div className="eyebrow">{translated(category.name,category.translations,locale)}</div>
              {!items.length && <p className="row-sub">{a.noProducts}</p>}
              {items.map((product,index) => <div className="admin-list-row" key={product.id} data-testid={`row-product-${product.id}`}>
                <div className="product-thumb" style={{width:48,height:48,flexBasis:48}}>{product.image ? <img src={product.image} alt="" /> : <span className="placeholder-glyph" style={{fontSize:19}}>L</span>}</div>
                <div className="row-grow"><div className="row-title">{product.name}</div><div className="row-sub">{formatPrice(product.price)} · {product.available ? a.available : a.unavailable}</div></div>
                <button className={`switch ${product.available ? 'on' : ''}`} onClick={() => toggleProduct(product.id)} role="switch" aria-checked={product.available} aria-label={`${a.availableToggle}: ${product.name}`} data-testid={`toggle-availability-${product.id}`} />
                <div className="row-actions"><button className="icon-btn optional-action" title={locale === 'fr' ? 'Monter' : locale === 'ar' ? 'تحريك للأعلى' : 'Move up'} aria-label={locale === 'fr' ? 'Monter' : locale === 'ar' ? 'تحريك للأعلى' : 'Move up'} disabled={!index} onClick={() => moveProduct(product.id,-1)} data-testid={`button-product-up-${product.id}`}><ArrowUp size={14}/></button><button className="icon-btn optional-action" title={locale === 'fr' ? 'Descendre' : locale === 'ar' ? 'تحريك للأسفل' : 'Move down'} aria-label={locale === 'fr' ? 'Descendre' : locale === 'ar' ? 'تحريك للأسفل' : 'Move down'} disabled={index === items.length-1} onClick={() => moveProduct(product.id,1)} data-testid={`button-product-down-${product.id}`}><ArrowDown size={14}/></button><button className="icon-btn" title={a.editProduct} aria-label={a.editProduct} onClick={() => setProductDraft(product)} data-testid={`button-edit-product-${product.id}`}><Pencil size={14}/></button><button className="icon-btn" title={a.delete} aria-label={a.delete} onClick={() => removeProduct(product.id)} data-testid={`button-delete-product-${product.id}`}><Trash2 size={14}/></button></div>
              </div>)}
            </div>;
          })}
      </section>}
      {tab === 'preview' && <section className="admin-panel"><div className="admin-panel-head"><div><h2>{a.previewTitle}</h2><p>{a.previewBody}</p></div><MenuLanguage locale={locale} onChange={chooseLocale}/></div>
        <div className="admin-preview-frame"><CustomerMenu categories={store.categories} products={store.products} locale={locale} onLocale={chooseLocale} theme={theme} onThemeToggle={toggleTheme} preview /></div></section>}
    </main>
    <nav className="mobile-admin-toolbar">{([[ 'categories',a.tabCategories,LayoutList],['products',a.tabProducts,Utensils],['preview',a.tabPreview,Eye]] as const).map(([key,label,Icon]) => <button key={key} className={tab === key ? 'active' : ''} onClick={() => changeTab(key)} data-testid={`mobile-tab-${key}`}><Icon />{label}</button>)}<button className="admin-add-mobile" aria-label={a.quickAdd} title={a.quickAdd} onClick={() => sortedCategories.length ? setProductDraft({id:'',categoryId:sortedCategories[0].id,name:'',description:'',price:0,available:true}) : setTab('categories')} data-testid="button-mobile-quick-add"><Plus/><span className="sr-only">{a.quickAdd}</span></button></nav>
    {categoryDraft && <div className="modal-backdrop" onMouseDown={e => { if(e.target === e.currentTarget) setCategoryDraft(null); }}><form className="modal-card" onSubmit={saveCategory}>
      <div className="admin-panel-head"><div><div className="admin-kicker">{a.sections}</div><h2>{categoryDraft.id ? a.editCategory : a.newCategory}</h2></div><button type="button" className="icon-btn" onClick={() => setCategoryDraft(null)} aria-label={a.cancel} data-testid="button-close-category-editor"><X size={16}/></button></div>
      <div className="field"><label htmlFor="category-name">{a.categoryName}</label><input id="category-name" name="name" defaultValue={categoryDraft.name} required autoFocus maxLength={45} placeholder="Ex. Boissons fraîches" data-testid="input-category-name"/></div>
      <div className="notice">{a.categoryNote}</div>
      <div className="modal-actions"><button type="button" className="btn" onClick={() => setCategoryDraft(null)} data-testid="button-cancel-category">{a.cancel}</button><button className="btn btn-primary" type="submit" data-testid="button-save-category"><Check size={15}/> {a.save}</button></div>
    </form></div>}
    {productDraft && <div className="modal-backdrop" onMouseDown={e => { if(e.target === e.currentTarget) setProductDraft(null); }}><form className="modal-card" onSubmit={saveProduct} style={{maxHeight:'92dvh',overflow:'auto'}}>
      <div className="admin-panel-head"><div><div className="admin-kicker">{a.products}</div><h2>{productDraft.id ? a.editProduct : a.newProduct}</h2></div><button type="button" className="icon-btn" onClick={() => setProductDraft(null)} aria-label={a.cancel} data-testid="button-close-product-editor"><X size={16}/></button></div>
      <label className="image-picker" data-testid="picker-product-image">{productDraft.image && <img src={productDraft.image} alt={a.image}/>}<span><ImagePlus size={15} style={{verticalAlign:'middle',marginInlineEnd:6}}/>{a.image}</span><input type="file" accept="image/*" onChange={imageChange} aria-label={a.image} data-testid="input-product-image"/></label>
      {productDraft.image && <button type="button" className="btn btn-quiet image-remove" onClick={() => setProductDraft({...productDraft,image:undefined})} data-testid="button-remove-product-image">{a.removeImage}</button>}
      <div className="notice">{a.imageNote}</div>
      <div className="form-grid">
        <div className="field"><label htmlFor="product-name">{a.name}</label><input id="product-name" name="name" defaultValue={productDraft.name} required maxLength={60} data-testid="input-product-name"/></div>
        <div className="field"><label htmlFor="product-price">{a.price}</label><input id="product-price" name="price" type="number" step="0.001" min="0" defaultValue={productDraft.price || ''} required data-testid="input-product-price"/></div>
      </div>
      <div className="field"><label htmlFor="product-category">{a.category}</label><select id="product-category" name="categoryId" defaultValue={productDraft.categoryId} required data-testid="select-product-category">{sortedCategories.map(c => <option value={c.id} key={c.id}>{translated(c.name,c.translations,locale)}</option>)}</select></div>
      <div className="field"><label htmlFor="product-description">{a.description}</label><textarea id="product-description" name="description" defaultValue={productDraft.description} maxLength={180} placeholder={a.descriptionHint} data-testid="input-product-description"/></div>
      <div className="toggle-line"><span>{a.availableToggle}</span><button type="button" className={`switch ${productDraft.available ? 'on' : ''}`} role="switch" aria-checked={productDraft.available} aria-label={a.availableToggle} onClick={() => setProductDraft({...productDraft,available:!productDraft.available})} data-testid="toggle-editor-availability"/></div>
      <div className="modal-actions"><button type="button" className="btn" onClick={() => setProductDraft(null)} data-testid="button-cancel-product">{a.cancel}</button><button className="btn btn-primary" type="submit" data-testid="button-save-product"><Check size={15}/> {a.save}</button></div>
    </form></div>}
    {modal && <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) setModal(null);}}><section className="modal-card" role="alertdialog" aria-modal="true">
      <div className="admin-kicker">{a.confirm}</div><h2>{modal.title}</h2><p style={{fontSize:13,color:'#777b72',lineHeight:1.7}}>{modal.message}</p>
      <div className="modal-actions"><button className="btn" onClick={() => setModal(null)} data-testid="button-cancel-delete">{a.cancel}</button><button className="btn btn-danger" onClick={modal.action} data-testid="button-confirm-delete"><Trash2 size={14}/> {a.delete}</button></div>
    </section></div>}
    {toast && <div className="toast-message" role="status" data-testid="status-toast">{toast}</div>}
  </div>;
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedApp /></WouterRouter>;
}

export default App;

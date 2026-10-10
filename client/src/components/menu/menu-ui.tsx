import { Moon, Sun } from 'lucide-react';
import type { Locale } from '../../menu-data';

export type Theme = 'light' | 'dark';

export function Brand({ small = false }: { small?: boolean }) {
  return <div className={`brand-lockup ${small ? 'brand-small' : ''}`} aria-label="LASTRADA Café-Resto">
    <img
      src={`${import.meta.env.BASE_URL}lastrada-logo-light.png`}
      alt="LASTRADA Café-Resto"
      className="brand-logo brand-logo-light"
    />
    <img
      src={`${import.meta.env.BASE_URL}lastrada-logo-dark.png`}
      alt="LASTRADA Café-Resto"
      className="brand-logo brand-logo-dark"
    />
  </div>;
}

export function MenuLanguage({ locale, onChange }: { locale: Locale; onChange: (value: Locale) => void }) {
  const label = locale === 'fr' ? 'Choisir la langue' : locale === 'ar' ? 'اختيار اللغة' : 'Choose language';
  return <div className="language-switch" role="group" aria-label={label}>
    {(['fr', 'ar', 'en'] as Locale[]).map(lang => <button key={lang} type="button" onClick={() => onChange(lang)} className={locale === lang ? 'active' : ''} aria-pressed={locale === lang} data-testid={`language-${lang}`}>{lang.toUpperCase()}</button>)}
  </div>;
}

export function ThemeToggle({ theme, onToggle, locale }: { theme: Theme; onToggle: () => void; locale: Locale }) {
  const label = theme === 'dark'
    ? locale === 'fr' ? 'Passer au thème clair' : locale === 'ar' ? 'التبديل إلى المظهر الفاتح' : 'Switch to light theme'
    : locale === 'fr' ? 'Passer au thème sombre' : locale === 'ar' ? 'التبديل إلى المظهر الداكن' : 'Switch to dark theme';
  const Icon = theme === 'dark' ? Sun : Moon;
  return <button className="theme-toggle" type="button" onClick={onToggle} aria-label={label} title={label}><Icon size={18} strokeWidth={1.7} aria-hidden="true" /></button>;
}

export function formatPrice(price: number) {
  return `${Number(price).toFixed(3).replace('.', ',')} DT`;
}

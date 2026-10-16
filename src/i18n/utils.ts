/**
 * i18n helpers. English is the default locale and lives at the site root;
 * Persian lives under /fa/. See docs/ARCHITECTURE.md → "Internationalisation".
 */
import { ui, type UIKey } from './ui';

export const locales = ['en', 'fa'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** A string that exists in every locale. All bilingual data uses this shape. */
export type L10n = Record<Locale, string>;

export const dir = (locale: Locale) => (locale === 'fa' ? 'rtl' : 'ltr');

/** Translator for UI strings. Falls back to English, then to the key. */
export function useT(locale: Locale) {
  return (key: UIKey, vars?: Record<string, string | number>) => {
    let s: string = ui[locale][key] ?? ui.en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

/** Pick the current-locale value from a bilingual field. */
export const pick = (value: L10n, locale: Locale) => value[locale] ?? value.en;

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Build an internal URL: applies the GitHub Pages base path and the locale
 * prefix. `path` is the locale-neutral route, e.g. "/shop" or "/product/milano".
 */
export function href(path: string, locale: Locale = defaultLocale) {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return `${BASE}${prefix}${clean}/`.replace(/\/{2,}/g, '/');
}

/** Static asset URL under /public, base-path aware. */
export const asset = (p: string) => `${BASE}/${p.replace(/^\//, '')}`;

/** Strip base + locale from a pathname → locale-neutral route (for the language switch). */
export function neutralPath(pathname: string) {
  let p = pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  p = p.replace(/^\/fa(\/|$)/, '/');
  return p || '/';
}

/** Digits in the locale's numbering system. */
export const num = (n: number, locale: Locale) =>
  new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(n);

/** Prices are stored as integer Toman. */
export function formatPrice(toman: number, locale: Locale) {
  return locale === 'fa' ? `${num(toman, 'fa')} تومان` : `${num(toman, 'en')} Toman`;
}

/** Locale-aware digits inside an arbitrary string (e.g. "55-18-145"). */
export function localDigits(s: string, locale: Locale) {
  if (locale !== 'fa') return s;
  return s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

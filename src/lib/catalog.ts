/**
 * The client catalogue: a small JSON snapshot of products that BaseLayout
 * embeds in every page (<script type="application/json" id="catalog">).
 * Client scripts (cart, Virtual Mirror) read it instead of importing the full
 * data module. When a real backend exists (Phase 3), this becomes an API call
 * with the same shape.
 */
import type { Locale } from '@/i18n/utils';

export interface ClientColourway {
  id: string;
  name: string;
  swatch: string;
  /** Front-view SVG as a data: URL — used by the Virtual Mirror overlay */
  frame: string;
}

export interface ClientProduct {
  slug: string;
  name: string;
  price: number;
  url: string;
  thumb: string;
  colourways: ClientColourway[];
}

export interface ClientCatalog {
  locale: Locale;
  checkoutUrl: string;
  strings: Record<string, string>;
  products: Record<string, ClientProduct>;
}

/** Client-side reader (cached). */
let cache: ClientCatalog | null = null;
export function readCatalog(): ClientCatalog {
  if (cache) return cache;
  const el = document.getElementById('catalog');
  cache = JSON.parse(el?.textContent || '{}') as ClientCatalog;
  return cache;
}

export function formatPriceClient(toman: number, locale: Locale) {
  const n = new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(toman);
  return locale === 'fa' ? `${n} تومان` : `${n} Toman`;
}

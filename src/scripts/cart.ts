/**
 * Bag / cart — client-side only in Phase 1.
 * State: localStorage["sz-cart"] = CartLine[]. Wrapped in try/catch so private
 * mode or blocked storage degrades to an in-memory bag instead of breaking.
 *
 * Hooks (data attributes):
 *   [data-add-to-cart][data-slug][data-colour?]  add one, open drawer
 *   [data-cart-open] / [data-cart-close]         toggle drawer
 *   [data-cart-count]                            badge(s) updated on change
 * Emits `cart:change` on window with the new lines.
 */
import { readCatalog, formatPriceClient } from '@/lib/catalog';

export interface CartLine {
  slug: string;
  colour: string;
  qty: number;
}

const KEY = 'sz-cart';
let memory: CartLine[] = [];

export function getCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return memory;
  }
}

function setCart(lines: CartLine[]) {
  memory = lines;
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable — keep in memory */
  }
  window.dispatchEvent(new CustomEvent('cart:change', { detail: lines }));
}

export function addToCart(slug: string, colour?: string) {
  const cat = readCatalog();
  const p = cat.products[slug];
  if (!p) return;
  const c = colour || p.colourways[0]?.id || 'default';
  const lines = getCart();
  const hit = lines.find((l) => l.slug === slug && l.colour === c);
  if (hit) hit.qty += 1;
  else lines.push({ slug, colour: c, qty: 1 });
  setCart(lines);
}

function updateQty(i: number, delta: number) {
  const lines = getCart();
  if (!lines[i]) return;
  lines[i].qty += delta;
  if (lines[i].qty <= 0) lines.splice(i, 1);
  setCart(lines);
}

export function cartTotal(lines = getCart()) {
  const cat = readCatalog();
  return lines.reduce((s, l) => s + (cat.products[l.slug]?.price ?? 0) * l.qty, 0);
}

export function toast(msg: string) {
  const el = document.querySelector<HTMLElement>('[data-toast]');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('is-on');
  clearTimeout(Number(el.dataset.timer));
  el.dataset.timer = String(window.setTimeout(() => el.classList.remove('is-on'), 2400));
}

function render() {
  const cat = readCatalog();
  const lines = getCart();
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const n = new Intl.NumberFormat(cat.locale === 'fa' ? 'fa-IR' : 'en-US').format(count);

  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
    el.textContent = n;
    el.hidden = count === 0;
  });
  const inline = document.querySelector('[data-cart-count-inline]');
  if (inline) inline.textContent = count ? `(${n})` : '';

  const list = document.querySelector<HTMLElement>('[data-cart-list]');
  const tpl = document.getElementById('cart-item') as HTMLTemplateElement | null;
  if (!list || !tpl) return;
  list.replaceChildren();
  lines.forEach((l, i) => {
    const p = cat.products[l.slug];
    if (!p) return;
    const node = tpl.content.cloneNode(true) as DocumentFragment;
    const q = (f: string) => node.querySelectorAll<HTMLElement>(`[data-f="${f}"]`);
    q('link').forEach((a) => ((a as HTMLAnchorElement).href = p.url));
    const img = q('img')[0] as HTMLImageElement;
    img.src = p.thumb;
    img.alt = p.name;
    q('name')[0].textContent = p.name;
    q('price')[0].textContent = formatPriceClient(p.price * l.qty, cat.locale);
    q('colour')[0].textContent = p.colourways.find((c) => c.id === l.colour)?.name ?? '';
    q('qty')[0].textContent = new Intl.NumberFormat(cat.locale === 'fa' ? 'fa-IR' : 'en-US').format(l.qty);
    q('inc')[0].addEventListener('click', () => updateQty(i, 1));
    q('dec')[0].addEventListener('click', () => updateQty(i, -1));
    q('remove')[0].addEventListener('click', () => updateQty(i, -l.qty));
    list.append(node);
  });

  const empty = document.querySelector<HTMLElement>('[data-cart-empty]');
  const foot = document.querySelector<HTMLElement>('[data-cart-foot]');
  if (empty) empty.hidden = count > 0;
  if (foot) foot.hidden = count === 0;
  const sub = document.querySelector('[data-cart-subtotal]');
  if (sub) sub.textContent = formatPriceClient(cartTotal(lines), cat.locale);
}

export function openCart() {
  const d = document.querySelector<HTMLDialogElement>('[data-cart]');
  if (d && !d.open) d.showModal();
}

export function initCart() {
  const drawer = document.querySelector<HTMLDialogElement>('[data-cart]');

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const add = target.closest<HTMLElement>('[data-add-to-cart]');
    if (add) {
      e.preventDefault();
      // Colour comes from the button, or from the nearest selected swatch.
      const scope = add.closest('[data-product-scope]') ?? document;
      const selected = scope.querySelector<HTMLInputElement>('input[name="colour"]:checked');
      addToCart(add.dataset.slug!, add.dataset.colour || selected?.value);
      toast(readCatalog().strings.added);
      if (!add.hasAttribute('data-no-drawer')) openCart();
      return;
    }
    if (target.closest('[data-cart-open]')) openCart();
    if (target.closest('[data-cart-close]')) drawer?.close();
  });

  // Click on the backdrop closes the drawer.
  drawer?.addEventListener('click', (e) => {
    if (e.target === drawer) drawer.close();
  });

  window.addEventListener('cart:change', render);
  window.addEventListener('storage', (e) => e.key === KEY && render());
  render();
}

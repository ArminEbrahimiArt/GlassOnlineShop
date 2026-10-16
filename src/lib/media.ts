/**
 * Product media registry. Every image under src/assets/products/<slug>/ is
 * produced by `npm run images` to the Image Standard (docs/IMAGE-STANDARD.md),
 * so file names are slot names: card, gallery-2…n, detail, lifestyle-1…n,
 * hero-desktop, hero-mobile.
 */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<ImageMetadata>('/src/assets/products/*/*.jpg', { eager: true, import: 'default' });

/** Get one slot image, e.g. media('milano', 'card'). Throws if missing so a broken spec fails the build. */
export function media(slug: string, slot: string): ImageMetadata {
  const img = files[`/src/assets/products/${slug}/${slot}.jpg`];
  if (!img) throw new Error(`Missing product image: ${slug}/${slot}.jpg — run \`npm run images\``);
  return img;
}

/** All images of a slot family in order, e.g. series('milano', 'lifestyle') → lifestyle-1, lifestyle-2… */
export function series(slug: string, family: string): ImageMetadata[] {
  return Object.entries(files)
    .filter(([p]) => p.startsWith(`/src/assets/products/${slug}/${family}-`))
    .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
    .map(([, img]) => img);
}

export const hasMedia = (slug: string, slot: string) => Boolean(files[`/src/assets/products/${slug}/${slot}.jpg`]);

/**
 * Product catalogue — PHASE 1 SAMPLE DATA.
 *
 * Names, prices, measurements, copy and colourways are placeholders written
 * for the design prototype. Real product data replaces this file (or is
 * fetched from the CMS / backend) in Phase 3 — the `Product` type below is the
 * contract the UI depends on. See docs/CONTENT.md for what is real vs sample.
 *
 * Photography: src/assets/products/<slug>/<slot>.jpg, generated to the Image
 * Standard by `npm run images` (docs/IMAGE-STANDARD.md). Images are looked
 * up by slot through src/lib/media.ts.
 */
import type { ImageMetadata } from 'astro';
import type { L10n } from '@/i18n/utils';
import type { FrameGeometry, FrameStyle } from '@/lib/frames';

import { media } from '@/lib/media';

export interface ProductImage {
  src: ImageMetadata;
  alt: L10n;
  /** 'product' = packshot, 'detail' = close-up, 'lifestyle' = on a person */
  kind: 'product' | 'detail' | 'lifestyle';
}

export interface Hotspot {
  /** Position on the image in % from top-left. Images are never mirrored in RTL, so positions are absolute. */
  x: number;
  y: number;
  title: L10n;
  body: L10n;
}

export interface Colourway {
  id: string;
  name: L10n;
  /** Swatch fill (CSS colour or gradient) */
  swatch: string;
  /** Front-view render style for the Virtual Mirror and previews */
  style: FrameStyle;
  /** Only colourways with photography have this */
  photographed: boolean;
}

export type Category = 'sun' | 'optical';
export type Tone = 'black' | 'clear' | 'tinted';

export interface Product {
  slug: string;
  code: string;
  name: L10n;
  collection: string; // collection slug
  category: Category;
  tone: Tone;
  isNew?: boolean;
  price: number; // Toman
  tagline: L10n;
  description: L10n;
  material: L10n;
  lens: L10n;
  weight: number; // grams
  hours: number; // hours of handwork
  run: number; // pieces in the limited run
  /** lens width – bridge – temple, plus lens height (mm) */
  size: { lens: number; bridge: number; temple: number; height: number };
  geometry: FrameGeometry;
  colourways: Colourway[];
  /** 4:3 product shots. [0] = card (front), [1] = card hover. Same order in the PDP gallery. */
  images: ProductImage[];
  /** 4:5 on-model / campaign portraits (may be empty → placeholder) */
  lifestyle: ProductImage[];
  /** Home hero pair (16:9 desktop + 9:16 mobile), if this product is a hero */
  hero?: { desktop: ImageMetadata; mobile: ImageMetadata };
  /** Close-up used for the anatomy/hotspot section */
  anatomy: { image: ImageMetadata; alt: L10n; spots: Hotspot[] };
  /** Stage background tint behind packshots */
  stage: string;
}

const alt = (en: string, fa: string): L10n => ({ en, fa });

/* Shared anatomy notes — reused across models where the build is identical. */
const HINGE: Hotspot = {
  x: 0,
  y: 0,
  title: alt('Five-barrel hinge', 'لولای پنج‌بندی'),
  body: alt(
    'German-made, riveted through the acetate by hand. Opens with a soft, damped resistance for decades.',
    'ساخت آلمان، با پرچ دستی درون استات. با مقاومتی نرم و یکنواخت، تا سال‌ها باز و بسته می‌شود.',
  ),
};
const LENS: Hotspot = {
  x: 0,
  y: 0,
  title: alt('Category 3 polarised lens', 'لنز پلاریزه کتگوری ۳'),
  body: alt(
    'Mineral-grade CR-39 with full UV400 protection and an anti-reflective back coat.',
    'لنز CR-39 با محافظت کامل UV400 و پوشش ضدبازتاب در سطح داخلی.',
  ),
};
const POLISH: Hotspot = {
  x: 0,
  y: 0,
  title: alt('Hand-polished acetate', 'استات با پرداخت دستی'),
  body: alt(
    'Tumbled for 72 hours in wood chips, then polished by hand on a cotton wheel for a deep, wet shine.',
    '۷۲ ساعت در تراشه‌ی چوب غلتانده و سپس روی چرخ پنبه‌ای با دست پرداخت می‌شود تا درخششی عمیق پیدا کند.',
  ),
};
const ENGRAVE: Hotspot = {
  x: 0,
  y: 0,
  title: alt('Engraved inner temple', 'حکاکی داخل دسته'),
  body: alt(
    'Model, colour and size laser-engraved inside the temple — your frame’s signature.',
    'مدل، رنگ و سایز با لیزر داخل دسته حک می‌شود — امضای فریم شما.',
  ),
};
const at = (h: Hotspot, x: number, y: number): Hotspot => ({ ...h, x, y });

export const products: Product[] = [
  {
    slug: 'milano',
    code: 'SZ 5031 C1',
    name: alt('Milano', 'میلانو'),
    collection: 'riviera',
    category: 'sun',
    tone: 'black',
    isNew: true,
    price: 8_900_000,
    tagline: alt('The everyday icon', 'نماد هر روز'),
    description: alt(
      'A confident square silhouette cut from matte black acetate, with a flash of signature red inside the temple. Milano is the frame you reach for every morning — and the one people ask you about.',
      'سیلوئتی مربعی و مطمئن از استات مشکی مات، با درخشش قرمز امضای برند در داخل دسته. میلانو فریمی است که هر صبح سراغش می‌روید — و همان که همه درباره‌اش می‌پرسند.',
    ),
    material: alt('Matte Italian acetate, stainless core wire', 'استات مات ایتالیایی، مغزی فولاد ضدزنگ'),
    lens: alt('Polarised CR-39, Category 3, UV400', 'پلاریزه CR-39، کتگوری ۳، UV400'),
    weight: 29,
    hours: 38,
    run: 300,
    size: { lens: 55, bridge: 18, temple: 145, height: 44 },
    geometry: { shape: 'square', rim: 6 },
    stage: '#e7e5e2',
    colourways: [
      {
        id: 'matte-black',
        name: alt('Matte Black', 'مشکی مات'),
        swatch: '#1b1a19',
        photographed: true,
        style: { frame: '#1a1918', frameOpacity: 1, lens: '#2b2c2e', lensOpacity: 0.86, metal: '#b9b9b9' },
      },
      {
        id: 'havana',
        name: alt('Havana Tortoise', 'لاک‌پشتی هاوانا'),
        swatch: 'radial-gradient(circle at 30% 30%, #b0763a, #4a2612 70%)',
        photographed: false,
        style: { frame: '#5a3017', frameOpacity: 0.96, lens: '#3a3226', lensOpacity: 0.85, metal: '#d4b483' },
      },
      {
        id: 'olive',
        name: alt('Smoked Olive', 'زیتونی دودی'),
        swatch: '#4d4f3b',
        photographed: false,
        style: { frame: '#4a4c37', frameOpacity: 0.95, lens: '#2f3329', lensOpacity: 0.85, metal: '#c9c9c9' },
      },
    ],
    images: [
      { src: media('milano', 'card'), kind: 'product', alt: alt('Milano in matte black, front three-quarter on a glass shelf', 'میلانو مشکی مات، نمای سه‌رخ روی قفسه‌ی شیشه‌ای') },
      { src: media('milano', 'gallery-2'), kind: 'product', alt: alt('Milano on a stone ledge in architectural light', 'میلانو روی سکوی سنگی در نور معماری') },
      { src: media('milano', 'gallery-3'), kind: 'detail', alt: alt('Milano temple with the Slazenger mark', 'دسته‌ی میلانو با نشان اسلازنجر') },
    ],
    lifestyle: [
      { src: media('milano', 'lifestyle-1'), kind: 'lifestyle', alt: alt('Woman wearing Milano sunglasses', 'زن با عینک آفتابی میلانو') },
      { src: media('milano', 'lifestyle-2'), kind: 'lifestyle', alt: alt('Man wearing Milano sunglasses', 'مرد با عینک آفتابی میلانو') },
    ],
    hero: { desktop: media('milano', 'hero-desktop'), mobile: media('milano', 'hero-mobile') },
    anatomy: {
      image: media('milano', 'detail'),
      alt: alt('Milano close-up', 'نمای نزدیک میلانو'),
      spots: [at(ENGRAVE, 35, 48), at(HINGE, 48, 37), at(LENS, 80, 60)],
    },
  },
  {
    slug: 'notte',
    code: 'SZ 9005 C1',
    name: alt('Notte', 'نوته'),
    collection: 'notturno',
    category: 'sun',
    tone: 'black',
    price: 9_400_000,
    tagline: alt('Gloss after dark', 'درخشش پس از غروب'),
    description: alt(
      'Thick, high-gloss black acetate with a bold keyhole bridge and a five-barrel hinge you can hear click. Notte is built heavier on purpose — it sits with authority.',
      'استات مشکی براق و ضخیم با پل جسورانه و لولای پنج‌بندی که صدای کلیکش را می‌شنوید. نوته عمداً سنگین‌تر ساخته شده — با اقتدار می‌نشیند.',
    ),
    material: alt('High-gloss acetate, 6 mm block', 'استات براق، بلوک ۶ میلی‌متری'),
    lens: alt('Polarised CR-39, Category 3, UV400', 'پلاریزه CR-39، کتگوری ۳، UV400'),
    weight: 34,
    hours: 42,
    run: 250,
    size: { lens: 56, bridge: 18, temple: 147, height: 45 },
    geometry: { shape: 'wayfarer', rim: 7 },
    stage: '#e4e2df',
    colourways: [
      {
        id: 'gloss-black',
        name: alt('Gloss Black', 'مشکی براق'),
        swatch: '#0d0d0d',
        photographed: true,
        style: { frame: '#0c0c0c', frameOpacity: 1, lens: '#2a2b2d', lensOpacity: 0.88, metal: '#d0d0d0' },
      },
      {
        id: 'smoke',
        name: alt('Smoke Grey', 'خاکستری دودی'),
        swatch: '#5d5b58',
        photographed: false,
        style: { frame: '#4d4b48', frameOpacity: 0.85, lens: '#2a2b2d', lensOpacity: 0.85, metal: '#d0d0d0' },
      },
    ],
    images: [
      { src: media('notte', 'card'), kind: 'product', alt: alt('Notte in gloss black, front view', 'نوته مشکی براق، نمای روبه‌رو') },
      { src: media('notte', 'gallery-2'), kind: 'product', alt: alt('Notte on a concrete plinth', 'نوته روی پایه‌ی بتنی') },
      { src: media('notte', 'gallery-3'), kind: 'detail', alt: alt('Notte side angle', 'نمای جانبی نوته') },
      { src: media('notte', 'gallery-4'), kind: 'detail', alt: alt('Notte five-barrel hinge', 'لولای پنج‌بندی نوته') },
    ],
    lifestyle: [],
    hero: { desktop: media('notte', 'hero-desktop'), mobile: media('notte', 'hero-mobile') },
    anatomy: {
      image: media('notte', 'detail'),
      alt: alt('Notte hinge close-up', 'نمای نزدیک لولای نوته'),
      spots: [at(HINGE, 64, 32), at(ENGRAVE, 25, 47), at(POLISH, 86, 72)],
    },
  },
  {
    slug: 'cristallo',
    code: 'SZ 9005 C4',
    name: alt('Cristallo', 'کریستالو'),
    collection: 'riviera',
    category: 'sun',
    tone: 'clear',
    isNew: true,
    price: 9_200_000,
    tagline: alt('Nothing to hide', 'چیزی برای پنهان کردن نیست'),
    description: alt(
      'Crystal-clear acetate that shows every rivet, every core wire, every decision. Cristallo catches light like a prism and turns the hinge into jewellery.',
      'استات کاملاً شفاف که هر پرچ، هر مغزی و هر تصمیم را نشان می‌دهد. کریستالو نور را مثل منشور می‌شکند و لولا را به جواهر تبدیل می‌کند.',
    ),
    material: alt('Crystal acetate, engraved silver core', 'استات کریستالی، مغزی نقره‌ای حکاکی‌شده'),
    lens: alt('Smoke CR-39, Category 3, UV400', 'دودی CR-39، کتگوری ۳، UV400'),
    weight: 31,
    hours: 44,
    run: 200,
    size: { lens: 54, bridge: 19, temple: 145, height: 43 },
    geometry: { shape: 'wayfarer', rim: 6.5 },
    stage: '#e9e9ea',
    colourways: [
      {
        id: 'crystal',
        name: alt('Crystal', 'کریستال'),
        swatch: 'linear-gradient(135deg, #ffffff, #d9dde0)',
        photographed: true,
        style: { frame: '#dfe5ea', frameOpacity: 0.55, lens: '#2e3133', lensOpacity: 0.82, metal: '#e6e6e6' },
      },
      {
        id: 'champagne',
        name: alt('Champagne', 'شامپاینی'),
        swatch: 'linear-gradient(135deg, #f6ead7, #d9c3a1)',
        photographed: false,
        style: { frame: '#e7d3b3', frameOpacity: 0.6, lens: '#3b3226', lensOpacity: 0.8, metal: '#d9be8c' },
      },
    ],
    images: [
      { src: media('cristallo', 'card'), kind: 'product', alt: alt('Cristallo in crystal acetate, front view', 'کریستالو با استات کریستالی، نمای روبه‌رو') },
      { src: media('cristallo', 'gallery-2'), kind: 'product', alt: alt('Cristallo floating in soft blue light', 'کریستالو معلق در نور آبی ملایم') },
      { src: media('cristallo', 'gallery-3'), kind: 'detail', alt: alt('Cristallo against a glass prism', 'کریستالو کنار منشور شیشه‌ای') },
      { src: media('cristallo', 'gallery-4'), kind: 'detail', alt: alt('Cristallo transparent hinge', 'لولای شفاف کریستالو') },
    ],
    lifestyle: [],
    hero: { desktop: media('cristallo', 'hero-desktop'), mobile: media('cristallo', 'hero-mobile') },
    anatomy: {
      image: media('cristallo', 'detail'),
      alt: alt('Cristallo hinge close-up', 'نمای نزدیک لولای کریستالو'),
      spots: [at(HINGE, 30, 52), at(ENGRAVE, 70, 40), at(POLISH, 58, 28)],
    },
  },
  {
    slug: 'rosa',
    code: 'SZ 7120 C3',
    name: alt('Rosa', 'رزا'),
    collection: 'atelier',
    category: 'sun',
    tone: 'tinted',
    price: 10_800_000,
    tagline: alt('Golden hour, every hour', 'ساعت طلایی، در هر ساعت'),
    description: alt(
      'An oversized silhouette in translucent rosé acetate with gradient brown lenses and a sculpted gold-tone temple jewel. Soft, bold and unmistakably feminine.',
      'سیلوئتی بزرگ از استات صورتی نیمه‌شفاف با لنزهای گرادیان قهوه‌ای و نگین طلایی تراش‌خورده روی دسته. نرم، جسور و بی‌تردید زنانه.',
    ),
    material: alt('Translucent rosé acetate, gold-tone metal jewel', 'استات صورتی نیمه‌شفاف، نگین فلزی طلایی'),
    lens: alt('Gradient brown CR-39, Category 2, UV400', 'گرادیان قهوه‌ای CR-39، کتگوری ۲، UV400'),
    weight: 33,
    hours: 46,
    run: 150,
    size: { lens: 57, bridge: 17, temple: 145, height: 52 },
    geometry: { shape: 'oversized', rim: 6 },
    stage: '#ece6e1',
    colourways: [
      {
        id: 'rose',
        name: alt('Rosé', 'رزه'),
        swatch: 'linear-gradient(135deg, #f1c9b4, #c98b72)',
        photographed: true,
        style: { frame: '#d79a82', frameOpacity: 0.72, lens: '#4a2d22', lensBottom: '#b98b74', lensOpacity: 0.82, metal: '#d8b56a' },
      },
      {
        id: 'sand',
        name: alt('Desert Sand', 'شنی کویری'),
        swatch: 'linear-gradient(135deg, #eadbc6, #c4a582)',
        photographed: false,
        style: { frame: '#cdb08c', frameOpacity: 0.75, lens: '#3f3326', lensBottom: '#a88f72', lensOpacity: 0.8, metal: '#d8b56a' },
      },
    ],
    images: [
      { src: media('rosa', 'card'), kind: 'product', alt: alt('Rosa in translucent rosé, front view', 'رزا با استات صورتی نیمه‌شفاف، نمای روبه‌رو') },
      { src: media('rosa', 'gallery-2'), kind: 'product', alt: alt('Rosa with gold temple jewel', 'رزا با نگین طلایی روی دسته') },
      { src: media('rosa', 'gallery-3'), kind: 'detail', alt: alt('Rosa temple jewel close-up', 'نمای نزدیک نگین دسته‌ی رزا') },
    ],
    lifestyle: [],
    anatomy: {
      image: media('rosa', 'detail'),
      alt: alt('Rosa temple jewel close-up', 'نمای نزدیک نگین دسته‌ی رزا'),
      spots: [
        {
          x: 46,
          y: 31,
          title: alt('Sculpted temple jewel', 'نگین تراش‌خورده‌ی دسته'),
          body: alt(
            'A faceted gold-tone emblem, hand-set into the acetate and polished flush.',
            'نشانی چندوجهی با روکش طلایی که با دست درون استات نشانده و هم‌سطح پرداخت می‌شود.',
          ),
        },
        at(HINGE, 78, 44),
        {
          x: 90,
          y: 72,
          title: alt('Gradient lens', 'لنز گرادیان'),
          body: alt(
            'Dark at the top for glare, clear at the bottom for reading your phone.',
            'تیره در بالا برای نور شدید، روشن در پایین برای خواندن صفحه‌ی موبایل.',
          ),
        },
      ],
    },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** Related = same collection first, then everything else. */
export function related(slug: string, n = 3) {
  const p = getProduct(slug);
  return products
    .filter((x) => x.slug !== slug)
    .sort((a, b) => Number(b.collection === p?.collection) - Number(a.collection === p?.collection))
    .slice(0, n);
}

export const sizeString = (p: Product) => `${p.size.lens}-${p.size.bridge}-${p.size.temple}`;

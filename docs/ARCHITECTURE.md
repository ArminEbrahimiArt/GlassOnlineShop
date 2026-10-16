# Architecture

_Last updated: 2026-10-16 · Phase 1_

## 1. Overview

A **static, bilingual storefront** built with Astro. Every page is pre-rendered to HTML at build time and served from
GitHub Pages. Interactivity (bag, galleries, filters, Virtual Mirror) is progressive enhancement written in small,
framework-free TypeScript modules. The architecture is meant to grow: Phase 3 swaps the sample data modules for a
backend/CMS without changing the views (see §7).

```
 Browser ──► GitHub Pages (static HTML/CSS/JS/WebP + self-hosted fonts + MediaPipe WASM)
               │
               ├─ HTML per route × locale  (pre-rendered by Astro)
               ├─ #catalog JSON in every page  (products for client scripts)
               └─ /mediapipe/*  (fetched only when the Virtual Mirror starts)
```

## 2. Project map

```
.
├── .github/workflows/deploy.yml   CI: build + publish to GitHub Pages on push to main
├── astro.config.mjs               site/base (from env: SITE_URL, BASE_PATH), build options
├── tsconfig.json                  strict TS, alias @/* → src/*
├── package.json                   scripts: dev, build, preview, check, images (+ pre-hooks)
├── CLAUDE.md                      working rules (read before changing anything)
├── README.md                      overview + quick start
├── docs/                          ← all project knowledge lives here
│   ├── ARCHITECTURE.md            this file
│   ├── DESIGN-SYSTEM.md           tokens + components
│   ├── ROADMAP.md                 phases & status
│   ├── CONTENT.md                 real vs sample content, shot list
│   ├── DECISIONS.md               ADRs
│   ├── CHANGELOG.md               dated change log
│   └── PRESENTATION.md            meeting demo script (fa)
├── scripts/
│   ├── prepare-images.mjs         raw brand photos → cropped, normalised JPGs in src/assets/products
│   └── fetch-mediapipe.mjs        copies MediaPipe WASM + downloads face model into public/mediapipe (git-ignored)
├── public/
│   ├── favicon.svg
│   └── mediapipe/                 (generated) wasm/ + face_landmarker.task
└── src/
    ├── assets/products/<slug>/    product photography (sources for astro:assets)
    ├── data/                      ← CONTENT (sample in Phase 1)
    │   ├── products.ts            Product type + catalogue (4 models), related(), sizeString()
    │   ├── collections.ts         Collection type + 4 collections
    │   └── editorial.ts           atelier process steps + numbers
    ├── i18n/
    │   ├── ui.ts                  every UI string, en + fa (fa is type-checked against en)
    │   └── utils.ts               Locale, L10n, useT(), pick(), href(), asset(), formatPrice(), num(), localDigits()
    ├── lib/
    │   ├── frames.ts              parametric front-view SVG frame renderer (try-on, measurements, colourways)
    │   └── catalog.ts             ClientCatalog type, readCatalog(), formatPriceClient()
    ├── layouts/
    │   └── BaseLayout.astro       <html lang/dir>, fonts, meta/hreflang, Header/Footer/Cart/TryOn, #catalog JSON
    ├── components/                shared UI
    │   ├── Header.astro           announcement bar, sticky header, full-screen menu <dialog>, language switch
    │   ├── Footer.astro           newsletter, link columns, large wordmark, legal
    │   ├── CartDrawer.astro       bag <dialog> + item <template> + toast
    │   ├── TryOn.astro            Virtual Mirror <dialog> (stage + panel)
    │   ├── ProductCard.astro      grid card with hover image, colour dots, quick try-on
    │   ├── Hotspots.astro         pulsing "+" anatomy points + synced list
    │   ├── Dimensions.astro       technical drawing + measurements table
    │   ├── Placeholder.astro      labelled art-directed placeholder for missing photography
    │   ├── Wordmark.astro         typographic logo (no logo yet)
    │   └── Icon.astro             1.5px stroke icon set
    ├── scripts/                   client modules
    │   ├── ui.ts                  header scroll state, menu, reveal-on-scroll, newsletter
    │   ├── cart.ts                bag store (localStorage), drawer rendering, add-to-cart hooks, toast
    │   └── tryon.ts               Virtual Mirror engine (camera, MediaPipe, overlay, capture, upload)
    ├── styles/
    │   ├── tokens.css             design tokens (see DESIGN-SYSTEM.md)
    │   └── global.css             reset, type primitives, buttons, layout, reveal
    ├── views/                     page bodies, each takes `locale`
    │   ├── HomeView.astro         hero slider, statement, product scenes, anatomy, mirror CTA, collections, atelier
    │   ├── ShopView.astro         listing + filter chips + sort
    │   ├── ProductView.astro      gallery, info, colourways, accordion, anatomy, lifestyle, measurements, related, buy bar
    │   ├── CollectionsView.astro  collections with their products / coming-soon
    │   ├── AtelierView.astro      brand story, numbers, 6-step process
    │   ├── TryOnView.astro        Virtual Mirror landing + frame picker
    │   ├── CheckoutView.astro     checkout form (UI only) + live summary
    │   └── NotFoundView.astro     404
    └── pages/                     thin route files (one per route per locale)
        ├── index.astro, shop.astro, collections.astro, atelier.astro, try-on.astro, checkout.astro, 404.astro
        ├── product/[slug].astro
        └── fa/ (same set, locale="fa")
```

## 3. Routing

| Route (en) | Route (fa) | View |
|---|---|---|
| `/` | `/fa/` | HomeView |
| `/shop/` | `/fa/shop/` | ShopView |
| `/product/<slug>/` | `/fa/product/<slug>/` | ProductView (`getStaticPaths` from `products`) |
| `/collections/` (+ `#<slug>`) | `/fa/collections/` | CollectionsView |
| `/atelier/` | `/fa/atelier/` | AtelierView |
| `/try-on/` (`?frame=<slug>` deep link) | `/fa/try-on/` | TryOnView |
| `/checkout/` | `/fa/checkout/` | CheckoutView |
| `404` | — | NotFoundView |

**Base path.** GitHub Pages serves under `/<repo>/`. The CI sets `BASE_PATH`, and `href()` / `asset()` prefix it.
Never hard-code an absolute internal URL.

**Why thin route files instead of Astro's i18n router?** It is explicit and easy to read, it has no locale magic, and
each locale can diverge later (for example, a Persian-only landing page). See ADR-003.

## 4. Internationalisation

- `Locale = 'en' | 'fa'`. The default is `en`, served at the site root. Persian lives under `/fa/`.
- `<html lang dir>` is set per locale. Persian gets `dir="rtl"`.
- **UI strings** live in `src/i18n/ui.ts`. `fa` is typed as `Record<UIKey, string>`, so a missing translation fails the type check.
- **Content** (products and so on) uses `L10n = { en, fa }`, and views read it with `pick(field, locale)`.
- **Numbers and prices.** `formatPrice()` gives `8,900,000 Toman` and `۸٬۹۰۰٬۰۰۰ تومان`. `localDigits()` converts digits inside codes such as sizes.
- **RTL layout.** CSS uses logical properties throughout. Directional icons get `flip`. Photos are never mirrored.
- **Typography.** The font stack is `Geist → Vazirmatn`, so Latin glyphs render in Geist and Persian falls through to Vazirmatn. Under `:lang(fa)`, letter-spacing is zeroed because tracking breaks Persian joining, and line-height is increased.
- The **wordmark** is always Latin, as is common for luxury houses.
- The language switch maps the current route to the same route in the other locale, using `neutralPath()`.

## 5. Data flow

```
src/data/*.ts  ──(import at build)──►  views (.astro)  ──►  static HTML
       │
       └──► BaseLayout builds ClientCatalog { products: {slug,name,price,url,thumb,colourways[{frame:svg dataURL}]}, strings }
                 └─► <script type="application/json" id="catalog">  ──►  readCatalog() in cart.ts / tryon.ts / checkout
```

- **Bag.** `localStorage["sz-cart"] = [{slug, colour, qty}]`. If storage is unavailable, it falls back to memory. It emits a `cart:change` event.
- **Hooks.** `[data-add-to-cart][data-slug][data-colour?]` adds an item, and the colour comes from the nearest `[data-product-scope] input[name=colour]:checked` if it is not given. `[data-cart-open]` opens the bag. `[data-tryon-open][data-slug?][data-autostart?]` opens the mirror.

## 6. Virtual Mirror (live try-on)

**Goal:** show any frame on the visitor's face, live, on a phone, without uploading anything.

```
getUserMedia(front camera) ─► <video> (CSS mirrored)
                                 │ each new frame
                                 ▼
             MediaPipe FaceLandmarker.detectForVideo()  (WASM, GPU→CPU fallback, 478 landmarks)
                                 │
          eye corners 33/263 → centre + roll angle; face edges 127/356 → width
                                 │  exponential smoothing (k=0.45), snap on large jumps
                                 ▼
          <canvas> overlay (same size as video, CSS mirrored): drawImage(frame SVG) with shadow
```

- **Frame artwork** comes from `lib/frames.ts`. Each product has `geometry` (shape and rim thickness) and each colourway has a `style` (acetate colour and opacity, lens tint or gradient, metal). The same renderer draws the measurement diagram, so the mirror and the spec drawing always agree. The lens holes use the non-zero winding rule: the lens sub-paths are reversed.
- **Calibration constants** live at the top of `scripts/tryon.ts`: `FRAME_EYE_Y` sets where the eye line sits inside the SVG, and `WIDTH_FACTOR` scales the frame width against face width.
- **Self-hosted runtime.** `scripts/fetch-mediapipe.mjs` runs before `dev` and `build`. It copies the WASM from `node_modules` and downloads `face_landmarker.task` into `public/mediapipe/`. Nothing loads from Google or a CDN at runtime (ADR-006). The JS is lazy-imported, so about 13 MB of WASM plus the 3.6 MB model is fetched only when the user starts the camera or uploads a photo.
- **States** (`[data-state]` on the stage): `idle → loading → searching ⇄ tracking → still`, plus `photo` for the upload fallback, which uses `detect()` in IMAGE mode.
- **Capture.** Composites the mirrored video frame with the overlay into a JPEG. **Save** uses the native share sheet when `navigator.canShare({files})` is available, and otherwise downloads the file.
- **Privacy.** The camera stops when the dialog closes or the tab is hidden. No frames leave the device.
- **Limits in Phase 1.** The overlay is 2D (roll and scale only, no yaw or 3D temples). The artwork is parametric, not photographic. Phase 4 upgrades this to 3D GLB frames with the face transformation matrix (see ROADMAP).

## 7. How Phase 3 plugs in (backend)

The views depend on the **types** `Product`, `Collection` and `ClientCatalog`, not on where the data comes from.

1. Replace `src/data/products.ts` with a loader that fetches from the CMS or API at build time (Astro content layer), or switch to SSR or hybrid output for live stock and prices.
2. Replace `scripts/cart.ts` storage with API calls behind the same functions (`addToCart`, `getCart`, `cartTotal`).
3. Checkout posts to the order API, which then redirects to the payment gateway (Shaparak PSP).
4. Hosting moves off GitHub Pages if SSR is needed. Candidates: an Iranian cloud for latency, or a VPS with Node.

## 8. Performance notes

- Images: responsive `srcset` WebP (q≈80) from roughly 1500 px sources. The hero is eager with `fetchpriority=high`, and everything else is lazy.
- Fonts: variable WOFF2 self-hosted. Vazirmatn is `unicode-range`-limited, so English pages do not download it.
- JS: about 10 KB of page scripts. MediaPipe is a separate lazy chunk.
- Motion: CSS transitions, IntersectionObserver reveals, cross-document View Transitions, and `prefers-reduced-motion` support.

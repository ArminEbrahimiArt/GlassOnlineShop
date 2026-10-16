# Changelog

All notable changes, newest first. Format: date · phase · summary · files.

## 2026-10-16 · Phase 1.1 · Design refinement after first review

**Summary:** Changes from the client's review: a Lucide (shadcn) icon family, a full-bleed hero, near-square
corners, a rebuilt type and spacing system, a phone-style image gallery, an app-like mobile layer, and faster,
steadier face tracking.

**Changed**
- **Icons:** all icons now come from Lucide, the shadcn/ui icon set, through `lucide-static`. They are inlined at build time with one family, a 1.5 px stroke and round caps. Files: `src/components/Icon.astro`, `package.json`. ADR-010.
- **Shape:** radii cut to 2–6 px. Buttons, chips, inputs and badges are near-square; true circles are kept only for swatches and dots. Files: `src/styles/tokens.css`, all components. ADR-011.
- **Typography and spacing:** a modular scale (ratio 1.25, 16 px body), named type roles (`.t-display`, `.t-h1`–`.t-h3`, `.t-lead`, `.t-body`, `.t-small`, `.t-caption`, `.label`), an 8-pt spacing grid, `--section` / `--section-head` rhythm, a `.grid-12` 12/8/4-column grid, a 1440 px max width and a 60ch measure. Every section header now uses one component. Files: `tokens.css`, `global.css`, `src/components/SectionHead.astro` (new), all views. ADR-011.
- **Home hero:** a full-bleed, full-screen slideshow (4 slides) with art-directed images (a landscape crop on desktop, a portrait image on phones, via `<picture>`). The copy and buttons live in a new frosted-glass caption panel with slide counter, arrows, the current product link, CTAs and progress segments. Supports swipe, arrow keys and auto-advance. File: `src/views/HomeView.astro`.
- **Home sections** are laid out on the 12-column grid: statement, product scenes, mirror CTA and atelier.
- **Product card:** reference-style quick-add "+" and quick try-on buttons over the image, plus a refined info row. File: `src/components/ProductCard.astro`.
- **Shop:** page header uses the type roles, text-style filter tabs with an ink active state, grid gap tokens. File: `src/views/ShopView.astro`.

**Added**
- **Full-screen product gallery (lightbox):** tap or click any product image to open it. It works like a phone's photo gallery: swipe or arrows or ←/→ to page, double-tap or double-click to zoom 2.5× and drag to pan, swipe down or Esc to close, with a thumbnail strip and a counter. File: `src/components/Lightbox.astro` (new), used by `ProductView.astro`.
- **Mobile app layer** (< 1024 px), inspired by the client's app reference:
  - a floating bottom **tab bar** (Home, Shop, Try on, Collections, Bag with count). File: `src/components/TabBar.astro` (new), wired through `BaseLayout` (`tabbar`, `bottomBar` props).
  - on product pages, a fixed **buy bar** with a live total, try-on and "Add to bag". It replaces the tab bar.
  - a **quantity stepper** on product pages; add-to-cart respects quantity (`data-use-qty`). Files: `ProductView.astro`, `src/scripts/cart.ts`.
  - a back button over the product gallery.
- **Face tracking v1.1:** a new pose module `src/lib/face-pose.ts` and a reworked engine in `src/scripts/tryon.ts`. ADR-012.
  - **One Euro filter** in place of fixed smoothing: steady when still, low lag when moving.
  - **3D head pose** from landmark depth: true face width (stays correct when the head turns), plus yaw and pitch foreshortening of the frame. The anchor is the nose bridge.
  - Detection runs once per **decoded camera frame** (`requestVideoFrameCallback`) at **640×480**, which is about 2–3× cheaper than HD on phones.
  - The runtime **preloads on intent** (hover or touch on any try-on button, or opening the mirror). The camera feed appears **immediately** while the model finishes loading, and a spinner shows during loading.
  - Brief detection drops (motion blur) keep the last pose for up to 3 frames instead of flickering.
  - The overlay is drawn on a 2× canvas so frames are crisp on retina screens.
  - Verified with a synthetic moving-face webcam feed in headless Chromium: tracking holds through roll, scale and motion.

## 2026-10-16 · Phase 1 · Visual QA pass

**Summary:** Fixes found by reviewing every page at 390 px and 1440 px, in both locales.

- Hero: split layout (copy column + image column) on desktop to avoid landscape-cropping portrait photos; on mobile the image is stacked above the copy at 56svh. Files: `src/views/HomeView.astro`.
- Product page: an orphaned last gallery image now spans both columns. The related grid is 2 columns on mobile and 3 on desktop. The buy bar is driven by scroll position and hidden with `visibility`. Files: `src/views/ProductView.astro`.
- Anatomy hotspots: balanced 1:1 columns, image capped at 720 px. File: `src/components/Hotspots.astro`.
- Product card: name and price stack when the card is narrower than 300 px (container query). File: `src/components/ProductCard.astro`.
- The toast moved under the header so it never covers the mobile buy bar. File: `src/components/CartDrawer.astro`.
- Virtual Mirror: lowered the frame relative to the eye line (`FRAME_EYE_Y` 38→34/80). File: `src/scripts/tryon.ts`.
- Verified: the bag persists across pages and locales, colour selection carries into the bag, checkout totals are correct, and the mirror detects faces in photo mode and starts the camera pipeline.

## 2026-10-16 · Phase 1 · Initial visual prototype

**Summary:** First complete, deployable version of the storefront for the brand presentation.

**Added**
- Astro 7 project (static), TypeScript strict, `@/*` alias, GitHub Pages CI (`.github/workflows/deploy.yml`).
- Design tokens and global styles: warm greys, ink, nude accent, Geist / Geist Mono / Vazirmatn, motion, light theme only.
- Bilingual i18n (en default at `/`, fa at `/fa/` with RTL), UI dictionary, price and digit localisation, language switch.
- Layout: announcement bar, sticky header with transparent-over-hero mode, full-screen menu, footer with newsletter.
- Pages (each in en + fa): Home, Shop, Product ×4, Collections, Atelier, Virtual Mirror, Checkout, and a 404.
- Home: split hero slider with story-style progress bars, brand statement, "one product per screen" scenes with thumbnail hover gallery, anatomy hotspots, Virtual Mirror CTA, collections rail, atelier teaser.
- Product page: swipe gallery (mobile) and mosaic (desktop), colourway swatches, frame size, accordion, anatomy hotspots, lifestyle section with detail inset, technical measurements drawing, try-on band, related products, mobile sticky buy bar.
- Shop: filter chips (tone and category), price sort, "coming soon" tile.
- **Virtual Mirror:** live camera try-on with MediaPipe Face Landmarker (self-hosted), parametric SVG frames per colourway, smoothing, capture, save/share, and a photo-upload fallback. Available from the header, product cards, product pages and `/try-on/`.
- Bag drawer (localStorage), toast, and a checkout UI with a live order summary.
- Sample catalogue data (4 models, 9 colourways, 4 collections, atelier editorial) in en + fa.
- Image pipeline script (`scripts/prepare-images.mjs`): crops the brand's composite photos into individual shots.
- Documentation: README, CLAUDE.md, and docs/ (ARCHITECTURE, DESIGN-SYSTEM, ROADMAP, CONTENT, DECISIONS, CHANGELOG, PRESENTATION).

**Known gaps** (tracked in ROADMAP)
- Sample product data and copy. Placeholder lifestyle and atelier imagery. No logo.
- Supplied photos for 3 models carry "JAKERSON" branding (see CONTENT.md).
- The try-on is 2D (roll and scale only).

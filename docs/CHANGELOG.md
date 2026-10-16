# Changelog

All notable changes, newest first. Format: date · phase · summary · files.

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

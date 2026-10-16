# Slazenger Eyewear — Online Store

Luxury, bilingual (English / فارسی) e-commerce storefront for **Slazenger**, a maker of handmade, high-quality eyewear frames.

**Live prototype:** https://arminebrahimiart.github.io/GlassOnlineShop/
**Persian:** https://arminebrahimiart.github.io/GlassOnlineShop/fa/

> **Current phase: 1 — Visual prototype.** Every page, interaction and the live Virtual Mirror work, but
> products, prices and copy are **sample data**, and checkout does not take payments. See
> [docs/ROADMAP.md](docs/ROADMAP.md).

---

## خلاصه (فارسی)

وب‌سایت فروشگاهی لوکس و دوزبانه برای برند عینک دست‌ساز **Slazenger**. فاز فعلی «نمونه‌ی ظاهری» برای ارائه به برند است:
همه‌ی صفحه‌ها، انیمیشن‌ها، سبد خرید و **آینه‌ی مجازی (امتحان زنده‌ی عینک با دوربین)** کار می‌کنند، ولی داده‌ی محصولات، قیمت‌ها و متن‌ها نمونه هستند
و پرداخت واقعی وصل نیست.

- زبان پیش‌فرض: انگلیسی (`/`) — فارسی: (`/fa/`) با راست‌به‌چپ کامل و فونت Abar High (آبَر)
- فونت لاتین: Geist — پالت: خاکستری گرم + مشکی + رنگ نود (Nude) برای تأکید — فقط تم روشن
- طراحی Mobile-first
- همه‌ی تصمیم‌ها، معماری، فازبندی و تغییرات در پوشه‌ی [`docs/`](docs/) ثبت می‌شوند

---

## Quick start

Requires **Node 22.22+**.

```bash
npm install
npm run dev        # http://localhost:4321  (also fetches the MediaPipe runtime on first run)
npm run build      # static site → dist/
npm run preview    # serve dist/ locally
npm run check      # type-check .astro / .ts
```

The Virtual Mirror needs a camera and a **secure context** — `localhost` or HTTPS (GitHub Pages is HTTPS).
To test on a phone during development, deploy or use an HTTPS tunnel; plain `http://<lan-ip>` blocks the camera.

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): `npm ci` → `npm run build`
(with `BASE_PATH=/<repo-name>`) → publish `dist/` to GitHub Pages. Pages source: **Settings → Pages → GitHub Actions**.

## Stack

| Concern | Choice |
|---|---|
| Framework | [Astro 7](https://astro.build) — static output, zero JS by default, islands when needed |
| Styling | Plain CSS with design tokens (`src/styles/tokens.css`), scoped component styles, logical properties for RTL |
| Fonts | Geist + Geist Mono (Latin, Fontsource), Abar High (Persian, commercial — self-hosted woff2) |
| Images | `astro:assets` — responsive WebP generated at build from `src/assets/` |
| Try-on | MediaPipe Face Landmarker (WASM, on-device) + parametric SVG frames |
| State | `localStorage` for the bag (Phase 1); backend in Phase 3 |
| Hosting | GitHub Pages via GitHub Actions |

## Documentation

| Doc | What it holds |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Project map (every folder/file), routing, i18n, data flow, Virtual Mirror internals |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Colour, type, spacing, motion tokens; components and their rules |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phases 1 → 5, scope and status of each |
| [docs/IMAGE-STANDARD.md](docs/IMAGE-STANDARD.md) | Image slots, exact sizes, generator, photographer brief |
| [docs/CONTENT.md](docs/CONTENT.md) | What is real vs sample; photo shot list; content the brand must supply |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Architecture/design decision records (ADRs) |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Every change, dated, newest first |
| [docs/PRESENTATION.md](docs/PRESENTATION.md) | Demo script for the brand meeting (Persian) |
| [CLAUDE.md](CLAUDE.md) | Working rules for anyone (human or AI) changing this repo |

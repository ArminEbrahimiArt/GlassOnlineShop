# Design System

_Source of truth: `src/styles/tokens.css` (tokens) and `src/styles/global.css` (roles and primitives). Update them together with this file. Last updated: 2026-10-16 (Phase 1.2)._

## Principles

1. **Quiet luxury.** Generous space, few elements, nothing shouts. The product is the colour.
2. **Craft is the story.** Close-ups, anatomy hotspots and measurements prove the handmade quality.
3. **Mobile first, app-like on phones.** Design for a 390 px phone held in one hand. Primary actions sit at the bottom, within thumb reach: tab bar, buy bar, quick add.
4. **Near-square geometry.** Corners are 2–6 px, roughly 2–3 % of a card. Circles appear only where something really is a dot: swatches, colour dots, badges.
5. **One system, two scripts.** English and Persian are equals. RTL is never an afterthought.
6. **Standards over taste.** Type follows a modular scale, space follows an 8-pt grid, layout follows a 12-column grid, text keeps a 60ch measure, and every hit target is at least 44 px.

## Colour

Light theme only (ADR-004). Warm greys, ink, and one **nude** accent.

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#f5f3f0` | Page background |
| `--stone-50` | `#faf9f7` | Raised surfaces, inputs |
| `--stone-100` | `#efece8` | Footer, subtle fills |
| `--stone-200` | `#e5e1db` | Image stages, placeholders |
| `--stone-300/400` | `#d4cec5` / `#b5aea4` | Disabled, secondary text on ink |
| `--stone-500` | `#8f887e` | Muted text, **large sizes only** |
| `--stone-600` | `#6c665e` | Secondary text (AA on paper) |
| `--stone-800` | `#34312d` | Primary button hover |
| `--ink` | `#141312` | Text, primary buttons, tab bar, dark sections |
| `--nude-100…700` | `#f3e8de` → `#8b6a52` | Accent. Use `--nude-700` for text on paper, `--nude-300` on ink, `--nude-500` for markers |
| `--line`, `--line-strong` | ink at 12% / 24% | Hairlines, outlines |

Use at most one accent moment per screen. Product stage backgrounds come from each product's `stage` colour.
The lightbox uses a near-black `#0e0d0c` so photos read like a phone gallery.

## Typography

**Fonts:**
- **Geist** for Latin, and **Geist Mono** for codes, sizes and indices. Both are variable and self-hosted.
- **Abar High** for Persian (FontIran, commercial, ADR-014). It is self-hosted at 400/600/700 and loaded only for Persian code points.
- The stack is `Geist → Abar High`, so Latin inside Persian pages stays Geist.

**Calibration:** luxury fashion e-commerce conventions (Celine, Saint Laurent, Bottega Veneta, Jacques Marie Mage):
- small, confident type and restrained headlines
- whitespace instead of size for hierarchy
- tracked uppercase micro-labels in English

The scale has a ratio of about 1.2 and is fluid between 360 px and 1440 px.

| Token | EN (mobile → desktop) | FA | Role class | Use |
|---|---|---|---|---|
| `--text-display` | 40 → 72 | same | `.t-display` | Rare: editorial page titles |
| `--text-3xl` | 32 → 52 | same | `.t-h1` | Page titles, PDP product name |
| `--text-2xl` | 26 → 36 | same | `.t-h2` | Section titles |
| `--text-xl` | 20 → 26 | same | `.t-h3` | Sub-titles, measurements, band titles |
| `--text-lg` | 17 → 19 | same | `.t-lead` | Leads, taglines, PDP price |
| `--text-md` | 16 | 17 | — | Emphasised list items |
| `--text-base` | 15 | 16 | `.t-body` | Body (max 62ch) |
| `--text-sm` | 13 | 14 | `.t-small` | UI text, card name and price |
| `--text-xs` | 12 | 13 | `.t-caption`, `.mono` | Captions, meta, codes |
| `--text-2xs` | 11 | 12 | `.label`, `.btn` | Overlines, buttons, nav |

**Leading:**

| Style | EN | FA |
|---|---|---|
| Display | 1.0 | 1.25 |
| Heading | 1.12 | 1.35 |
| Lead | 1.4 | 1.6 |
| Body | 1.6 | 1.8 |

Persian leading is explicit because Abar's metrics (ascent+descent) are 1.8em.

**Tracking (EN):** display −0.03em, headings −0.02em, labels +0.14em, buttons +0.1em. **Persian:** always 0.

**Weights:** `--weight-heading` is 500 in English and 600 in Persian. Body is 400.

**Case:** English labels, buttons and card names are UPPERCASE. Persian never changes case.

**Rules:**
- Use role classes, never raw `font-size` in components, except the documented 10 px tab-bar labels and badges.
- Every section header goes through `<SectionHead>`.

## Space & layout

- **8-pt grid:** `--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-5` 24 · `--s-6` 32 · `--s-7` 48 · `--s-8` 64 · `--s-9` 96 · `--s-10` 128.
- **Rhythm:** `--section` is 64 → 128 between sections. `--section-head` is 32 → 48 between a header and its content.
- **Page:** `--gutter` is 20 → 48. `--max` is 1440 px of content width. `--measure` is 60ch.
- **Grid:** `.grid-12` gives 4 columns under 640 px, 8 columns from 640 px and 12 from 1024 px. The gap is `--grid-gap` (12 → 20). Children place themselves with `grid-column`.
- **Breakpoints:** 600 (large phone), 640 (tablet grid), 900 (art-direction switch), 1024 (desktop: tab bar off, two-column PDP).

## Shape & elevation

| Token | px | Use |
|---|---|---|
| `--radius-xs` | 2 | Buttons, chips, inputs, thumbnails, icon tiles |
| `--radius-sm` | 3 | Badges, small cards, inset images |
| `--radius` | 4 | Images, product cards, frames |
| `--radius-lg` | 6 | Dialogs, feature blocks, hero panel, tab bar |
| `--radius-pill` | 999 | **Only** true circles: swatches, colour dots, count badges |

Shadows are used only on floating UI: `--shadow-soft` for pins, and `--shadow-float` for the tab bar, buy bar, dialogs and toast.

## Motion

- `--ease-out` (expo-out) for UI, and `--ease-in-out` for crossfades.
- Durations: 180 ms for state changes, 420 ms for UI, 900 ms for reveals.
- Patterns:
  - **Reveal:** add `data-reveal` and optionally `--reveal-i` to stagger.
  - **Image hover:** a slow 1.6 s scale.
  - **Hero:** Ken Burns zoom with a 1.4 s crossfade and progress segments.
  - **Dialogs:** `@starting-style`.
  - **Page changes:** View Transitions.
- `prefers-reduced-motion` turns all of it off, and the hero stops auto-advancing.

## Icons

**Lucide**, the shadcn/ui set, via `Icon.astro` (ADR-010): 24 px grid, **1.5 px stroke**, round caps and joins, `currentColor`.
Sizes are 16 inline, 18 in buttons, 20–21 for navigation and 24 in the lightbox. Directional icons take `flip` so they mirror in RTL.

## Components

| Component | Spec |
|---|---|
| **Button** `.btn` `--primary/--ghost/--light/--sm/--block` | 48 px tall (40 for `--sm`), `--radius-xs`. English: 11 px/500 UPPERCASE with +0.1em tracking. Persian: 14 px/600. 8 px icon gap |
| **Icon button** `.icon-btn` | A centred 40 px square (44 px on touch), `--radius-xs`, with a square 7% ink hover tint on hover-capable devices only. Layout code may only toggle it with `display: none` or `display: inline-grid` (never flex) |
| **Icon tile** | 36–48 px square, `--radius-xs`, 1 px `--line-strong` outline or a white glass fill over images |
| **SectionHead** | label + `.t-h2` (`.t-h1` for page) + optional `.t-lead` + optional trailing link. Tones `ink` and `paper` |
| **Header** | 64 / 72 px. Transparent over the hero with a soft top scrim, blurred paper once scrolled. Full-screen menu dialog with numbered links |
| **Hero** (home) | Full-bleed art-directed slideshow (16:9 on desktop, 9:16 on phones, see IMAGE-STANDARD). No text over the image: only two buttons per slide at the bottom centre (primary "Discover <name>" and a glass "Try on"), plus progress dots. They stack vertically under 480 px |
| **ProductCard** | A contained unit: `--stone-50` surface, 1 px `--line` frame, `--radius`, with hover shadow and border. 4:3 stage (second image on hover). Info area separated by a hairline: UPPERCASE name and price on row 1, colour name and dots (current ringed) on row 2. Try-on tile at top-end and ink quick-add "+" at the stage's bottom corner. Ink "NEW" badge |
| **Lookbook** (home) | Edge-to-edge 4:5 on-model portraits (2-up from 768 px), bottom scrim, label and product link |
| **Lightbox** | Near-black full-screen dialog: counter, zoom hint, close; snap track; thumbnail strip; side arrows on desktop. Double-tap zooms to 2.5×, swipe down closes |
| **TabBar** (< 1024) | Floating ink bar, 64 px, inset 12 px, `--radius-lg`. 5 items with icon and 10 px label; the active one is paper-coloured with a heavier stroke. The bag shows a nude count badge |
| **Buy bar** (PDP < 1024) | Same geometry as the tab bar, white glass. Total label and live price → try-on tile → primary "Add to bag" |
| **Qty stepper** | 40 px tall, `--radius-xs` outline, − value + |
| **Hotspots** | White "+" pins with a pulsing ring; the active pin turns ink "×". Synced numbered list |
| **Dimensions** | Parametric frame on a blueprint grid with measure lines, plus a 2-column spec table |
| **Swatch** | 32 px circle with a 1 px ink ring when selected |
| **Chip / tab** (shop filter) | 36 px text tab; the active one is an ink fill |
| **Drawer / Dialog** | Native `<dialog>`. The bag slides from inline-end. The mirror is a full-screen sheet on mobile and a 1120 px modal on desktop |
| **Placeholder** | Labelled, tinted, line-art panel for photography that does not exist yet |
| **Wordmark** | "SLAZENGER", Geist 500, +0.38em tracking, optional "EYEWEAR ATELIER" sub-line |

## Accessibility baseline

- Text contrast meets AA. Muted text uses `--stone-600` and above.
- Real `<a>` and `<button>` elements with a visible `:focus-visible` ring. Hit targets are at least 44 px; tab bar items are 64 px tall.
- Native `<dialog>` for the menu, bag, mirror and lightbox: focus trap and Esc come free.
- The lightbox supports keyboard paging (←/→), and the hero responds to arrow keys.
- Bilingual alt text comes from the data files. Decorative images use `alt=""`.

# Design System

_Source of truth: `src/styles/tokens.css`. Update both together._

## Principles

1. **Quiet luxury.** Generous space, few elements, nothing shouts. The product is the colour.
2. **Craft is the story.** Close-ups, anatomy hotspots and measurements prove the handmade quality.
3. **Mobile first.** Design for a 390 px phone held in one hand, then scale up. Primary actions stay within thumb reach (the sticky buy bar, the bottom sheet mirror).
4. **Gen Z native, not trendy.** Huge type, story-style progress bars, live try-on and shareable photos, all delivered with restraint.
5. **One system, two scripts.** English and Persian are equals. RTL is never an afterthought.

## Colour

Light theme only (ADR-004). Warm greys, ink, and one **nude** accent.

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#f5f3f0` | Page background |
| `--stone-50` | `#faf9f7` | Raised surfaces, inputs |
| `--stone-100` | `#efece8` | Footer, subtle fills, frame tiles |
| `--stone-200` | `#e5e1db` | Image stages, placeholders |
| `--stone-300/400` | `#d4cec5` / `#b5aea4` | Disabled, dark-surface secondary text |
| `--stone-500` | `#8f887e` | Muted text, **large sizes only** |
| `--stone-600` | `#6c665e` | Secondary text (AA on paper) |
| `--stone-800` | `#34312d` | Primary button hover |
| `--ink` | `#141312` | Text, primary buttons, dark sections |
| `--nude-100…700` | `#f3e8de` → `#8b6a52` | Accent. Use `--nude-700` for text on paper, `--nude-300` on ink, `--nude-500` for markers |
| `--line`, `--line-strong` | ink at 12% / 24% | Hairlines, outlines |

Rules: one accent moment per screen at most. Never put the accent on large surfaces. Product stage backgrounds come from each product's `stage` colour.

## Typography

- **Latin:** Geist (variable). **Mono:** Geist Mono, for codes, sizes and indices. **Persian:** Vazirmatn (variable).
- The stack `Geist → Vazirmatn` lets mixed strings render each script in its own face.

| Token | Size (mobile → desktop) | Use |
|---|---|---|
| `--text-display` | 56 → 192 px | Product names on scenes, page titles |
| `--text-3xl` | 48 → 112 px | Hero, PDP name, big numbers |
| `--text-2xl` | 36 → 64 px | Section titles, statement |
| `--text-xl` | 26 → 40 px | Sub-titles, measurement values |
| `--text-lg` | 20 → 26 px | Ledes, taglines |
| `--text-md` | 16 → 18 px | Card names, emphasised body |
| `--text-base` | 15 px | Body |
| `--text-sm/xs/2xs` | 13 / 12 / 11 px | UI, captions, `.label` |

- Display sizes use negative tracking (−0.035 to −0.055 em) and a tight line-height of 0.88–0.95.
- `.label` is 11 px uppercase with +0.16 em tracking. In Persian it becomes 12 px with no case change and no tracking.
- Persian headings use weight 600–700 with a line-height of about 1.3, because Persian needs more vertical room.

## Space, shape, elevation

- 4 px base scale, `--s-1` to `--s-10`. Section rhythm is `--section` (72 → 160 px). Page gutter is `--gutter` (16 → 40 px). Max width is 1600 px.
- Radii: `--radius-sm` 6 for thumbnails and inputs, `--radius` 14 for cards and images, `--radius-lg` 24 for feature blocks and the dialog, and pill for buttons and chips.
- Shadows are used only on floating UI: `--shadow-soft` for pins, `--shadow-float` for the buy bar, dialog and toast.

## Motion

- Easing `--ease-out` is expo-out and applies to almost everything. `--ease-in-out` is for crossfades.
- Durations: `--dur-fast` 180 ms for state changes, `--dur` 420 ms for UI, and `--dur-slow` 900 ms for reveals.
- Patterns:
  - **Reveal:** add `data-reveal` and optionally `--reveal-i` to stagger.
  - **Image hover:** a slow 1.6 s scale.
  - **Hero:** Ken Burns zoom, crossfade and progress bars.
  - **Dialogs:** `@starting-style` enter and exit.
  - **Page changes:** View Transitions.
- `prefers-reduced-motion` disables all of it.

## Components

| Component | Notes |
|---|---|
| **Button** `.btn` + `--primary` / `--ghost` / `--light` / `--sm` / `--block` | 52 px tall pill, icon gap 12 px. `--light` is used on ink surfaces |
| **Icon button** `.icon-btn` | 44 × 44 px hit target |
| **Label** `.label` | Kicker above every section title |
| **Link** `.link` | Underline that retracts on hover (direction-aware) |
| **Header** | 64 px on mobile, 76 px on desktop. Transparent over the hero, blurred paper once scrolled. The menu is a full-screen dialog with numbered links |
| **ProductCard** | 4:5 stage with a second image on hover. A try-on pill expands on hover and is always expanded on touch. The info row stacks when the card is narrower than 300 px (container query) |
| **Product scene** (home) | One product per screen: gallery and thumbnails, a display-size name, and the ⓘ / Buy / mirror trio (from the Kingsley Rowe reference) |
| **Hotspots** | White "+" pins with a pulsing ring. The active pin turns to ink "×". Synced with the numbered list |
| **Dimensions** | Parametric frame on a blueprint grid with measure lines, plus a 2-column spec table |
| **Swatch** | 34 px colour dot with an ink outline ring when selected |
| **Chip** | 36 px pill filter. The pressed state is ink |
| **Buy bar** (mobile PDP) | Ink pill fixed at the bottom. Appears once the main CTA scrolls away |
| **Drawer / Dialog** | Native `<dialog>`, so focus trap and Esc come free. The bag slides from inline-end. The mirror is a full-screen sheet on mobile and a centred 1120 px modal on desktop |
| **Placeholder** | Labelled, tinted, line-art panel for photography that does not exist yet. Always says "Placeholder" |
| **Wordmark** | "SLAZENGER" in Geist 500, +0.38 em tracking, optional "EYEWEAR ATELIER" sub-line |

## Accessibility baseline

- Text contrast meets AA. Muted text uses `--stone-600`.
- Every interactive element is a real `<a>` or `<button>` with a visible `:focus-visible` ring. Hit targets are at least 44 px.
- Dialogs use native `<dialog>`. The skip link goes to `#main`. Each gallery and filter has an aria-label.
- Images carry bilingual alt text from the data files. Decorative images use `alt=""`.

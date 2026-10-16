# Content inventory

What is real, what is sample, and what the brand needs to supply.

## Status (Phase 1)

| Content | Status | Where |
|---|---|---|
| Product photography (4 models, 15 images) | **Real**, supplied by the brand | `src/assets/products/<slug>/` |
| Product names (Milano, Notte, Cristallo, Rosa) | Sample | `src/data/products.ts` |
| Prices (Toman), codes, measurements, weights, materials | Sample | `src/data/products.ts` |
| Colourways other than the photographed one | Sample, rendered from the parametric frame only | `products.ts → colourways[].photographed=false` |
| Product descriptions, taglines, hotspot copy | Sample (en + fa) | `src/data/products.ts` |
| Collections (Riviera, Notturno, Atelier Edition, Monolith) | Sample names and stories. The brand has real collections but no photos yet | `src/data/collections.ts` |
| Atelier process and numbers | Sample | `src/data/editorial.ts` |
| UI copy and tagline ("Shaped by hand. Seen by everyone.") | Sample | `src/i18n/ui.ts` |
| Logo | **None yet.** A typographic wordmark is used instead | `src/components/Wordmark.astro` |
| Lifestyle, atelier and collection imagery | **Missing.** Labelled placeholders are shown | `Placeholder.astro` usages |
| Social links, store locations, legal pages | Placeholder `#` links | `Footer.astro`, `Header.astro` |

## ⚠️ Branding issue in the supplied photos

Products **2 (Notte), 3 (Cristallo) and 4 (Rosa)** have the word **"JAKERSON"** printed on the temples. One image
(`cristallo/editorial.jpg`, not used on the site) also has "JAKERSON LOS ANGELES" in large type. These photos are fine
for the prototype, but **the final photography must show Slazenger branding**. Raise this in the meeting.

## Photo mapping

All product images are generated to the **Image Standard** (`docs/IMAGE-STANDARD.md`) by `npm run images` from the
brand's raw folders. The full source → slot map with focal points is in `scripts/image-spec.mjs`, and per-file
results are in `docs/IMAGE-REPORT.md`.

| Folder (brand delivery) | Slug | Slots produced |
|---|---|---|
| `1/` | `milano` | card, gallery-2/3, detail, lifestyle-1/2 (on-model), hero-desktop, hero-mobile |
| `2/` | `notte` | card (front), gallery-2/3/4, detail (hinge), hero-desktop, hero-mobile |
| `3/` | `cristallo` | card (front), gallery-2/3/4, detail (hinge), hero-desktop, hero-mobile |
| `4/` | `rosa` | card (the standing shot rotated to a front view), gallery-2/3, detail (jewel) |

## Shot list for the brand (Phase 2)

The full photographer brief is in `docs/IMAGE-STANDARD.md`. Summary:

Per model × colourway:
1. **Front packshot** on a seamless warm-grey background (#E5E1DB), 3000 px, centred. Used for cards and the hero.
2. **3/4 angle** packshot. Used for the card hover image and the gallery.
3. **Side / temple** packshot, showing the inner engraving.
4. **Macro details**: hinge, rivets, bridge and the polished edge. Used for the anatomy hotspots.
5. **Front view, transparent PNG** with lenses at their real tint, shot orthographically. Used by the Virtual Mirror.
6. **On-model**: two or three portraits per model, of different genders, ages and skin tones (the Gen Z focus). Used for the lifestyle sections.

Brand-wide:
- Atelier and workshop: wide shot, hands milling, hands filing, the tumbling barrels, polishing wheel, final inspection. That makes six images, matching the six process steps.
- One campaign image per collection, in 4:5 and 16:9.
- Packaging and case.
- Optional: a 10–15 s loop video for the hero.

## Data the brand must supply (Phase 2)

For each model: official name, code, colourways with codes, lens width, bridge, temple, lens height, weight, frame
material, lens spec, price in Toman, run size, collection, hours of handwork, and a short story in both languages.

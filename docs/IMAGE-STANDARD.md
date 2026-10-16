# Image Standard v1

_Source of truth in code: `scripts/image-spec.mjs`. Generator: `scripts/prepare-images.mjs` (`npm run images`).
Per-file results: [IMAGE-REPORT.md](IMAGE-REPORT.md), which the generator rewrites._

Every product image on the site is produced from the brand's raw photos by one script, to exact sizes, crops and
file names. Nothing is cropped by hand, and no view hard-codes an image path. Views ask for a **slot** through
`src/lib/media.ts`, for example `media('milano', 'card')`.

## Why these ratios

- **Product shots are landscape (4:3).** Glasses are wide objects. A 4:3 frame shows the whole frame large and
  centred, which is how specialist eyewear houses present product. Every card on the site therefore has the same
  scale and the same horizon.
- **People are portrait (4:5).** On-model and campaign images use the classic fashion portrait ratio.
- **The hero is art-directed.** A 16:9 image goes to desktops and a separate 9:16 image goes to phones, both of the
  same product, so neither device sees an awkward crop.

## Slots

| Slot | Ratio | Exact output | Min. source (long edge) | Where it's used | Composition rules |
|---|---|---|---|---|---|
| `card` | 4:3 | 1600 × 1200 | 1600 px | Shop and related cards, cart, PDP gallery #1 | Whole frame, front or 3/4 view, about 80% of width, optically centred, horizon at about 55% height, calm background |
| `gallery-N` | 4:3 | 1600 × 1200 | 1600 px | PDP gallery #2 onwards; `gallery-2` is the card hover image | Angles, side view, the frame on a surface, temples |
| `detail` | 4:3 | 1600 × 1200 | 1200 px | "Up close" anatomy hotspots | Hinge, rivets, engraving, jewel. Leave space for 3 hotspots |
| `lifestyle-N` | 4:5 | 1200 × 1500 | 1500 px | PDP lifestyle band, home lookbook, mirror CTA | On-model. Eyes in the top third, frame sharp |
| `hero-desktop` | 16:9 | 1920 × 1080 | 1920 px | Home hero ≥ 900 px wide | Product in the central or right two-thirds. The bottom 20% stays calm because buttons sit there |
| `hero-mobile` | 9:16 | 1080 × 1920 | 1440 px | Home hero on phones | Subject in the top 60%. The bottom 30% stays calm for the buttons and tab bar |

Astro then builds responsive **WebP** variants from these masters (for example 400/640/960/1280 px for cards), so
the masters are the only size that has to be right.

**File naming:** `src/assets/products/<slug>/<slot>.jpg`, for example `notte/gallery-3.jpg`. The master JPGs are
quality 90 (mozjpeg) with 4:4:4 chroma.

## How a slot is rendered

1. **Source region:** take a raw file; optionally `box`-crop it out of a composite (triptychs) and `rotate` it.
2. **Crop:** cut the largest rectangle of the slot's ratio that fits, divided by `zoom`, centred on the
   **focal point** `[x, y]` (0–1 of the source) and clamped to the edges.
3. **Resize:** scale to the exact output size with Lanczos3, adding light sharpening when enlarging more than 1.15×.
4. **Report:** if the crop's long edge is below the slot's minimum source, the file is flagged as an upscale.

## Adding or changing a product's images

1. Put the brand's photos in a folder (outside the repo), with one sub-folder per product.
2. In `scripts/image-spec.mjs`, add the sources under `SRC` and the outputs under `PRODUCTS`:
   `['card', 'card', SRC.slug.front, [0.5, 0.48], 1]`, meaning name, slot, source, focal point and zoom.
3. Run `RAW_DIR=/path/to/photos npm run images` and check `docs/IMAGE-REPORT.md`.
4. Reference the images in `src/data/products.ts` with `media('<slug>', '<slot>')` and write bilingual alt text.
   If you change a `detail` crop, update the hotspot `x/y` percentages.

## Brief for the brand's photographer (for the final shoot)

- **Resolution:** at least 3000 px on the long edge, RAW plus 16-bit TIFF, colour-managed (sRGB export).
- **Packshots** (`card`, `gallery`):
  - seamless warm-grey background (#E5E1DB), soft key light from the top-left, one consistent shadow direction
  - a 50 mm-equivalent lens to avoid distortion, frames dust-free, lenses without reflections of the studio
- **Required set per colourway:**
  - front (orthographic, at eye level)
  - 3/4 view
  - side
  - temple interior (engraving)
  - hinge macro
  - folded
- **For the Virtual Mirror:** one front view as a **transparent PNG**, 3000 px wide, lenses at their real tint.
- **On-model:** 2–3 portraits per model in 4:5, with diverse faces (Gen Z focus). Eyes sharp, frame clean.
- **Hero:** shot wide (16:9) with negative space, plus a vertical variant (9:16).
- **Branding:** every frame must show **Slazenger** marks. The current photos for 3 models show "JAKERSON".

## Current status

The brand's first photo set tops out at 1536 px, so most slots are clean Lanczos enlargements (×1.1–×2.5). They are
good enough for the prototype, and each file is flagged in [IMAGE-REPORT.md](IMAGE-REPORT.md). Delivering the
shoot above replaces every file with no code changes: run `npm run images`.

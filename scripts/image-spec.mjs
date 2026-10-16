/**
 * IMAGE STANDARD v1 — the single source of truth for product imagery.
 * Documented for humans in docs/IMAGE-STANDARD.md (keep both in sync).
 *
 * SLOTS define the exact output of every image role on the site.
 * PRODUCTS map each product's slots to a source region + focal point.
 * `npm run images` (scripts/prepare-images.mjs) renders every slot to the
 * exact pixel size and writes a quality report.
 */

/** Output roles. Sizes are exact. `minSource` is the smallest crop (in source
 *  pixels, long edge) that meets the standard without visible upscaling. */
export const SLOTS = {
  // Product shots — landscape, because glasses are landscape objects.
  card: { ratio: [4, 3], size: [1600, 1200], minSource: 1600, use: 'Shop/related cards, cart, PDP gallery #1. Whole frame, front or 3/4, ~80% of width, centred.' },
  gallery: { ratio: [4, 3], size: [1600, 1200], minSource: 1600, use: 'PDP gallery #2+, card hover (#2). Angles, side, on-surface still lifes.' },
  detail: { ratio: [4, 3], size: [1600, 1200], minSource: 1200, use: 'Anatomy hotspots close-up: hinge, temple, rivets, jewel.' },
  // Editorial — portrait.
  lifestyle: { ratio: [4, 5], size: [1200, 1500], minSource: 1500, use: 'On-model / campaign portraits: PDP lifestyle, home lookbook, mirror CTA.' },
  // Home hero — art-directed pair.
  'hero-desktop': { ratio: [16, 9], size: [1920, 1080], minSource: 1920, use: 'Home hero ≥900px wide. Product on the right two-thirds, calm left/bottom.' },
  'hero-mobile': { ratio: [9, 16], size: [1080, 1920], minSource: 1440, use: 'Home hero on phones. Subject in the top 60% (buttons sit at the bottom).' },
};

/** Raw source regions per product. `file` is relative to RAW_DIR; `box` crops a
 *  composite (left, top, right, bottom in source px); `rotate` in degrees. */
const SRC = {
  milano: {
    campaign: { file: '1/Minimalist Slazenger Sunglasses Advertisement.png' },
    angle: { file: '1/Slazenger Sunglasses in Architectural Light.png' },
    woman: { file: '1/Sleek Slazenger Sunglasses Editorial Portrait.png' },
    man: { file: '1/Cinematic Slazenger Eyewear Portrait.png' },
  },
  notte: {
    still: { file: '2/Luxury JAKERSON Sunglasses Still Life.png' },
    side: { file: '2/Premium JAKerson Sunglasses Triptych.png', box: [0, 0, 833, 1024] },
    front: { file: '2/Premium JAKerson Sunglasses Triptych.png', box: [839, 0, 1536, 533] },
    hinge: { file: '2/Premium JAKerson Sunglasses Triptych.png', box: [839, 539, 1536, 1024] },
  },
  cristallo: {
    float: { file: '3/Crystal-Clear JAKERSON Eyewear.png' },
    side: { file: '3/Transparent JAKERSON Eyewear Triptych.png', box: [0, 0, 806, 1024] },
    front: { file: '3/Transparent JAKERSON Eyewear Triptych.png', box: [812, 0, 1536, 502] },
    hinge: { file: '3/Transparent JAKERSON Eyewear Triptych.png', box: [812, 508, 1536, 1024] },
  },
  rosa: {
    angle: { file: '4/Rose Gold Eyewear Editorial Split View.png', box: [0, 0, 862, 1024] },
    // Shot standing on its side; rotated to read as a front view.
    front: { file: '4/Rose Gold Eyewear Editorial Split View.png', box: [878, 0, 1536, 1024], rotate: 90 },
  },
};

/**
 * Per-product outputs. Each entry: [outputName, slot, source, focus [x,y] 0–1, zoom ≥1].
 * focus = the point that must stay centred (clamped at the edges);
 * zoom 1 = the largest crop of the slot's ratio that fits the source.
 * Gallery order = PDP order; gallery-1 is always the card image.
 */
export const PRODUCTS = {
  milano: [
    ['card', 'card', SRC.milano.campaign, [0.47, 0.565], 1.28],
    ['gallery-2', 'gallery', SRC.milano.angle, [0.5, 0.7], 1],
    ['gallery-3', 'gallery', SRC.milano.angle, [0.55, 0.22], 1.15],
    ['detail', 'detail', SRC.milano.angle, [0.55, 0.2], 1.3],
    ['lifestyle-1', 'lifestyle', SRC.milano.woman, [0.48, 0.36], 1],
    ['lifestyle-2', 'lifestyle', SRC.milano.man, [0.47, 0.4], 1],
    ['hero-desktop', 'hero-desktop', SRC.milano.campaign, [0.47, 0.585], 1],
    ['hero-mobile', 'hero-mobile', SRC.milano.man, [0.5, 0.42], 1],
  ],
  notte: [
    ['card', 'card', SRC.notte.front, [0.5, 0.48], 1],
    ['gallery-2', 'gallery', SRC.notte.still, [0.52, 0.48], 1],
    ['gallery-3', 'gallery', SRC.notte.side, [0.55, 0.5], 1],
    ['gallery-4', 'gallery', SRC.notte.hinge, [0.55, 0.5], 1],
    ['detail', 'detail', SRC.notte.hinge, [0.55, 0.5], 1],
    ['hero-desktop', 'hero-desktop', SRC.notte.still, [0.5, 0.45], 1],
    ['hero-mobile', 'hero-mobile', SRC.notte.side, [0.6, 0.5], 1],
  ],
  cristallo: [
    ['card', 'card', SRC.cristallo.front, [0.5, 0.48], 1],
    ['gallery-2', 'gallery', SRC.cristallo.float, [0.5, 0.5], 1],
    ['gallery-3', 'gallery', SRC.cristallo.side, [0.5, 0.55], 1],
    ['gallery-4', 'gallery', SRC.cristallo.hinge, [0.5, 0.48], 1],
    ['detail', 'detail', SRC.cristallo.hinge, [0.5, 0.48], 1],
    ['hero-desktop', 'hero-desktop', SRC.cristallo.float, [0.5, 0.5], 1],
    ['hero-mobile', 'hero-mobile', SRC.cristallo.float, [0.5, 0.5], 1],
  ],
  rosa: [
    ['card', 'card', SRC.rosa.front, [0.5, 0.5], 1],
    ['gallery-2', 'gallery', SRC.rosa.angle, [0.5, 0.5], 1],
    ['gallery-3', 'gallery', SRC.rosa.angle, [0.34, 0.45], 1.25],
    ['detail', 'detail', SRC.rosa.angle, [0.45, 0.48], 1.1],
  ],
};

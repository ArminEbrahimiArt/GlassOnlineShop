/**
 * Prepares product photography for the site.
 *
 * Reads the raw photo folders delivered by the brand (one folder per product,
 * see docs/CONTENT.md) and writes normalised, cropped JPG sources into
 * src/assets/products/<slug>/. Astro's image pipeline then generates the
 * responsive AVIF/WebP variants at build time, so these sources stay
 * high-quality and are committed to the repo. The raw folder is NOT committed.
 *
 * Usage:  RAW_DIR=/path/to/Glass npm run images
 *
 * Crops are in source pixels: [left, top, width, height]. Composite
 * "triptych" shots are split into their individual panels here.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const RAW = process.env.RAW_DIR;
if (!RAW) {
  console.error('Set RAW_DIR to the folder that contains the numbered product folders (1, 2, 3, 4).');
  process.exit(1);
}
const OUT = path.resolve('src/assets/products');

/** slug -> list of { src, out, crop? } */
const MAP = {
  milano: [
    { src: '1/Minimalist Slazenger Sunglasses Advertisement.png', out: 'campaign.jpg' },
    { src: '1/Slazenger Sunglasses in Architectural Light.png', out: 'angle.jpg' },
    { src: '1/Sleek Slazenger Sunglasses Editorial Portrait.png', out: 'portrait-woman.jpg' },
    { src: '1/Cinematic Slazenger Eyewear Portrait.png', out: 'portrait-man.jpg' },
  ],
  notte: [
    { src: '2/Luxury JAKERSON Sunglasses Still Life.png', out: 'still-life.jpg' },
    { src: '2/Premium JAKerson Sunglasses Triptych.png', out: 'angle.jpg', crop: [0, 0, 833, 1024] },
    { src: '2/Premium JAKerson Sunglasses Triptych.png', out: 'front.jpg', crop: [839, 0, 697, 533] },
    { src: '2/Premium JAKerson Sunglasses Triptych.png', out: 'hinge.jpg', crop: [839, 539, 697, 485] },
  ],
  cristallo: [
    { src: '3/Crystal-Clear JAKERSON Eyewear.png', out: 'float.jpg' },
    { src: '3/Transparent JAKERSON Eyewear Triptych.png', out: 'angle.jpg', crop: [0, 0, 806, 1024] },
    { src: '3/Transparent JAKERSON Eyewear Triptych.png', out: 'front.jpg', crop: [812, 0, 724, 502] },
    { src: '3/Transparent JAKERSON Eyewear Triptych.png', out: 'hinge.jpg', crop: [812, 508, 724, 516] },
    { src: '3/JAKERSON Crystal Frames Editorial.png', out: 'editorial.jpg' },
  ],
  rosa: [
    { src: '4/Rose Gold Eyewear Editorial Split View.png', out: 'angle.jpg', crop: [0, 0, 862, 1024] },
    { src: '4/Rose Gold Eyewear Editorial Split View.png', out: 'standing.jpg', crop: [878, 0, 658, 1024] },
  ],
};

for (const [slug, items] of Object.entries(MAP)) {
  const dir = path.join(OUT, slug);
  await mkdir(dir, { recursive: true });
  for (const item of items) {
    let img = sharp(path.join(RAW, item.src));
    if (item.crop) {
      const [left, top, width, height] = item.crop;
      img = img.extract({ left, top, width, height });
    }
    await img
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(path.join(dir, item.out));
    console.log('✓', slug, item.out);
  }
}

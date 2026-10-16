/**
 * Parametric front-view frame renderer.
 *
 * Produces an SVG string for a pair of glasses seen from the front. One
 * definition drives three things:
 *   1. The Virtual Mirror overlay (drawn onto the camera canvas)
 *   2. The measurements diagram on product pages
 *   3. Colourway previews when no photograph exists yet
 *
 * Coordinate system: viewBox 0 0 200 H. x=100 is the centre of the bridge.
 * The width 200 maps to the full frame width (temple to temple) — the try-on
 * scales it against the user's face width.
 */

export type FrameShape = 'square' | 'wayfarer' | 'oversized';

export interface FrameStyle {
  /** Acetate colour */
  frame: string;
  /** 0–1. < 1 for crystal / transparent acetate */
  frameOpacity: number;
  /** Lens tint (top of gradient) */
  lens: string;
  /** Lens tint (bottom of gradient) — gradient lenses */
  lensBottom?: string;
  lensOpacity: number;
  /** Hinge rivets / metal detail */
  metal: string;
}

export interface FrameGeometry {
  shape: FrameShape;
  /** Rim thickness in viewBox units */
  rim: number;
}

type Pt = [number, number];

/** Polygon → path with rounded corners (quadratic joins). */
function roundedPath(points: Pt[], radii: number[]) {
  const n = points.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const cur = points[i];
    const next = points[(i + 1) % n];
    const r = radii[i];
    const v1 = unit(cur, prev);
    const v2 = unit(cur, next);
    const a: Pt = [cur[0] + v1[0] * r, cur[1] + v1[1] * r];
    const b: Pt = [cur[0] + v2[0] * r, cur[1] + v2[1] * r];
    d += `${i === 0 ? 'M' : 'L'}${f(a[0])} ${f(a[1])} Q${f(cur[0])} ${f(cur[1])} ${f(b[0])} ${f(b[1])} `;
  }
  return d + 'Z';
}
const unit = (from: Pt, to: Pt): Pt => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  return [dx / len, dy / len];
};
const f = (n: number) => Math.round(n * 100) / 100;

/** Left-eye outline for a given shape, inset by `inset` (0 = outer rim edge). */
function eye(shape: FrameShape, inset: number): { pts: Pt[]; r: number[] } {
  const i = inset;
  switch (shape) {
    case 'wayfarer':
      // Strong brow, tapering bottom toward the nose.
      return {
        pts: [
          [6 + i, 10 + i],
          [91 - i, 13 + i],
          [88 - i, 64 - i],
          [13 + i, 67 - i],
        ],
        r: [10 - i * 0.5, 9 - i * 0.5, 14 - i * 0.6, 16 - i * 0.6],
      };
    case 'oversized':
      // Softer, taller, butterfly lift at the outer corner.
      return {
        pts: [
          [3 + i, 4 + i],
          [90 - i, 14 + i],
          [86 - i, 70 - i],
          [12 + i, 72 - i],
        ],
        r: [16 - i * 0.6, 14 - i * 0.6, 22 - i * 0.8, 22 - i * 0.8],
      };
    case 'square':
    default:
      return {
        pts: [
          [8 + i, 12 + i],
          [91 - i, 12 + i],
          [90 - i, 66 - i],
          [10 + i, 67 - i],
        ],
        r: [9 - i * 0.4, 9 - i * 0.4, 13 - i * 0.5, 15 - i * 0.5],
      };
  }
}

const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [200 - x, y] as Pt).reverse();

export const FRAME_VIEWBOX_H = 80;

/**
 * Returns a standalone SVG document string.
 * `uid` keeps gradient ids unique when several frames share a page.
 */
export function frameSVG(geo: FrameGeometry, style: FrameStyle, uid = 'f'): string {
  const outerL = eye(geo.shape, 0);
  const innerL = eye(geo.shape, geo.rim);
  const outerR = { pts: mirror(outerL.pts), r: [...outerL.r].reverse() };
  const innerR = { pts: mirror(innerL.pts), r: [...innerL.r].reverse() };

  // Inner (lens) paths must wind opposite to the outer rims so the nonzero
  // fill rule punches clean holes — see docs/ARCHITECTURE.md → Virtual Mirror.
  const rev = (e: { pts: Pt[]; r: number[] }) => ({ pts: [...e.pts].reverse(), r: [...e.r].reverse() });
  const lensL = roundedPath(innerL.pts, innerL.r);
  const lensR = roundedPath(innerR.pts, innerR.r);
  const holeL = roundedPath(rev(innerL).pts, rev(innerL).r);
  const holeR = roundedPath(rev(innerR).pts, rev(innerR).r);

  const browY = geo.shape === 'oversized' ? 14 : 12;
  const bridge = `M86 ${browY + 1} L114 ${browY + 1} L114 ${browY + geo.rim + 5} Q100 ${browY + geo.rim} 86 ${browY + geo.rim + 5} Z`;
  // End pieces (where temples attach)
  const endL = `M1 ${browY + 2} L9 ${browY} L9 ${browY + 12} L2 ${browY + 12} Z`;
  const endR = `M199 ${browY + 2} L191 ${browY} L191 ${browY + 12} L198 ${browY + 12} Z`;

  const frameD = [
    roundedPath(outerL.pts, outerL.r),
    roundedPath(outerR.pts, outerR.r),
    bridge,
    endL,
    endR,
    holeL,
    holeR,
  ].join(' ');

  const lensTop = style.lens;
  const lensBottom = style.lensBottom ?? style.lens;
  const rivetY = browY + 5;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 ${FRAME_VIEWBOX_H}" width="1000" height="${FRAME_VIEWBOX_H * 5}">
<defs>
<linearGradient id="${uid}-lens" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lensTop}"/><stop offset="1" stop-color="${lensBottom}"/></linearGradient>
<linearGradient id="${uid}-sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".18" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${uid}-glare" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>
<g opacity="${style.lensOpacity}"><path d="${lensL}" fill="url(#${uid}-lens)"/><path d="${lensR}" fill="url(#${uid}-lens)"/></g>
<path d="${lensL}" fill="url(#${uid}-glare)"/><path d="${lensR}" fill="url(#${uid}-glare)"/>
<g opacity="${style.frameOpacity}"><path d="${frameD}" fill="${style.frame}" fill-rule="nonzero"/></g>
<path d="${frameD}" fill="url(#${uid}-sheen)" fill-rule="nonzero"/>
${style.frameOpacity < 1 ? `<path d="${roundedPath(outerL.pts, outerL.r)} ${roundedPath(outerR.pts, outerR.r)} ${lensL} ${lensR}" fill="none" stroke="#000" stroke-opacity=".16" stroke-width=".45"/>` : ''}
<circle cx="15" cy="${rivetY}" r="1.4" fill="${style.metal}"/><circle cx="185" cy="${rivetY}" r="1.4" fill="${style.metal}"/>
</svg>`;
}

/** data: URL for <img src> or canvas drawing. */
export const frameDataURL = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

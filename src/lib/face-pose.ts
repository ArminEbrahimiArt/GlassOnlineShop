/**
 * Face pose for the Virtual Mirror.
 *
 * Turns MediaPipe's 478 normalised landmarks into where and how to draw the
 * frame: centre, true (3D) face width, roll, yaw and pitch. It is filtered
 * with a One Euro filter, an adaptive low-pass filter that removes jitter when
 * the head is still but adds almost no lag when it moves (Casiez et al., CHI
 * 2012). See docs/ARCHITECTURE.md → Virtual Mirror.
 */
import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

// Canonical face-mesh indices
const EYE_L_OUT = 33;
const EYE_L_IN = 133;
const EYE_R_IN = 362;
const EYE_R_OUT = 263;
const NOSE_BRIDGE = 168; // where the frame's bridge rests
const TEMPLE_L = 127; // face edge at eye height
const TEMPLE_R = 356;
const FOREHEAD = 10;
const CHIN = 152;

/** Frame width ÷ temple-to-temple face width */
export const WIDTH_FACTOR = 1.04;

export interface Pose {
  /** Bridge position in image pixels */
  x: number;
  y: number;
  /** True frame width in pixels (before yaw foreshortening) */
  w: number;
  roll: number;
  yaw: number;
  pitch: number;
}

export function poseFrom(lm: NormalizedLandmark[], W: number, H: number): Pose {
  // MediaPipe z is in roughly the same scale as x (image width).
  const P = (i: number) => ({ x: lm[i].x * W, y: lm[i].y * H, z: lm[i].z * W });
  const mid = (a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2,
  });
  const eyeL = mid(P(EYE_L_OUT), P(EYE_L_IN));
  const eyeR = mid(P(EYE_R_IN), P(EYE_R_OUT));
  const bridge = P(NOSE_BRIDGE);
  const tl = P(TEMPLE_L);
  const tr = P(TEMPLE_R);
  const top = P(FOREHEAD);
  const chin = P(CHIN);

  const roll = Math.atan2(eyeR.y - eyeL.y, eyeR.x - eyeL.x);
  // Width measured in 3D, so turning the head doesn't shrink the frame.
  const w = Math.hypot(tr.x - tl.x, tr.y - tl.y, tr.z - tl.z) * WIDTH_FACTOR;
  const yaw = Math.atan2(tr.z - tl.z, Math.hypot(tr.x - tl.x, tr.y - tl.y));
  const pitch = Math.atan2(chin.z - top.z, Math.hypot(chin.y - top.y, chin.x - top.x));

  return {
    // Horizontal anchor: nose bridge (follows yaw naturally). Vertical: eye line.
    x: bridge.x * 0.6 + ((eyeL.x + eyeR.x) / 2) * 0.4,
    y: (eyeL.y + eyeR.y) / 2,
    w,
    roll,
    yaw,
    pitch,
  };
}

/* ── One Euro filter ─────────────────────────────────────────────────────── */

class OneEuro {
  private xPrev: number | null = null;
  private dxPrev = 0;
  private tPrev = 0;
  constructor(
    private minCutoff: number,
    private beta: number,
    private dCutoff = 1,
  ) {}
  private static alpha(cutoff: number, dt: number) {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / dt);
  }
  filter(x: number, t: number) {
    if (this.xPrev === null) {
      this.xPrev = x;
      this.tPrev = t;
      return x;
    }
    const dt = Math.max(1e-3, t - this.tPrev);
    const dx = (x - this.xPrev) / dt;
    const edx = this.dxPrev + OneEuro.alpha(this.dCutoff, dt) * (dx - this.dxPrev);
    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    const xHat = this.xPrev + OneEuro.alpha(cutoff, dt) * (x - this.xPrev);
    this.xPrev = xHat;
    this.dxPrev = edx;
    this.tPrev = t;
    return xHat;
  }
  reset() {
    this.xPrev = null;
    this.dxPrev = 0;
  }
}

/**
 * Smooths a stream of poses. Tuned for ~30 fps phone cameras:
 * position/size react fast to motion, angles are a little calmer.
 */
export class PoseFilter {
  private f = {
    x: new OneEuro(1.4, 0.008),
    y: new OneEuro(1.4, 0.008),
    w: new OneEuro(0.9, 0.004),
    roll: new OneEuro(1.2, 0.4),
    yaw: new OneEuro(0.9, 0.3),
    pitch: new OneEuro(0.9, 0.3),
  };
  apply(p: Pose, tMs: number): Pose {
    const t = tMs / 1000;
    return {
      x: this.f.x.filter(p.x, t),
      y: this.f.y.filter(p.y, t),
      w: this.f.w.filter(p.w, t),
      roll: this.f.roll.filter(p.roll, t),
      yaw: this.f.yaw.filter(p.yaw, t),
      pitch: this.f.pitch.filter(p.pitch, t),
    };
  }
  reset() {
    Object.values(this.f).forEach((f) => f.reset());
  }
}

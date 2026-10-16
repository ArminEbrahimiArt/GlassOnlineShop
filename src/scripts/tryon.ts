/**
 * Virtual Mirror — live try-on.
 *
 * Pipeline (all on-device, nothing uploaded):
 *   camera (getUserMedia) → MediaPipe FaceLandmarker (478 landmarks, WASM/GPU)
 *   → eye line + face width → place the product's front-view SVG on a canvas
 *   that sits over the mirrored <video>.
 *
 * The MediaPipe runtime (~13 MB WASM + 3.6 MB model) is self-hosted under
 * /mediapipe and only fetched when the user presses "Turn on camera" or
 * uploads a photo. See docs/ARCHITECTURE.md → "Virtual Mirror".
 *
 * Stage states (data-state): idle → loading → searching ⇄ tracking → still
 *                            idle → loading → photo  (uploaded image)
 */
import type { FaceLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { readCatalog, formatPriceClient } from '@/lib/catalog';
import { addToCart, openCart, toast } from './cart';

// Landmark indices (MediaPipe canonical face mesh)
const EYE_OUTER_A = 33;
const EYE_OUTER_B = 263;
const FACE_EDGE_A = 127; // near the temple, at eye height
const FACE_EDGE_B = 356;
// Where the eye line sits inside the frame SVG (viewBox 200×80).
const FRAME_EYE_Y = 34 / 80;
const FRAME_ASPECT = 80 / 200;
// Frame width relative to face width at the temples.
const WIDTH_FACTOR = 1.02;

type State = 'idle' | 'loading' | 'searching' | 'tracking' | 'still' | 'photo';

interface Pose {
  x: number;
  y: number;
  w: number;
  angle: number;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

let dialog: HTMLDialogElement;
let stage: HTMLElement;
let video: HTMLVideoElement;
let overlay: HTMLCanvasElement;
let photo: HTMLCanvasElement;
let still: HTMLImageElement;
let statusEl: HTMLElement;

let landmarker: FaceLandmarker | null = null;
let landmarkerMode: 'VIDEO' | 'IMAGE' = 'VIDEO';
let stream: MediaStream | null = null;
let raf = 0;
let lastVideoTime = -1;
let pose: Pose | null = null;
let photoPose: Pose | null = null;
let stillUrl: string | null = null;

let current: { slug: string; colour: string } = { slug: '', colour: '' };
const frameCache = new Map<string, HTMLImageElement>();

const $ = <T extends Element>(sel: string) => dialog.querySelector<T>(sel)!;
const S = () => readCatalog().strings;

function setState(s: State) {
  stage.dataset.state = s;
  const capture = $<HTMLButtonElement>('[data-capture]');
  const retake = $<HTMLButtonElement>('[data-retake]');
  capture.disabled = !(s === 'tracking' || s === 'searching');
  capture.hidden = s === 'still' || s === 'photo';
  retake.hidden = !(s === 'still' || s === 'photo');
  $<HTMLButtonElement>('[data-save]').disabled = !(s === 'still' || s === 'photo');
  const msg: Partial<Record<State, string>> = {
    loading: S().mirrorLoading,
    searching: S().mirrorSearching,
    tracking: '',
  };
  if (s in msg) status(msg[s]!);
}
const status = (m: string) => (statusEl.textContent = m);

/* ── Product / frame selection ─────────────────────────────────────────── */

function frameImage(slug: string, colour: string) {
  const key = `${slug}:${colour}`;
  let img = frameCache.get(key);
  if (!img) {
    const p = readCatalog().products[slug];
    const c = p.colourways.find((x) => x.id === colour) ?? p.colourways[0];
    img = new Image();
    img.src = c.frame;
    frameCache.set(key, img);
  }
  return img;
}

function select(slug: string, colour?: string) {
  const cat = readCatalog();
  const p = cat.products[slug] ?? Object.values(cat.products)[0];
  current = { slug: p.slug, colour: colour && p.colourways.some((c) => c.id === colour) ? colour : p.colourways[0].id };
  const c = p.colourways.find((x) => x.id === current.colour)!;

  $('[data-name]').textContent = p.name;
  $('[data-colour-name]').textContent = c.name;
  $('[data-price]').textContent = formatPriceClient(p.price, cat.locale);

  // Colour swatches
  const colours = $<HTMLElement>('[data-colours]');
  colours.replaceChildren(
    ...p.colourways.map((cw) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.role = 'radio';
      b.style.background = cw.swatch;
      b.setAttribute('aria-label', cw.name);
      b.setAttribute('aria-checked', String(cw.id === current.colour));
      b.addEventListener('click', () => select(p.slug, cw.id));
      return b;
    }),
  );

  // Frames list
  dialog.querySelectorAll<HTMLElement>('[data-frames] button').forEach((b) => {
    b.setAttribute('aria-selected', String(b.dataset.slug === p.slug));
  });

  frameImage(current.slug, current.colour);
  if (stage.dataset.state === 'photo') drawPhoto();
}

function buildFrameList() {
  const cat = readCatalog();
  const list = $<HTMLElement>('[data-frames]');
  list.replaceChildren(
    ...Object.values(cat.products).map((p) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.role = 'option';
      b.dataset.slug = p.slug;
      const img = document.createElement('img');
      img.src = p.colourways[0].frame;
      img.alt = '';
      const label = document.createElement('span');
      label.textContent = p.name;
      b.append(img, label);
      b.addEventListener('click', () => select(p.slug));
      return b;
    }),
  );
}

/* ── MediaPipe ─────────────────────────────────────────────────────────── */

async function getLandmarker(mode: 'VIDEO' | 'IMAGE') {
  if (!landmarker) {
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
    const fileset = await FilesetResolver.forVisionTasks(`${BASE}/mediapipe/wasm`);
    const opts = (delegate: 'GPU' | 'CPU') => ({
      baseOptions: { modelAssetPath: `${BASE}/mediapipe/face_landmarker.task`, delegate },
      runningMode: mode,
      numFaces: 1,
      minFaceDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    try {
      landmarker = await FaceLandmarker.createFromOptions(fileset, opts('GPU'));
    } catch {
      landmarker = await FaceLandmarker.createFromOptions(fileset, opts('CPU'));
    }
    landmarkerMode = mode;
  } else if (landmarkerMode !== mode) {
    await landmarker.setOptions({ runningMode: mode });
    landmarkerMode = mode;
  }
  return landmarker;
}

/** Landmarks (normalised) → frame pose in pixel space of a W×H image. */
function poseFrom(lm: NormalizedLandmark[], W: number, H: number): Pose {
  const P = (i: number) => ({ x: lm[i].x * W, y: lm[i].y * H });
  const a = P(EYE_OUTER_A);
  const b = P(EYE_OUTER_B);
  const ea = P(FACE_EDGE_A);
  const eb = P(FACE_EDGE_B);
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    w: Math.hypot(eb.x - ea.x, eb.y - ea.y) * WIDTH_FACTOR,
    angle: Math.atan2(b.y - a.y, b.x - a.x),
  };
}

/** Exponential smoothing — removes jitter without feeling laggy. */
function smooth(prev: Pose | null, next: Pose, k = 0.45): Pose {
  if (!prev) return next;
  // Snap if the face jumped (e.g. re-detected)
  if (Math.hypot(next.x - prev.x, next.y - prev.y) > next.w * 0.5) return next;
  return {
    x: prev.x + (next.x - prev.x) * k,
    y: prev.y + (next.y - prev.y) * k,
    w: prev.w + (next.w - prev.w) * k,
    angle: prev.angle + (next.angle - prev.angle) * k,
  };
}

function drawFrame(ctx: CanvasRenderingContext2D, p: Pose) {
  const img = frameImage(current.slug, current.colour);
  if (!img.complete) return;
  const w = p.w;
  const h = w * FRAME_ASPECT;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.shadowColor = 'rgba(0,0,0,0.28)';
  ctx.shadowBlur = w * 0.04;
  ctx.shadowOffsetY = w * 0.02;
  ctx.drawImage(img, -w / 2, -h * FRAME_EYE_Y, w, h);
  ctx.restore();
}

/* ── Camera ────────────────────────────────────────────────────────────── */

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    status(S().mirrorUnsupported);
    return;
  }
  stopCamera();
  photo.hidden = true;
  still.hidden = true;
  video.hidden = false;
  overlay.hidden = false;
  setState('loading');
  try {
    const [s] = await Promise.all([
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      }),
      getLandmarker('VIDEO'),
    ]);
    stream = s;
    video.srcObject = s;
    await video.play();
    overlay.width = video.videoWidth;
    overlay.height = video.videoHeight;
    setState('searching');
    lastVideoTime = -1;
    pose = null;
    loop();
  } catch (err) {
    const name = (err as DOMException)?.name;
    setState('idle');
    status(name === 'NotAllowedError' || name === 'SecurityError' ? S().mirrorDenied : S().mirrorError);
    console.warn('[mirror]', err);
  }
}

function loop() {
  raf = requestAnimationFrame(loop);
  if (!landmarker || video.readyState < 2 || video.currentTime === lastVideoTime) return;
  lastVideoTime = video.currentTime;
  const W = overlay.width;
  const H = overlay.height;
  const res = landmarker.detectForVideo(video, performance.now());
  const ctx = overlay.getContext('2d')!;
  ctx.clearRect(0, 0, W, H);
  const lm = res.faceLandmarks?.[0];
  if (lm) {
    pose = smooth(pose, poseFrom(lm, W, H));
    drawFrame(ctx, pose);
    if (stage.dataset.state !== 'tracking') setState('tracking');
  } else if (stage.dataset.state === 'tracking') {
    pose = null;
    setState('searching');
  }
}

function stopCamera() {
  cancelAnimationFrame(raf);
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
  video.srcObject = null;
}

/** Freeze the current camera frame + overlay into a still image. */
function capture() {
  if (!video.videoWidth) return;
  const W = video.videoWidth;
  const H = video.videoHeight;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.translate(W, 0);
  ctx.scale(-1, 1); // match what the user sees (mirror)
  ctx.drawImage(video, 0, 0, W, H);
  ctx.drawImage(overlay, 0, 0, W, H);
  c.toBlob(
    (blob) => {
      if (!blob) return;
      if (stillUrl) URL.revokeObjectURL(stillUrl);
      stillUrl = URL.createObjectURL(blob);
      still.src = stillUrl;
      still.hidden = false;
      stopCamera();
      setState('still');
      status('');
    },
    'image/jpeg',
    0.92,
  );
}

/* ── Photo upload fallback ─────────────────────────────────────────────── */

let photoImg: HTMLImageElement | null = null;

async function usePhoto(file: File) {
  stopCamera();
  setState('loading');
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();
  photoImg = img;
  try {
    const lmk = await getLandmarker('IMAGE');
    const res = lmk.detect(img);
    const lm = res.faceLandmarks?.[0];
    photoPose = lm ? poseFrom(lm, img.naturalWidth, img.naturalHeight) : null;
  } catch (err) {
    console.warn('[mirror]', err);
    photoPose = null;
  }
  video.hidden = true;
  overlay.hidden = true;
  still.hidden = true;
  photo.hidden = false;
  setState('photo');
  status(photoPose ? '' : S().mirrorSearching);
  drawPhoto();
}

function drawPhoto() {
  if (!photoImg) return;
  const W = photoImg.naturalWidth;
  const H = photoImg.naturalHeight;
  photo.width = W;
  photo.height = H;
  const ctx = photo.getContext('2d')!;
  ctx.drawImage(photoImg, 0, 0);
  const img = frameImage(current.slug, current.colour);
  const draw = () => photoPose && drawFrame(ctx, photoPose);
  if (img.complete) draw();
  else img.onload = () => drawPhoto();
}

/* ── Save / share ──────────────────────────────────────────────────────── */

async function save() {
  const source = stage.dataset.state === 'photo' ? photo : null;
  const blob: Blob | null = source
    ? await new Promise((r) => source.toBlob(r, 'image/jpeg', 0.92))
    : stillUrl
      ? await fetch(stillUrl).then((r) => r.blob())
      : null;
  if (!blob) return;
  const name = `slazenger-${current.slug}.jpg`;
  const file = new File([blob], name, { type: 'image/jpeg' });
  // Mobile: native share sheet (save to Photos, send to a friend…)
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Slazenger' });
      return;
    } catch {
      /* user cancelled — fall through to download */
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* ── Open / close ──────────────────────────────────────────────────────── */

export function openTryOn(slug?: string, colour?: string) {
  select(slug ?? current.slug ?? '', colour);
  if (!dialog.open) dialog.showModal();
}

function close() {
  stopCamera();
  dialog.close();
}

export function initTryOn() {
  const d = document.querySelector<HTMLDialogElement>('[data-tryon]');
  if (!d) return;
  dialog = d;
  stage = $('[data-stage]');
  video = $('[data-video]');
  overlay = $('[data-overlay]');
  photo = $('[data-photo]');
  still = $('[data-still]');
  statusEl = $('[data-status]');

  buildFrameList();
  select(Object.keys(readCatalog().products)[0]);

  document.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-tryon-open]');
    if (!t) return;
    e.preventDefault();
    const scope = t.closest('[data-product-scope]');
    const colour = scope?.querySelector<HTMLInputElement>('input[name="colour"]:checked')?.value;
    openTryOn(t.dataset.slug, t.dataset.colour || colour);
    if (t.hasAttribute('data-autostart')) startCamera();
  });

  $('[data-start]').addEventListener('click', startCamera);
  $('[data-retake]').addEventListener('click', startCamera);
  $('[data-capture]').addEventListener('click', capture);
  $('[data-save]').addEventListener('click', save);
  $('[data-tryon-close]').addEventListener('click', close);
  $<HTMLInputElement>('[data-upload]').addEventListener('change', (e) => {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) usePhoto(f);
  });
  $('[data-buy]').addEventListener('click', () => {
    addToCart(current.slug, current.colour);
    toast(S().added);
    close();
    openCart();
  });
  dialog.addEventListener('close', stopCamera);
  dialog.addEventListener('cancel', stopCamera);
  // Pause the camera when the tab is hidden (battery, privacy).
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && stream) {
      stopCamera();
      setState('idle');
    }
  });

  // Deep link: /try-on/?frame=milano opens the mirror on that frame.
  const q = new URLSearchParams(location.search).get('frame');
  if (q && document.body.dataset.page === 'try-on') openTryOn(q);
}

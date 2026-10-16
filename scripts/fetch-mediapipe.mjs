/**
 * Self-hosts the MediaPipe runtime used by the Virtual Mirror (try-on).
 *
 * - Copies the WASM runtime from node_modules into public/mediapipe/wasm
 * - Downloads the face landmarker model into public/mediapipe/
 *
 * Everything is served from our own origin (GitHub Pages) so the try-on keeps
 * working where Google/CDN hosts are slow or blocked. Runs automatically
 * before `npm run dev` / `npm run build` (see package.json "pre*" scripts).
 * Output is git-ignored.
 */
import { mkdir, copyFile, access, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('public/mediapipe');
const WASM_SRC = path.resolve('node_modules/@mediapipe/tasks-vision/wasm');
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

const exists = (p) => access(p).then(() => true, () => false);

await mkdir(path.join(OUT, 'wasm'), { recursive: true });

// Only the SIMD + no-SIMD builds are needed by FilesetResolver.
for (const f of [
  'vision_wasm_internal.js',
  'vision_wasm_internal.wasm',
  'vision_wasm_nosimd_internal.js',
  'vision_wasm_nosimd_internal.wasm',
]) {
  await copyFile(path.join(WASM_SRC, f), path.join(OUT, 'wasm', f));
}

const modelPath = path.join(OUT, 'face_landmarker.task');
if (!(await exists(modelPath))) {
  const res = await fetch(MODEL_URL);
  if (!res.ok) {
    console.warn(`! Could not download face model (${res.status}). The Virtual Mirror will show its fallback state.`);
  } else {
    await writeFile(modelPath, Buffer.from(await res.arrayBuffer()));
    console.log('✓ face_landmarker.task downloaded');
  }
}
console.log('✓ MediaPipe runtime ready in public/mediapipe');

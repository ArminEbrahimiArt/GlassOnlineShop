# Decision records (ADRs)

Each record covers the context, the decision, and its consequences. Add new records at the bottom, numbered.

---

### ADR-001 — Astro, static output, no UI framework (2026-10-16)

**Context:** The brand needs a fast, beautiful prototype online tonight, hosted on GitHub Pages. Later it becomes a full store with a backend.
**Decision:** Astro 7 with static output. Interactivity is written in small vanilla TypeScript modules, with no React or Vue yet.
**Consequences:** Near-zero JS, excellent performance on Iranian mobile networks, and simple hosting. If a complex interactive
island is needed later (configurator, account area), add `@astrojs/react` or similar for that island only. When live
inventory or checkout arrives, switch to Astro hybrid/SSR (Phase 3).

### ADR-002 — Plain CSS with design tokens (2026-10-16)

**Context:** A luxury look needs fine typographic control, and the site must support RTL.
**Decision:** CSS custom properties in `tokens.css`, scoped component styles, and logical properties. No Tailwind.
**Consequences:** One place to restyle the whole site after brand feedback. RTL works with almost no overrides.

### ADR-003 — English at the root, Persian under `/fa/`, thin route files (2026-10-16)

**Context:** The client asked for a bilingual site with English as the default.
**Decision:** `src/pages/*` are thin wrappers that render `src/views/*View.astro` with a `locale` prop. All links go through `href()`.
**Consequences:** Explicit, greppable routing, and each locale can diverge if needed. Adding a page means adding two thin
route files. If the default locale ever changes to Persian, the change is limited to `defaultLocale` in `i18n/utils.ts`
and moving the route files.

### ADR-004 — Light theme only (2026-10-16)

**Context:** The client asked for a light theme only.
**Decision:** `color-scheme: light`. No dark-mode tokens.
**Consequences:** Simpler system. The Virtual Mirror and the CTA bands use local ink surfaces for contrast.

### ADR-005 — Typographic wordmark until a logo exists (2026-10-16)

**Context:** There is no logo yet.
**Decision:** "SLAZENGER" in Geist 500 with wide tracking, always in Latin, in both locales.
**Consequences:** When the logo arrives, swap the contents of `Wordmark.astro`. Every usage updates.

### ADR-006 — Self-host fonts and the MediaPipe runtime (2026-10-16)

**Context:** The main audience is in Iran, where Google-hosted assets and some CDNs are slow or blocked.
**Decision:** Fonts come from Fontsource packages and are bundled by Astro. The MediaPipe WASM and model are copied into `public/mediapipe` at build time.
**Consequences:** No third-party runtime requests. The repo stays small because the runtime is generated, not committed. CI needs internet access to download the model once per build.

### ADR-007 — 2D parametric try-on for Phase 1 (2026-10-16)

**Context:** The client wants live try-on but has no 3D models or transparent front PNGs, and the deadline is tonight.
**Decision:** Use MediaPipe Face Landmarker for tracking, plus an SVG frame generated from each product's geometry and colourway style.
The frame is scaled by face width and rotated by the eye line, then smoothed.
**Consequences:** It works on any phone with a front camera, and every colourway is supported immediately. It does not handle
head yaw realistically and the frames are stylised. Phase 4 moves to 3D GLB frames.

### ADR-008 — Bag in localStorage for Phase 1 (2026-10-16)

**Context:** There is no backend yet, but the purchase flow must feel real in the demo.
**Decision:** A client-side bag in `localStorage` with a memory fallback. Checkout is UI only.
**Consequences:** The demo works fully offline from a backend. Phase 3 replaces the storage behind the same function API.

### ADR-009 — Pin TypeScript 6 (2026-10-16)

**Context:** `astro check` does not support TypeScript 7 yet.
**Decision:** Pin `typescript@^6` as a dev dependency.
**Consequences:** Revisit when Astro's type-checking supports TS 7 (see `@astrojs/ts-content-mapper`).

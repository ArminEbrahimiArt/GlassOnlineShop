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

### ADR-010 — Lucide icons (the shadcn/ui icon set) (2026-10-16)

**Context:** The client wants a single, clean, consistent icon family, and asked for "the shadcn icons".
**Decision:** Use [Lucide](https://lucide.dev), which shadcn/ui uses, through `lucide-static`. Icons are inlined as SVG at build time by `Icon.astro`. Stroke is 1.5 px (finer than Lucide's default of 2, to suit the luxury typography).
**Consequences:** No runtime icon JS. Any of roughly 2,000 Lucide icons is one line in the `map` inside `Icon.astro`. If a React island is added later, `lucide-react` gives identical glyphs.

### ADR-011 — Near-square shapes and a modular type system (2026-10-16)

**Context:** Client feedback: corners were too round, and type and spacing felt ad hoc.
**Decision:** Radii are 2–6 px; circles are kept only for swatches and dots. Type uses a 1.25 modular scale with named roles. Spacing uses an 8-pt grid. Layout uses a 12/8/4-column grid. Every section header uses `SectionHead`.
**Consequences:** One place to tune rhythm. New UI must use the role classes and tokens, not raw sizes (see DESIGN-SYSTEM.md).

### ADR-012 — One Euro filter + per-frame detection for try-on (2026-10-16)

**Context:** Tracking should feel steadier and faster on phones.
**Decision:**
- Smoothing: a One Euro filter per pose channel.
- Pose: computed in 3D from landmark z (width, yaw, pitch).
- Detection: once per decoded frame via `requestVideoFrameCallback`, at 640×480.
- Loading: preloaded on user intent, with the camera shown before the model is ready.

**Consequences:** Lower CPU and GPU cost, less jitter, and lower perceived latency. The overlay is still 2D artwork; true 3D frames are Phase 4.

### ADR-013 — App-style bottom navigation on mobile (2026-10-16)

**Context:** The client's mobile reference is an app-like storefront with a bottom nav and a bottom buy bar.
**Decision:** On viewports under 1024 px, a floating ink tab bar (5 destinations). Product pages swap it for a buy bar with the live total. The header bag icon hides while the tab bar is shown.
**Consequences:** Primary actions sit in thumb reach. Pages reserve bottom space through `body.has-bar`. New pages get the tab bar by default.

### ADR-014 — Abar High for Persian (2026-10-16)

**Context:** Persian text set in Vazirmatn felt loose and not fashion-like. The client supplied Abar (FontIran).
**Decision:** Use Abar High for Persian at 400/600/700. Self-host woff2 only, limited by `unicode-range` to Persian/Arabic code points. Latin glyphs on Persian pages stay in Geist. Persian leading and sizes are set explicitly in the `:lang(fa)` tokens.
**Consequences:** English pages never download it. **Licensing:** Abar is commercial. The files live in this public repo under `src/assets/fonts/abar/` with a notice. If the brand's licence forbids public hosting of the font files, make the repo private or serve the fonts from a private origin.

### ADR-015 — Image Standard v1 with a generator (2026-10-16)

**Context:** Product imagery looked inconsistent: mixed crops, mixed scales, close-ups used as card images.
**Decision:** Fixed image slots with exact ratios and sizes: product shots 4:3, lifestyle 4:5, hero 16:9 and 9:16. Every slot is rendered by `npm run images` from a focal-point spec. Views request images by slot, and a generated report flags sources below the standard.
**Consequences:** Images are consistent across the site, and a new photo shoot only needs a spec update. Current sources are small (≤1536 px), so most files are flagged as upscales until the final shoot.

### ADR-016 — Image-led home page (2026-10-16)

**Context:** Client feedback: the store must lead with images, not paragraphs; the hero overlay looked like "something stuck on the image".
**Decision:** The hero shows images plus two buttons only. The headline moves into the next section above the product grid. A lookbook replaces the text-only statement. The per-product scenes are removed because the grid replaces them.
**Consequences:** Shopping starts one scroll from the top. Copy is kept to section headers.

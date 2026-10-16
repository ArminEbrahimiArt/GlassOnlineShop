# Roadmap

Status key: ✅ done · 🟡 in progress · ⬜ not started

## Phase 1 — Visual prototype (for the brand presentation) 🟡

**Goal:** show the brand and the brand manager the look, feel and key experiences on a real URL, on desktop and mobile.

| Item | Status |
|---|---|
| Astro project, tokens, global styles, self-hosted fonts (Geist, Geist Mono; Persian: Abar High since 1.2) | ✅ |
| Bilingual EN / FA with RTL, language switch, Persian digits and prices | ✅ |
| Header, full-screen menu, footer with newsletter | ✅ |
| Home: hero slider, statement, 4 product scenes, anatomy hotspots, mirror CTA, collections rail, atelier teaser | ✅ |
| Shop: grid, filter chips, sort, "coming soon" tile | ✅ |
| Product page: gallery (swipe on mobile, mosaic on desktop), colourways, accordion, anatomy, lifestyle, measurements, related, sticky buy bar | ✅ |
| Virtual Mirror: live camera try-on (MediaPipe), frame and colour switching, capture, save/share, photo-upload fallback | ✅ |
| Collections, Atelier, Checkout (UI only), 404 | ✅ |
| Bag drawer with localStorage persistence | ✅ |
| GitHub Pages CI deploy | ✅ |
| Project documentation (this folder) | ✅ |
| **1.1 refinement** (client review): Lucide icons, full-bleed hero + glass caption panel, near-square radii, type/spacing system, phone-style lightbox, mobile tab bar + buy bar + quick add, face-tracking v1.1 | ✅ |
| **1.2 refinement** (second review): Abar High Persian font, luxury type scale, Image Standard + generator, image-led home, hero buttons only, contained product cards, icon hover fix | ✅ |
| Collect feedback from the brand meeting → `docs/CHANGELOG.md` + backlog below | ⬜ |

## Phase 2 — Design refinement & real content ⬜

- Apply meeting feedback: palette, typography, layout and copy tone.
- Real logo, which replaces the typographic wordmark.
- Real product data: names, codes, measurements, prices, materials and stock (see `docs/CONTENT.md`).
- Professional photography to the brief in `docs/IMAGE-STANDARD.md` (≥3000 px, Slazenger-branded, front-view PNGs for the mirror), then `npm run images`.
- Confirm the Abar font licence covers web use and public hosting (ADR-014).
- Real collections, atelier story and brand copy in both languages, reviewed by native editors.
- More pages: Size guide, Store locator, Journal / lookbook, FAQ, Shipping & returns, Warranty, Contact, Legal.
- Search overlay and wishlist.
- Optical vs sun lines, lens options (prescription, blue-light).
- Accessibility audit (WCAG 2.1 AA) and performance budget (LCP < 2.5 s on 4G).

## Phase 3 — Commerce backend ⬜

- Choose the platform: headless (Medusa or Saleor) or a custom Node/Go API. Write an ADR first.
- Product catalogue in a CMS (bilingual fields), inventory per colourway.
- Accounts: phone-number OTP login (common in Iran), addresses, order history.
- Cart and checkout API, shipping (Post / Tipax), discount codes.
- Payment gateway via a Shaparak PSP (for example Zarinpal, IDPay or a bank IPG). Callback verification.
- Order emails and SMS, admin dashboard.
- Hosting: move to SSR or hybrid on an Iranian cloud or a VPS. CDN for images.
- Analytics and privacy policy.

## Phase 4 — Virtual Mirror v2 ⬜

- 3D frames (GLB) per model, placed with the facial transformation matrix for yaw and pitch, and temples that occlude behind the ears.
- Real photographic textures and a PD (pupillary distance) estimate for size recommendations.
- A "frames that suit your face shape" suggestion.
- Share to Instagram stories with a branded template.

## Phase 5 — Growth ⬜

- SEO: structured data (Product, Offer, Breadcrumb), sitemap and hreflang, OG images.
- PWA and add-to-home-screen, push for limited-run drops.
- Waitlist and numbered-edition reservations.
- CRM and newsletter integration.

## Backlog / ideas

- A configurator for temple colour, engraving initials, and lens tint.
- An "Atelier live" video of a frame being made, as a hero option.
- Gift cards and gift wrapping message.

# Working rules for this repository

This file is read automatically by Claude Code. Humans: the same rules apply to you.

## Source of truth

This project must never depend on chat history. Everything needed to continue the work lives in the repo:

1. `docs/ARCHITECTURE.md`: project map and how the parts fit together. Read it first.
2. `docs/ROADMAP.md`: which phase we are in, and what is in or out of scope.
3. `docs/DESIGN-SYSTEM.md`: tokens and component rules. Do not invent new colours or sizes.
4. `docs/CONTENT.md`: which data is sample data and which is real.
5. `docs/DECISIONS.md`: why things are the way they are. Do not silently reverse a decision.
6. `docs/CHANGELOG.md`: what changed and when.

## Every change must

- **Add an entry to `docs/CHANGELOG.md`** with the date, the phase, what changed and the files touched.
- Update `docs/ARCHITECTURE.md` if you add, move or remove a file or folder, a route, or a data shape.
- Update `docs/DESIGN-SYSTEM.md` if you add or change a token or a shared component.
- Add an ADR to `docs/DECISIONS.md` for any non-obvious choice: a library, a pattern, a trade-off.
- Update task status in `docs/ROADMAP.md` when something is completed.
- Keep **both locales** working. Every UI string goes in `src/i18n/ui.ts` (en + fa), and every content field is `L10n` (`{ en, fa }`).
- Use CSS **logical properties** (`margin-inline-start`, not `margin-left`) so RTL keeps working.
- Build all internal links with `href(path, locale)` from `src/i18n/utils.ts`, never as hard-coded `/…` strings. This keeps the GitHub Pages base path and the locale prefix correct.
- Pass `npm run build` and `npm run check` before committing.

## Conventions

- Pages in `src/pages/` are thin route files. The page markup lives in `src/views/*View.astro` and takes a `locale` prop.
- Shared UI goes in `src/components/`. Page-specific UI stays inside its view.
- Client behaviour uses `data-*` hooks and lives in `<script>` tags or in `src/scripts/`. No inline `on*` handlers.
- Every page script must degrade gracefully. Wrap any storage access in try/catch.
- Commits use imperative mood, for example "Add size guide to product page".

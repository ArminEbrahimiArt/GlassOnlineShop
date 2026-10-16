// @ts-check
import { defineConfig } from 'astro/config';

/**
 * GitHub Pages serves the site from /<repo-name>/. The deploy workflow passes
 * BASE_PATH; locally the site runs at the root. Every internal link goes
 * through `href()` in src/i18n/utils.ts, which prefixes this base.
 */
const base = process.env.BASE_PATH ?? '/';
const site = process.env.SITE_URL ?? 'https://arminebrahimiart.github.io';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  image: {
    // Product photography is local; responsive variants are generated at build.
    responsiveStyles: false,
  },
  devToolbar: { enabled: false },
});

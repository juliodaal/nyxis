/**
 * Single source of truth for the docs-app site configuration.
 *
 * When you migrate to a custom domain:
 * 1. Set the `SITE_URL` environment variable in Vercel
 *    (`https://nyxis.dev` or whatever).
 * 2. Add the new domain in Vercel → Project → Settings → Domains.
 * 3. Configure DNS at your registrar to point at Vercel.
 * 4. Enable the redirect in `apps/docs/vercel.json` (see the
 *    commented-out `redirects` block).
 * 5. Find/replace remaining occurrences in MDX, READMEs, and the
 *    individual package `homepage` fields. See `DOMAIN_MIGRATION.md`.
 *
 * The `SITE_URL` env var is read by `astro.config.mjs` at build time
 * so `Astro.site`, sitemap URLs, and canonical links pick it up
 * automatically.
 */

const FALLBACK_SITE_URL = 'https://nyxisai.vercel.app';

/** Canonical origin (no trailing slash). */
export const SITE_URL = (
  (typeof process !== 'undefined' ? process.env?.SITE_URL : undefined) ?? FALLBACK_SITE_URL
).replace(/\/$/, '');

/** The path prefix where registry JSON is served. */
export const REGISTRY_PATH = '/r';

/** Full registry base URL — what users paste into `shadcn add`. */
export const REGISTRY_BASE_URL = `${SITE_URL}${REGISTRY_PATH}`;

/** Short display host — used inside the Hero's install command. */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '');

/** Convenience: build a registry item URL for a given slug. */
export function registryItemUrl(slug: string): string {
  return `${REGISTRY_BASE_URL}/${slug}.json`;
}

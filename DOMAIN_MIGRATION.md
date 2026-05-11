# Custom Domain Migration

This document is the checklist for moving Nyxis from
`https://nyxisai.vercel.app` to a custom domain (e.g. `https://nyxis.dev`). Most
code already reads the URL from a single source — the migration is small and
reversible.

## 1. Buy the domain

Choose a registrar (Namecheap, Cloudflare Registrar, Porkbun, etc.). For
brand-only SaaS like Nyxis, `.dev` and `.app` are the natural defaults (both
require HTTPS via HSTS preload, which we want anyway).

Suggested candidates, in order:

1. **`nyxis.dev`** — primary target. `.dev` matches the audience.
2. `nyxis.app` — fallback if `.dev` is taken.
3. `usenyxis.com` — fallback if both `.dev` and `.app` are unavailable.

## 2. Configure DNS

In your registrar's DNS settings, point the domain at Vercel:

- **Apex (`nyxis.dev`)** → A record `76.76.21.21`
- **`www.nyxis.dev`** → CNAME `cname.vercel-dns.com`

Verify propagation with `dig nyxis.dev` before continuing.

## 3. Add the domain in Vercel

1. Vercel dashboard → `nyxisai` project → Settings → Domains.
2. Add `nyxis.dev` (and `www.nyxis.dev` redirecting to apex).
3. Mark `nyxis.dev` as the **Primary Domain**.
4. Wait for the green check on SSL certificate provisioning.

## 4. Set the `SITE_URL` env var

In Vercel → Settings → Environment Variables, add for **Production**:

```
SITE_URL = https://nyxis.dev
```

This single env var is read by:

- `apps/docs/astro.config.mjs` → drives `Astro.site`, sitemap, canonicals
- `apps/docs/src/lib/site.ts` → drives `SITE_URL`, `REGISTRY_BASE_URL`,
  `SITE_HOST`, `registryItemUrl()` — used by Hero, QuickStart, BaseLayout,
  `registry.json` endpoint
- `apps/docs/scripts/build-og-image.mjs` → regenerates the OG image with the new
  install command

Re-deploy. Production now serves the new origin everywhere code is involved.

## 5. Enable the 308 redirect on the old origin

In `apps/docs/vercel.json`, copy the contents of `_redirects_template` into a
real top-level `redirects` field (remove the `_comment_redirects` guidance and
`_redirects_template` block). Replace `YOUR-NEW-DOMAIN` with the live domain:

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "nyxisai.vercel.app" }],
      "destination": "https://nyxis.dev/:path*",
      "permanent": true
    }
  ]
}
```

Push. Now any traffic still hitting `nyxisai.vercel.app` 308s to the new origin
**with the path preserved** — every existing `/r/<name>.json` link in the wild
keeps working.

## 6. Find-replace the documentation copy

The code paths are covered by env var. Documentation strings (READMEs, MDX,
CHANGELOG, package.json `homepage`) are still spelled out literally. Run a
find-replace across the repo:

```bash
git grep -l 'nyxisai\.vercel\.app' | xargs sed -i 's|nyxisai\.vercel\.app|nyxis.dev|g'
```

Verify nothing critical broke:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

The e2e tests assert the install command points at the canonical URL — they'll
update automatically because they read from the env var.

## 7. Update separate-package fallbacks

Two npm packages still have hardcoded fallbacks for users who **don't** set
their own env var. Update both DEFAULT constants:

- `packages/mcp-server/src/lib/registry-fetch.ts` →
  `const DEFAULT_BASE_URL = 'https://nyxis.dev/r';`
- `packages/create-nyxis/src/index.ts` →
  `const REGISTRY_BASE = (process.env.NYXIS_REGISTRY_URL ?? 'https://nyxis.dev/r')...`

After bumping these, publish new versions:

```bash
pnpm changeset
# select @nyxis/mcp-server, create-nyxis, type: patch
git commit -am 'feat(mcp,cli): default to nyxis.dev after domain migration'
git push
# Merge the Version Packages PR that CI opens, then publish locally:
git pull
pnpm changeset publish
```

Existing installs of `@nyxis/mcp-server` and `create-nyxis` keep working because
the 308 from step 5 covers them.

## 8. Update social / canonical links

External services that cache or reference the old origin:

- [ ] GitHub repository "Website" field (`Settings → General → Website`)
- [ ] GitHub Pages (if any) — none currently
- [ ] npm package pages (re-publish picks the new `homepage` from `package.json`
      — make sure each `package.json` has the new domain)
- [ ] Twitter Card / Facebook OG cache: re-validate at
      <https://cards-dev.twitter.com/validator> and
      <https://developers.facebook.com/tools/debug/>
- [ ] Update any analytics property URLs (Vercel Analytics is automatic)

## 9. Smoke test the migration

```bash
# DNS resolves
dig nyxis.dev +short
# Registry serves from the new origin
curl -fsS https://nyxis.dev/r/registry.json | head
# Old origin redirects
curl -I https://nyxisai.vercel.app/r/chat-message.json | grep -i location
# A fresh install actually works against the new domain
npx shadcn@latest add https://nyxis.dev/r/chat-message.json
```

Once these pass, the migration is complete.

## 10. Don't take down the old subdomain

Leave `nyxisai.vercel.app` as a 308 redirect forever (or at minimum 12 months).
Many AI assistants have the URL in their training set or in user-defined MCP
configs. The 308 keeps them working without manual intervention.

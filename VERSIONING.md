# Versioning Policy

Nyxis follows [Semantic Versioning 2.0.0](https://semver.org). This document
describes how we apply it, what counts as a breaking change, and what to expect
on the road to v1.0.

## Current state — `0.x`

Every published Nyxis package is in the `0.x` range. Per SemVer, **anything can
break in a minor bump on `0.x`**. In practice we try not to abuse this;
breakages cluster around explicit phase transitions (the Phase 1B series, the
shadcn-registry pivot, the brand refresh) and are documented in `CHANGELOG.md`
of each package.

If you depend on Nyxis today and want stability, **pin minor versions**:

```jsonc
// Stable enough across patches; breaking changes only on minor bumps:
"nyxis-ui": "~0.19.0"
"@nyxis/core": "~0.2.0"

// Looser — accept new minors automatically (only do this if you read the
// changelog before upgrading):
"nyxis-ui": "^0.19.0"
```

Once we reach v1.0 (see below), `^` becomes safe.

## What counts as a breaking change

For packages we publish to npm (`@nyxis/core`, `nyxis-ui`, `@nyxis/mcp-server`,
`create-nyxis`):

- **Removing or renaming an exported symbol.** Functions, types, hooks, React
  components.
- **Changing a function signature.** Adding a required parameter, removing one,
  narrowing return type, throwing where it didn't before.
- **Changing the runtime contract** of a hook or component prop in a way that
  would break a reasonable consumer.
- **Removing a subpath export** (`nyxis-ui/theme`, `@nyxis/core/server`).
- **Bumping a peer dep major** (e.g. requiring React 19 only).
- **Renaming a CSS custom property** that consumers may have read
  (`--color-brand`, etc.).

Not a breaking change:

- Adding a new exported symbol.
- Adding an optional prop or parameter.
- Adding a new theme token.
- Refactoring internals — as long as the public surface is unchanged.
- Changing a registry component's source code (you copy-pasted it; it's yours
  now). New `npx shadcn add <name>` may produce different output — re-run only
  when you want it.

## Registry items

Registry items (every component installed via
`npx shadcn add https://nyxisai.vercel.app/r/<name>.json`) live in your repo
once installed. We try to keep their public prop API stable, but the philosophy
is the opposite of an npm package: **you own the source**, you edit it, you
don't blindly re-install on every release.

When a registry item ships a meaningful change, we note it in the docs page
(`/components/<slug>`) and tag the registry response with the change date.

## Deprecation flow

When we plan to remove or rename something:

1. **Mark it deprecated** in the type signature, in the JSDoc, and in
   `CHANGELOG.md`. The deprecated form continues to work.
2. **Document the migration path** — at minimum, what to use instead.
3. **Wait at least one minor version** (currently — once we hit v1, at least one
   major) before removing.
4. **Remove on the next major** with a `BREAKING CHANGE:` note in the commit and
   CHANGELOG.

Example:

```ts
/**
 * @deprecated Use `useChat` from `@nyxis/core` instead. Will be removed in
 * 0.21.0.
 */
export const useStreamingChat = useChat;
```

## Road to v1.0

We ship v1.0 of `nyxis-ui` and `@nyxis/core` when **all** of these hold:

- [ ] Public API is stable. No identified breaking changes pending. Six
      consecutive months without a removed/renamed export.
- [ ] Test suite covers the critical paths. ≥ 80% statement coverage on both
      packages, e2e covering homepage / catalog / theme switch / install via
      shadcn / `useChat` round-trip.
- [ ] Bundle sizes are within their published budgets and the budgets reflect
      what we want long-term, not just current measurements.
- [ ] All `0.x` deprecations have either been removed or had their removal
      target pushed past v1.0 explicitly.
- [ ] First-class support for Next.js, Astro, SvelteKit, Hono, Express (recipes
      shipping). Currently: ✅
- [ ] `npm install nyxis-ui @nyxis/core` works on a fresh project from a cold
      cache without a build script crash. ✅
- [ ] CI green on every PR for ≥ 30 days running.

**Estimated timeline:** v1.0 is months away, not weeks. We won't rush a version
bump for marketing — `0.x` honestly communicates "still iterating on the public
API."

## After v1.0

- **Major bumps** (`1.x` → `2.x`) require:
  - A migration guide in `MIGRATIONS.md`.
  - A codemod in `@nyxis/codemods` where mechanical changes are possible.
  - One full minor cycle of deprecation warnings before removal.
  - Compatibility matrix in `CHANGELOG.md` (which framework / React version each
    major supports).
- **Long-term support** is best-effort. The most-recent minor of the most-recent
  major receives security fixes; older versions only by community contribution.

## Per-package versioning

We use [Changesets](https://github.com/changesets/changesets) to version
packages independently. The four published packages can advance at their own
pace:

| Package             | Cadence      | Notes                                         |
| ------------------- | ------------ | --------------------------------------------- |
| `@nyxis/core`       | Conservative | Public API; stability matters most            |
| `nyxis-ui`          | Conservative | Stylesheet + theme runtime; theming consumers |
| `@nyxis/mcp-server` | Faster       | CLI tool; frequent feature additions          |
| `create-nyxis`      | Faster       | CLI tool; safe to iterate                     |

Internal packages (`@nyxis/docs`) don't get versioned — they're
`"private": true` and tracked via git.

## Questions

If something here is unclear or you think a particular change should or
shouldn't be a breaking change, open an issue with the `versioning` label.

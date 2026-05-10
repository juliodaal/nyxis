# Contributing to Nyxis

Thanks for your interest. This document covers how to set up the project
locally, the conventions we follow, and how to submit changes.

By participating, you agree to abide by our
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Prerequisites

- **Node.js** 22.x (see `.nvmrc`)
- **pnpm** 10.x (`npm install -g pnpm`)
- **Git** 2.40+

## Getting Started

```bash
git clone git@github.com:juliodaal/nyxis.git
cd nyxis
pnpm install
pnpm dev
```

`pnpm dev` runs every workspace package in watch mode in parallel: the docs
site, the `nyxis-ui` rebuild loop, and `@nyxis/core` rebuild loop.

## Repository Layout

```
nyxis/
├── apps/
│   └── docs/              # Astro documentation site + registry endpoints
│       ├── registry/      # Source of every registry component / recipe
│       └── tests/e2e/     # Playwright smoke tests
├── packages/
│   ├── core/              # @nyxis/core — types, hooks, provider adapter
│   ├── ui/                # nyxis-ui — theme runtime + design tokens (npm)
│   └── mcp-server/        # @nyxis/mcp-server — MCP server (CLI bin)
├── .github/               # CI workflows, templates, security configs
└── ...
```

## Workflow

1. Create a feature branch from `main`: `git checkout -b feat/my-thing`.
2. Make your changes. Add tests; if it's a registry component, drop it under
   `apps/docs/registry/components/` and register it in `items.ts`.
3. Run the full check locally:
   ```bash
   pnpm -r --filter=./packages/* build   # types must be built first
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm test:e2e                         # requires Playwright browsers
   pnpm build
   pnpm size
   ```
4. Add a [Changeset](https://github.com/changesets/changesets) describing what
   changed in any publishable package:
   ```bash
   pnpm changeset
   ```
   The docs app is `ignored` in the changeset config — only changes to
   `nyxis-ui`, `@nyxis/core`, and `@nyxis/mcp-server` need a changeset.
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(registry): add eval-leaderboard component`
   - `fix(core): prevent useChat infinite loop on tool result`
   - `docs(installation): add SvelteKit setup section`
6. Open a pull request. CI must be green and one approval is required.

## Authoring a Registry Component

When you add a new component to `apps/docs/registry/`:

- [ ] Source file at `apps/docs/registry/components/<name>.tsx` with
      `'use client'` if it has state or events.
- [ ] Tailwind classes use the design tokens (`bg-card`, `text-foreground`) so
      it inherits theming. Avoid arbitrary hex.
- [ ] `prefers-reduced-motion` respected if the component animates.
- [ ] Only depends on the shadcn/ui primitives the consumer already has. Pull in
      extras via `dependencies` in `items.ts`.
- [ ] Entry added to `apps/docs/registry/items.ts` (with `dependencies`,
      `registryDependencies`, and the right `category`).
- [ ] Slug listed in `apps/docs/src/lib/registry.ts` so it shows up in the
      catalog and the sidebar.
- [ ] MDX page at `apps/docs/src/content/<category>/<slug>.mdx` with title,
      description, and a live demo import.
- [ ] If interactive, add a live demo to
      `apps/docs/src/components/demos/demos.tsx`.
- [ ] Build passes: `pnpm --filter @nyxis/docs build`.

## Code Style

- TypeScript strict mode, no `any`, no `@ts-ignore` without a comment explaining
  why.
- Prettier formats everything. Don't fight it.
- ESLint must be clean. Use `// eslint-disable-next-line` sparingly with a
  comment.
- Conventional Commits (enforced by commitlint).

## Versioning

When you bump a package, follow [VERSIONING.md](./VERSIONING.md) — it describes
what counts as a breaking change in `0.x`, the deprecation flow, and the road to
v1.0.

## Reporting Bugs

Open a GitHub Issue using the bug template. Include:

- Reproduction (CodeSandbox or minimal repo preferred).
- Expected vs. actual behavior.
- Browser, OS, package version.

## Reporting Security Issues

See [SECURITY.md](./SECURITY.md). **Do not** open public issues for security
vulnerabilities.

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](./LICENSE).

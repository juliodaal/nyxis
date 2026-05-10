/**
 * Bundle size budget. Each entry measures the **gzipped output a
 * consumer actually downloads** (own code + bundled deps).
 *
 * Limits are baselined just above the current measurement (~10%
 * headroom). When a check fails, look at the diff:
 * - Tightening dep code? Justify and bump.
 * - Adding a heavy dep? Try a tree-shakeable alternative first.
 *
 * Run `pnpm size:why` to see what's inside.
 */

module.exports = [
  // ── nyxis-ui ───────────────────────────────────────────────────────
  {
    name: 'nyxis-ui (full surface)',
    path: 'packages/ui/dist/index.js',
    limit: '12 KB',
    gzip: true,
  },
  {
    name: 'nyxis-ui/theme (FOUC + ThemeToggle)',
    path: 'packages/ui/dist/components/theme/index.js',
    limit: '6 KB',
    gzip: true,
  },
  {
    name: 'nyxis-ui/utils (cn helper)',
    path: 'packages/ui/dist/lib/utils.js',
    // clsx + tailwind-merge dominate the gzipped output here.
    limit: '8 KB',
    gzip: true,
  },

  // ── @nyxis/core ────────────────────────────────────────────────────
  // Includes the Vercel AI SDK as a hidden dep — that's what users get
  // when they `import { useChat }`. Tree-shaking helps but pessimistic
  // baseline measures the full index entry.
  {
    name: '@nyxis/core (full client surface)',
    path: 'packages/core/dist/index.js',
    limit: '110 KB',
    gzip: true,
  },
  {
    name: '@nyxis/core/server (route helpers)',
    path: 'packages/core/dist/server/index.js',
    limit: '160 KB',
    gzip: true,
  },
];

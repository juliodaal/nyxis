import { defineConfig } from 'tsup';

/**
 * Bundle the CLI as a single ESM file. Node-friendly shebang, tree-
 * shaken deps, no source maps in production.
 */
export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  clean: true,
  shims: false,
  sourcemap: false,
  banner: { js: '#!/usr/bin/env node' },
  // Bundle pure-ESM deps; keep `execa` external because its
  // `cross-spawn` dependency uses dynamic CJS `require('child_process')`
  // which can't be inlined into an ESM bundle.
  noExternal: [/^@clack\/prompts$/, /^picocolors$/],
});

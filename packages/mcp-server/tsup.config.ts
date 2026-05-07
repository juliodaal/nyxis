import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  // Hash-bang preserved so the built file can be invoked as a CLI.
  banner: { js: '#!/usr/bin/env node' },
  external: ['@modelcontextprotocol/sdk', 'zod'],
});

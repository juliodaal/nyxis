import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  target: 'es2022',
  dts: true,
  clean: true,
  sourcemap: false,
  external: ['svelte', 'svelte/store', '@nyxis/core'],
});

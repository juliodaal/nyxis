import { defineConfig } from 'tsup';

// In watch mode we skip cleaning so previously emitted `.d.ts` files survive
// (the watch script runs with `--no-dts` to keep memory usage sane). For a
// real build, clean is enabled so we never ship stale artefacts.
const isWatch = process.argv.includes('--watch');

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'lib/utils': 'src/lib/utils.ts',
    'components/theme/index': 'src/components/theme/index.ts',
  },
  format: ['esm'],
  target: 'es2022',
  platform: 'browser',
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  clean: !isWatch,
  splitting: false,
  treeshake: true,
  onSuccess: 'node scripts/copy-styles.mjs && node scripts/preserve-directives.mjs',
  minify: false,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  esbuildOptions(options) {
    options.legalComments = 'none';
  },
});

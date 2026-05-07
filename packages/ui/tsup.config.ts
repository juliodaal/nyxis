import { defineConfig } from 'tsup';

const ui = (name: string) => `src/components/ui/${name}/index.ts`;

// In watch mode we skip cleaning so previously emitted `.d.ts` files survive
// (the watch script runs with `--no-dts` to keep memory usage sane). For a
// real build, clean is enabled so we never ship stale artefacts.
const isWatch = process.argv.includes('--watch');

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'lib/utils': 'src/lib/utils.ts',
    'components/theme/index': 'src/components/theme/index.ts',
    // UI primitives
    'components/ui/button/index': ui('button'),
    'components/ui/input/index': ui('input'),
    'components/ui/textarea/index': ui('textarea'),
    'components/ui/label/index': ui('label'),
    'components/ui/card/index': ui('card'),
    'components/ui/badge/index': ui('badge'),
    'components/ui/avatar/index': ui('avatar'),
    'components/ui/separator/index': ui('separator'),
    'components/ui/skeleton/index': ui('skeleton'),
    // Overlays
    'components/ui/dialog/index': ui('dialog'),
    'components/ui/sheet/index': ui('sheet'),
    'components/ui/drawer/index': ui('drawer'),
    'components/ui/popover/index': ui('popover'),
    'components/ui/tooltip/index': ui('tooltip'),
    // Form controls
    'components/ui/select/index': ui('select'),
    'components/ui/checkbox/index': ui('checkbox'),
    'components/ui/switch/index': ui('switch'),
    'components/ui/radio-group/index': ui('radio-group'),
    'components/ui/form/index': ui('form'),
    // Navigation / disclosure
    'components/ui/tabs/index': ui('tabs'),
    'components/ui/accordion/index': ui('accordion'),
    // Composed
    'components/ui/command/index': ui('command'),
    'components/ui/combobox/index': ui('combobox'),
    'components/ui/toast/index': ui('toast'),
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
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'framer-motion',
    'react-hook-form',
    'zod',
    '@hookform/resolvers',
    'sonner',
    'cmdk',
    'vaul',
  ],
  esbuildOptions(options) {
    options.legalComments = 'none';
  },
});

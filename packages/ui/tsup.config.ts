import { defineConfig } from 'tsup';

const ui = (name: string) => `src/components/ui/${name}/index.ts`;
const text = (name: string) => `src/components/text/${name}/index.ts`;
const anim = (name: string) => `src/components/animations/${name}/index.ts`;
const domain = (name: string) => `src/components/domain/${name}/index.ts`;

// In watch mode we skip cleaning so previously emitted `.d.ts` files survive
// (the watch script runs with `--no-dts` to keep memory usage sane). For a
// real build, clean is enabled so we never ship stale artefacts.
const isWatch = process.argv.includes('--watch');

/**
 * Build config for nyxis-ui.
 *
 * - ESM only (consumers are modern apps).
 * - No code splitting → each subpath export is a single file the bundler can
 *   tree-shake by name.
 * - "use client" / "use server" directives are re-attached after build by
 *   `scripts/preserve-directives.mjs` so Next.js App Router consumers see
 *   the client boundaries (esbuild strips directives during bundling).
 * - Type declarations emitted alongside JS.
 * - External: react, react-dom, and any peer dep — never bundled.
 */
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
    // Text animations
    'components/text/index': 'src/components/text/index.ts',
    'components/text/split-text/index': text('split-text'),
    'components/text/type-writer/index': text('type-writer'),
    'components/text/scramble-text/index': text('scramble-text'),
    'components/text/decrypt-text/index': text('decrypt-text'),
    'components/text/gradient-text/index': text('gradient-text'),
    'components/text/shiny-text/index': text('shiny-text'),
    'components/text/count-up/index': text('count-up'),
    'components/text/reveal-text/index': text('reveal-text'),
    'components/text/marquee-text/index': text('marquee-text'),
    'components/text/rotating-text/index': text('rotating-text'),
    // Effect animations
    'components/animations/index': 'src/components/animations/index.ts',
    'components/animations/magnetic-button/index': anim('magnetic-button'),
    'components/animations/spotlight-cursor/index': anim('spotlight-cursor'),
    'components/animations/parallax-container/index': anim('parallax-container'),
    'components/animations/stagger-reveal/index': anim('stagger-reveal'),
    'components/animations/tilt-card/index': anim('tilt-card'),
    'components/animations/aurora-background/index': anim('aurora-background'),
    'components/animations/dot-grid-background/index': anim('dot-grid-background'),
    'components/animations/mesh-gradient-background/index': anim('mesh-gradient-background'),
    // Domain
    'components/domain/index': 'src/components/domain/index.ts',
    'components/domain/confidence-badge/index': domain('confidence-badge'),
    'components/domain/sentiment-indicator/index': domain('sentiment-indicator'),
    'components/domain/kpi-card/index': domain('kpi-card'),
    'components/domain/citation-card/index': domain('citation-card'),
    'components/domain/chat-message/index': domain('chat-message'),
    'components/domain/chat-input/index': domain('chat-input'),
    'components/domain/action-item/index': domain('action-item'),
    'components/domain/audit-log-item/index': domain('audit-log-item'),
    'components/domain/lead-card/index': domain('lead-card'),
    'components/domain/email-triage-card/index': domain('email-triage-card'),
    'components/domain/file-dropzone/index': domain('file-dropzone'),
    'components/domain/data-table/index': domain('data-table'),
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
  // Re-run after every successful build (initial + watch rebuilds).
  // Tsup wipes dist/ on each build because of `clean: true`, so we re-copy
  // the CSS and re-attach "use client" directives here. This keeps the
  // dev server happy and means consumers always see a complete dist/.
  onSuccess: 'node scripts/copy-styles.mjs && node scripts/preserve-directives.mjs',
  minify: false,
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'gsap',
    'framer-motion',
    'react-hook-form',
    'zod',
    '@hookform/resolvers',
    'sonner',
    'cmdk',
    'vaul',
    '@tanstack/react-table',
  ],
  esbuildOptions(options) {
    options.legalComments = 'none';
  },
});

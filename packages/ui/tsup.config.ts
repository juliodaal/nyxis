import { defineConfig } from 'tsup';

const ui = (name: string) => `src/components/ui/${name}/index.ts`;
const text = (name: string) => `src/components/text/${name}/index.ts`;
const anim = (name: string) => `src/components/animations/${name}/index.ts`;
const domain = (name: string) => `src/components/domain/${name}/index.ts`;
const aiUi = (name: string) => `src/components/ai/${name}/index.ts`;
const chat = (name: string) => `src/components/chat/${name}/index.ts`;

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
    // AI core (Phase C)
    'ai/index': 'src/ai/index.ts',
    'ai/server/index': 'src/ai/server/index.ts',
    // AI Models & Providers UI (Phase D)
    'components/ai/index': 'src/components/ai/index.ts',
    'components/ai/api-key-input/index': aiUi('api-key-input'),
    'components/ai/temperature-slider/index': aiUi('temperature-slider'),
    'components/ai/top-p-slider/index': aiUi('top-p-slider'),
    'components/ai/max-tokens-input/index': aiUi('max-tokens-input'),
    'components/ai/system-prompt-editor/index': aiUi('system-prompt-editor'),
    'components/ai/context-window-meter/index': aiUi('context-window-meter'),
    'components/ai/cost-meter/index': aiUi('cost-meter'),
    'components/ai/provider-health-badge/index': aiUi('provider-health-badge'),
    'components/ai/ai-provider-selector/index': aiUi('ai-provider-selector'),
    'components/ai/model-picker/index': aiUi('model-picker'),
    'components/ai/ai-config-card/index': aiUi('ai-config-card'),
    // Chat 2.0 (Phase E)
    'components/chat/index': 'src/components/chat/index.ts',
    'components/chat/typing-indicator/index': chat('typing-indicator'),
    'components/chat/streaming-text/index': chat('streaming-text'),
    'components/chat/streaming-markdown/index': chat('streaming-markdown'),
    'components/chat/streaming-code/index': chat('streaming-code'),
    'components/chat/message-actions/index': chat('message-actions'),
    'components/chat/token-counter/index': chat('token-counter'),
    'components/chat/chat-thread/index': chat('chat-thread'),
    'components/chat/conversation-sidebar/index': chat('conversation-sidebar'),
    'components/chat/conversation-fork/index': chat('conversation-fork'),
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
    'gsap',
    'framer-motion',
    'react-hook-form',
    'zod',
    '@hookform/resolvers',
    'ai',
    '@ai-sdk/anthropic',
    '@ai-sdk/openai',
    '@ai-sdk/google',
    '@ai-sdk/mistral',
    'ollama-ai-provider',
    'sonner',
    'cmdk',
    'vaul',
    '@tanstack/react-table',
    'react-markdown',
    'remark-gfm',
  ],
  esbuildOptions(options) {
    options.legalComments = 'none';
  },
});

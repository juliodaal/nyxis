import { defineConfig } from 'tsup';

const ui = (name: string) => `src/components/ui/${name}/index.ts`;
const domain = (name: string) => `src/components/domain/${name}/index.ts`;
const aiUi = (name: string) => `src/components/ai/${name}/index.ts`;
const chat = (name: string) => `src/components/chat/${name}/index.ts`;
const reasoning = (name: string) => `src/components/reasoning/${name}/index.ts`;
const tools = (name: string) => `src/components/tools/${name}/index.ts`;
const mcp = (name: string) => `src/components/mcp/${name}/index.ts`;
const agents = (name: string) => `src/components/agents/${name}/index.ts`;
const multimodal = (name: string) => `src/components/multimodal/${name}/index.ts`;
const prompts = (name: string) => `src/components/prompts/${name}/index.ts`;
const rag = (name: string) => `src/components/rag/${name}/index.ts`;
const skills = (name: string) => `src/components/skills/${name}/index.ts`;
const aiAnim = (name: string) => `src/components/ai-animations/${name}/index.ts`;

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
    // Reasoning (Phase F)
    'components/reasoning/index': 'src/components/reasoning/index.ts',
    'components/reasoning/reasoning-trace/index': reasoning('reasoning-trace'),
    'components/reasoning/chain-of-thought/index': reasoning('chain-of-thought'),
    'components/reasoning/thinking-indicator/index': reasoning('thinking-indicator'),
    // Tools / Function Calling (Phase G)
    'components/tools/index': 'src/components/tools/index.ts',
    'components/tools/tool-call/index': tools('tool-call'),
    'components/tools/tool-result/index': tools('tool-result'),
    'components/tools/parameter-form/index': tools('parameter-form'),
    'components/tools/tool-registry/index': tools('tool-registry'),
    'components/tools/tool-execution-log/index': tools('tool-execution-log'),
    // MCP (Phase H)
    'components/mcp/index': 'src/components/mcp/index.ts',
    'components/mcp/mcp-capability-badge/index': mcp('mcp-capability-badge'),
    'components/mcp/mcp-connection-status/index': mcp('mcp-connection-status'),
    'components/mcp/mcp-server-card/index': mcp('mcp-server-card'),
    'components/mcp/mcp-server-list/index': mcp('mcp-server-list'),
    'components/mcp/mcp-resource-browser/index': mcp('mcp-resource-browser'),
    'components/mcp/mcp-prompt-library/index': mcp('mcp-prompt-library'),
    'components/mcp/mcp-log-stream/index': mcp('mcp-log-stream'),
    // Agents (Phase I)
    'components/agents/index': 'src/components/agents/index.ts',
    'components/agents/agent-status-badge/index': agents('agent-status-badge'),
    'components/agents/agent-card/index': agents('agent-card'),
    'components/agents/agent-roster/index': agents('agent-roster'),
    'components/agents/agent-activity-feed/index': agents('agent-activity-feed'),
    'components/agents/agent-handoff/index': agents('agent-handoff'),
    'components/agents/task-delegation/index': agents('task-delegation'),
    // Multimodal (Phase J)
    'components/multimodal/index': 'src/components/multimodal/index.ts',
    'components/multimodal/image-message/index': multimodal('image-message'),
    'components/multimodal/image-gallery/index': multimodal('image-gallery'),
    'components/multimodal/voice-waveform/index': multimodal('voice-waveform'),
    'components/multimodal/audio-player/index': multimodal('audio-player'),
    'components/multimodal/transcription-view/index': multimodal('transcription-view'),
    'components/multimodal/vision-input/index': multimodal('vision-input'),
    // Prompts / Eval (Phase K)
    'components/prompts/index': 'src/components/prompts/index.ts',
    'components/prompts/prompt-card/index': prompts('prompt-card'),
    'components/prompts/prompt-variable-form/index': prompts('prompt-variable-form'),
    'components/prompts/metric-card/index': prompts('metric-card'),
    'components/prompts/eval-run-card/index': prompts('eval-run-card'),
    'components/prompts/dataset-table/index': prompts('dataset-table'),
    'components/prompts/ab-compare/index': prompts('ab-compare'),
    // RAG (Phase L)
    'components/rag/index': 'src/components/rag/index.ts',
    'components/rag/chunk-card/index': rag('chunk-card'),
    'components/rag/retrieval-results/index': rag('retrieval-results'),
    'components/rag/vector-search-input/index': rag('vector-search-input'),
    'components/rag/document-chunker/index': rag('document-chunker'),
    'components/rag/embedding-scatter/index': rag('embedding-scatter'),
    'components/rag/rag-pipeline/index': rag('rag-pipeline'),
    // Skills (Phase M)
    'components/skills/index': 'src/components/skills/index.ts',
    'components/skills/skill-permissions/index': skills('skill-permissions'),
    'components/skills/skill-auth-status/index': skills('skill-auth-status'),
    'components/skills/skill-card/index': skills('skill-card'),
    'components/skills/skill-registry/index': skills('skill-registry'),
    'components/skills/skill-invocation-log/index': skills('skill-invocation-log'),
    'components/skills/skill-marketplace/index': skills('skill-marketplace'),
    // AI Animations (Phase N)
    'components/ai-animations/index': 'src/components/ai-animations/index.ts',
    'components/ai-animations/sparkle-field/index': aiAnim('sparkle-field'),
    'components/ai-animations/ai-halo-border/index': aiAnim('ai-halo-border'),
    'components/ai-animations/thinking-orb/index': aiAnim('thinking-orb'),
    'components/ai-animations/neural-background/index': aiAnim('neural-background'),
    'components/ai-animations/token-stream/index': aiAnim('token-stream'),
    'components/ai-animations/gradient-aura/index': aiAnim('gradient-aura'),
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

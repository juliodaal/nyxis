/**
 * Single source of truth for the Nyxis component catalog.
 *
 * This drives the sidebar, the command palette, the dynamic page routes,
 * and the search index. Adding a new component to Nyxis means adding an
 * entry here and an MDX file under `src/content/<category>/<slug>.mdx`.
 */

export type Category =
  | 'getting-started'
  | 'text-animations'
  | 'components'
  | 'animations'
  | 'domain'
  | 'ai-models'
  | 'chat'
  | 'reasoning'
  | 'tools'
  | 'mcp'
  | 'agents'
  | 'multimodal'
  | 'prompts'
  | 'rag'
  | 'skills';

export type Status = 'stable' | 'beta' | 'planned' | 'in-progress';

export interface RegistryEntry {
  slug: string;
  name: string;
  category: Category;
  description: string;
  status: Status;
  importPath?: string;
  dependencies?: readonly string[];
}

export interface CategoryGroup {
  id: Category;
  label: string;
  description: string;
  href: string;
}

export const CATEGORIES: readonly CategoryGroup[] = [
  {
    id: 'getting-started',
    label: 'Getting started',
    description: 'Install Nyxis, configure theming, security guidance.',
    href: '/docs',
  },
  {
    id: 'text-animations',
    label: 'Text animations',
    description: 'GSAP-powered text effects with reduced-motion support.',
    href: '/text-animations',
  },
  {
    id: 'components',
    label: 'Components',
    description: 'Accessible UI primitives built on Radix UI.',
    href: '/components',
  },
  {
    id: 'animations',
    label: 'Animations',
    description: 'Effect components and animated backgrounds.',
    href: '/animations',
  },
  {
    id: 'ai-models',
    label: 'Models & providers',
    description: 'Pickers, sliders, meters, and config cards for AI provider/model setup.',
    href: '/ai-models',
  },
  {
    id: 'chat',
    label: 'Chat',
    description: 'Streaming-first chat surface, message primitives, and conversation tools.',
    href: '/chat',
  },
  {
    id: 'reasoning',
    label: 'Reasoning',
    description:
      'Surface for the model’s internal state — extended thinking, plans, "is working" indicators.',
    href: '/reasoning',
  },
  {
    id: 'tools',
    label: 'Tools',
    description:
      'Visual primitives for function calling — calls, results, parameter forms, registries, logs.',
    href: '/tools',
  },
  {
    id: 'mcp',
    label: 'MCP',
    description:
      'Visual surface for the Model Context Protocol — servers, capabilities, resources, prompts, traffic.',
    href: '/mcp',
  },
  {
    id: 'agents',
    label: 'Agents',
    description:
      'Multi-agent surface — status, cards, rosters, activity feeds, handoffs, task delegation.',
    href: '/agents',
  },
  {
    id: 'multimodal',
    label: 'Multimodal',
    description:
      'Media exchanged with the model — images, audio, voice, transcripts, vision input.',
    href: '/multimodal',
  },
  {
    id: 'prompts',
    label: 'Prompts / Eval',
    description:
      'Prompt engineering and offline evaluation — saved prompts, variable forms, eval runs, datasets, A/B compare.',
    href: '/prompts',
  },
  {
    id: 'rag',
    label: 'RAG',
    description:
      'Retrieval-augmented generation — chunks, retrieval results, search input, document chunker, embedding scatter, pipeline.',
    href: '/rag',
  },
  {
    id: 'skills',
    label: 'Skills',
    description:
      'Skill ecosystem — cards, registry, permissions, auth status, invocation log, marketplace.',
    href: '/skills',
  },
  {
    id: 'domain',
    label: 'AI patterns',
    description: 'Components purpose-built for AI products: agents, citations, monitoring.',
    href: '/domain',
  },
] as const;

export const REGISTRY: readonly RegistryEntry[] = [
  // ── Getting started ─────────────────────────────────────────────────
  {
    slug: 'introduction',
    name: 'Introduction',
    category: 'getting-started',
    description: 'What is Nyxis and how the docs are organized.',
    status: 'stable',
  },
  {
    slug: 'installation',
    name: 'Installation',
    category: 'getting-started',
    description: 'Install nyxis-ui in any React project.',
    status: 'stable',
  },
  {
    slug: 'theming',
    name: 'Theming',
    category: 'getting-started',
    description: 'Five-mode theming, design tokens, and FOUC prevention.',
    status: 'stable',
  },
  {
    slug: 'security',
    name: 'Security',
    category: 'getting-started',
    description: 'Hardening practices and vulnerability disclosure.',
    status: 'stable',
  },

  // ── Text animations (Phase 5) ───────────────────────────────────────
  {
    slug: 'split-text',
    name: 'SplitText',
    category: 'text-animations',
    description: 'Animate entry of characters, words, or lines.',
    status: 'stable',
    importPath: 'nyxis-ui',
    dependencies: ['gsap'],
  },
  {
    slug: 'type-writer',
    name: 'TypeWriter',
    category: 'text-animations',
    description: 'Typewriter effect with multi-string support.',
    status: 'stable',
    importPath: 'nyxis-ui',
  },
  {
    slug: 'scramble-text',
    name: 'ScrambleText',
    category: 'text-animations',
    description: 'Scrambled cipher resolves into the final text.',
    status: 'stable',
  },
  {
    slug: 'decrypt-text',
    name: 'DecryptText',
    category: 'text-animations',
    description: 'Matrix-style decryption animation.',
    status: 'stable',
  },
  {
    slug: 'gradient-text',
    name: 'GradientText',
    category: 'text-animations',
    description: 'Pure-CSS animated gradient text.',
    status: 'stable',
  },
  {
    slug: 'shiny-text',
    name: 'ShinyText',
    category: 'text-animations',
    description: 'Light sweep across a text label.',
    status: 'stable',
  },
  {
    slug: 'count-up',
    name: 'CountUp',
    category: 'text-animations',
    description: 'Animate a number with locale-aware formatting.',
    status: 'stable',
  },
  {
    slug: 'reveal-text',
    name: 'RevealText',
    category: 'text-animations',
    description: 'Reveal text on scroll via ScrollTrigger.',
    status: 'stable',
  },
  {
    slug: 'marquee-text',
    name: 'MarqueeText',
    category: 'text-animations',
    description: 'Infinite horizontal scrolling text.',
    status: 'stable',
  },
  {
    slug: 'rotating-text',
    name: 'RotatingText',
    category: 'text-animations',
    description: 'Cycle through words with slide, fade or scramble transitions.',
    status: 'stable',
  },

  // ── Base UI components (Phase 4) ────────────────────────────────────
  {
    slug: 'button',
    name: 'Button',
    category: 'components',
    description: 'Polymorphic button with six variants and four sizes.',
    status: 'stable',
    importPath: 'nyxis-ui',
  },
  {
    slug: 'input',
    name: 'Input',
    category: 'components',
    description: 'Single-line text input with prefix/suffix slots.',
    status: 'stable',
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    category: 'components',
    description: 'Multi-line input with optional autosize.',
    status: 'stable',
  },
  {
    slug: 'card',
    name: 'Card',
    category: 'components',
    description: 'Surface with header, content, and footer slots.',
    status: 'stable',
  },
  {
    slug: 'badge',
    name: 'Badge',
    category: 'components',
    description: 'Small status indicator.',
    status: 'stable',
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    category: 'components',
    description: 'Circular avatar with fallback initials and status dot.',
    status: 'stable',
  },
  {
    slug: 'separator',
    name: 'Separator',
    category: 'components',
    description: 'Horizontal or vertical divider.',
    status: 'stable',
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    category: 'components',
    description: 'Accessible modal dialog built on Radix.',
    status: 'stable',
  },
  {
    slug: 'sheet',
    name: 'Sheet',
    category: 'components',
    description: 'Side-anchored panel (top/right/bottom/left).',
    status: 'stable',
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    category: 'components',
    description: 'Mobile-first bottom sheet with drag-to-dismiss.',
    status: 'stable',
  },
  {
    slug: 'popover',
    name: 'Popover',
    category: 'components',
    description: 'Floating element anchored to a trigger.',
    status: 'stable',
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    category: 'components',
    description: 'Contextual hint with delay control.',
    status: 'stable',
  },
  {
    slug: 'toast',
    name: 'Toast',
    category: 'components',
    description: 'Transient notification (Sonner).',
    status: 'stable',
  },
  {
    slug: 'select',
    name: 'Select',
    category: 'components',
    description: 'Custom select control built on Radix.',
    status: 'stable',
  },
  {
    slug: 'combobox',
    name: 'Combobox',
    category: 'components',
    description: 'Searchable select using cmdk.',
    status: 'stable',
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    category: 'components',
    description: 'Boolean input with indeterminate state.',
    status: 'stable',
  },
  {
    slug: 'switch',
    name: 'Switch',
    category: 'components',
    description: 'Toggle switch.',
    status: 'stable',
  },
  {
    slug: 'radio-group',
    name: 'RadioGroup',
    category: 'components',
    description: 'Grouped exclusive choice.',
    status: 'stable',
  },
  {
    slug: 'dropdown-menu',
    name: 'DropdownMenu',
    category: 'components',
    description: 'Multi-item menu with submenus and shortcuts.',
    status: 'stable',
    importPath: 'nyxis-ui',
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    category: 'components',
    description: 'Switch between equivalent views.',
    status: 'stable',
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    category: 'components',
    description: 'Collapsible disclosure rows.',
    status: 'stable',
  },
  {
    slug: 'command',
    name: 'Command',
    category: 'components',
    description: 'Cmd+K-style command palette (cmdk).',
    status: 'stable',
  },
  {
    slug: 'form',
    name: 'Form',
    category: 'components',
    description: 'react-hook-form + zod wrapper with FormField, FormItem, FormMessage.',
    status: 'stable',
  },

  // ── Effect animations (Phase 6) ─────────────────────────────────────
  {
    slug: 'magnetic-button',
    name: 'MagneticButton',
    category: 'animations',
    description: 'Button that pulls toward the cursor.',
    status: 'stable',
    dependencies: ['gsap'],
  },
  {
    slug: 'spotlight-cursor',
    name: 'SpotlightCursor',
    category: 'animations',
    description: 'Radial gradient that follows the cursor.',
    status: 'stable',
  },
  {
    slug: 'parallax-container',
    name: 'ParallaxContainer',
    category: 'animations',
    description: 'Scroll-triggered layered parallax.',
    status: 'stable',
    dependencies: ['gsap'],
  },
  {
    slug: 'stagger-reveal',
    name: 'StaggerReveal',
    category: 'animations',
    description: 'Animate children into view in sequence.',
    status: 'stable',
    dependencies: ['gsap'],
  },
  {
    slug: 'tilt-card',
    name: 'TiltCard',
    category: 'animations',
    description: 'Cursor-tracked 3D tilt with optional glare.',
    status: 'stable',
  },
  {
    slug: 'aurora-background',
    name: 'AuroraBackground',
    category: 'animations',
    description: 'Soft animated aurora backdrop.',
    status: 'stable',
  },
  {
    slug: 'dot-grid-background',
    name: 'DotGridBackground',
    category: 'animations',
    description: 'Canvas dot grid that reacts to hover.',
    status: 'stable',
  },
  {
    slug: 'mesh-gradient-background',
    name: 'MeshGradientBackground',
    category: 'animations',
    description: 'Animated SVG mesh gradient.',
    status: 'stable',
    dependencies: ['gsap'],
  },

  // ── AI patterns ─────────────────────────────────────────────────────
  {
    slug: 'file-dropzone',
    name: 'FileDropzone',
    category: 'domain',
    description: 'Drag-and-drop uploader for documents, images, and audio fed to an AI pipeline.',
    status: 'stable',
  },
  {
    slug: 'data-table',
    name: 'DataTable',
    category: 'domain',
    description:
      'Sortable, filterable, paginated table for AI extractions, runs, and evaluation results.',
    status: 'stable',
  },
  {
    slug: 'chat-message',
    name: 'ChatMessage',
    category: 'domain',
    description: 'User / assistant / system bubble with streaming cursor for chat interfaces.',
    status: 'stable',
  },
  {
    slug: 'chat-input',
    name: 'ChatInput',
    category: 'domain',
    description: 'Auto-resizing composer with attachments for chat and agent interfaces.',
    status: 'stable',
  },
  {
    slug: 'citation-card',
    name: 'CitationCard',
    category: 'domain',
    description: 'Source snippet with title, locator, and link — for RAG citations.',
    status: 'stable',
  },
  {
    slug: 'confidence-badge',
    name: 'ConfidenceBadge',
    category: 'domain',
    description: 'Color-coded badge for any AI extraction or classification confidence score.',
    status: 'stable',
  },
  {
    slug: 'kpi-card',
    name: 'KPICard',
    category: 'domain',
    description: 'Number, delta, and sparkline at a glance — for AI dashboards and monitoring.',
    status: 'stable',
  },
  {
    slug: 'lead-card',
    name: 'LeadCard',
    category: 'domain',
    description: 'Entity summary card with a circular score and quick actions.',
    status: 'stable',
  },
  {
    slug: 'sentiment-indicator',
    name: 'SentimentIndicator',
    category: 'domain',
    description: 'Positive / neutral / negative readout for sentiment-analysis output.',
    status: 'stable',
  },
  {
    slug: 'audit-log-item',
    name: 'AuditLogItem',
    category: 'domain',
    description: 'Timeline entry with actor, action, and diff — for AI audit trails.',
    status: 'stable',
  },
  {
    slug: 'action-item',
    name: 'ActionItem',
    category: 'domain',
    description: 'Checkbox row with assignee, due date, and status — for agent task lists.',
    status: 'stable',
  },
  {
    slug: 'email-triage-card',
    name: 'EmailTriageCard',
    category: 'domain',
    description: 'Auto-classified inbox row with preview and draft response.',
    status: 'stable',
  },

  // ── AI · Models & Providers (Phase D) ───────────────────────────────
  {
    slug: 'ai-provider-selector',
    name: 'AIProviderSelector',
    category: 'ai-models',
    description: 'Dropdown to pick an AI provider (Anthropic, OpenAI, Google, Mistral, Ollama).',
    status: 'stable',
  },
  {
    slug: 'model-picker',
    name: 'ModelPicker',
    category: 'ai-models',
    description: 'Models grouped by provider with capability icons, context window, and pricing.',
    status: 'stable',
  },
  {
    slug: 'api-key-input',
    name: 'APIKeyInput',
    category: 'ai-models',
    description: 'Masked API key input with show/hide toggle and live validation status.',
    status: 'stable',
  },
  {
    slug: 'temperature-slider',
    name: 'TemperatureSlider',
    category: 'ai-models',
    description: 'Sampling temperature slider with deterministic ↔ creative endpoints.',
    status: 'stable',
  },
  {
    slug: 'top-p-slider',
    name: 'TopPSlider',
    category: 'ai-models',
    description: 'Nucleus sampling slider for top-p configuration.',
    status: 'stable',
  },
  {
    slug: 'max-tokens-input',
    name: 'MaxTokensInput',
    category: 'ai-models',
    description: 'Numeric input that knows the model output cap and warns on overflow.',
    status: 'stable',
  },
  {
    slug: 'system-prompt-editor',
    name: 'SystemPromptEditor',
    category: 'ai-models',
    description: 'Auto-resizing system prompt editor with variable detection and token estimate.',
    status: 'stable',
  },
  {
    slug: 'context-window-meter',
    name: 'ContextWindowMeter',
    category: 'ai-models',
    description: 'Bar chart of tokens consumed vs. context window.',
    status: 'stable',
  },
  {
    slug: 'cost-meter',
    name: 'CostMeter',
    category: 'ai-models',
    description: 'Live USD cost meter that subscribes to the AI event bus.',
    status: 'stable',
  },
  {
    slug: 'provider-health-badge',
    name: 'ProviderHealthBadge',
    category: 'ai-models',
    description: 'Operational / degraded / down pill with optional latency.',
    status: 'stable',
  },
  {
    slug: 'ai-config-card',
    name: 'AIConfigCard',
    category: 'ai-models',
    description: 'Composed configuration card combining provider, model, sampling, and prompt.',
    status: 'stable',
  },

  // ── AI · Chat 2.0 (Phase E) ─────────────────────────────────────────
  {
    slug: 'chat-thread',
    name: 'ChatThread',
    category: 'chat',
    description:
      'Scrollable conversation surface with auto-scroll-to-bottom and a "scroll to latest" floating button.',
    status: 'stable',
  },
  {
    slug: 'streaming-text',
    name: 'StreamingText',
    category: 'chat',
    description: 'Plain-text incremental renderer with a blinking cursor while tokens arrive.',
    status: 'stable',
  },
  {
    slug: 'streaming-markdown',
    name: 'StreamingMarkdown',
    category: 'chat',
    description:
      'Markdown renderer tuned for streaming — GFM, themed code blocks, trailing cursor.',
    status: 'stable',
    dependencies: ['react-markdown', 'remark-gfm'],
  },
  {
    slug: 'streaming-code',
    name: 'StreamingCode',
    category: 'chat',
    description: 'Code block with language badge, filename header, copy button, and live cursor.',
    status: 'stable',
  },
  {
    slug: 'typing-indicator',
    name: 'TypingIndicator',
    category: 'chat',
    description: 'Three-dot bouncer for "AI is typing" — subtle and bubble variants.',
    status: 'stable',
  },
  {
    slug: 'message-actions',
    name: 'MessageActions',
    category: 'chat',
    description: 'Hover-revealed copy / regenerate / edit / delete / fork / share row.',
    status: 'stable',
  },
  {
    slug: 'token-counter',
    name: 'TokenCounter',
    category: 'chat',
    description: 'Live token estimate with optional context-window bar; tone shifts at 70% / 90%.',
    status: 'stable',
  },
  {
    slug: 'conversation-sidebar',
    name: 'ConversationSidebar',
    category: 'chat',
    description: 'Left-rail conversation list with search, pinned items, and unread counts.',
    status: 'stable',
  },
  {
    slug: 'conversation-fork',
    name: 'ConversationFork',
    category: 'chat',
    description: 'Tree visualisation of branched conversations — regenerations and edits.',
    status: 'stable',
  },

  // ── AI · Reasoning (Phase F) ────────────────────────────────────────
  {
    slug: 'reasoning-trace',
    name: 'ReasoningTrace',
    category: 'reasoning',
    description:
      'Collapsible disclosure for the model’s extended-thinking output, with live streaming.',
    status: 'stable',
  },
  {
    slug: 'chain-of-thought',
    name: 'ChainOfThought',
    category: 'reasoning',
    description: 'Vertical stepper for explicit, structured reasoning steps.',
    status: 'stable',
  },
  {
    slug: 'thinking-indicator',
    name: 'ThinkingIndicator',
    category: 'reasoning',
    description: 'Lightweight "model is working" affordance — distinct from the typing indicator.',
    status: 'stable',
  },

  // ── AI · Tools / Function Calling (Phase G) ─────────────────────────
  {
    slug: 'tool-call',
    name: 'ToolCall',
    category: 'tools',
    description:
      'Card representing a single tool invocation by the model with status, args, and timing.',
    status: 'stable',
  },
  {
    slug: 'tool-result',
    name: 'ToolResult',
    category: 'tools',
    description:
      'Auto-formatted output viewer — JSON / text / markdown / image — with copy and truncate.',
    status: 'stable',
  },
  {
    slug: 'parameter-form',
    name: 'ParameterForm',
    category: 'tools',
    description:
      'Schema-driven form for tool parameters — string, number, enum, boolean, list, and JSON.',
    status: 'stable',
  },
  {
    slug: 'tool-registry',
    name: 'ToolRegistry',
    category: 'tools',
    description: 'Searchable, groupable catalog of available tools with per-tool toggles.',
    status: 'stable',
  },
  {
    slug: 'tool-execution-log',
    name: 'ToolExecutionLog',
    category: 'tools',
    description: 'Stacked timeline of tool invocations with status, args, result, and duration.',
    status: 'stable',
  },

  // ── AI · MCP (Phase H) ──────────────────────────────────────────────
  {
    slug: 'mcp-server-card',
    name: 'MCPServerCard',
    category: 'mcp',
    description:
      'Card for a single configured MCP server — transport, status, capabilities, inline actions.',
    status: 'stable',
  },
  {
    slug: 'mcp-server-list',
    name: 'MCPServerList',
    category: 'mcp',
    description:
      'Multi-server view with search, "Add server" affordance, and connect/disconnect handlers.',
    status: 'stable',
  },
  {
    slug: 'mcp-capability-badge',
    name: 'MCPCapabilityBadge',
    category: 'mcp',
    description:
      'Pill per MCP capability (tools, prompts, resources, sampling, roots, logging) with icons.',
    status: 'stable',
  },
  {
    slug: 'mcp-connection-status',
    name: 'MCPConnectionStatus',
    category: 'mcp',
    description:
      'Inline pill describing the MCP connection lifecycle with optional latency readout.',
    status: 'stable',
  },
  {
    slug: 'mcp-resource-browser',
    name: 'MCPResourceBrowser',
    category: 'mcp',
    description:
      'Searchable list of resources exposed by MCP servers, optionally grouped by URI scheme.',
    status: 'stable',
  },
  {
    slug: 'mcp-prompt-library',
    name: 'MCPPromptLibrary',
    category: 'mcp',
    description: 'Catalog of MCP prompt templates with collapsible argument lists.',
    status: 'stable',
  },
  {
    slug: 'mcp-log-stream',
    name: 'MCPLogStream',
    category: 'mcp',
    description:
      'Real-time JSON-RPC traffic viewer — direction badges, level pills, expandable JSON payloads.',
    status: 'stable',
  },

  // ── AI · Agents (Phase I) ───────────────────────────────────────────
  {
    slug: 'agent-status-badge',
    name: 'AgentStatusBadge',
    category: 'agents',
    description:
      'Pill describing an agent lifecycle (idle/thinking/working/blocked/done/errored) with animated indicator.',
    status: 'stable',
  },
  {
    slug: 'agent-card',
    name: 'AgentCard',
    category: 'agents',
    description:
      'Single-agent card with avatar, name, role, model, status, and the tools available to it.',
    status: 'stable',
  },
  {
    slug: 'agent-roster',
    name: 'AgentRoster',
    category: 'agents',
    description: 'Multi-agent team view with search, status filters, and list/grid layouts.',
    status: 'stable',
  },
  {
    slug: 'agent-activity-feed',
    name: 'AgentActivityFeed',
    category: 'agents',
    description:
      'Vertical timeline of agent activity — thoughts, actions, tool calls, messages, handoffs, errors.',
    status: 'stable',
  },
  {
    slug: 'agent-handoff',
    name: 'AgentHandoff',
    category: 'agents',
    description:
      'Card visualising a handoff between two agents with reason and pending/accepted/rejected state.',
    status: 'stable',
  },
  {
    slug: 'task-delegation',
    name: 'TaskDelegation',
    category: 'agents',
    description:
      'Hierarchical task tree with per-node status, assigned-agent chips, and progress bars.',
    status: 'stable',
  },

  // ── AI · Multimodal (Phase J) ───────────────────────────────────────
  {
    slug: 'image-message',
    name: 'ImageMessage',
    category: 'multimodal',
    description:
      'Image bubble for chat replies with loading, generation progress, error, and ready states.',
    status: 'stable',
  },
  {
    slug: 'image-gallery',
    name: 'ImageGallery',
    category: 'multimodal',
    description: 'Responsive image grid with built-in lightbox, keyboard navigation, and download.',
    status: 'stable',
  },
  {
    slug: 'voice-waveform',
    name: 'VoiceWaveform',
    category: 'multimodal',
    description: 'Bar-based audio waveform: live recording, playback progress, or idle baseline.',
    status: 'stable',
  },
  {
    slug: 'audio-player',
    name: 'AudioPlayer',
    category: 'multimodal',
    description:
      'Compact player for TTS / transcribed audio — play, seek, mute, cycle speed, download.',
    status: 'stable',
  },
  {
    slug: 'transcription-view',
    name: 'TranscriptionView',
    category: 'multimodal',
    description:
      'Time-anchored transcript with active-segment highlight, auto-scroll, click-to-seek.',
    status: 'stable',
  },
  {
    slug: 'vision-input',
    name: 'VisionInput',
    category: 'multimodal',
    description:
      'Vision-input dropzone — drag-and-drop, file picker, paste, optional camera capture.',
    status: 'stable',
  },

  // ── AI · Prompts / Eval (Phase K) ───────────────────────────────────
  {
    slug: 'prompt-card',
    name: 'PromptCard',
    category: 'prompts',
    description:
      'Saved-prompt card with name, description, version, model, variable count, and tags.',
    status: 'stable',
  },
  {
    slug: 'prompt-variable-form',
    name: 'PromptVariableForm',
    category: 'prompts',
    description:
      'Auto-form for `{{variables}}` extracted from a prompt template, with live preview.',
    status: 'stable',
  },
  {
    slug: 'metric-card',
    name: 'MetricCard',
    category: 'prompts',
    description: 'Single eval metric with delta vs baseline and an optional inline sparkline.',
    status: 'stable',
  },
  {
    slug: 'eval-run-card',
    name: 'EvalRunCard',
    category: 'prompts',
    description: 'Eval-run summary — status, prompt, model, dataset, progress, headline metrics.',
    status: 'stable',
  },
  {
    slug: 'dataset-table',
    name: 'DatasetTable',
    category: 'prompts',
    description:
      'Stacked table for an eval dataset — input / expected / actual / score with bucket filters.',
    status: 'stable',
  },
  {
    slug: 'ab-compare',
    name: 'ABCompare',
    category: 'prompts',
    description:
      'Side-by-side comparison of two prompts (or two models) with metric deltas and sample outputs.',
    status: 'stable',
  },

  // ── AI · RAG (Phase L) ──────────────────────────────────────────────
  {
    slug: 'chunk-card',
    name: 'ChunkCard',
    category: 'rag',
    description:
      'Single retrieved chunk with rank, source, score, optional reranker delta, and expandable metadata.',
    status: 'stable',
  },
  {
    slug: 'retrieval-results',
    name: 'RetrievalResults',
    category: 'rag',
    description: 'List of retrieved chunks with in-set search and a score-threshold slider.',
    status: 'stable',
  },
  {
    slug: 'vector-search-input',
    name: 'VectorSearchInput',
    category: 'rag',
    description: 'Query input with topK slider, similarity threshold, and reranker toggle.',
    status: 'stable',
  },
  {
    slug: 'document-chunker',
    name: 'DocumentChunker',
    category: 'rag',
    description: 'Source document with chunk boundaries highlighted — preview a chunking strategy.',
    status: 'stable',
  },
  {
    slug: 'embedding-scatter',
    name: 'EmbeddingScatter',
    category: 'rag',
    description:
      'Pure-SVG 2D scatter for UMAP / t-SNE / PCA projections with hover tooltips and group colour-coding.',
    status: 'stable',
  },
  {
    slug: 'rag-pipeline',
    name: 'RAGPipeline',
    category: 'rag',
    description:
      'Connected stage chips for embed → retrieve → rerank → generate with status, durations, and counts.',
    status: 'stable',
  },

  // ── AI · Skills (Phase M) ───────────────────────────────────────────
  {
    slug: 'skill-card',
    name: 'SkillCard',
    category: 'skills',
    description:
      'Single skill with icon, name, version, author, description, scopes, auth pill, and an enable toggle.',
    status: 'stable',
  },
  {
    slug: 'skill-permissions',
    name: 'SkillPermissions',
    category: 'skills',
    description:
      'Pill row of required scopes (read / write / admin × resource) with compact and limited variants.',
    status: 'stable',
  },
  {
    slug: 'skill-auth-status',
    name: 'SkillAuthStatus',
    category: 'skills',
    description:
      'Auth lifecycle card — connected / expired / needs-reauth / never / errored — with primary action.',
    status: 'stable',
  },
  {
    slug: 'skill-registry',
    name: 'SkillRegistry',
    category: 'skills',
    description:
      'Installed-skills catalog with search, category filters, and per-skill enable toggles.',
    status: 'stable',
  },
  {
    slug: 'skill-invocation-log',
    name: 'SkillInvocationLog',
    category: 'skills',
    description:
      'Vertical timeline of skill calls with status, action, duration, and expandable payloads.',
    status: 'stable',
  },
  {
    slug: 'skill-marketplace',
    name: 'SkillMarketplace',
    category: 'skills',
    description:
      'Discovery grid with category filters, star ratings, install counts, and stateful install button.',
    status: 'stable',
  },
] as const;

export function entriesByCategory(category: Category): readonly RegistryEntry[] {
  return REGISTRY.filter((entry) => entry.category === category);
}

export function findEntry(category: Category, slug: string): RegistryEntry | undefined {
  return REGISTRY.find((entry) => entry.category === category && entry.slug === slug);
}

export function findEntryBySlug(slug: string): RegistryEntry | undefined {
  return REGISTRY.find((entry) => entry.slug === slug);
}

export function pathFor(entry: RegistryEntry): string {
  if (entry.category === 'getting-started') return `/docs/${entry.slug}`;
  return `/${entry.category}/${entry.slug}`;
}

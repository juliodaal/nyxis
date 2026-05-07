/**
 * Source-of-truth catalog for the Nyxis shadcn-style registry.
 *
 * The build-registry script reads this list, loads the source for each
 * declared file, and emits the JSON entries the shadcn CLI consumes:
 *
 *   public/r/registry.json     — manifesto (root)
 *   public/r/<name>.json       — one item per entry
 *
 * Adding a new component to the registry means:
 *   1. Drop the source file under `apps/docs/registry/components/`
 *      (or `apps/docs/registry/hooks/`, `apps/docs/registry/lib/`).
 *   2. Add an entry below.
 *   3. Run `pnpm --filter @nyxis/docs build` (the script runs as a
 *      pre-build step).
 */

import type { Category } from '../src/lib/registry';

/** Mirrors the shadcn registry item type union. */
export type RegistryItemType =
  | 'registry:lib'
  | 'registry:component'
  | 'registry:ui'
  | 'registry:hook'
  | 'registry:block'
  | 'registry:page'
  | 'registry:file'
  | 'registry:theme'
  | 'registry:style';

/** A file that ships as part of a registry item. */
export interface RegistryFileSpec {
  /** Source path relative to `apps/docs/registry/`. */
  source: string;
  /** Where the file should land in the consumer's project. */
  target: string;
  /** Item type for this file (almost always matches the parent). */
  type: RegistryItemType;
}

/** A single registry entry. */
export interface RegistryItemSpec {
  /** Slug used by `npx shadcn add <name>`. */
  name: string;
  /** Item kind for the shadcn CLI. */
  type: RegistryItemType;
  /** Display title. */
  title: string;
  /** One-line description shown in catalog UIs. */
  description: string;
  /** External npm dependencies the consumer needs. */
  dependencies?: readonly string[];
  /** Other registry items to install alongside (names from this list, or full URLs). */
  registryDependencies?: readonly string[];
  /** Files the consumer receives. */
  files: readonly RegistryFileSpec[];
  /** Optional category — used to group items in the docs catalog UI. */
  category?: Category;
}

/**
 * The catalog. Order matters only for the manifesto's listing; consumers
 * install items by name.
 */
export const REGISTRY_ITEMS: readonly RegistryItemSpec[] = [
  // ── Shared lib (auto-installed when any component depends on it) ──
  // Source is read from the docs site's own `src/lib/utils.ts` so the
  // file the registry serves is the same one the docs site uses.
  {
    name: 'utils',
    type: 'registry:lib',
    title: 'cn() utility',
    description: 'The standard tailwind-merge + clsx helper used by every Nyxis component.',
    dependencies: ['clsx', 'tailwind-merge'],
    files: [
      {
        source: '../src/lib/utils.ts',
        target: 'lib/utils.ts',
        type: 'registry:lib',
      },
    ],
  },

  // ── Backend recipes ────────────────────────────────────────────────
  // Phase 2 — server-side route handlers and helpers, distributed as
  // copy-paste source. Each recipe lands as one or more files in the
  // consumer's repo. Targets assume Next.js App Router conventions
  // (app/api/<name>/route.ts, lib/ai/<helper>.ts) — adapt as needed.
  {
    name: 'api-chat',
    type: 'registry:file',
    title: 'POST /api/chat',
    description:
      'Streaming chat route handler for Next.js App Router — provider-agnostic, useChat-compatible.',
    dependencies: ['@nyxis/core'],
    registryDependencies: [],
    files: [
      {
        source: 'api/chat/route.ts',
        target: 'app/api/chat/route.ts',
        type: 'registry:file',
      },
      {
        source: 'lib/ai/system-prompt.ts',
        target: 'lib/ai/system-prompt.ts',
        type: 'registry:lib',
      },
    ],
    category: 'getting-started',
  },
  {
    name: 'api-completion',
    type: 'registry:file',
    title: 'POST /api/completion',
    description: 'Single-shot streaming completion endpoint. For autocomplete and one-off prompts.',
    dependencies: ['@nyxis/core'],
    registryDependencies: ['api-chat'],
    files: [
      {
        source: 'api/completion/route.ts',
        target: 'app/api/completion/route.ts',
        type: 'registry:file',
      },
    ],
    category: 'getting-started',
  },
  {
    name: 'api-tools',
    type: 'registry:file',
    title: 'POST /api/chat-tools',
    description:
      'Streaming chat handler with tool calling — pair with the ToolCall and ToolResult components.',
    dependencies: ['@nyxis/core', 'ai', 'zod'],
    registryDependencies: ['api-chat'],
    files: [
      {
        source: 'api/tools/route.ts',
        target: 'app/api/chat-tools/route.ts',
        type: 'registry:file',
      },
      {
        source: 'lib/ai/tools.ts',
        target: 'lib/ai/tools.ts',
        type: 'registry:lib',
      },
    ],
    category: 'getting-started',
  },
  {
    name: 'api-rag',
    type: 'registry:file',
    title: 'POST /api/rag',
    description:
      'RAG-style chat handler — retrieves relevant chunks before each turn and injects them as context.',
    dependencies: ['@nyxis/core'],
    registryDependencies: ['api-chat'],
    files: [
      {
        source: 'api/rag/route.ts',
        target: 'app/api/rag/route.ts',
        type: 'registry:file',
      },
      {
        source: 'lib/ai/retrieve.ts',
        target: 'lib/ai/retrieve.ts',
        type: 'registry:lib',
      },
    ],
    category: 'getting-started',
  },

  // ── Theme ──────────────────────────────────────────────────────────
  {
    name: 'theme-toggle',
    type: 'registry:ui',
    title: 'Theme Toggle',
    description:
      'Five-mode theme switcher (light/dark/dim/high-contrast/system) backed by Nyxis design tokens.',
    dependencies: ['lucide-react', '@radix-ui/react-dropdown-menu', 'nyxis-ui'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/theme-toggle.tsx',
        target: 'components/nyxis/theme-toggle.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'getting-started',
  },

  // ── Domain patterns ────────────────────────────────────────────────
  {
    name: 'confidence-badge',
    type: 'registry:ui',
    title: 'Confidence Badge',
    description: 'Color-coded badge for any AI extraction or classification confidence score.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/confidence-badge.tsx',
        target: 'components/nyxis/confidence-badge.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },
  {
    name: 'sentiment-indicator',
    type: 'registry:ui',
    title: 'Sentiment Indicator',
    description: 'Positive / neutral / negative readout for sentiment-analysis output.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/sentiment-indicator.tsx',
        target: 'components/nyxis/sentiment-indicator.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },
  {
    name: 'citation-card',
    type: 'registry:ui',
    title: 'Citation Card',
    description: 'Source snippet with title, locator, and link — for RAG citations.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/citation-card.tsx',
        target: 'components/nyxis/citation-card.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },
  {
    name: 'kpi-card',
    type: 'registry:ui',
    title: 'KPI Card',
    description: 'Number, delta, and sparkline at a glance — for AI dashboards and monitoring.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/kpi-card.tsx',
        target: 'components/nyxis/kpi-card.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },
  {
    name: 'file-dropzone',
    type: 'registry:ui',
    title: 'File Dropzone',
    description: 'Drag-and-drop uploader for documents, images, and audio fed to an AI pipeline.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/file-dropzone.tsx',
        target: 'components/nyxis/file-dropzone.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },
  {
    name: 'data-table',
    type: 'registry:ui',
    title: 'Data Table',
    description:
      'Sortable, filterable, paginated table for AI extractions, runs, and evaluation results.',
    dependencies: ['lucide-react', '@tanstack/react-table'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/data-table.tsx',
        target: 'components/nyxis/data-table.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },
  {
    name: 'chat-message',
    type: 'registry:ui',
    title: 'Chat Message',
    description: 'User / assistant / system bubble with streaming cursor for chat interfaces.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/chat-message.tsx',
        target: 'components/nyxis/chat-message.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },
  {
    name: 'chat-input',
    type: 'registry:ui',
    title: 'Chat Input',
    description: 'Auto-resizing composer with attachments for chat and agent interfaces.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/chat-input.tsx',
        target: 'components/nyxis/chat-input.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },
  {
    name: 'lead-card',
    type: 'registry:ui',
    title: 'Lead Card',
    description: 'Entity summary card with a circular score and quick actions.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/lead-card.tsx',
        target: 'components/nyxis/lead-card.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },
  {
    name: 'audit-log-item',
    type: 'registry:ui',
    title: 'Audit Log Item',
    description: 'Timeline entry with actor, action, and diff — for AI audit trails.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/audit-log-item.tsx',
        target: 'components/nyxis/audit-log-item.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },
  {
    name: 'action-item',
    type: 'registry:ui',
    title: 'Action Item',
    description: 'Checkbox row with assignee, due date, and status — for agent task lists.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils', 'checkbox'],
    files: [
      {
        source: 'components/action-item.tsx',
        target: 'components/nyxis/action-item.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },
  {
    name: 'email-triage-card',
    type: 'registry:ui',
    title: 'Email Triage Card',
    description: 'Auto-classified inbox row with preview and draft response.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/email-triage-card.tsx',
        target: 'components/nyxis/email-triage-card.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },

  // ── AI animations ──────────────────────────────────────────────────
  {
    name: 'sparkle-field',
    type: 'registry:ui',
    title: 'Sparkle Field',
    description:
      'Twinkling four-point stars at random positions inside a container — the "magic AI" affordance.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/sparkle-field.tsx',
        target: 'components/nyxis/sparkle-field.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-animations',
  },
  {
    name: 'ai-halo-border',
    type: 'registry:ui',
    title: 'AI Halo Border',
    description:
      'Animated conic-gradient border that orbits around an element — indicates "AI-touched" content.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/ai-halo-border.tsx',
        target: 'components/nyxis/ai-halo-border.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-animations',
  },
  {
    name: 'thinking-orb',
    type: 'registry:ui',
    title: 'Thinking Orb',
    description: 'Siri-style breathing orb with idle / thinking / speaking / errored states.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/thinking-orb.tsx',
        target: 'components/nyxis/thinking-orb.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-animations',
  },
  {
    name: 'neural-background',
    type: 'registry:ui',
    title: 'Neural Background',
    description:
      'Animated network of nodes and edges drifting across a hero — pure canvas, GPU-accelerated.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/neural-background.tsx',
        target: 'components/nyxis/neural-background.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-animations',
  },
  {
    name: 'token-stream',
    type: 'registry:ui',
    title: 'Token Stream',
    description:
      'Visual representation of tokens flowing through a horizontal lane — streaming indicator.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/token-stream.tsx',
        target: 'components/nyxis/token-stream.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-animations',
  },
  {
    name: 'gradient-aura',
    type: 'registry:ui',
    title: 'Gradient Aura',
    description:
      'Soft, rotating conic-gradient glow behind any child element — element-scoped backdrop.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/gradient-aura.tsx',
        target: 'components/nyxis/gradient-aura.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-animations',
  },

  // ── Reasoning ──────────────────────────────────────────────────────
  {
    name: 'reasoning-trace',
    type: 'registry:ui',
    title: 'Reasoning Trace',
    description:
      "Collapsible disclosure for the model's extended-thinking output, with live streaming.",
    dependencies: ['lucide-react'],
    registryDependencies: ['utils', 'streaming-text'],
    files: [
      {
        source: 'components/reasoning-trace.tsx',
        target: 'components/nyxis/reasoning-trace.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'reasoning',
  },
  {
    name: 'chain-of-thought',
    type: 'registry:ui',
    title: 'Chain of Thought',
    description: 'Vertical stepper for explicit, structured reasoning steps.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/chain-of-thought.tsx',
        target: 'components/nyxis/chain-of-thought.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'reasoning',
  },
  {
    name: 'thinking-indicator',
    type: 'registry:ui',
    title: 'Thinking Indicator',
    description: 'Lightweight "model is working" affordance — distinct from the typing indicator.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/thinking-indicator.tsx',
        target: 'components/nyxis/thinking-indicator.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'reasoning',
  },

  // ── Agents ─────────────────────────────────────────────────────────
  {
    name: 'agent-status-badge',
    type: 'registry:ui',
    title: 'Agent Status Badge',
    description:
      'Pill describing an agent lifecycle (idle/thinking/working/blocked/done/errored) with animated indicator.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/agent-status-badge.tsx',
        target: 'components/nyxis/agent-status-badge.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'agents',
  },
  {
    name: 'agent-card',
    type: 'registry:ui',
    title: 'Agent Card',
    description:
      'Single-agent card with avatar, name, role, model, status, and the tools available to it.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils', 'agent-status-badge'],
    files: [
      {
        source: 'components/agent-card.tsx',
        target: 'components/nyxis/agent-card.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'agents',
  },
  {
    name: 'agent-roster',
    type: 'registry:ui',
    title: 'Agent Roster',
    description: 'Multi-agent team view with search, status filters, and list/grid layouts.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils', 'agent-card', 'agent-status-badge'],
    files: [
      {
        source: 'components/agent-roster.tsx',
        target: 'components/nyxis/agent-roster.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'agents',
  },
  {
    name: 'agent-activity-feed',
    type: 'registry:ui',
    title: 'Agent Activity Feed',
    description:
      'Vertical timeline of agent activity — thoughts, actions, tool calls, messages, handoffs, errors.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/agent-activity-feed.tsx',
        target: 'components/nyxis/agent-activity-feed.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'agents',
  },
  {
    name: 'agent-handoff',
    type: 'registry:ui',
    title: 'Agent Handoff',
    description:
      'Card visualising a handoff between two agents with reason and pending/accepted/rejected state.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/agent-handoff.tsx',
        target: 'components/nyxis/agent-handoff.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'agents',
  },
  {
    name: 'task-delegation',
    type: 'registry:ui',
    title: 'Task Delegation',
    description:
      'Hierarchical task tree with per-node status, assigned-agent chips, and progress bars.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/task-delegation.tsx',
        target: 'components/nyxis/task-delegation.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'agents',
  },

  // ── Chat ───────────────────────────────────────────────────────────
  {
    name: 'streaming-text',
    type: 'registry:ui',
    title: 'Streaming Text',
    description: 'Plain-text incremental renderer with a blinking cursor while tokens arrive.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/streaming-text.tsx',
        target: 'components/nyxis/streaming-text.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'chat',
  },
  {
    name: 'streaming-code',
    type: 'registry:ui',
    title: 'Streaming Code',
    description: 'Code block with language badge, filename header, copy button, and live cursor.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/streaming-code.tsx',
        target: 'components/nyxis/streaming-code.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'chat',
  },
  {
    name: 'streaming-markdown',
    type: 'registry:ui',
    title: 'Streaming Markdown',
    description:
      'Markdown renderer tuned for streaming — GFM, themed code blocks, trailing cursor.',
    dependencies: ['react-markdown', 'remark-gfm'],
    registryDependencies: ['utils', 'streaming-code'],
    files: [
      {
        source: 'components/streaming-markdown.tsx',
        target: 'components/nyxis/streaming-markdown.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'chat',
  },
  {
    name: 'typing-indicator',
    type: 'registry:ui',
    title: 'Typing Indicator',
    description: 'Three-dot bouncer for "AI is typing" — subtle and bubble variants.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/typing-indicator.tsx',
        target: 'components/nyxis/typing-indicator.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'chat',
  },
  {
    name: 'chat-thread',
    type: 'registry:ui',
    title: 'Chat Thread',
    description:
      'Scrollable conversation surface with auto-scroll-to-bottom and a "scroll to latest" floating button.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils', 'chat-message', 'typing-indicator', 'streaming-markdown'],
    files: [
      {
        source: 'components/chat-thread.tsx',
        target: 'components/nyxis/chat-thread.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'chat',
  },
  {
    name: 'message-actions',
    type: 'registry:ui',
    title: 'Message Actions',
    description: 'Hover-revealed copy / regenerate / edit / delete / fork / share row.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/message-actions.tsx',
        target: 'components/nyxis/message-actions.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'chat',
  },
  {
    name: 'token-counter',
    type: 'registry:ui',
    title: 'Token Counter',
    description: 'Live token estimate with optional context-window bar; tone shifts at 70% / 90%.',
    dependencies: ['@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/token-counter.tsx',
        target: 'components/nyxis/token-counter.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'chat',
  },
  {
    name: 'conversation-sidebar',
    type: 'registry:ui',
    title: 'Conversation Sidebar',
    description: 'Left-rail conversation list with search, pinned items, and unread counts.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/conversation-sidebar.tsx',
        target: 'components/nyxis/conversation-sidebar.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'chat',
  },
  {
    name: 'conversation-fork',
    type: 'registry:ui',
    title: 'Conversation Fork',
    description: 'Tree visualisation of branched conversations — regenerations and edits.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/conversation-fork.tsx',
        target: 'components/nyxis/conversation-fork.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'chat',
  },

  // ── Tools ──────────────────────────────────────────────────────────
  {
    name: 'tool-call',
    type: 'registry:ui',
    title: 'Tool Call',
    description:
      'Card representing a single tool invocation by the model with status, args, and timing.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/tool-call.tsx',
        target: 'components/nyxis/tool-call.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'tools',
  },
  {
    name: 'tool-result',
    type: 'registry:ui',
    title: 'Tool Result',
    description:
      'Auto-formatted output viewer — JSON / text / markdown / image — with copy and truncate.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/tool-result.tsx',
        target: 'components/nyxis/tool-result.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'tools',
  },
  {
    name: 'parameter-form',
    type: 'registry:ui',
    title: 'Parameter Form',
    description:
      'Schema-driven form for tool parameters — string, number, enum, boolean, list, and JSON.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/parameter-form.tsx',
        target: 'components/nyxis/parameter-form.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'tools',
  },
  {
    name: 'tool-registry',
    type: 'registry:ui',
    title: 'Tool Registry',
    description: 'Searchable, groupable catalog of available tools with per-tool toggles.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/tool-registry.tsx',
        target: 'components/nyxis/tool-registry.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'tools',
  },
  {
    name: 'tool-execution-log',
    type: 'registry:ui',
    title: 'Tool Execution Log',
    description: 'Stacked timeline of tool invocations with status, args, result, and duration.',
    dependencies: ['@nyxis/core'],
    registryDependencies: ['utils', 'tool-call', 'tool-result'],
    files: [
      {
        source: 'components/tool-execution-log.tsx',
        target: 'components/nyxis/tool-execution-log.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'tools',
  },

  // ── MCP (Model Context Protocol) ───────────────────────────────────
  {
    name: 'mcp-capability-badge',
    type: 'registry:ui',
    title: 'MCP Capability Badge',
    description:
      'Pill per MCP capability (tools, prompts, resources, sampling, roots, logging) with icons.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/mcp-capability-badge.tsx',
        target: 'components/nyxis/mcp-capability-badge.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'mcp',
  },
  {
    name: 'mcp-connection-status',
    type: 'registry:ui',
    title: 'MCP Connection Status',
    description:
      'Inline pill describing the MCP connection lifecycle with optional latency readout.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/mcp-connection-status.tsx',
        target: 'components/nyxis/mcp-connection-status.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'mcp',
  },
  {
    name: 'mcp-server-card',
    type: 'registry:ui',
    title: 'MCP Server Card',
    description:
      'Card for a single configured MCP server — transport, status, capabilities, inline actions.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils', 'mcp-capability-badge', 'mcp-connection-status'],
    files: [
      {
        source: 'components/mcp-server-card.tsx',
        target: 'components/nyxis/mcp-server-card.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'mcp',
  },
  {
    name: 'mcp-server-list',
    type: 'registry:ui',
    title: 'MCP Server List',
    description:
      'Multi-server view with search, "Add server" affordance, and connect/disconnect handlers.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils', 'mcp-server-card'],
    files: [
      {
        source: 'components/mcp-server-list.tsx',
        target: 'components/nyxis/mcp-server-list.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'mcp',
  },
  {
    name: 'mcp-resource-browser',
    type: 'registry:ui',
    title: 'MCP Resource Browser',
    description:
      'Searchable list of resources exposed by MCP servers, optionally grouped by URI scheme.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/mcp-resource-browser.tsx',
        target: 'components/nyxis/mcp-resource-browser.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'mcp',
  },
  {
    name: 'mcp-prompt-library',
    type: 'registry:ui',
    title: 'MCP Prompt Library',
    description: 'Catalog of MCP prompt templates with collapsible argument lists.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/mcp-prompt-library.tsx',
        target: 'components/nyxis/mcp-prompt-library.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'mcp',
  },
  {
    name: 'mcp-log-stream',
    type: 'registry:ui',
    title: 'MCP Log Stream',
    description:
      'Real-time JSON-RPC traffic viewer — direction badges, level pills, expandable JSON payloads.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/mcp-log-stream.tsx',
        target: 'components/nyxis/mcp-log-stream.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'mcp',
  },

  // ── Multimodal ─────────────────────────────────────────────────────
  {
    name: 'image-message',
    type: 'registry:ui',
    title: 'Image Message',
    description:
      'Image bubble for chat replies with loading, generation progress, error, and ready states.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/image-message.tsx',
        target: 'components/nyxis/image-message.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'multimodal',
  },
  {
    name: 'image-gallery',
    type: 'registry:ui',
    title: 'Image Gallery',
    description: 'Responsive image grid with built-in lightbox, keyboard navigation, and download.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/image-gallery.tsx',
        target: 'components/nyxis/image-gallery.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'multimodal',
  },
  {
    name: 'voice-waveform',
    type: 'registry:ui',
    title: 'Voice Waveform',
    description: 'Bar-based audio waveform: live recording, playback progress, or idle baseline.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/voice-waveform.tsx',
        target: 'components/nyxis/voice-waveform.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'multimodal',
  },
  {
    name: 'audio-player',
    type: 'registry:ui',
    title: 'Audio Player',
    description:
      'Compact player for TTS / transcribed audio — play, seek, mute, cycle speed, download.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils', 'voice-waveform'],
    files: [
      {
        source: 'components/audio-player.tsx',
        target: 'components/nyxis/audio-player.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'multimodal',
  },
  {
    name: 'transcription-view',
    type: 'registry:ui',
    title: 'Transcription View',
    description:
      'Time-anchored transcript with active-segment highlight, auto-scroll, click-to-seek.',
    dependencies: ['@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/transcription-view.tsx',
        target: 'components/nyxis/transcription-view.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'multimodal',
  },
  {
    name: 'vision-input',
    type: 'registry:ui',
    title: 'Vision Input',
    description:
      'Vision-input dropzone — drag-and-drop, file picker, paste, optional camera capture.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/vision-input.tsx',
        target: 'components/nyxis/vision-input.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'multimodal',
  },

  // ── RAG ────────────────────────────────────────────────────────────
  {
    name: 'chunk-card',
    type: 'registry:ui',
    title: 'Chunk Card',
    description:
      'Single retrieved chunk with rank, source, score, optional reranker delta, and expandable metadata.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/chunk-card.tsx',
        target: 'components/nyxis/chunk-card.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'rag',
  },
  {
    name: 'retrieval-results',
    type: 'registry:ui',
    title: 'Retrieval Results',
    description: 'List of retrieved chunks with in-set search and a score-threshold slider.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils', 'chunk-card'],
    files: [
      {
        source: 'components/retrieval-results.tsx',
        target: 'components/nyxis/retrieval-results.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'rag',
  },
  {
    name: 'vector-search-input',
    type: 'registry:ui',
    title: 'Vector Search Input',
    description: 'Query input with topK slider, similarity threshold, and reranker toggle.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/vector-search-input.tsx',
        target: 'components/nyxis/vector-search-input.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'rag',
  },
  {
    name: 'document-chunker',
    type: 'registry:ui',
    title: 'Document Chunker',
    description: 'Source document with chunk boundaries highlighted — preview a chunking strategy.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/document-chunker.tsx',
        target: 'components/nyxis/document-chunker.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'rag',
  },
  {
    name: 'embedding-scatter',
    type: 'registry:ui',
    title: 'Embedding Scatter',
    description:
      'Pure-SVG 2D scatter for UMAP / t-SNE / PCA projections with hover tooltips and group colour-coding.',
    dependencies: ['@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/embedding-scatter.tsx',
        target: 'components/nyxis/embedding-scatter.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'rag',
  },
  {
    name: 'rag-pipeline',
    type: 'registry:ui',
    title: 'RAG Pipeline',
    description:
      'Connected stage chips for embed → retrieve → rerank → generate with status, durations, and counts.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/rag-pipeline.tsx',
        target: 'components/nyxis/rag-pipeline.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'rag',
  },

  // ── Skills ─────────────────────────────────────────────────────────
  {
    name: 'skill-permissions',
    type: 'registry:ui',
    title: 'Skill Permissions',
    description:
      'Pill row of required scopes (read / write / admin × resource) with compact and limited variants.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/skill-permissions.tsx',
        target: 'components/nyxis/skill-permissions.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'skills',
  },
  {
    name: 'skill-auth-status',
    type: 'registry:ui',
    title: 'Skill Auth Status',
    description:
      'Auth lifecycle card — connected / expired / needs-reauth / never / errored — with primary action.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/skill-auth-status.tsx',
        target: 'components/nyxis/skill-auth-status.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'skills',
  },
  {
    name: 'skill-card',
    type: 'registry:ui',
    title: 'Skill Card',
    description:
      'Single skill with icon, name, version, author, description, scopes, auth pill, and an enable toggle.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils', 'skill-auth-status', 'skill-permissions'],
    files: [
      {
        source: 'components/skill-card.tsx',
        target: 'components/nyxis/skill-card.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'skills',
  },
  {
    name: 'skill-registry',
    type: 'registry:ui',
    title: 'Skill Registry',
    description:
      'Installed-skills catalog with search, category filters, and per-skill enable toggles.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils', 'skill-card'],
    files: [
      {
        source: 'components/skill-registry.tsx',
        target: 'components/nyxis/skill-registry.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'skills',
  },
  {
    name: 'skill-invocation-log',
    type: 'registry:ui',
    title: 'Skill Invocation Log',
    description:
      'Vertical timeline of skill calls with status, action, duration, and expandable payloads.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/skill-invocation-log.tsx',
        target: 'components/nyxis/skill-invocation-log.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'skills',
  },
  {
    name: 'skill-marketplace',
    type: 'registry:ui',
    title: 'Skill Marketplace',
    description:
      'Discovery grid with category filters, star ratings, install counts, and stateful install button.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils', 'skill-permissions'],
    files: [
      {
        source: 'components/skill-marketplace.tsx',
        target: 'components/nyxis/skill-marketplace.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'skills',
  },

  // ── Prompts / Eval ─────────────────────────────────────────────────
  {
    name: 'prompt-card',
    type: 'registry:ui',
    title: 'Prompt Card',
    description:
      'Saved-prompt card with name, description, version, model, variable count, and tags.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/prompt-card.tsx',
        target: 'components/nyxis/prompt-card.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'prompts',
  },
  {
    name: 'prompt-variable-form',
    type: 'registry:ui',
    title: 'Prompt Variable Form',
    description:
      'Auto-form for `{{variables}}` extracted from a prompt template, with live preview.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/prompt-variable-form.tsx',
        target: 'components/nyxis/prompt-variable-form.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'prompts',
  },
  {
    name: 'metric-card',
    type: 'registry:ui',
    title: 'Metric Card',
    description: 'Single eval metric with delta vs baseline and an optional inline sparkline.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/metric-card.tsx',
        target: 'components/nyxis/metric-card.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'prompts',
  },
  {
    name: 'eval-run-card',
    type: 'registry:ui',
    title: 'Eval Run Card',
    description: 'Eval-run summary — status, prompt, model, dataset, progress, headline metrics.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils', 'metric-card'],
    files: [
      {
        source: 'components/eval-run-card.tsx',
        target: 'components/nyxis/eval-run-card.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'prompts',
  },
  {
    name: 'dataset-table',
    type: 'registry:ui',
    title: 'Dataset Table',
    description:
      'Stacked table for an eval dataset — input / expected / actual / score with bucket filters.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/dataset-table.tsx',
        target: 'components/nyxis/dataset-table.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'prompts',
  },
  {
    name: 'ab-compare',
    type: 'registry:ui',
    title: 'AB Compare',
    description:
      'Side-by-side comparison of two prompts (or two models) with metric deltas and sample outputs.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/ab-compare.tsx',
        target: 'components/nyxis/ab-compare.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'prompts',
  },

  // ── AI Models & Providers ──────────────────────────────────────────
  {
    name: 'ai-provider-selector',
    type: 'registry:ui',
    title: 'AI Provider Selector',
    description: 'Dropdown to pick an AI provider (Anthropic, OpenAI, Google, Mistral, Ollama).',
    dependencies: ['lucide-react', '@radix-ui/react-dropdown-menu', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/ai-provider-selector.tsx',
        target: 'components/nyxis/ai-provider-selector.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-models',
  },
  {
    name: 'model-picker',
    type: 'registry:ui',
    title: 'Model Picker',
    description: 'Models grouped by provider with capability icons, context window, and pricing.',
    dependencies: ['lucide-react', '@radix-ui/react-dropdown-menu', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/model-picker.tsx',
        target: 'components/nyxis/model-picker.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-models',
  },
  {
    name: 'api-key-input',
    type: 'registry:ui',
    title: 'API Key Input',
    description: 'Masked API key input with show/hide toggle and live validation status.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/api-key-input.tsx',
        target: 'components/nyxis/api-key-input.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-models',
  },
  {
    name: 'temperature-slider',
    type: 'registry:ui',
    title: 'Temperature Slider',
    description: 'Sampling temperature slider with deterministic ↔ creative endpoints.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/temperature-slider.tsx',
        target: 'components/nyxis/temperature-slider.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-models',
  },
  {
    name: 'top-p-slider',
    type: 'registry:ui',
    title: 'Top-P Slider',
    description: 'Nucleus sampling slider for top-p configuration.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/top-p-slider.tsx',
        target: 'components/nyxis/top-p-slider.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-models',
  },
  {
    name: 'max-tokens-input',
    type: 'registry:ui',
    title: 'Max Tokens Input',
    description: 'Numeric input that knows the model output cap and warns on overflow.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/max-tokens-input.tsx',
        target: 'components/nyxis/max-tokens-input.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-models',
  },
  {
    name: 'system-prompt-editor',
    type: 'registry:ui',
    title: 'System Prompt Editor',
    description: 'Auto-resizing system prompt editor with variable detection and token estimate.',
    dependencies: ['@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/system-prompt-editor.tsx',
        target: 'components/nyxis/system-prompt-editor.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-models',
  },
  {
    name: 'context-window-meter',
    type: 'registry:ui',
    title: 'Context Window Meter',
    description: 'Bar chart of tokens consumed vs. context window.',
    dependencies: ['@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/context-window-meter.tsx',
        target: 'components/nyxis/context-window-meter.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-models',
  },
  {
    name: 'cost-meter',
    type: 'registry:ui',
    title: 'Cost Meter',
    description: 'Live USD cost meter that subscribes to the AI event bus.',
    dependencies: ['lucide-react', '@nyxis/core'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/cost-meter.tsx',
        target: 'components/nyxis/cost-meter.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-models',
  },
  {
    name: 'provider-health-badge',
    type: 'registry:ui',
    title: 'Provider Health Badge',
    description: 'Operational / degraded / down pill with optional latency.',
    dependencies: ['lucide-react'],
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/provider-health-badge.tsx',
        target: 'components/nyxis/provider-health-badge.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-models',
  },
  {
    name: 'ai-config-card',
    type: 'registry:ui',
    title: 'AI Config Card',
    description: 'Composed configuration card combining provider, model, sampling, and prompt.',
    dependencies: ['@nyxis/core'],
    registryDependencies: [
      'utils',
      'ai-provider-selector',
      'model-picker',
      'api-key-input',
      'temperature-slider',
      'top-p-slider',
      'max-tokens-input',
      'system-prompt-editor',
    ],
    files: [
      {
        source: 'components/ai-config-card.tsx',
        target: 'components/nyxis/ai-config-card.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'ai-models',
  },
] as const;

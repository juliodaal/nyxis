# nyxis-ui

## 0.18.0

### Phase 1B.5 — Theme system only

**BREAKING.** The base UI primitives leave the package. `nyxis-ui` is now a tiny
theme-only package: design tokens, the `<ThemeToggle>` runtime, and the `cn()`
helper. Every component (base or AI-first) is distributed via the shadcn
registry now.

### Removed

- All 22 base UI primitives previously exported here (Button, Input, Textarea,
  Label, Card, Badge, Avatar, Separator, Skeleton, Dialog, Sheet, Drawer,
  Popover, Tooltip, Select, Checkbox, Switch, RadioGroup, Form, Tabs, Accordion,
  Command, Combobox, Toast).
- All Radix UI peer/runtime deps that powered those primitives.
- Form and table runtime deps (`@hookform/resolvers`, `react-hook-form`, `cmdk`,
  `vaul`, `sonner`, `class-variance-authority`, `lucide-react`, `zod`). Each
  migrated to the relevant registry items' `dependencies` array.
- Storybook tooling — the registry source files in `apps/docs/registry/` are the
  new visual reference.

### Kept

- Theme system (`<ThemeToggle>`, `getThemeScript`, design tokens CSS).
- `cn()` helper at `nyxis-ui/utils`.

### Migration

Replace any import of a base UI primitive with the equivalent shadcn install.
Example:

```diff
- import { Button } from 'nyxis-ui';
+ // 1. install Button via the shadcn CLI from the standard registry:
+ //    npx shadcn@latest add button
+ // 2. import from your project:
+ import { Button } from '@/components/ui/button';
```

If you prefer Nyxis's exact baseline of those primitives (instead of shadcn/ui's
official ones), copy the source files from this repo's
`apps/docs/src/components/ui/` directory, which keeps the prior implementations.

The five-mode theme runtime stays where it was:

```ts
import { ThemeToggle, getThemeScript } from 'nyxis-ui/theme';
import { cn } from 'nyxis-ui/utils';
import 'nyxis-ui/styles.css';
```

## 0.17.0

### Phase 1B.4 — AI-first components leave the package

**BREAKING.** Every AI-first component is now distributed exclusively through
the shadcn registry. This package keeps only the theme system and the base UI
primitives that registry components compose on top of.

### Removed

- **All 83 AI-first components** previously exported from this package (chat,
  agents, mcp, multimodal, prompts, rag, skills, reasoning, tools, ai-models,
  ai-animations, domain). Install them with the shadcn CLI instead — see
  migration below.
- All subpath exports for the removed components.
- Dependencies that only powered the AI-first components: `@nyxis/core`,
  `@tanstack/react-table`, `react-markdown`, `remark-gfm`. These move to the
  registry's per-component `dependencies` declarations.

### Kept

- The **theme system** (`<ThemeToggle>`, `getThemeScript`, the five theme
  tokens, design tokens CSS).
- The **22 base UI primitives** (Button, Input, Textarea, Label, Card, Badge,
  Avatar, Separator, Skeleton, Dialog, Sheet, Drawer, Popover, Tooltip, Select,
  Checkbox, Switch, RadioGroup, Form, Tabs, Accordion, Command, Combobox,
  Toast). The future of these is decided in 0.18.0 — they may move to the
  registry too, or stay if they prove useful as a packaged baseline.

### Migration

Replace `from 'nyxis-ui'` (for any AI-first symbol) with the shadcn CLI:

```bash
# Before:
# import { ChatMessage } from 'nyxis-ui';

# After:
npx shadcn@latest add https://nyxis-docs.vercel.app/r/chat-message.json
# then:
import { ChatMessage } from '@/components/nyxis/chat-message';
```

For each registry item the CLI installs source files into your repo (e.g.
`src/components/nyxis/chat-message.tsx`) plus the npm `dependencies` the item
declares. You own the resulting source.

The runtime types and adapter (`AIMessage`, `useChat`, `createModel`, etc.)
continue to live in `@nyxis/core`.

## 0.16.0

### Phase 1B.1 — Extract @nyxis/core

**BREAKING.** The AI runtime has moved to a dedicated package, `@nyxis/core`.
`nyxis-ui` now depends on it internally and no longer exposes those modules from
its own surface.

### Removed

- `nyxis-ui/ai` subpath export. Use `@nyxis/core` instead.
- `nyxis-ui/ai/server` subpath export. Use `@nyxis/core/server` instead.
- AI-SDK peer deps (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai`,
  `@ai-sdk/google`, `@ai-sdk/mistral`, `ollama-ai-provider`). They live on
  `@nyxis/core` now.
- `smoke:providers` script (also moved to `@nyxis/core`).

### Migration

Replace any import of these removed paths with `@nyxis/core`:

```diff
- import { useChat, AIProvider } from 'nyxis-ui/ai';
- import { createChatHandler } from 'nyxis-ui/ai/server';
+ import { useChat, AIProvider } from '@nyxis/core';
+ import { createChatHandler } from '@nyxis/core/server';
```

Then add the new dep:

```bash
pnpm add @nyxis/core
```

### Internal

- Components, stories and tests in `nyxis-ui` now type-import from `@nyxis/core`
  directly. No public surface change beyond the removed subpaths.

## 0.15.0

### Phase 1 — Re-base toward shadcn registry distribution

**BREAKING.** Strategic shift in distribution model. The package now positions
itself as the runtime core (`@nyxis/core`) of a shadcn-style registry.
Components and backend recipes will be copy-paste via
`npx shadcn add @nyxis/<name>` rather than imported from this package.

This release is the cleanup pass:

### Removed

- **GSAP** dependency in full — package, peer dep, optional dep, dev dep,
  external. The kit is for AI products, not animations.
- **`text-animations`** category (10 components): SplitText, TypeWriter,
  ScrambleText, DecryptText, GradientText, ShinyText, CountUp, RevealText,
  MarqueeText, RotatingText.
- **`animations`** category (8 components): MagneticButton, SpotlightCursor,
  ParallaxContainer, StaggerReveal, TiltCard, AuroraBackground,
  DotGridBackground, MeshGradientBackground.
- **`lib/gsap/`** helpers (`use-gsap`, `split`).
- Subpath exports for the above.

### Kept

- **`ai-animations`** (6 components: SparkleField, AIHaloBorder, ThinkingOrb,
  NeuralBackground, TokenStream, GradientAura). These are AI-specific motion
  primitives; canvas / CSS / framer-motion only — no GSAP. Differentiator.
- All AI categories (chat, agents, MCP, RAG, tools, multimodal, prompts,
  reasoning, skills, ai-models).
- Domain patterns.
- The 22 base UI primitives (Button, Card, Form, etc.) — kept here for this
  release; will be removed in **0.16.0** when components migrate to build on top
  of shadcn/ui directly.

### Migration

If you depended on a removed component, copy its source from the git history
(commit before 0.15.0) into your project. None of the removed components had
AI-specific behaviour; equivalent CSS / framer-motion implementations are short.

## 0.14.0

### Phase N — AI Animations

The final motion-primitives pass — AI-specific motion language that the rest of
the library (chat, agents, RAG, skills) can lean on. Six new components, all
GPU-accelerated, all honouring `prefers-reduced-motion`, all dependency-free at
runtime.

### What's new

- **`<SparkleField>`** — twinkling four-point stars at random positions inside a
  container. The "magic AI" affordance — wrap any AI button or generated
  content. Static fallback under reduced motion.
- **`<AIHaloBorder>`** — animated conic-gradient border that orbits around an
  element. Indicates "AI-touched" content. Tunable thickness / radius / speed;
  supports a static-but-still-pretty off-state.
- **`<ThinkingOrb>`** — Siri-style breathing orb with four states (`idle` /
  `thinking` / `speaking` / `errored`) driving distinct animation curves. Pure
  CSS, no canvas.
- **`<NeuralBackground>`** — animated network of nodes and edges drifting across
  a hero. Pure canvas + RAF, with a static snapshot under reduced motion.
  Configurable density, edge radius, speed.
- **`<TokenStream>`** — visual representation of tokens flowing through a
  horizontal lane. Use as a streaming indicator above a chat composer or codegen
  surface.
- **`<GradientAura>`** — soft, rotating conic-gradient glow behind any child.
  Element-scoped. Configurable intensity / speed / colour stops.

### Internal

- All AI-animation components are `'use client';` and zero-dep — no GSAP, no
  Framer Motion. Lightweight enough to ship inline in any edge runtime.

### Subpath exports

```ts
import { SparkleField } from 'nyxis-ui/sparkle-field';
import { ThinkingOrb } from 'nyxis-ui/thinking-orb';
// or umbrella:
import { AIHaloBorder, NeuralBackground } from 'nyxis-ui/ai-animations';
```

### Docs site

New **AI Animations** category at `/ai-animations/<slug>` surfaces all six
primitives with live previews. Sidebar picks it up automatically through the
`CATEGORIES` registry.

## 0.13.0

### Phase M — Skills

Visual surface for the skill ecosystem — packaged capabilities the agent can
invoke (Google Calendar, GitHub, internal Postgres, etc.). Build settings pages,
OAuth flows, and discovery UIs without rebuilding the chrome from scratch.

### What's new

- **`<SkillCard>`** — single skill with icon, name, version, author,
  description, scopes preview, auth pill, and an optional enable toggle. Compact
  and full variants; selection support via `onSelect`.
- **`<SkillPermissions>`** — pill row of required scopes (read / write / admin ×
  resource). Compact icon-only mode and `limit` with `+N` overflow.
- **`<SkillAuthStatus>`** — auth lifecycle card. Five states (`connected` /
  `expired` / `needs-reauth` / `never` / `errored`) drive distinct tones,
  descriptions, and primary actions (Connect / Reconnect / Reauthorise / Retry).
  Compact pill mode for inline display.
- **`<SkillRegistry>`** — installed-skills catalog with search, category
  filters, and per-skill toggles. Composes `<SkillCard>` for each row.
- **`<SkillInvocationLog>`** — vertical timeline of skill calls with status,
  action name, duration, and expandable input / result / error payloads.
- **`<SkillMarketplace>`** — discovery grid with category filters, star ratings,
  install counts, and stateful Install / Installing… / Installed buttons.

### AI core

`nyxis-ui/ai` types extended with `Skill`, `SkillScope`, `SkillScopeKind`,
`SkillAuthState`, `SkillStatus`, `SkillInvocation`, `SkillInvocationStatus`.
Provider-agnostic.

### Subpath exports

```ts
import { SkillCard } from 'nyxis-ui/skill-card';
import { SkillMarketplace } from 'nyxis-ui/skill-marketplace';
// or umbrella:
import { SkillRegistry, SkillInvocationLog } from 'nyxis-ui/skills';
```

### Docs site

New **Skills** category at `/skills/<slug>` surfaces all six components with
live previews. Sidebar picks it up automatically through the `CATEGORIES`
registry.

## 0.12.0

### Phase L — RAG (Retrieval-Augmented Generation)

Visual surface for retrieval pipelines. Build chat surfaces with inline
citations and internal RAG-debugging tools that let you inspect what the
retriever returned, how the reranker reordered it, and how chunks land on the
embedding manifold.

### What's new

- **`<ChunkCard>`** — single retrieved-chunk card with rank, source, locator,
  score (and optional reranker delta with directional arrow), text snippet, and
  an expandable metadata table. Tone buckets at 0.5 / 0.8.
- **`<RetrievalResults>`** — stack of `<ChunkCard>` rows for one query. Header
  shows the query and result count; in-set search filter and a score-threshold
  slider.
- **`<VectorSearchInput>`** — query input with `topK` slider,
  similarity-threshold slider, and reranker toggle. Submits the full retrieval
  options through `onSubmit`.
- **`<DocumentChunker>`** — renders the source document with chunk boundaries
  highlighted (alternating tones, per-chunk index badge, hover/click selection).
  Stats header surfaces avg / min / max chunk size.
- **`<EmbeddingScatter>`** — pure-SVG 2D scatter for UMAP / t-SNE / PCA
  projections. Points coloured by `group`; hover tooltips with label; legend
  strip below.
- **`<RAGPipeline>`** — connected stage chips (embed → retrieve → rerank →
  generate) with status icons, durations, counts, and error details. Horizontal
  and vertical layouts.

### AI core

`nyxis-ui/ai` types extended with `RetrievedChunk`, `EmbeddingPoint`,
`RAGStageStatus`, `RAGStage`. Provider-agnostic.

### Subpath exports

```ts
import { ChunkCard } from 'nyxis-ui/chunk-card';
import { RAGPipeline } from 'nyxis-ui/rag-pipeline';
// or umbrella:
import { RetrievalResults, EmbeddingScatter } from 'nyxis-ui/rag';
```

### Docs site

New **RAG** category at `/rag/<slug>` surfaces all six components with live
previews. Sidebar picks it up automatically through the `CATEGORIES` registry.

## 0.11.0

### Phase K — Prompts / Eval

Visual surface for prompt engineering and offline evaluation. Build internal
tooling that lets your team save prompts, fill in `{{variables}}`, run them
against golden datasets, and compare versions side-by-side.

### What's new

- **`<PromptCard>`** — saved-prompt card with name, description, version, model,
  variable count, tags, and last-modified relative time. Compact and full
  variants; selection support.
- **`<PromptVariableForm>`** — auto-extracts `{{variables}}` from a template
  body and renders an input per variable (`<input>` for short values,
  `<textarea>` for longer ones). Live `preview` mode shows the rendered
  template.
- **`<MetricCard>`** — single metric with current value, delta vs baseline (tone
  driven by `goodDirection`), and optional inline SVG sparkline. Compact variant
  for dense grids.
- **`<EvalRunCard>`** — eval-run summary with status pill, prompt / model /
  dataset, progress bar (when running), inline metric strip, and error banner.
  Composes `<MetricCard>` for the headline metrics.
- **`<DatasetTable>`** — stacked table for an eval dataset run. Input → expected
  → actual → score columns with low/mid/high score buckets; click to expand each
  row's full text.
- **`<ABCompare>`** — side-by-side comparison of two prompts (or two models).
  Matched metrics with delta arrows showing which side won each one, plus
  optional sample outputs. Configurable baseline side.

### AI core

`nyxis-ui/ai` types extended with `Prompt`, `EvalRunStatus`, `EvalMetric`,
`EvalRun`, `EvalRow`. Provider-agnostic.

### Subpath exports

```ts
import { EvalRunCard } from 'nyxis-ui/eval-run-card';
import { ABCompare } from 'nyxis-ui/ab-compare';
// or umbrella:
import { PromptCard, MetricCard } from 'nyxis-ui/prompts';
```

### Docs site

New **Prompts / Eval** category at `/prompts/<slug>` surfaces all six components
with live previews. Sidebar picks it up automatically through the `CATEGORIES`
registry.

## 0.10.0

### Phase J — Multimodal

Visual surface for media exchanged with the model — images, audio, voice,
transcripts, and vision input. Build chat surfaces that let users send
screenshots, listen to TTS replies, or watch transcribed calls in real time.

### What's new

- **`<ImageMessage>`** — image bubble for chat replies. Handles loading,
  generation progress (with optional partial preview), errors, and a "ready"
  state with download + click-to-zoom. Pairs with any image-output model
  (DALL-E, Imagen, Stable Diffusion, etc.).
- **`<ImageGallery>`** — responsive grid of images with built-in lightbox:
  keyboard navigation, prev/next, download, dimensions. Configurable column
  count.
- **`<VoiceWaveform>`** — bar-based waveform that supports three modes: live
  recording (jittery, destructive tone), playback (progress fill in primary
  tone), and idle. Pre-computed amplitudes optional.
- **`<AudioPlayer>`** — compact player for TTS / transcribed audio. Play / pause
  / seek / mute / cycle speed (0.75x–2x) / download. Composes `<VoiceWaveform>`
  for the visual track.
- **`<TranscriptionView>`** — time-anchored transcript with the active segment
  highlighted and auto-scrolled into view. Click segments to seek; speaker
  labels and low-confidence flags.
- **`<VisionInput>`** — dropzone tuned for vision-capable models. Accepts
  drag-and-drop, file picker, paste (Cmd/Ctrl+V), and optional camera capture.
  Validates MIME type and size.

### AI core

`nyxis-ui/ai` types extended with `MediaKind`, `MediaGenerationStatus`,
`MediaAttachment`, `TranscriptSegment`. Provider-agnostic.

### Subpath exports

```ts
import { ImageGallery } from 'nyxis-ui/image-gallery';
import { AudioPlayer } from 'nyxis-ui/audio-player';
// or umbrella:
import { VisionInput, TranscriptionView } from 'nyxis-ui/multimodal';
```

### Docs site

New **Multimodal** category at `/multimodal/<slug>` surfaces all six components
with live previews. Sidebar picks it up automatically through the `CATEGORIES`
registry.

## 0.9.0

### Phase I — Agents

Visual surface for **multi-agent systems**: status, individual agent cards, team
rosters, activity timelines, handoffs between agents, and hierarchical task
delegation. Render-only — works with any orchestrator (LangGraph, Mastra,
Inngest, OpenAI Swarm, custom).

### What's new

- **`<AgentStatusBadge>`** — pill describing an agent's lifecycle (`idle` /
  `thinking` / `working` / `blocked` / `done` / `errored`) with the appropriate
  icon and animated indicator (spin while working, pulse while thinking).
- **`<AgentCard>`** — single-agent card with avatar / initials, name, role,
  model, status, and the tools available to it. Compact and full variants;
  selection support via `onSelect`.
- **`<AgentRoster>`** — multi-agent team view with search, status filters, and
  list/grid layouts. Renders `<AgentCard>` per row with selection.
- **`<AgentActivityFeed>`** — vertical timeline of agent activity: thoughts,
  actions, tool calls, messages, handoffs, errors. Each kind gets its own icon
  and tone; payloads expand inline.
- **`<AgentHandoff>`** — card visualising a handoff between two agents
  (`from → to`) with the stated reason and a `pending` / `accepted` / `rejected`
  lifecycle.
- **`<TaskDelegation>`** — hierarchical task tree with per-node status icons
  (`pending` / `in-progress` / `blocked` / `done` / `errored`), assigned-agent
  chips (`@AgentName`), and an optional progress bar per node.

### AI core

`nyxis-ui/ai` types extended with `Agent`, `AgentStatus`, `AgentActivity`,
`AgentActivityKind`, `HandoffEvent`, `DelegatedTask`, `DelegatedTaskStatus`.
Provider-agnostic, pairs with any agent runtime.

### Subpath exports

```ts
import { AgentRoster } from 'nyxis-ui/agent-roster';
import { TaskDelegation } from 'nyxis-ui/task-delegation';
// or umbrella:
import { AgentCard, AgentActivityFeed } from 'nyxis-ui/agents';
```

### Docs site

New **Agents** category at `/agents/<slug>` surfaces all six components with
live previews. Sidebar picks it up automatically through the `CATEGORIES`
registry.

## 0.8.0

### Phase H — Model Context Protocol (MCP)

Visual surface for the **Model Context Protocol** — Anthropic's open standard
for connecting models to external tools, resources, and prompt libraries via
servers (stdio, SSE, WebSocket, HTTP). Render-only components: they don't
dictate transport, so any MCP client can drive them.

### What's new

- **`<MCPServerCard>`** — single-server card with title, transport pill,
  endpoint, version, latency, capability badges, and inline connect / disconnect
  / remove actions. Error state shows the failure message.
- **`<MCPServerList>`** — multi-server view with search, "Add server"
  affordance, and per-server lifecycle handlers. Surfaces a connected/total
  counter at the top.
- **`<MCPCapabilityBadge>`** — pill per capability (`tools`, `prompts`,
  `resources`, `sampling`, `roots`, `logging`) with canonical icons. Compact
  variant for dense rows.
- **`<MCPConnectionStatus>`** — inline pill describing the connection lifecycle
  (`disconnected` / `connecting` / `connected` / `error`) with optional latency
  readout. Animated pulse when connected, spinner while connecting.
- **`<MCPResourceBrowser>`** — searchable list of resources exposed by servers,
  optionally grouped by URI scheme (`file://`, `db://`, `https://`), with
  mime-type icons.
- **`<MCPPromptLibrary>`** — catalog of prompt templates with collapsible
  argument lists. Required args get a red asterisk; click to dispatch.
- **`<MCPLogStream>`** — real-time JSON-RPC traffic viewer. Direction badges
  (`in` / `out` / `event`), expandable JSON payloads, optional `limit` with
  `+N more` footer, log-level pills for `notifications/message`.

### AI core

`nyxis-ui/ai` gains the MCP type vocabulary: `MCPServer`, `MCPResource`,
`MCPPrompt`, `MCPLogEntry`, `MCPCapability`, `MCPTransport`,
`MCPConnectionState`, `MCPLogDirection`. Provider-agnostic and spec-aligned.

### Subpath exports

```ts
import { MCPServerCard } from 'nyxis-ui/mcp-server-card';
import { MCPLogStream } from 'nyxis-ui/mcp-log-stream';
// or umbrella:
import { MCPServerList, MCPResourceBrowser } from 'nyxis-ui/mcp';
```

### Docs site

New **MCP** category at `/mcp/<slug>` surfaces all seven components with live
previews. Sidebar picks it up automatically through the `CATEGORIES` registry.

## 0.7.0

### Phase F + Phase G — Reasoning & Tool Calling

Two complete component sets land in one release: surfaces for the model's
_internal state_ (Phase F) and for the _tools it invokes_ (Phase G). Plus the
final scaffolding for Phase E in the docs site (chat category, 9 demos, 9 MDX
stubs, dynamic route).

### What's new — Phase F (Reasoning)

- **`<ReasoningTrace>`** — collapsible disclosure card for extended-thinking
  output. Streams in real time and shows duration when complete. Pair with any
  reasoning-capable model (Anthropic extended thinking, OpenAI o1, etc.).
- **`<ChainOfThought>`** — vertical stepper for explicit, structured reasoning
  steps (`pending` / `active` / `done` / `errored`). Ideal when the model
  exposes its plan as discrete operations.
- **`<ThinkingIndicator>`** — distinct from `<TypingIndicator>`, this signals
  the model is _working_ (extended thinking, tool dispatch) before any tokens
  emit. Three variants: `shimmer`, `pulse`, `orbit`.

### What's new — Phase G (Tools / Function Calling)

- **`<ToolCall>`** — card for a single tool invocation. Status drives the icon
  and colour (`pending` / `running` / `completed` / `errored`); args block
  expands inline with a JSON view.
- **`<ToolResult>`** — output viewer that auto-detects JSON, plain text,
  markdown, and image URLs. Copy-to-clipboard, optional truncation, distinct
  destructive variant for errors.
- **`<ParameterForm>`** — schema-driven form for tool parameters. Native
  rendering for `string` / `number` / `boolean` / `enum` / `string[]` / `json`.
  Use to let users tweak args before dispatching a proposed tool call.
- **`<ToolRegistry>`** — searchable, groupable catalog of tools the assistant
  can use, with per-tool toggle switches. Pair with `useToolExecutor`.
- **`<ToolExecutionLog>`** — timeline of past tool calls. Composes
  `<ToolCall>` + `<ToolResult>` per row with timestamps; `limit` collapses long
  histories with a `+N more` footer.

### Subpath exports

Every Phase E / F / G component now ships with a dedicated subpath for strict
tree-shaking:

```ts
import { ChatThread } from 'nyxis-ui/chat-thread';
import { ReasoningTrace } from 'nyxis-ui/reasoning-trace';
import { ToolCall } from 'nyxis-ui/tool-call';
```

Umbrellas (`nyxis-ui/chat`, `nyxis-ui/reasoning`, `nyxis-ui/tools`) export the
whole set per phase.

### Docs site

- New **Chat** category surfaces all nine Phase E components with live previews
  and MDX docs at `/chat/<slug>`.
- Phase F lands as **Reasoning** (3 entries) and Phase G as **Tools** (5
  entries) — all wired into the sidebar via `CATEGORIES` and the search index
  automatically.

## 0.5.0

### Phase E — Chat 2.0

Streaming-first conversation UI built on top of `nyxis-ui/ai`. Nine new
primitives plus a major polish-and-feature pass on the two existing chat
components.

### What's new

- **`<ChatThread>`** — scrollable conversation surface with auto-scroll while at
  the bottom and a "scroll to latest" floating button.
- **`<StreamingText>`** — incremental plain-text renderer with blinking cursor.
- **`<StreamingMarkdown>`** — full markdown via `react-markdown` + `remark-gfm`,
  with custom renderers tied to theme tokens. Fenced code blocks render through
  `<StreamingCode>` automatically.
- **`<StreamingCode>`** — code block with language badge, optional filename
  header, copy-to-clipboard button, and trailing cursor while streaming.
- **`<TypingIndicator>`** — three-dot bouncer; subtle and bubble variants.
- **`<MessageActions>`** — hover-revealed row of buttons (copy, regenerate,
  edit, delete, fork, share) with `ghost` and `panel` variants.
- **`<TokenCounter>`** — live token estimate + optional context-window bar; tone
  shifts at 70% / 90%.
- **`<ConversationSidebar>`** — left-rail conversation list with search, pinned
  items, unread counts.
- **`<ConversationFork>`** — tree visualisation for branched conversations
  (regenerations and edits).

### Refactored

- **`<ChatMessage>` v2** — adds `markdown`, `toolCalls`, `citations`, and
  `actions` props. Backwards compatible: existing v1 usage keeps working.
- **`<ChatInput>` v2** — adds `slashCommands` with auto-suggest, controlled
  `attachedFiles` with preview pills, voice button, and a `trailingSlot` for
  inline meta (e.g. `<TokenCounter>`).

### Peer deps (optional)

`react-markdown` and `remark-gfm` — only loaded when consumers actually use
`<StreamingMarkdown>` or any component that composes it.

### Subpath exports

Every chat component ships with its own subpath: `nyxis-ui/chat-thread`,
`nyxis-ui/streaming-markdown`, etc. The umbrella `nyxis-ui/chat` exports the
whole set.

### Internal

- Build heap raised to 12 GB (`NODE_OPTIONS=--max-old-space-size=12288`) — DTS
  emission with ~80 entries needed the room.

## 0.4.0

### Phase D — Models & Providers UI

Eleven visual primitives that make AI configuration a five-minute job instead of
a two-day one. Every component is hooked up to the Phase C core (`nyxis-ui/ai`)
so there is a single source of truth across the app.

### What's new

- **`<AIProviderSelector>`** — dropdown listing every provider in the curated
  catalog. Local providers (Ollama) get a "local" badge.
- **`<ModelPicker>`** — models grouped by provider with capability icons
  (vision, tools, audio, reasoning, JSON-mode), context window, pricing, and
  `preview` / `deprecated` status badges. Filter by required capabilities.
- **`<APIKeyInput>`** — masked input with show/hide toggle, async validator, and
  four explicit states (idle, validating, valid, invalid, rate-limited).
  Provider-aware placeholders.
- **`<TemperatureSlider>`** — semantic endpoints (deterministic ↔ creative).
  Defaults to 0–1; supports OpenAI's 0–2 range.
- **`<TopPSlider>`** — nucleus sampling with a hint reminding users to prefer it
  _over_ temperature.
- **`<MaxTokensInput>`** — model-aware: knows each model's `maxOutput` and warns
  visually when the value exceeds it.
- **`<SystemPromptEditor>`** — auto-resizing editor that auto-detects
  `{{variables}}` and shows a live token estimate.
- **`<ContextWindowMeter>`** — bar chart with three tones (safe / warn / crit).
  Compact and full variants.
- **`<CostMeter>`** — live USD meter that subscribes to `nyxisAIEvents` `usage`
  events. Shows accumulated cost + token breakdown.
- **`<ProviderHealthBadge>`** — operational / degraded / down / unknown pill
  with optional latency.
- **`<AIConfigCard>`** — composed configuration panel combining all of the
  above. Drop-in for any "AI settings" page.

### Subpath exports

Every component ships with its own subpath for stricter tree-shaking:
`nyxis-ui/ai-config-card`, `nyxis-ui/model-picker`, etc. The umbrella
`nyxis-ui/ai/components` exports the whole set.

### Internal

- New `_slider-base.tsx` internal primitive shared by Temperature and Top-P
  sliders. Native range input styled with Tailwind, no extra deps.
- Registry adds the `ai-models` category and wires `/ai-models/*` routes in the
  docs site.

## 0.3.0

### Phase C — `nyxis-ui/ai` core landing

The library now ships **a provider-agnostic AI integration layer**. Drop in
`<AIProvider>`, configure your endpoint, and a single `useChat` hook wires up
streaming chat with tool calls, citations, and usage tracking against any AI SDK
provider (Anthropic, OpenAI, Google, Mistral, Ollama).

### What's new

- **New subpath** `nyxis-ui/ai` exporting:
  - `<AIProvider>` — context provider with persistent provider/model selection,
    tool registry, and per-instance API endpoint config.
  - `useAI()` — read the current AI configuration.
  - `useChat()` — streaming chat with tool calls, citations, usage. Wraps the
    Vercel AI SDK Stream Protocol so any compatible server endpoint just works.
  - `useCompletion()` — single-shot streaming text.
  - `useTokenCount()` — fast token estimate (replaceable with provider
    tokenizers later).
  - `useToolExecutor()` — register client-side tools the assistant can call.
- **New subpath** `nyxis-ui/ai/server` exporting:
  - `createChatHandler()` — drop-in `Request → Response` for Next.js App Router,
    Remix, Astro endpoints, Hono, Bun. Wires `streamText` from the Vercel AI SDK
    to any provider.
  - `createCompletionHandler()` — same but for single-shot prompts.
  - `createModel()` — lazy provider loader. Only the SDK packages you actually
    use end up in your bundle.
- **Provider catalog** with curated models, capabilities, pricing, and context
  windows for Anthropic, OpenAI, Google, Mistral, and Ollama — used by upcoming
  Phase D UI (model picker, provider selector).
- **Event bus** `nyxisAIEvents`: streaming events, tool registrations, provider
  switches, and session usage broadcast across disconnected Astro islands
  without prop drilling.
- **Type vocabulary**: `AIMessage`, `AIToolCall`, `AICitation`, `AIUsage`,
  `AIModel`, `AIProviderId`, `AIStreamEvent`, `AITool` — shared across every
  component and hook.

### Peer dependencies (all optional)

`ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/google`,
`@ai-sdk/mistral`, `ollama-ai-provider`. Install only the providers you ship.

## 0.2.0

### Repositioning: AI-first component library

- **Scope pivot**: Nyxis is now positioned as the React component library for AI
  products in general, not as a private toolkit for any specific portfolio. All
  references to private SaaS products have been removed from public surfaces
  (landing, docs, registry metadata, demo data, JSDoc).
- **Landing**: removed the "Built for AI products" services showcase that pinned
  the library to seven specific apps.
- **Categories**: "Domain patterns" → "AI patterns", with descriptions framed in
  AI vocabulary.
- **Demo data**: replaced product-named placeholders with neutral terms like
  "Document AI", "AI Assistant", "Lead Intelligence".
- **Version chip**: the topbar and hero now read the version straight from
  `nyxis-ui/package.json` so future bumps propagate automatically.

### Internal

- New `scripts/scrub-saas-refs.mjs` keeps the codebase neutral if any product
  names slip back in. Idempotent.
- Generator (`apps/docs/scripts/generate-stubs.mjs`) no longer emits a `saas`
  frontmatter block; the corresponding zod field was removed from the content
  schema.
- Registry's `RegistryEntry` type drops the `saasContext` field.

## 0.1.0

Internal release tagged with the original 54-component scope. Never published to
npm — superseded by 0.2.0.

## 0.0.0

Initial scaffold (unpublished).

# nyxis-ui

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

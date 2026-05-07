# @nyxis/core

## 0.1.0

Initial release. Extracted from `nyxis-ui` (≤ 0.15.0) where these modules lived
under `nyxis-ui/ai`. The split lets components and backend recipes (copy-paste
via `npx shadcn add @nyxis/<name>`) share types and the adapter from a single
tiny npm package.

### What's inside

- **Types** — `AIMessage`, `AIToolCall`, `AICitation`, `AIProviderId`,
  `AIStreamEvent`, plus domain types for chat, agents, RAG, MCP, multimodal,
  prompts, skills.
- **Provider adapter** — `createModel` with lazy-loaded SDKs for Anthropic,
  OpenAI, Google, Mistral, Ollama. Provider registry is open for extension.
- **Event bus** — `nyxisAIEvents` for token / cost / usage telemetry.
- **React hooks** — `useAI`, `useChat`, `useCompletion`, `useTokenCount`,
  `useToolExecutor`.
- **Server helpers** — `createChatHandler` available from `@nyxis/core/server`.

### Relation to `nyxis-ui`

`nyxis-ui` ≥ 0.16.0 will depend on `@nyxis/core` for its shared types and
adapter. Subpaths `nyxis-ui/ai` and `nyxis-ui/ai/server` have been removed;
import from `@nyxis/core` instead.

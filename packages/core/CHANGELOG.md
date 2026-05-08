# @nyxis/core

## 0.2.0

### Phase 3 — Custom-provider API

Adds a public registry so consumers can plug in any AI provider at runtime
without forking Nyxis. Built-in providers (Anthropic, OpenAI, Google, Mistral,
Ollama) self-register on import and behave exactly as before; new providers
(Cohere, Groq, Together, AWS Bedrock, internal proxies, OpenAI-compatible
gateways) register through a one-line `registerProvider` call.

### What's new

```ts
import { registerProvider, createModel } from '@nyxis/core';
import { createCohere } from '@ai-sdk/cohere';

registerProvider('cohere', {
  loadModel: ({ apiKey, model }) => createCohere({ apiKey })(model),
});

const model = await createModel({
  provider: 'cohere',
  model: 'command-r-plus',
});
```

New exports:

- `registerProvider(id, { loadModel, label?, docsUrl? })` — add or replace a
  provider adapter.
- `unregisterProvider(id)` — remove a registration.
- `getRegisteredProvider(id)` — read a registration without invoking it.
- `listProviders()` — list every registered id, built-ins included.
- `resetProviderRegistry()` — wipe and re-register the built-ins (useful between
  tests).
- `BUILT_IN_PROVIDER_IDS` — the static tuple of the five built-ins.
- `type ProviderRegistration`.
- `type BuiltInAIProviderId`.

### Type changes (mildly breaking)

- `AIProviderId` is now `BuiltInAIProviderId | (string & {})`. Built-in ids
  still autocomplete; arbitrary strings compile without complaint so
  custom-provider slugs (`'cohere'`, `'groq'`, etc.) just work.
- The legacy `'custom'` provider was a placeholder that threw at runtime; it's
  gone now. Migration: replace `provider: 'custom'` with
  `registerProvider('your-id', { loadModel })` and call
  `createModel({ provider: 'your-id', model })`.
- `getProviderInfo(id)` now returns `ProviderInfo | undefined` (was
  `ProviderInfo`) — the lookup is no longer guaranteed to hit a built-in.
  Existing call sites that index built-in ids only need a `!` if they want the
  old shape.

### Internals

- `createModel` now consults the registry instead of a hardcoded switch. The
  "module not installed" hint still fires when the relevant `@ai-sdk/<provider>`
  peer dep is missing.
- 9 new tests in `provider-registry.test.ts` cover registration, cascading
  replace, error rewriting, and reset.

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

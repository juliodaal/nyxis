# @nyxis/core

[![License: MIT](https://img.shields.io/badge/License-MIT-A855F7.svg)](https://github.com/juliodaal/nyxis/blob/main/LICENSE)

The runtime core of [Nyxis](https://nyxis.vercel.app) — a toolkit for building
AI products. This package holds the shared types, the `createModel` provider
adapter, and the event bus consumed by both the frontend components (copy-paste
via `npx shadcn add @nyxis/<name>`) and the backend recipes.

This package alone does not give you UI. Pair it with the registry:

```bash
# Add a component (lands as editable source in your repo)
npx shadcn add @nyxis/chat-message

# Add a backend recipe (lands as editable source in your repo)
npx shadcn add @nyxis/api-chat
```

→ [Documentation](https://nyxis.vercel.app) ·
[Storybook](https://nyxis-storybook.vercel.app)

## Install

```bash
pnpm add @nyxis/core
```

## What's inside

- **Types** — `AIMessage`, `AIToolCall`, `AICitation`, `AIProviderId`, etc.
- **`createModel`** — provider-agnostic adapter (Anthropic, OpenAI, Google,
  Mistral, Ollama out of the box; extensible).
- **Event bus** — token streaming, cost tracking, usage events.
- **Hooks** — `useChat`, `useAIStream`, `useToolExecutor`.

## Why a separate package?

Components and backend recipes that you `shadcn add` need a stable place to
import shared types and the provider adapter from. Without a versioned core,
registry items would drift apart. `@nyxis/core` is intentionally tiny — no UI,
no CSS, no Tailwind.

## License

[MIT](https://github.com/juliodaal/nyxis/blob/main/LICENSE) © Julio César Daal

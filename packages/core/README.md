# @nyxis/core

[![License: MIT](https://img.shields.io/badge/License-MIT-A855F7.svg)](https://github.com/juliodaal/nyxis/blob/main/LICENSE)

The runtime core of [Nyxis](https://nyxisai.vercel.app) — a toolkit for building
AI products. Tiny by design: shared types, the `createModel` provider adapter,
an event bus, and a handful of React hooks.

This package is the only thing the rest of Nyxis (the frontend components and
backend recipes you copy-paste with `npx shadcn add`) imports from. There is no
UI here, no CSS, no Tailwind.

## Install

```bash
pnpm add @nyxis/core
```

## What's inside

- **Types** — `AIMessage`, `AIToolCall`, `AICitation`, `AIProviderId`, plus
  domain types for chat, agents, RAG, MCP, multimodal, prompts, skills.
- **`createModel`** — provider-agnostic adapter. Anthropic, OpenAI, Google,
  Mistral, Ollama out of the box; extensible via the registry.
- **Event bus** — `nyxisAIEvents` for token streaming, cost tracking, and usage
  telemetry.
- **Hooks** — `useAI`, `useChat`, `useCompletion`, `useTokenCount`,
  `useToolExecutor`.
- **Server helpers** — `createChatHandler` for `Request → Response` streaming
  endpoints, available from `@nyxis/core/server`.

## Pair with the registry

```bash
# Add a UI component (lands as editable source in your repo)
npx shadcn add @nyxis/chat-message

# Add a backend recipe (lands as editable source in your repo)
npx shadcn add @nyxis/api-chat
```

Components and recipes import shared types and the adapter from `@nyxis/core`.
They are otherwise yours to edit freely.

## License

[MIT](https://github.com/juliodaal/nyxis/blob/main/LICENSE) © Julio César Daal

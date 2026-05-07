<div align="center">

# Nyxis

**The component toolkit for AI products.**

Built on top of [shadcn/ui](https://ui.shadcn.com). Distributed as a
shadcn-style registry: every component and every backend recipe is copy-paste
source code that lands in your repo and is yours to edit.

[![License: MIT](https://img.shields.io/badge/License-MIT-A855F7.svg)](./LICENSE)
[![CI](https://github.com/juliodaal/nyxis/actions/workflows/ci.yml/badge.svg)](https://github.com/juliodaal/nyxis/actions/workflows/ci.yml)

[Documentation](https://nyxis.vercel.app) ·
[Storybook](https://nyxis-storybook.vercel.app) · [Changelog](./CHANGELOG.md)

</div>

---

## What is Nyxis

Nyxis is a kit for building AI products — chat, agents, RAG, MCP, tools,
multimodal, prompt tooling, evaluation. It distributes through three layers,
none subordinate to the others:

1. **`@nyxis/core`** — the only npm package. Tiny. Holds shared types, the
   provider adapter, the event bus.
2. **Frontend registry** — `npx shadcn add @nyxis/<component>`. UI you own,
   edit, modify.
3. **Backend registry** — `npx shadcn add @nyxis/<recipe>`. Route handlers,
   server helpers, schemas. Same model — source you own.

You can install only the backend, only the frontend, or both. Future: an MCP
server exposes the catalog to Claude Code, Cursor, and Windsurf so the assistant
can scaffold AI apps from prompts.

## Quick start

```bash
# 1. The runtime core
pnpm add @nyxis/core

# 2. Add a frontend component
npx shadcn add @nyxis/chat-message

# 3. Add a backend recipe
npx shadcn add @nyxis/api-chat
```

```tsx
'use client';
import { ChatMessage } from '@/components/nyxis/chat-message';
import { useChat } from '@nyxis/core';

export function Chat() {
  const { messages, append } = useChat({ api: '/api/chat' });
  return messages.map((m) => (
    <ChatMessage key={m.id} role={m.role}>
      {m.content}
    </ChatMessage>
  ));
}
```

## Why this model

- **Owning the code beats theming systems.** When `npx shadcn add` puts a file
  in your repo, you change the markup, the Tailwind classes, the variants. There
  is nothing to fight.
- **Built on shadcn/ui.** We do not duplicate base UI (Button, Card, Form,
  etc.). The shadcn CLI auto-installs them as needed.
- **Provider-agnostic.** Anthropic, OpenAI, Google, Mistral, Ollama out of the
  box. Add your own with a single file.
- **Engine-hidden.** Vercel AI SDK lives inside `@nyxis/core` as an
  implementation detail. The public API doesn't expose it, so we can swap
  engines later without breaking consumers.

## Roadmap

- **Phase 1** — re-base to shadcn registry model, build on top of shadcn/ui.
- **Phase 2** — backend recipes (chat, tools, RAG, evaluation).
- **Phase 3** — extensible provider system with public API.
- **Phase 4** — MCP server for IDE assistants (Claude Code, Cursor, Windsurf).
- **Phase 5+** — registries for Vue, Svelte, Angular, Astro, FastAPI.

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup and the component
authoring checklist.

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability disclosure and our hardening
baseline.

## Acknowledgements

Built on the work of [shadcn/ui](https://ui.shadcn.com),
[Radix UI](https://www.radix-ui.com), [Tailwind CSS](https://tailwindcss.com),
and the [Vercel AI SDK](https://sdk.vercel.ai).

## License

[MIT](./LICENSE) © Julio César Daal

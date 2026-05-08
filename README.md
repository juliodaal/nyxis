<div align="center">

# Nyxis

**The component toolkit for AI products.**

Built on top of [shadcn/ui](https://ui.shadcn.com). Distributed as a
shadcn-style registry: every component is copy-paste source code that lands in
your repo and is yours to edit. Tiny `@nyxis/core` runtime holds the shared
types, provider adapter, and React hooks.

[![License: MIT](https://img.shields.io/badge/License-MIT-A855F7.svg)](./LICENSE)
[![CI](https://github.com/juliodaal/nyxis/actions/workflows/ci.yml/badge.svg)](https://github.com/juliodaal/nyxis/actions/workflows/ci.yml)

[Documentation](https://nyxisai.vercel.app) ·
[Changelog](./packages/ui/CHANGELOG.md)

</div>

---

## Quick start

```bash
# 1. Bootstrap your project with shadcn (creates components.json, lib/utils.ts, etc.)
npx shadcn@latest init

# 2. Install the AI runtime
pnpm add @nyxis/core

# 3. Install the theme system (optional — required only if you want the
#    five-mode theme runtime; you can stick with shadcn's default theming)
pnpm add nyxis-ui

# 4. Add components from the catalog
npx shadcn@latest add https://nyxisai.vercel.app/r/chat-message.json
npx shadcn@latest add https://nyxisai.vercel.app/r/agent-roster.json
npx shadcn@latest add https://nyxisai.vercel.app/r/rag-pipeline.json

# Or — let your AI assistant install for you. Add to ~/.claude.json,
# ~/.cursor/mcp.json, or your editor's equivalent:
# {
#   "mcpServers": {
#     "nyxis": { "command": "npx", "args": ["-y", "@nyxis/mcp-server"] }
#   }
# }
```

```tsx
'use client';

import { ChatMessage } from '@/components/nyxis/chat-message';
import { useChat } from '@nyxis/core';

export function Chat() {
  const { messages } = useChat({ api: '/api/chat' });
  return messages.map((m) => (
    <ChatMessage key={m.id} role={m.role}>
      {m.content}
    </ChatMessage>
  ));
}
```

## Architecture

Four layers, none subordinate to the others:

| Layer                   | Distributed as    | What's inside                                                                                                                                                                            |
| ----------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`@nyxis/core`**       | npm package       | Types (`AIMessage`, `AIToolCall`, ...), provider adapter (`createModel`), event bus, hooks (`useChat`, `useToolExecutor`), server helpers (`createChatHandler`).                         |
| **`nyxis-ui`**          | npm package       | Five-mode theme runtime (`getThemeScript`), design tokens stylesheet, `cn()` helper.                                                                                                     |
| **Registry**            | `npx shadcn add`  | 84+ AI-first components + 4 backend recipes (chat, completion, tools, RAG). Source you own.                                                                                              |
| **`@nyxis/mcp-server`** | npm package (CLI) | MCP server that exposes the registry to Claude Code, Cursor, Windsurf, and any MCP-aware assistant — so the assistant can search, read, and install components without leaving the chat. |

You can install only the runtime, only the theme, only some components, or
everything. The shadcn CLI resolves cascading dependencies automatically; the
MCP server delegates installs back to that same CLI.

## Why this model

- **Owning the code beats theming systems.** When `npx shadcn add` puts a file
  in your repo, you change the markup, the Tailwind classes, the variants —
  there is nothing to fight.
- **Built on shadcn/ui.** Base UI primitives (Button, Card, Form, etc.) come
  from shadcn directly. Nyxis adds the AI-specific layer on top.
- **Provider-agnostic.** Anthropic, OpenAI, Google, Mistral, Ollama out of the
  box; add your own with a single file.
- **Engine-hidden.** Vercel AI SDK lives inside `@nyxis/core` as an
  implementation detail. The public API doesn't expose it, so the engine can be
  swapped later without breaking consumers.

## Roadmap

- **Phase 1 — Frontend registry.** **Done.** 84+ components live.
- **Phase 2 — Backend recipes.** **Done.** chat / completion / tools / RAG route
  handlers for Next.js App Router.
- **Phase 4 — MCP server.** **Done.** `@nyxis/mcp-server` exposes the registry
  to Claude Code, Cursor, Windsurf with four tools (`list`, `search`, `get`,
  `install`).
- **Phase 2.5 — Recipes for Astro / Hono / Express / Sveltekit.** Planned.
- **Phase 3 — Public API for custom providers.** Planned.
- **Phase 5+ — Multi-framework registries.** Vue, Svelte, Angular, Astro,
  Python/FastAPI. Planned.

## Repository layout

```
nyxis/
├── packages/
│   ├── core/             → @nyxis/core (npm — types, adapter, hooks)
│   ├── ui/               → nyxis-ui (npm — theme runtime + cn)
│   └── mcp-server/       → @nyxis/mcp-server (npm, CLI bin: nyxis-mcp)
├── apps/
│   └── docs/             → Astro docs site + registry endpoints
│       ├── registry/     → Source files served by /r/<name>.json
│       └── src/
│           ├── components/ui/  → shadcn-style base UI for the docs
│           └── lib/utils.ts    → cn() helper
└── ...
```

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup, conventions, and the
registry-item authoring checklist.

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability disclosure and our hardening
baseline.

## Acknowledgements

Built on the work of [shadcn/ui](https://ui.shadcn.com),
[Radix UI](https://www.radix-ui.com), [Tailwind CSS](https://tailwindcss.com),
[Vercel AI SDK](https://sdk.vercel.ai), and [lucide-react](https://lucide.dev).

## License

[MIT](./LICENSE) © Julio César Daal

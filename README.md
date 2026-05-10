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
# Scaffold a new project with the CLI — picks the framework, runs
# shadcn init, optionally installs nyxis-ui and your first components.
npm create nyxis@latest my-app
```

Or do it by hand on an existing project:

```bash
# 1. Bootstrap your project with shadcn (creates components.json, lib/utils.ts, etc.)
npx shadcn@latest init

# 2. Install your first component — @nyxis/core comes along automatically
npx shadcn@latest add https://nyxisai.vercel.app/r/chat-thread.json

# 3. (Optional) the theme system — five-mode runtime + brand color tokens
pnpm add nyxis-ui

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

Five layers, none subordinate to the others:

| Layer                   | Distributed as    | What's inside                                                                                                                                                                            |
| ----------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`@nyxis/core`**       | npm package       | Types (`AIMessage`, `AIToolCall`, ...), provider adapter (`createModel`), event bus, hooks (`useChat`, `useToolExecutor`), server helpers (`createChatHandler`).                         |
| **`nyxis-ui`**          | npm package       | Five-mode theme runtime (`getThemeScript`), design tokens stylesheet, `cn()` helper.                                                                                                     |
| **Registry**            | `npx shadcn add`  | 105+ AI-first components + 20 backend recipes (chat, completion, tools, RAG × 5 frameworks). Source you own.                                                                             |
| **`@nyxis/mcp-server`** | npm package (CLI) | MCP server that exposes the registry to Claude Code, Cursor, Windsurf, and any MCP-aware assistant — so the assistant can search, read, and install components without leaving the chat. |
| **`create-nyxis`**      | `npm create` flow | Project scaffolder: picks the framework, runs shadcn init, optionally installs `nyxis-ui` and starter components. One command for a working baseline.                                    |

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

- **Phase 1 — Frontend registry.** **Done.** 105+ components live.
- **Phase 2 — Backend recipes.** **Done.** chat / completion / tools / RAG route
  handlers for Next.js App Router.
- **Phase 2.5 — Multi-framework recipes.** **Done.** Astro, SvelteKit, Hono,
  Express variants of every backend recipe.
- **Phase 3 — Public custom-provider API.** **Done.** `registerProvider` plus
  `BUILT_IN_PROVIDER_IDS` from `@nyxis/core`.
- **Phase 4 — MCP server.** **Done.** `@nyxis/mcp-server` exposes the registry
  to Claude Code, Cursor, Windsurf with four tools (`list`, `search`, `get`,
  `install`).
- **Phase 5 — Adoption.** **Started.** `create-nyxis` CLI live; telemetry opt-in
  and custom domain queued.
- **Phase 6 — Multi-framework registries.** Planned. Headless `@nyxis/core`
  - Vue / Svelte / Web Components renderers.

## Repository layout

```
nyxis/
├── packages/
│   ├── core/             → @nyxis/core (npm — types, adapter, hooks)
│   ├── ui/               → nyxis-ui (npm — theme runtime + cn)
│   ├── mcp-server/       → @nyxis/mcp-server (npm, CLI bin: nyxis-mcp)
│   └── create-nyxis/     → create-nyxis (npm, scaffolder for npm create)
├── apps/
│   └── docs/             → Astro docs site + registry endpoints
│       ├── registry/     → Source files served by /r/<name>.json
│       ├── tests/e2e/    → Playwright smoke tests
│       └── src/
│           ├── components/ui/  → shadcn-style base UI for the docs
│           └── lib/utils.ts    → cn() helper
└── ...
```

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup, conventions, and the
registry-item authoring checklist.

## Versioning

See [VERSIONING.md](./VERSIONING.md) for how we apply SemVer in 0.x, what counts
as a breaking change, and the road to v1.0.

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability disclosure and our hardening
baseline.

## Acknowledgements

Built on the work of [shadcn/ui](https://ui.shadcn.com),
[Radix UI](https://www.radix-ui.com), [Tailwind CSS](https://tailwindcss.com),
[Vercel AI SDK](https://sdk.vercel.ai), and [lucide-react](https://lucide.dev).

## License

[MIT](./LICENSE) © Julio César Daal

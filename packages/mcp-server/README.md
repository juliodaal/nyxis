# @nyxis/mcp-server

[![License: MIT](https://img.shields.io/badge/License-MIT-A855F7.svg)](https://github.com/juliodaal/nyxis/blob/main/LICENSE)

MCP server that exposes the
[Nyxis registry](https://nyxisai.vercel.app/docs/registry) to AI coding
assistants. Once configured in your editor, the assistant can browse the Nyxis
catalog, read the full source of any component or backend recipe, and suggest
the right `npx shadcn@latest add` command — all without leaving the chat.

→ [Documentation](https://nyxisai.vercel.app)

## Tools exposed

- **`list_components`** — Browse the catalog. Optional `category` and `type`
  filters.
- **`search_components`** — Free-text search over names, titles, descriptions,
  and categories. Ranked top-N matches.
- **`get_component`** — Read the full metadata plus inlined source of a single
  item by slug, ready to copy or pipe into `npx shadcn add`.

## Configure your assistant

The server speaks MCP over stdio. Add it to your assistant's MCP config; it will
be launched on demand.

### Claude Code

```json title="~/.claude.json"
{
  "mcpServers": {
    "nyxis": {
      "command": "npx",
      "args": ["-y", "@nyxis/mcp-server"]
    }
  }
}
```

Or, project-scoped, in `.mcp.json` at the repo root.

### Cursor

```json title="~/.cursor/mcp.json"
{
  "mcpServers": {
    "nyxis": {
      "command": "npx",
      "args": ["-y", "@nyxis/mcp-server"]
    }
  }
}
```

### Windsurf

```json title="~/.codeium/windsurf/mcp_config.json"
{
  "mcpServers": {
    "nyxis": {
      "command": "npx",
      "args": ["-y", "@nyxis/mcp-server"]
    }
  }
}
```

## Usage

Ask the assistant in natural language:

> "Make me a chat surface using Nyxis. Use the streaming markdown renderer."

The assistant will:

1. Call `search_components` with `query: "chat streaming markdown"`.
2. Call `get_component` on each match to read the source.
3. Suggest `npx shadcn@latest add <url>` commands for each item.
4. Wire them up in your codebase.

## Local development

To point the server at your own dev instance of the registry instead of the
production deploy, set `NYXIS_REGISTRY_URL`:

```bash
NYXIS_REGISTRY_URL=http://localhost:4321/r npx @nyxis/mcp-server
```

Useful when iterating on registry items locally.

## License

[MIT](https://github.com/juliodaal/nyxis/blob/main/LICENSE) © Julio César Daal

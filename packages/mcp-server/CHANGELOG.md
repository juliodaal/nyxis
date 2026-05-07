# @nyxis/mcp-server

## 0.1.0

### Phase 4.1 — MCP server foundation

Initial release. Exposes the Nyxis registry to AI coding assistants (Claude
Code, Cursor, Windsurf, …) via the Model Context Protocol over stdio.

### Tools

- **`list_components`** — Browse the catalog with optional category / type
  filters.
- **`search_components`** — Free-text search ranked by relevance.
- **`get_component`** — Full source of a single registry item.

### Configuration

The server reads `NYXIS_REGISTRY_URL` to override the default registry base URL
(`https://nyxis.vercel.app/r`). In-memory caching keeps repeat calls cheap
during a single MCP session.

### What's coming

- **0.2.0 (Phase 4.2)** — `install_component` tool that writes the files into
  the active workspace via the shadcn CLI, so the assistant can install items
  end-to-end without dropping back to a terminal.

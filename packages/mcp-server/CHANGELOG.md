# @nyxis/mcp-server

## 0.2.0

### Phase 4.2 — `install_component` tool

The MCP server can now install items directly into the user's project, not just
describe them. New tool: `install_component`.

### What it does

Shells out to the canonical shadcn CLI:

```
npx -y shadcn@latest add <url> --yes
```

with `cwd` set to the user's project root. We don't replicate the CLI — we trust
it. That gives users the exact install behaviour they'd get running the command
by hand: cascading registry-dependency resolution, npm-package installs via the
right package manager (detected from lockfiles), Tailwind / design-token wiring,
alias resolution from their `tsconfig.json`. When shadcn CLI improves, we
inherit the upgrade for free.

### Behaviour

- Pre-flight check: if there's no `components.json` at `cwd`, return a clear
  error telling the user to run `npx shadcn@latest init` first.
- Captures stdout + stderr from the subprocess and returns them in the tool
  response, so the assistant can surface the canonical CLI output.
- On non-zero exit, returns `isError: true` with the full output and the failed
  command, so the assistant can diagnose without retrying blindly.
- `cwd` arg is optional — defaults to the MCP server's working directory, which
  is normally the assistant's active workspace.
- `yes` arg defaults to `true` (skip interactive prompts) — what you almost
  always want from a non-interactive subprocess.

### Updated instructions

The server's MCP `instructions` block now describes the full workflow: `list` /
`search` to discover, `get_component` to read, then `install_component` to
write. The intent is that assistants always preview a component before
installing it.

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

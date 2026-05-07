/**
 * Nyxis MCP server — entry point.
 *
 * Exposes the Nyxis component registry to AI coding assistants
 * (Claude Code, Cursor, Windsurf, …) over the Model Context Protocol.
 *
 * Run as a subprocess from the assistant's MCP config:
 *
 *   {
 *     "mcpServers": {
 *       "nyxis": { "command": "npx", "args": ["-y", "@nyxis/mcp-server"] }
 *     }
 *   }
 *
 * Or invoke directly:
 *
 *   npx @nyxis/mcp-server
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { RegistryClient } from './lib/registry-fetch.js';
import { listComponentsHandler, listComponentsSchema } from './tools/list-components.js';
import { getComponentHandler, getComponentSchema } from './tools/get-component.js';
import { searchComponentsHandler, searchComponentsSchema } from './tools/search-components.js';
import { installComponentHandler, installComponentSchema } from './tools/install-component.js';

async function main(): Promise<void> {
  const client = new RegistryClient();

  const server = new McpServer(
    { name: 'nyxis', version: '0.2.0' },
    {
      capabilities: { tools: {} },
      instructions:
        'Nyxis is a shadcn-style registry of AI-first React components and Next.js backend ' +
        'recipes (chat, agents, RAG, MCP, tools, multimodal, prompts/eval, skills, theme). ' +
        'Use `list_components` to browse the catalog, `search_components` to find by ' +
        'keyword, and `get_component` to read the full source of any item. To install one ' +
        "into the user's project, use the suggested `npx shadcn@latest add <url>` command — " +
        'the user owns the resulting source files and can edit them freely.',
    },
  );

  server.tool(
    'list_components',
    'List Nyxis registry items. Optionally filter by category or type. Returns a concise catalog with descriptions.',
    listComponentsSchema,
    listComponentsHandler(client),
  );

  server.tool(
    'get_component',
    'Read the full source of a single Nyxis registry item by slug. Returns metadata plus every file the shadcn CLI would install, with inlined content.',
    getComponentSchema,
    getComponentHandler(client),
  );

  server.tool(
    'search_components',
    'Free-text search over the Nyxis registry. Matches against slug, title, description, and category. Returns the top-N matches ranked by relevance.',
    searchComponentsSchema,
    searchComponentsHandler(client),
  );

  server.tool(
    'install_component',
    "Install a Nyxis registry item into the user's project by shelling out to the shadcn CLI (`npx shadcn@latest add <url>`). The CLI resolves cascading registry dependencies, installs the npm packages, and writes the source files into the configured component directory. Requires a `components.json` at the project root — the tool returns a clear error if missing.",
    installComponentSchema,
    installComponentHandler(client),
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Keep the process alive while the transport is open.
  // The MCP SDK closes stdin/stdout when the parent disconnects, so we
  // don't need an explicit await — the runtime exits with the transport.
}

main().catch((err: unknown) => {
  // Send fatal errors to stderr so they don't pollute the MCP stream
  // on stdout. The parent assistant can surface them in its UI.
  // eslint-disable-next-line no-console
  console.error(`[nyxis-mcp] fatal: ${(err as Error).message}`);
  process.exit(1);
});

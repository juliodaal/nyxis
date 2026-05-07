import { z } from 'zod';

import type { RegistryClient } from '../lib/registry-fetch.js';

export const listComponentsSchema = {
  category: z
    .string()
    .optional()
    .describe(
      'Optional category filter (e.g. "chat", "agents", "rag", "domain", "ai-models", "getting-started"). Omit for the full catalog.',
    ),
  type: z
    .string()
    .optional()
    .describe(
      'Optional type filter — "registry:ui" for components, "registry:file" for backend recipes, "registry:lib" for shared helpers.',
    ),
};

export function listComponentsHandler(client: RegistryClient) {
  return async (args: { category?: string; type?: string }) => {
    const manifest = await client.manifest();
    const filtered = manifest.items.filter((item) => {
      if (args.category && !item.categories?.includes(args.category)) return false;
      if (args.type && item.type !== args.type) return false;
      return true;
    });

    const lines = filtered.map((item) => {
      const cats = item.categories?.length ? ` [${item.categories.join(', ')}]` : '';
      const desc = item.description ?? '';
      return `- **${item.name}** (${item.type})${cats}\n  ${desc}`;
    });

    const header =
      `# Nyxis registry — ${filtered.length} item${filtered.length === 1 ? '' : 's'}\n\n` +
      `Source: ${client.baseUrl}/registry.json\n` +
      (args.category ? `Category filter: ${args.category}\n` : '') +
      (args.type ? `Type filter: ${args.type}\n` : '') +
      `\nUse the \`get_component\` tool to read the full source of any item, ` +
      `or run \`npx shadcn@latest add <url>\` to install it. URLs follow ` +
      `\`${client.baseUrl}/<name>.json\`.\n\n`;

    return {
      content: [
        {
          type: 'text' as const,
          text: header + lines.join('\n'),
        },
      ],
    };
  };
}

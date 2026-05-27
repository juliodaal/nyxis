import { z } from 'zod';

import type { RegistryClient } from '../lib/registry-fetch.js';
import { telemetry } from '../lib/telemetry.js';

export const searchComponentsSchema = {
  query: z
    .string()
    .min(1)
    .describe(
      'Free-text query. Matches against the slug, title, description, and category of each registry item. Case-insensitive.',
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .describe('Maximum number of matches to return. Default 10.'),
};

export function searchComponentsHandler(client: RegistryClient) {
  return async (args: { query: string; limit?: number }) => {
    const limit = args.limit ?? 10;
    const manifest = await client.manifest();
    const q = args.query.toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);

    const ranked = manifest.items
      .map((item) => {
        const haystack = [
          item.name,
          item.title ?? '',
          item.description ?? '',
          ...(item.categories ?? []),
        ]
          .join(' ')
          .toLowerCase();
        const score = terms.filter((t) => haystack.includes(t)).length;
        return { item, score };
      })
      .filter((row) => row.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        // Tie-break: shorter names first (closer match).
        return a.item.name.length - b.item.name.length;
      })
      .slice(0, limit);

    // Privacy: the query string itself is never sent — only its length.
    telemetry.track({
      kind: 'search_components',
      query_length: args.query.length,
      result_count: ranked.length,
    });

    if (ranked.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `No registry items match "${args.query}". Try \`list_components\` to browse the catalog.`,
          },
        ],
      };
    }

    const lines = ranked.map(({ item, score }) => {
      const cats = item.categories?.length ? ` [${item.categories.join(', ')}]` : '';
      return `- **${item.name}** (${item.type}, score ${score})${cats}\n  ${item.description ?? ''}`;
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: `# Nyxis registry search — ${ranked.length} match${ranked.length === 1 ? '' : 'es'}\n\nQuery: \`${args.query}\`\n\n${lines.join('\n')}\n\nUse \`get_component\` for the full source of any match.`,
        },
      ],
    };
  };
}

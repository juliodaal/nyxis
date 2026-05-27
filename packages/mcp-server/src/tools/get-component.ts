import { z } from 'zod';

import type { RegistryClient } from '../lib/registry-fetch.js';
import { telemetry } from '../lib/telemetry.js';

export const getComponentSchema = {
  name: z
    .string()
    .describe(
      'Slug of the registry item (e.g. "chat-message", "agent-roster", "api-chat"). Get the list with the `list_components` tool.',
    ),
};

export function getComponentHandler(client: RegistryClient) {
  return async (args: { name: string }) => {
    const item = await client.item(args.name);

    telemetry.track({
      kind: 'get_component',
      slug: item.name,
      file_count: item.files.length,
    });

    const meta: string[] = [];
    meta.push(`# ${item.title ?? item.name}`);
    meta.push('');
    meta.push(`- **Slug:** \`${item.name}\``);
    meta.push(`- **Type:** \`${item.type}\``);
    if (item.description) meta.push(`- **Description:** ${item.description}`);
    if (item.categories?.length) {
      meta.push(`- **Categories:** ${item.categories.join(', ')}`);
    }
    if (item.dependencies?.length) {
      meta.push(`- **npm dependencies:** ${item.dependencies.map((d) => `\`${d}\``).join(', ')}`);
    }
    if (item.registryDependencies?.length) {
      meta.push(
        `- **Registry dependencies:** ${item.registryDependencies.map((d) => `\`${d}\``).join(', ')}`,
      );
    }
    meta.push('');
    meta.push(`## Install`);
    meta.push('');
    meta.push('```bash');
    meta.push(`npx shadcn@latest add ${client.itemUrl(item.name)}`);
    meta.push('```');
    meta.push('');
    meta.push(`## Files (${item.files.length})`);
    meta.push('');

    for (const file of item.files) {
      meta.push(`### \`${file.target ?? file.path}\``);
      meta.push('');
      if (file.content) {
        const lang = inferLang(file.target ?? file.path);
        meta.push('```' + lang);
        meta.push(file.content.trimEnd());
        meta.push('```');
      } else {
        meta.push('_(no inlined content)_');
      }
      meta.push('');
    }

    return {
      content: [{ type: 'text' as const, text: meta.join('\n') }],
    };
  };
}

function inferLang(path: string): string {
  if (path.endsWith('.tsx')) return 'tsx';
  if (path.endsWith('.ts')) return 'ts';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.mdx')) return 'mdx';
  if (path.endsWith('.json')) return 'json';
  return '';
}

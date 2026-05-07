import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { APIRoute, GetStaticPaths } from 'astro';

import { REGISTRY_ITEMS } from '../../../registry/items';

/**
 * Per-item registry endpoint, shadcn-CLI compatible. Returns the JSON
 * with each declared file's source inlined under `content`, so the CLI
 * can install the file into the consumer's project.
 *
 * Served at:  /r/<item-name>.json
 */

const REGISTRY_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../../registry');

export const getStaticPaths: GetStaticPaths = () =>
  REGISTRY_ITEMS.map((item) => ({ params: { name: item.name } }));

export const GET: APIRoute = ({ params }) => {
  const item = REGISTRY_ITEMS.find((it) => it.name === params.name);
  if (!item) {
    return new Response(JSON.stringify({ error: 'item not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const files = item.files.map((f) => ({
    path: f.target,
    type: f.type,
    target: f.target,
    content: readFileSync(join(REGISTRY_ROOT, f.source), 'utf-8'),
  }));

  const body = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    ...(item.dependencies?.length ? { dependencies: item.dependencies } : {}),
    ...(item.registryDependencies?.length
      ? { registryDependencies: item.registryDependencies }
      : {}),
    files,
    ...(item.category ? { categories: [item.category] } : {}),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};

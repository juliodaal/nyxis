import type { APIRoute } from 'astro';

import { REGISTRY_ITEMS } from '../../../registry/items';

/**
 * The Nyxis registry manifesto. Lists every item without inlining file
 * contents. The shadcn CLI uses this to populate `npx shadcn search`
 * and the per-item routes for the actual install.
 *
 * Served at:  /r/registry.json
 */
export const GET: APIRoute = () => {
  const body = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'nyxis',
    homepage: 'https://nyxisai.vercel.app',
    items: REGISTRY_ITEMS.map((item) => ({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      ...(item.dependencies?.length ? { dependencies: item.dependencies } : {}),
      ...(item.registryDependencies?.length
        ? { registryDependencies: item.registryDependencies }
        : {}),
      // Strip source paths from the manifesto — only the manifest of
      // targets and types is meaningful here.
      files: item.files.map((f) => ({ path: f.target, type: f.type })),
      ...(item.category ? { categories: [item.category] } : {}),
    })),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};

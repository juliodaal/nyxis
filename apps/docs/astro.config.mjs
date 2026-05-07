import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = process.env.SITE_URL ?? 'https://nyxis.vercel.app';

const REGISTRY_COMPONENTS = fileURLToPath(new URL('./registry/components', import.meta.url));
const REGISTRY_UTILS = fileURLToPath(new URL('./registry/lib/utils.ts', import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    react(),
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        wrap: true,
      },
      gfm: true,
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['nyxis-ui'],
    },
    resolve: {
      // Path aliases used by every registry component (mirrors what the
      // shadcn CLI installs into a consumer's project). The docs site
      // dogfoods its own registry by resolving these to the source files
      // here; consumers resolve them to their own src/.
      alias: [
        { find: /^@\/lib\/utils$/, replacement: REGISTRY_UTILS },
        {
          find: /^@\/components\/nyxis\/(.*)$/,
          replacement: `${REGISTRY_COMPONENTS}/$1`,
        },
        // Base shadcn primitives are still hosted by nyxis-ui until 1B.5;
        // map @/components/ui/<name> to the nyxis-ui subpath export.
        { find: /^@\/components\/ui\/(.*)$/, replacement: 'nyxis-ui/$1' },
      ],
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  security: {
    checkOrigin: true,
  },
});

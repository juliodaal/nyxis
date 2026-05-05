import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const baseFrontmatter = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum([
    'getting-started',
    'text-animations',
    'components',
    'animations',
    'domain',
    'ai-models',
  ]),
  status: z.enum(['stable', 'beta', 'planned', 'in-progress']).default('planned'),
  /** Slug override; otherwise derived from the file name. */
  slug: z.string().optional(),
  /** External docs (Radix, GSAP, etc.). */
  references: z
    .array(
      z.object({
        label: z.string(),
        href: z.string().url(),
      }),
    )
    .optional(),
  /** Last-updated marker, used in the docs footer. */
  updated: z.string().optional(),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: baseFrontmatter,
});

const components = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/components' }),
  schema: baseFrontmatter,
});

const textAnimations = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/text-animations' }),
  schema: baseFrontmatter,
});

const animations = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/animations' }),
  schema: baseFrontmatter,
});

const domain = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/domain' }),
  schema: baseFrontmatter,
});

const aiModels = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ai-models' }),
  schema: baseFrontmatter,
});

export const collections = {
  docs,
  components,
  'text-animations': textAnimations,
  animations,
  domain,
  'ai-models': aiModels,
};

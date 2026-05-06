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
    'chat',
    'reasoning',
    'tools',
    'mcp',
    'agents',
    'multimodal',
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

const chat = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/chat' }),
  schema: baseFrontmatter,
});

const reasoning = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reasoning' }),
  schema: baseFrontmatter,
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: baseFrontmatter,
});

const mcp = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/mcp' }),
  schema: baseFrontmatter,
});

const agents = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/agents' }),
  schema: baseFrontmatter,
});

const multimodal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/multimodal' }),
  schema: baseFrontmatter,
});

export const collections = {
  docs,
  components,
  'text-animations': textAnimations,
  animations,
  domain,
  'ai-models': aiModels,
  chat,
  reasoning,
  tools,
  mcp,
  agents,
  multimodal,
};

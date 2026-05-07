/**
 * Source-of-truth catalog for the Nyxis shadcn-style registry.
 *
 * The build-registry script reads this list, loads the source for each
 * declared file, and emits the JSON entries the shadcn CLI consumes:
 *
 *   public/r/registry.json     — manifesto (root)
 *   public/r/<name>.json       — one item per entry
 *
 * Adding a new component to the registry means:
 *   1. Drop the source file under `apps/docs/registry/components/`
 *      (or `apps/docs/registry/hooks/`, `apps/docs/registry/lib/`).
 *   2. Add an entry below.
 *   3. Run `pnpm --filter @nyxis/docs build` (the script runs as a
 *      pre-build step).
 */

import type { Category } from '../src/lib/registry';

/** Mirrors the shadcn registry item type union. */
export type RegistryItemType =
  | 'registry:lib'
  | 'registry:component'
  | 'registry:ui'
  | 'registry:hook'
  | 'registry:block'
  | 'registry:page'
  | 'registry:file'
  | 'registry:theme'
  | 'registry:style';

/** A file that ships as part of a registry item. */
export interface RegistryFileSpec {
  /** Source path relative to `apps/docs/registry/`. */
  source: string;
  /** Where the file should land in the consumer's project. */
  target: string;
  /** Item type for this file (almost always matches the parent). */
  type: RegistryItemType;
}

/** A single registry entry. */
export interface RegistryItemSpec {
  /** Slug used by `npx shadcn add <name>`. */
  name: string;
  /** Item kind for the shadcn CLI. */
  type: RegistryItemType;
  /** Display title. */
  title: string;
  /** One-line description shown in catalog UIs. */
  description: string;
  /** External npm dependencies the consumer needs. */
  dependencies?: readonly string[];
  /** Other registry items to install alongside (names from this list, or full URLs). */
  registryDependencies?: readonly string[];
  /** Files the consumer receives. */
  files: readonly RegistryFileSpec[];
  /** Optional category — used to group items in the docs catalog UI. */
  category?: Category;
}

/**
 * The catalog. Order matters only for the manifesto's listing; consumers
 * install items by name.
 */
export const REGISTRY_ITEMS: readonly RegistryItemSpec[] = [
  // ── Shared lib (auto-installed when any component depends on it) ──
  {
    name: 'utils',
    type: 'registry:lib',
    title: 'cn() utility',
    description: 'The standard tailwind-merge + clsx helper used by every Nyxis component.',
    dependencies: ['clsx', 'tailwind-merge'],
    files: [
      {
        source: 'lib/utils.ts',
        target: 'lib/utils.ts',
        type: 'registry:lib',
      },
    ],
  },

  // ── Pilot: ConfidenceBadge ─────────────────────────────────────────
  {
    name: 'confidence-badge',
    type: 'registry:ui',
    title: 'Confidence Badge',
    description: 'Color-coded badge for any AI extraction or classification confidence score.',
    registryDependencies: ['utils'],
    files: [
      {
        source: 'components/confidence-badge.tsx',
        target: 'components/nyxis/confidence-badge.tsx',
        type: 'registry:ui',
      },
    ],
    category: 'domain',
  },
] as const;

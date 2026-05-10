'use client';

import { Search, X } from 'lucide-react';
import { useDeferredValue, useMemo, useState } from 'react';

import {
  CATEGORIES,
  REGISTRY,
  pathFor,
  type Category,
  type RegistryEntry,
} from '../../lib/registry';

/**
 * Master component catalog. Renders every entry in the registry with a
 * full-text filter over name + description and a single-select category
 * pill row. Designed to feel like a fast, snappy product surface — the
 * search is debounced via `useDeferredValue` so typing stays smooth on
 * 100+ entries.
 *
 * Hydrated on the `/components` page as a `client:load` island. The grid
 * itself is server-rendered (Astro emits the initial DOM), then React
 * takes over to drive the filter state.
 */

const FILTERABLE_CATEGORIES = CATEGORIES.filter((c) => c.id !== 'getting-started');

/** Lookup of category id → human label, for chips on each card. */
const CATEGORY_LABELS: Record<Category, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label]),
) as Record<Category, string>;

const STATUS_CHIP_STYLES: Record<RegistryEntry['status'], string> = {
  stable: '',
  beta: 'bg-brand-soft text-brand',
  planned: 'bg-muted text-muted-foreground',
  'in-progress': 'bg-warning/15 text-warning',
};

export default function CatalogGrid() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return REGISTRY.filter((entry) => {
      if (entry.category === 'getting-started') return false;
      if (activeCategory !== 'all' && entry.category !== activeCategory) return false;
      if (!q) return true;
      return (
        entry.name.toLowerCase().includes(q) ||
        entry.slug.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q)
      );
    });
  }, [deferredQuery, activeCategory]);

  return (
    <div className="flex flex-col gap-8">
      {/* ── Search + clear ─────────────────────────────────────────── */}
      <div className="border-border bg-card focus-within:border-foreground/30 relative flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors">
        <Search className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 105+ components by name or description…"
          aria-label="Search components"
          className="placeholder:text-muted-foreground text-foreground flex-1 bg-transparent text-sm outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ── Category pills ─────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5">
        <CategoryPill
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
          label="All"
          count={REGISTRY.filter((e) => e.category !== 'getting-started').length}
        />
        {FILTERABLE_CATEGORIES.map((c) => {
          const count = REGISTRY.filter((e) => e.category === c.id).length;
          if (count === 0) return null;
          return (
            <CategoryPill
              key={c.id}
              active={activeCategory === c.id}
              onClick={() => setActiveCategory(c.id)}
              label={c.label}
              count={count}
            />
          );
        })}
      </div>

      {/* ── Result count ───────────────────────────────────────────── */}
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
        {filtered.length} {filtered.length === 1 ? 'component' : 'components'}
        {query && (
          <span className="text-muted-foreground/70 ml-2 normal-case tracking-normal">
            matching &ldquo;{query}&rdquo;
          </span>
        )}
      </p>

      {/* ── Grid ───────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <CatalogCard key={`${entry.category}-${entry.slug}`} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="border-border bg-card text-muted-foreground flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center text-sm">
          <p>No components match &ldquo;{query}&rdquo;.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setActiveCategory('all');
            }}
            className="text-foreground hover:text-brand text-sm font-medium underline-offset-4 transition-colors hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}

function CategoryPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'bg-foreground text-background inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors'
          : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors'
      }
    >
      {label}
      <span
        className={active ? 'text-background/70' : 'text-muted-foreground/70 font-mono text-[10px]'}
      >
        {count}
      </span>
    </button>
  );
}

function CatalogCard({ entry }: { entry: RegistryEntry }) {
  return (
    <a
      href={pathFor(entry)}
      className="border-border bg-card hover:border-foreground/30 group relative flex h-full flex-col gap-2 rounded-lg border p-5 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-foreground group-hover:text-brand text-base font-semibold tracking-tight transition-colors">
          {entry.name}
        </h3>
        {entry.status !== 'stable' && (
          <span
            className={`${STATUS_CHIP_STYLES[entry.status]} rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider`}
          >
            {entry.status}
          </span>
        )}
      </div>
      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
        {entry.description}
      </p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <span className="border-border text-muted-foreground rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
          {CATEGORY_LABELS[entry.category]}
        </span>
        <span
          aria-hidden="true"
          className="text-muted-foreground group-hover:text-brand text-xs transition-colors"
        >
          →
        </span>
      </div>
    </a>
  );
}

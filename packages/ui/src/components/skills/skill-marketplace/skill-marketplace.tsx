'use client';

import { Check, Download, Search, Sparkles, Star, User } from 'lucide-react';
import { useMemo, useState, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { Skill } from '@nyxis/core';
import { SkillPermissions } from '../skill-permissions/skill-permissions.js';

export interface SkillMarketplaceProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Skills available in the marketplace. */
  skills: readonly Skill[];
  /** Click handler when a card is opened. */
  onSelect?: (id: string) => void;
  /** Install handler. Receives the skill id. */
  onInstall?: (id: string) => void;
  /** Currently installing skill id (drives the spinner). */
  installingId?: string;
  /** Hide the search box. */
  hideSearch?: boolean;
  /** Hide the category filter pills. */
  hideCategories?: boolean;
  /** Card title; defaults to "Marketplace". */
  title?: string;
}

/**
 * Discovery / install grid for skills. Cards show icon, name, author,
 * description, scope preview, install count, and a star rating with
 * count. Install button toggles to "Installed" once the consumer
 * flips `installed: true` on the skill.
 */
export function SkillMarketplace({
  skills,
  onSelect,
  onInstall,
  installingId,
  hideSearch = false,
  hideCategories = false,
  title = 'Marketplace',
  className,
  ...props
}: SkillMarketplaceProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Map<string, number>();
    for (const s of skills) {
      const key = s.category ?? '—';
      set.set(key, (set.get(key) ?? 0) + 1);
    }
    return Array.from(set.entries());
  }, [skills]);

  const filtered = useMemo(() => {
    let out = skills;
    if (category) out = out.filter((s) => (s.category ?? '—') === category);
    if (query) {
      const q = query.toLowerCase();
      out = out.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.author?.toLowerCase().includes(q) ||
          s.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return out;
  }, [skills, query, category]);

  return (
    <div
      className={cn(
        'border-border bg-card flex flex-col overflow-hidden rounded-lg border',
        className,
      )}
      {...props}
    >
      <header className="border-border flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-muted-foreground size-4" aria-hidden />
          <h3 className="text-foreground text-sm font-semibold">{title}</h3>
          <span className="text-muted-foreground text-[11px] font-medium tabular-nums">
            {filtered.length} / {skills.length}
          </span>
        </div>
      </header>

      {(!hideSearch || (!hideCategories && categories.length > 1)) && (
        <div className="border-border flex flex-wrap items-center gap-2 border-b px-4 py-2">
          {!hideSearch && (
            <div className="relative min-w-[12rem] flex-1">
              <Search
                className="text-muted-foreground absolute left-2 top-1/2 size-3 -translate-y-1/2"
                aria-hidden
              />
              <input
                type="search"
                placeholder="Search the marketplace…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-md border pl-7 pr-2 text-xs outline-none focus-visible:ring-2"
              />
            </div>
          )}
          {!hideCategories && categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setCategory(null)}
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors',
                  category === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
                )}
              >
                all
              </button>
              {categories.map(([cat, count]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(category === cat ? null : cat)}
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors',
                    category === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80',
                  )}
                >
                  {cat}
                  <span className="ml-1 tabular-nums opacity-70">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <ul className="grid max-h-[44rem] grid-cols-1 gap-3 overflow-y-auto p-3 sm:grid-cols-2">
        {filtered.map((skill) => (
          <li key={skill.id}>
            <MarketplaceCard
              skill={skill}
              installing={installingId === skill.id}
              {...(onSelect ? { onSelect } : {})}
              {...(onInstall ? { onInstall } : {})}
            />
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-muted-foreground col-span-full px-3 py-6 text-center text-xs">
            {skills.length === 0
              ? 'No skills published yet.'
              : 'No skills match the current filters.'}
          </li>
        )}
      </ul>
    </div>
  );
}

function MarketplaceCard({
  skill,
  installing,
  onSelect,
  onInstall,
}: {
  skill: Skill;
  installing: boolean;
  onSelect?: (id: string) => void;
  onInstall?: (id: string) => void;
}) {
  const fallback =
    skill.initials ??
    skill.name
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0])
      .join('')
      .toUpperCase();

  return (
    <article className="border-border bg-card flex h-full flex-col gap-2 rounded-lg border p-3">
      <header className="flex items-start gap-2.5">
        {skill.iconUrl ? (
          <img
            src={skill.iconUrl}
            alt={skill.name}
            className="border-border size-10 shrink-0 rounded-md border object-cover"
          />
        ) : (
          <span
            className="bg-primary/15 text-primary grid size-10 shrink-0 place-items-center rounded-md text-xs font-semibold"
            aria-hidden
          >
            {fallback || <Sparkles className="size-4" aria-hidden />}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onSelect ? () => onSelect(skill.id) : undefined}
            disabled={!onSelect}
            className={cn('min-w-0 text-left', onSelect && 'cursor-pointer hover:underline')}
          >
            <h4 className="text-foreground truncate text-sm font-semibold">{skill.name}</h4>
          </button>
          {skill.author && (
            <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
              <User className="size-3" aria-hidden />
              {skill.author}
            </p>
          )}
        </div>

        {skill.installed ? (
          <span className="bg-success/15 text-success inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium">
            <Check className="size-3" aria-hidden />
            Installed
          </span>
        ) : (
          <button
            type="button"
            onClick={onInstall ? () => onInstall(skill.id) : undefined}
            disabled={!onInstall || installing}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors disabled:opacity-50"
          >
            <Download className={cn('size-3', installing && 'animate-pulse')} aria-hidden />
            {installing ? 'Installing…' : 'Install'}
          </button>
        )}
      </header>

      {skill.description && (
        <p className="text-muted-foreground line-clamp-3 text-xs leading-snug">
          {skill.description}
        </p>
      )}

      {skill.scopes && skill.scopes.length > 0 && (
        <SkillPermissions scopes={skill.scopes} compact limit={6} />
      )}

      <footer className="text-muted-foreground mt-auto flex items-center gap-3 text-[10px]">
        {skill.rating != null && (
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Star className="size-3 fill-current text-amber-500" aria-hidden />
            <span className="text-foreground font-medium">{skill.rating.toFixed(1)}</span>
            {skill.ratingCount != null && <span>({skill.ratingCount.toLocaleString()})</span>}
          </span>
        )}
        {skill.installs != null && (
          <span className="tabular-nums">{formatInstalls(skill.installs)} installs</span>
        )}
        {skill.version && <span className="font-mono">v{skill.version}</span>}
      </footer>
    </article>
  );
}

function formatInstalls(n: number): string {
  if (n < 1_000) return n.toString();
  if (n < 1_000_000) return `${(n / 1_000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

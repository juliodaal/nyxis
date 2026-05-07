'use client';

import { Sparkles } from 'lucide-react';
import { useMemo, useState, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { Skill } from '@nyxis/core';
import { SkillCard } from '../skill-card/skill-card.js';

export interface SkillRegistryProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onSelect'
> {
  /** All skills installed in the runtime. */
  skills: readonly Skill[];
  /** Currently enabled skill ids (controlled). */
  value?: readonly string[];
  /** Default enabled set (uncontrolled). */
  defaultValue?: readonly string[];
  /** Called when a skill is toggled. */
  onChange?: (enabledIds: readonly string[]) => void;
  /** Selection callback (e.g. open the detail page). */
  onSelect?: (id: string) => void;
  /** Currently selected skill id. */
  activeId?: string;
  /** Hide the search input. */
  hideSearch?: boolean;
  /** Hide the category filter pills. */
  hideCategories?: boolean;
  /** Card title; defaults to "Skills". */
  title?: string;
}

/**
 * Catalog of installed skills with search, category filtering, and
 * per-skill enable toggles. Pair with `<SkillCard>` for the row view.
 */
export function SkillRegistry({
  skills,
  value: controlledValue,
  defaultValue,
  onChange,
  onSelect,
  activeId,
  hideSearch = false,
  hideCategories = false,
  title = 'Skills',
  className,
  ...props
}: SkillRegistryProps) {
  const [enabled, setEnabled] = useState<readonly string[]>(
    () =>
      controlledValue ??
      defaultValue ??
      skills.filter((s) => s.status === 'enabled').map((s) => s.id),
  );
  const active = controlledValue ?? enabled;

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
          s.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return out;
  }, [skills, query, category]);

  const toggle = (id: string, nextEnabled: boolean) => {
    const next = nextEnabled ? [...new Set([...active, id])] : active.filter((v) => v !== id);
    setEnabled(next);
    onChange?.(next);
  };

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
            {active.length}/{skills.length} enabled
          </span>
        </div>
      </header>

      {(!hideSearch || !hideCategories) && (
        <div className="border-border flex flex-wrap items-center gap-2 border-b px-4 py-2">
          {!hideSearch && (
            <input
              type="search"
              placeholder="Search skills…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-8 min-w-[10rem] flex-1 rounded-md border px-2.5 text-xs outline-none focus-visible:ring-2"
            />
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
                  data-active={category === cat || undefined}
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

      <div className="flex max-h-[36rem] flex-col gap-2 overflow-y-auto p-2">
        {filtered.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={{
              ...skill,
              status: active.includes(skill.id)
                ? 'enabled'
                : skill.status === 'errored'
                  ? 'errored'
                  : 'disabled',
            }}
            toggleable
            onToggle={toggle}
            {...(onSelect ? { onSelect } : {})}
            selected={skill.id === activeId}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground px-3 py-6 text-center text-xs">
            {skills.length === 0 ? 'No skills installed.' : 'No skills match the current filters.'}
          </p>
        )}
      </div>
    </div>
  );
}

'use client';

import { Wrench } from 'lucide-react';
import { useMemo, useState, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface RegisteredTool {
  /** Unique tool id. */
  id: string;
  /** Tool name (matches what the model calls). */
  name: string;
  /** Human-readable description shown in the catalog. */
  description: string;
  /** Optional category to group rows. */
  group?: string;
  /** Optional icon override. */
  icon?: ReactNode;
  /** Whether the tool is enabled by default. */
  enabled?: boolean;
}

export interface ToolRegistryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Tools available to the assistant. */
  tools: readonly RegisteredTool[];
  /** Currently enabled tool ids (controlled). */
  value?: readonly string[];
  /** Default enabled set (uncontrolled). */
  defaultValue?: readonly string[];
  /** Called when a tool is toggled. */
  onChange?: (enabledIds: readonly string[]) => void;
  /** Show a search input. */
  searchable?: boolean;
  /** Card title; defaults to "Tools". */
  title?: string;
}

/**
 * Catalog of tools the assistant can use, with per-tool toggles. Pair
 * with `useToolExecutor` from `nyxis-ui/ai` to wire client-side
 * implementations.
 */
export function ToolRegistry({
  tools,
  value: controlledValue,
  defaultValue,
  onChange,
  searchable = true,
  title = 'Tools',
  className,
  ...props
}: ToolRegistryProps) {
  const [enabled, setEnabled] = useState<readonly string[]>(
    () =>
      controlledValue ?? defaultValue ?? tools.filter((t) => t.enabled !== false).map((t) => t.id),
  );
  const active = controlledValue ?? enabled;
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const filtered = query
      ? tools.filter(
          (t) =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.description.toLowerCase().includes(query.toLowerCase()),
        )
      : tools;
    const map = new Map<string, RegisteredTool[]>();
    for (const t of filtered) {
      const key = t.group ?? '';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries());
  }, [tools, query]);

  const toggle = (id: string) => {
    const next = active.includes(id) ? active.filter((v) => v !== id) : [...active, id];
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
          <Wrench className="text-muted-foreground size-4" aria-hidden />
          <h3 className="text-foreground text-sm font-semibold">{title}</h3>
          <span className="text-muted-foreground text-[11px] font-medium">
            {active.length}/{tools.length} active
          </span>
        </div>
      </header>

      {searchable && (
        <div className="border-border border-b px-4 py-2">
          <input
            type="search"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-2.5 text-xs outline-none focus-visible:ring-2"
          />
        </div>
      )}

      <ul className="divide-border max-h-[28rem] divide-y overflow-y-auto">
        {groups.map(([group, items]) => (
          <li key={group || '__none'}>
            {group && (
              <p className="bg-muted/30 text-muted-foreground sticky top-0 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider">
                {group}
              </p>
            )}
            <ul className="divide-border divide-y">
              {items.map((tool) => {
                const isOn = active.includes(tool.id);
                return (
                  <li key={tool.id}>
                    <button
                      type="button"
                      onClick={() => toggle(tool.id)}
                      aria-pressed={isOn}
                      className={cn(
                        'hover:bg-muted/40 flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors',
                      )}
                    >
                      <span className="bg-muted text-muted-foreground mt-0.5 grid size-7 shrink-0 place-items-center rounded">
                        {tool.icon ?? <Wrench className="size-3.5" aria-hidden />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <code className="text-foreground block truncate font-mono text-xs font-medium">
                          {tool.name}
                        </code>
                        <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-[11px] leading-snug">
                          {tool.description}
                        </span>
                      </span>
                      <span
                        role="switch"
                        aria-checked={isOn}
                        className={cn(
                          'relative mt-0.5 inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors',
                          isOn ? 'bg-primary' : 'bg-muted',
                        )}
                      >
                        <span
                          className={cn(
                            'bg-background block size-3 rounded-full shadow-sm transition-transform',
                            isOn ? 'translate-x-3.5' : 'translate-x-0.5',
                          )}
                        />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}

        {groups.length === 0 && (
          <li className="text-muted-foreground px-4 py-6 text-center text-xs">
            No tools match "{query}".
          </li>
        )}
      </ul>
    </div>
  );
}

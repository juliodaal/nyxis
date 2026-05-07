'use client';

import { ChevronDown, ChevronRight, MessageSquare, Search } from 'lucide-react';
import { useMemo, useState, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import type { MCPPrompt } from '@nyxis/core';

export interface MCPPromptLibraryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Prompts exposed by one or more MCP servers. */
  prompts: readonly MCPPrompt[];
  /** Called when a prompt is clicked / picked. */
  onSelect?: (prompt: MCPPrompt) => void;
  /** Currently active prompt name. */
  activeName?: string;
  /** Hide the search input. */
  hideSearch?: boolean;
}

/**
 * Catalog of prompts exposed by one or more MCP servers, with their
 * declared arguments expandable per-row. Click a prompt to dispatch
 * (typically to a `<ParameterForm>` for arg input).
 */
export function MCPPromptLibrary({
  prompts,
  onSelect,
  activeName,
  hideSearch = false,
  className,
  ...props
}: MCPPromptLibraryProps) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<readonly string[]>([]);

  const filtered = useMemo(() => {
    if (!query) return prompts;
    const q = query.toLowerCase();
    return prompts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q),
    );
  }, [prompts, query]);

  const toggle = (name: string) =>
    setExpanded((prev) => (prev.includes(name) ? prev.filter((v) => v !== name) : [...prev, name]));

  return (
    <div
      className={cn(
        'border-border bg-card flex flex-col overflow-hidden rounded-lg border',
        className,
      )}
      {...props}
    >
      <header className="border-border flex items-center justify-between gap-2 border-b px-3 py-2.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-muted-foreground size-4" aria-hidden />
          <h3 className="text-foreground text-sm font-semibold">Prompts</h3>
          <span className="text-muted-foreground text-[11px] font-medium">{prompts.length}</span>
        </div>
      </header>

      {!hideSearch && prompts.length > 0 && (
        <div className="border-border border-b p-2">
          <div className="relative">
            <Search
              className="text-muted-foreground absolute left-2 top-1/2 size-3 -translate-y-1/2"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search prompts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-7 w-full rounded-md border pl-7 pr-2 text-xs outline-none focus-visible:ring-2"
            />
          </div>
        </div>
      )}

      <ul className="divide-border max-h-[32rem] divide-y overflow-y-auto">
        {filtered.map((prompt) => {
          const isOpen = expanded.includes(prompt.name);
          const isActive = prompt.name === activeName;
          const argCount = prompt.arguments?.length ?? 0;
          return (
            <li
              key={prompt.name}
              data-active={isActive || undefined}
              className="data-[active]:bg-primary/5"
            >
              <div className="flex items-start gap-2 px-3 py-2">
                <button
                  type="button"
                  onClick={() => toggle(prompt.name)}
                  disabled={argCount === 0}
                  aria-expanded={argCount > 0 ? isOpen : undefined}
                  aria-label={isOpen ? 'Collapse arguments' : 'Expand arguments'}
                  className={cn(
                    'text-muted-foreground hover:text-foreground mt-0.5 transition-colors',
                    argCount === 0 && 'opacity-30',
                  )}
                >
                  {isOpen ? (
                    <ChevronDown className="size-3" aria-hidden />
                  ) : (
                    <ChevronRight className="size-3" aria-hidden />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onSelect?.(prompt)}
                  className="min-w-0 flex-1 text-left"
                >
                  <code
                    className={cn(
                      'block truncate font-mono text-xs font-medium',
                      isActive ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {prompt.name}
                  </code>
                  {prompt.description && (
                    <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-[11px] leading-snug">
                      {prompt.description}
                    </span>
                  )}
                </button>

                <span
                  className={cn(
                    'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium tabular-nums',
                    argCount > 0 ? 'bg-muted text-muted-foreground' : 'text-muted-foreground/40',
                  )}
                >
                  {argCount} arg{argCount === 1 ? '' : 's'}
                </span>
              </div>

              {isOpen && argCount > 0 && (
                <div className="border-border bg-muted/20 ml-7 border-l py-1.5 pl-3 pr-3">
                  <ul className="flex flex-col gap-1">
                    {prompt.arguments!.map((arg) => (
                      <li key={arg.name} className="flex items-baseline gap-2 text-[11px]">
                        <code className="text-foreground font-mono font-medium">{arg.name}</code>
                        {arg.required && (
                          <span className="text-destructive font-medium" aria-label="required">
                            *
                          </span>
                        )}
                        {arg.description && (
                          <span className="text-muted-foreground line-clamp-1">
                            — {arg.description}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}

        {filtered.length === 0 && (
          <li className="text-muted-foreground px-4 py-6 text-center text-xs">
            {prompts.length === 0
              ? 'No prompts exposed by this server.'
              : `No prompts match "${query}".`}
          </li>
        )}
      </ul>
    </div>
  );
}

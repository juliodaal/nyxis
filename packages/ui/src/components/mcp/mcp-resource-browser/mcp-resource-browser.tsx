'use client';

import {
  ChevronDown,
  ChevronRight,
  FileCode,
  FileJson,
  FileText,
  FileType2,
  Search,
} from 'lucide-react';
import { useMemo, useState, type ComponentType, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { MCPResource } from '../../../ai/types.js';

export interface MCPResourceBrowserProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Resources exposed by one or more MCP servers. */
  resources: readonly MCPResource[];
  /** Currently selected URI. */
  activeUri?: string;
  /** Called when a resource is clicked. */
  onSelect?: (resource: MCPResource) => void;
  /** Hide the search input. */
  hideSearch?: boolean;
  /** Group rows by URI scheme (e.g. `file://`, `db://`). */
  groupByScheme?: boolean;
}

/**
 * Browser/picker for resources exposed by MCP servers. Lists URIs with
 * mime-type icons, supports search, and optionally groups by URI scheme
 * — useful when surfacing files, database rows, and remote endpoints
 * side by side.
 */
export function MCPResourceBrowser({
  resources,
  activeUri,
  onSelect,
  hideSearch = false,
  groupByScheme = true,
  className,
  ...props
}: MCPResourceBrowserProps) {
  const [query, setQuery] = useState('');
  const [closedSchemes, setClosedSchemes] = useState<readonly string[]>([]);

  const filtered = useMemo(() => {
    if (!query) return resources;
    const q = query.toLowerCase();
    return resources.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.uri.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q),
    );
  }, [resources, query]);

  const groups = useMemo(() => {
    if (!groupByScheme) {
      return [['', filtered] as [string, readonly MCPResource[]]];
    }
    const map = new Map<string, MCPResource[]>();
    for (const r of filtered) {
      const scheme = parseScheme(r.uri);
      if (!map.has(scheme)) map.set(scheme, []);
      map.get(scheme)!.push(r);
    }
    return Array.from(map.entries());
  }, [filtered, groupByScheme]);

  const toggleScheme = (s: string) =>
    setClosedSchemes((prev) => (prev.includes(s) ? prev.filter((v) => v !== s) : [...prev, s]));

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
          <FileText className="text-muted-foreground size-4" aria-hidden />
          <h3 className="text-foreground text-sm font-semibold">Resources</h3>
          <span className="text-muted-foreground text-[11px] font-medium">{resources.length}</span>
        </div>
      </header>

      {!hideSearch && resources.length > 0 && (
        <div className="border-border border-b p-2">
          <div className="relative">
            <Search
              className="text-muted-foreground absolute left-2 top-1/2 size-3 -translate-y-1/2"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search resources..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-7 w-full rounded-md border pl-7 pr-2 text-xs outline-none focus-visible:ring-2"
            />
          </div>
        </div>
      )}

      <ul className="divide-border max-h-[28rem] divide-y overflow-y-auto">
        {groups.map(([scheme, items]) => {
          const closed = closedSchemes.includes(scheme);
          return (
            <li key={scheme || '__all'}>
              {scheme && groupByScheme && (
                <button
                  type="button"
                  onClick={() => toggleScheme(scheme)}
                  className="bg-muted/30 text-muted-foreground hover:bg-muted/50 flex w-full items-center gap-1 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors"
                >
                  {closed ? (
                    <ChevronRight className="size-3" aria-hidden />
                  ) : (
                    <ChevronDown className="size-3" aria-hidden />
                  )}
                  <span>{scheme}://</span>
                  <span className="ml-auto font-mono normal-case">{items.length}</span>
                </button>
              )}
              {!closed && (
                <ul className="divide-border divide-y">
                  {items.map((resource) => {
                    const Icon = iconForMime(resource.mimeType);
                    const isActive = resource.uri === activeUri;
                    return (
                      <li key={resource.uri}>
                        <button
                          type="button"
                          onClick={() => onSelect?.(resource)}
                          aria-current={isActive ? 'true' : undefined}
                          className={cn(
                            'flex w-full items-start gap-2.5 px-3 py-2 text-left transition-colors',
                            isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/40',
                          )}
                        >
                          <Icon
                            className={cn(
                              'mt-0.5 size-3.5 shrink-0',
                              isActive ? 'text-primary' : 'text-muted-foreground',
                            )}
                            aria-hidden
                          />
                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                'block truncate text-xs font-medium',
                                isActive ? 'text-primary' : 'text-foreground',
                              )}
                            >
                              {resource.name}
                            </span>
                            <span className="text-muted-foreground block truncate font-mono text-[10px]">
                              {resource.uri}
                            </span>
                            {resource.description && (
                              <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-[11px] leading-snug">
                                {resource.description}
                              </span>
                            )}
                          </span>
                          {resource.mimeType && (
                            <span className="text-muted-foreground bg-muted shrink-0 rounded px-1 py-0.5 font-mono text-[9px]">
                              {resource.mimeType}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}

        {filtered.length === 0 && (
          <li className="text-muted-foreground px-4 py-6 text-center text-xs">
            {resources.length === 0
              ? 'No resources exposed by this server.'
              : `No resources match "${query}".`}
          </li>
        )}
      </ul>
    </div>
  );
}

function parseScheme(uri: string): string {
  const match = uri.match(/^([a-z][a-z0-9+\-.]*):/i);
  return match?.[1] ?? 'other';
}

function iconForMime(
  mime?: string,
): ComponentType<{ className?: string; 'aria-hidden'?: boolean }> {
  if (!mime) return FileText;
  if (mime.includes('json')) return FileJson;
  if (mime.startsWith('text/markdown')) return FileType2;
  if (mime.includes('javascript') || mime.includes('typescript') || mime.startsWith('text/x-'))
    return FileCode;
  return FileText;
}

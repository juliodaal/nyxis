'use client';

import { Plus, Search } from 'lucide-react';
import { useMemo, useState, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import type { MCPServer } from '@nyxis/core';
import { MCPServerCard } from '@/components/nyxis/mcp-server-card';

export interface MCPServerListProps extends HTMLAttributes<HTMLDivElement> {
  servers: readonly MCPServer[];
  /** Show search input. */
  searchable?: boolean;
  /** Render the "Add server" button + handler. */
  onAdd?: () => void;
  /** Forwarded to each card. */
  onConnect?: (id: string) => void;
  onDisconnect?: (id: string) => void;
  onRemove?: (id: string) => void;
  /** Empty state when no servers are configured. */
  emptyState?: React.ReactNode;
}

/**
 * Vertical list of configured MCP servers. Composes `<MCPServerCard>`
 * with an optional search box and "Add server" affordance. Filters by
 * name, description, and transport.
 */
export function MCPServerList({
  servers,
  searchable = true,
  onAdd,
  onConnect,
  onDisconnect,
  onRemove,
  emptyState,
  className,
  ...props
}: MCPServerListProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return servers;
    const q = query.toLowerCase();
    return servers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.transport.toLowerCase().includes(q),
    );
  }, [servers, query]);

  const connectedCount = servers.filter((s) => s.state === 'connected').length;

  return (
    <div className={cn('flex flex-col gap-3', className)} {...props}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-foreground text-sm font-semibold">MCP servers</h3>
          <span className="text-muted-foreground text-[11px] font-medium">
            {connectedCount}/{servers.length} connected
          </span>
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors"
          >
            <Plus className="size-3.5" aria-hidden />
            Add server
          </button>
        )}
      </header>

      {searchable && servers.length > 0 && (
        <div className="relative">
          <Search
            className="text-muted-foreground absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search servers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-full rounded-md border pl-8 pr-3 text-xs outline-none focus-visible:ring-2"
          />
        </div>
      )}

      {servers.length === 0 ? (
        <div className="border-border bg-card text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
          {emptyState ?? 'No MCP servers configured yet.'}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-muted-foreground rounded border border-dashed py-6 text-center text-xs">
          No servers match "{query}".
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((server) => (
            <MCPServerCard
              key={server.id}
              server={server}
              {...(onConnect ? { onConnect } : {})}
              {...(onDisconnect ? { onDisconnect } : {})}
              {...(onRemove ? { onRemove } : {})}
            />
          ))}
        </div>
      )}
    </div>
  );
}

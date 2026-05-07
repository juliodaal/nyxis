'use client';

import { Users } from 'lucide-react';
import { useMemo, useState, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import type { Agent, AgentStatus } from '@nyxis/core';
import { AgentCard } from '@/components/nyxis/agent-card';
import { AgentStatusBadge } from '@/components/nyxis/agent-status-badge';

export interface AgentRosterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** All agents in the team. */
  agents: readonly Agent[];
  /** Currently selected agent id (controlled). */
  activeId?: string;
  /** Called when the user picks an agent. */
  onSelect?: (id: string) => void;
  /** Layout: dense list rows or full cards in a grid. */
  layout?: 'list' | 'grid';
  /** Show search input. */
  searchable?: boolean;
  /** Show status filters. */
  filterable?: boolean;
  /** Card title; defaults to "Agents". */
  title?: string;
}

const ALL_STATUSES: AgentStatus[] = ['idle', 'thinking', 'working', 'blocked', 'done', 'errored'];

/**
 * Multi-agent roster — search, filter by status, and pick an active
 * agent. Renders `<AgentCard>` per agent in either a dense list or a
 * 2-column grid.
 */
export function AgentRoster({
  agents,
  activeId,
  onSelect,
  layout = 'list',
  searchable = true,
  filterable = true,
  title = 'Agents',
  className,
  ...props
}: AgentRosterProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgentStatus | null>(null);

  const filtered = useMemo(() => {
    let list = agents;
    if (statusFilter) list = list.filter((a) => a.status === statusFilter);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.role?.toLowerCase().includes(q) ||
          a.modelId?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [agents, query, statusFilter]);

  const counts = useMemo(() => {
    const map = new Map<AgentStatus, number>();
    for (const a of agents) map.set(a.status, (map.get(a.status) ?? 0) + 1);
    return map;
  }, [agents]);

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
          <Users className="text-muted-foreground size-4" aria-hidden />
          <h3 className="text-foreground text-sm font-semibold">{title}</h3>
          <span className="text-muted-foreground text-[11px] font-medium">{agents.length}</span>
        </div>
      </header>

      {(searchable || filterable) && (
        <div className="border-border flex flex-wrap items-center gap-2 border-b px-4 py-2">
          {searchable && (
            <input
              type="search"
              placeholder="Search agents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-8 flex-1 rounded-md border px-2.5 text-xs outline-none focus-visible:ring-2"
            />
          )}
          {filterable && (
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setStatusFilter(null)}
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors',
                  statusFilter === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
                )}
              >
                all
              </button>
              {ALL_STATUSES.filter((s) => counts.has(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(statusFilter === s ? null : s)}
                  data-active={statusFilter === s || undefined}
                  className="data-[active]:ring-primary/40 rounded-full ring-2 ring-transparent transition-all"
                >
                  <AgentStatusBadge status={s} compact />
                  <span className="text-muted-foreground ml-1 text-[10px] tabular-nums">
                    {counts.get(s)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          'max-h-[36rem] overflow-y-auto p-2',
          layout === 'list' ? 'flex flex-col gap-1.5' : 'grid grid-cols-1 gap-2 sm:grid-cols-2',
        )}
      >
        {filtered.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            compact={layout === 'list'}
            {...(onSelect ? { onSelect } : {})}
            selected={agent.id === activeId}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground col-span-2 px-3 py-6 text-center text-xs">
            {agents.length === 0
              ? 'No agents in this roster yet.'
              : 'No agents match the current filters.'}
          </p>
        )}
      </div>
    </div>
  );
}

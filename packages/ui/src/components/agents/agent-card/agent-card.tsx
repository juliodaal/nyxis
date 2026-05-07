'use client';

import { Bot, Wrench } from 'lucide-react';
import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import type { Agent } from '@nyxis/core';
import { AgentStatusBadge } from '../agent-status-badge/agent-status-badge.js';

export interface AgentCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Agent to render. */
  agent: Agent;
  /** Compact one-line variant. */
  compact?: boolean;
  /** Hide the trailing actions row. */
  hideActions?: boolean;
  /** Trailing slot for arbitrary content (e.g. a "view" button). */
  trailingSlot?: ReactNode;
  /** Click handler on the card body (selection). */
  onSelect?: (id: string) => void;
  /** Whether the card is currently selected. */
  selected?: boolean;
}

/**
 * Card representing a single agent in a multi-agent system. Surfaces
 * name, role, model, status, and the tools available to it. Pair with
 * `<AgentRoster>` for the team view.
 */
export function AgentCard({
  agent,
  compact = false,
  hideActions = false,
  trailingSlot,
  onSelect,
  selected = false,
  className,
  children,
  ...props
}: AgentCardProps) {
  const interactive = !!onSelect;

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onSelect ? () => onSelect(agent.id) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(agent.id);
              }
            }
          : undefined
      }
      data-status={agent.status}
      data-selected={selected || undefined}
      aria-pressed={interactive ? selected : undefined}
      className={cn(
        'border-border bg-card flex w-full flex-col gap-2 rounded-lg border p-3 text-left transition-colors',
        interactive &&
          'hover:bg-muted/40 focus-visible:ring-ring focus-visible:ring-offset-background cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'data-[selected]:border-primary/50 data-[selected]:bg-primary/5',
        compact && 'gap-1.5 p-2.5',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <AgentAvatar agent={agent} compact={compact} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                'text-foreground truncate font-semibold',
                compact ? 'text-xs' : 'text-sm',
              )}
            >
              {agent.name}
            </h3>
            <AgentStatusBadge status={agent.status} />
          </div>

          {agent.role && (
            <p className="text-muted-foreground mt-0.5 line-clamp-1 text-[11px] leading-snug">
              {agent.role}
            </p>
          )}

          {!compact && agent.modelId && (
            <p className="text-muted-foreground mt-1 font-mono text-[10px]">
              <Bot className="mr-1 inline size-3" aria-hidden />
              {agent.modelId}
            </p>
          )}
        </div>

        {trailingSlot}
      </div>

      {!compact && agent.tools && agent.tools.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <Wrench className="text-muted-foreground size-3" aria-hidden />
          {agent.tools.slice(0, 6).map((tool) => (
            <code
              key={tool}
              className="bg-muted text-foreground/80 rounded px-1.5 py-0.5 font-mono text-[10px]"
            >
              {tool}
            </code>
          ))}
          {agent.tools.length > 6 && (
            <span className="text-muted-foreground text-[10px]">+{agent.tools.length - 6}</span>
          )}
        </div>
      )}

      {!hideActions && children && (
        <div className="border-border mt-1 flex items-center gap-1 border-t pt-2">{children}</div>
      )}
    </div>
  );
}

function AgentAvatar({ agent, compact }: { agent: Agent; compact: boolean }) {
  const fallback =
    agent.initials ??
    agent.name
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0])
      .join('')
      .toUpperCase();

  if (agent.avatarUrl) {
    return (
      <img
        src={agent.avatarUrl}
        alt={agent.name}
        className={cn(
          'border-border shrink-0 rounded-full border object-cover',
          compact ? 'size-7' : 'size-9',
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        'bg-primary/15 text-primary grid shrink-0 place-items-center rounded-full font-semibold',
        compact ? 'size-7 text-[10px]' : 'size-9 text-xs',
      )}
      aria-hidden
    >
      {fallback}
    </span>
  );
}

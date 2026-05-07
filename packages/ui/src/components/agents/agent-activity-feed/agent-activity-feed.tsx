'use client';

import {
  AlertTriangle,
  ArrowRightLeft,
  Brain,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Play,
  Wrench,
} from 'lucide-react';
import { useState, type ComponentType, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { AgentActivity, AgentActivityKind } from '@nyxis/core';

export interface AgentActivityFeedProps extends HTMLAttributes<HTMLDivElement> {
  /** Activities, newest first. */
  activities: readonly AgentActivity[];
  /** Cap rendered entries (`+N earlier` footer). */
  limit?: number;
  /** Hide timestamps column. */
  hideTimestamps?: boolean;
  /** Empty-state placeholder. */
  emptyState?: React.ReactNode;
}

const KIND_ICON: Record<
  AgentActivityKind,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  thought: Brain,
  action: Play,
  'tool-call': Wrench,
  message: MessageSquare,
  handoff: ArrowRightLeft,
  error: AlertTriangle,
};

const KIND_TONE: Record<AgentActivityKind, string> = {
  thought: 'bg-primary/15 text-primary',
  action: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
  'tool-call': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  message: 'bg-muted text-muted-foreground',
  handoff: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
  error: 'bg-destructive/15 text-destructive',
};

const KIND_LABEL: Record<AgentActivityKind, string> = {
  thought: 'thought',
  action: 'action',
  'tool-call': 'tool',
  message: 'message',
  handoff: 'handoff',
  error: 'error',
};

/**
 * Vertical timeline of agent activity — thoughts, actions, tool calls,
 * messages, handoffs, errors. Pair with `<AgentRoster>` selection or use
 * standalone in a side rail.
 */
export function AgentActivityFeed({
  activities,
  limit,
  hideTimestamps = false,
  emptyState,
  className,
  ...props
}: AgentActivityFeedProps) {
  const [openIds, setOpenIds] = useState<readonly string[]>([]);

  if (activities.length === 0) {
    return (
      <div
        className={cn(
          'border-border bg-card text-muted-foreground rounded-lg border p-6 text-center text-sm',
          className,
        )}
        {...props}
      >
        {emptyState ?? 'No agent activity yet.'}
      </div>
    );
  }

  const visible = limit != null ? activities.slice(0, limit) : activities;
  const hidden = limit != null ? Math.max(0, activities.length - limit) : 0;

  const toggle = (id: string) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  return (
    <div
      className={cn(
        'border-border bg-card flex flex-col overflow-hidden rounded-lg border',
        className,
      )}
      {...props}
    >
      <ol className="divide-border max-h-[36rem] divide-y overflow-y-auto">
        {visible.map((activity) => {
          const Icon = KIND_ICON[activity.kind];
          const open = openIds.includes(activity.id);
          const hasDetail = !!activity.detail;
          return (
            <li key={activity.id}>
              <button
                type="button"
                onClick={() => hasDetail && toggle(activity.id)}
                disabled={!hasDetail}
                aria-expanded={hasDetail ? open : undefined}
                className={cn(
                  'flex w-full items-start gap-2.5 px-3 py-2 text-left transition-colors',
                  hasDetail && 'hover:bg-muted/40',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 grid size-5 shrink-0 place-items-center rounded',
                    KIND_TONE[activity.kind],
                  )}
                  aria-label={KIND_LABEL[activity.kind]}
                >
                  <Icon className="size-3" aria-hidden />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    {activity.agentName && (
                      <span className="text-foreground text-xs font-semibold">
                        {activity.agentName}
                      </span>
                    )}
                    <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                      {KIND_LABEL[activity.kind]}
                    </span>
                  </div>
                  <p className="text-foreground/90 mt-0.5 text-xs leading-snug">
                    {activity.summary}
                  </p>
                </div>

                {!hideTimestamps && (
                  <time
                    dateTime={
                      typeof activity.timestamp === 'string'
                        ? activity.timestamp
                        : activity.timestamp.toISOString()
                    }
                    className="text-muted-foreground shrink-0 font-mono text-[10px] tabular-nums"
                  >
                    {formatTime(activity.timestamp)}
                  </time>
                )}

                {hasDetail &&
                  (open ? (
                    <ChevronDown className="text-muted-foreground mt-0.5 size-3" aria-hidden />
                  ) : (
                    <ChevronRight className="text-muted-foreground mt-0.5 size-3" aria-hidden />
                  ))}
              </button>

              {open && hasDetail && (
                <div className="border-border bg-muted/30 border-t px-3 py-2">
                  <pre className="text-foreground/80 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[10px] leading-relaxed">
                    {activity.detail}
                  </pre>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {hidden > 0 && (
        <div className="border-border text-muted-foreground border-t px-3 py-1.5 text-center text-[11px]">
          + {hidden} earlier event{hidden === 1 ? '' : 's'}
        </div>
      )}
    </div>
  );
}

function formatTime(value: Date | string): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return typeof value === 'string' ? value : '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

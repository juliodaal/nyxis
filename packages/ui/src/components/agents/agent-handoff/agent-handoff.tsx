'use client';

import { ArrowRight, Check, Clock, X } from 'lucide-react';
import { type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { HandoffEvent } from '@nyxis/core';

export interface AgentHandoffProps extends HTMLAttributes<HTMLDivElement> {
  /** Handoff event to render. */
  handoff: HandoffEvent;
  /** Hide the lifecycle pill. */
  hideStatus?: boolean;
  /** Compact one-line variant. */
  compact?: boolean;
}

const STATE_TONE = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  accepted: 'bg-success/15 text-success',
  rejected: 'bg-destructive/15 text-destructive',
} as const;

const STATE_ICON = {
  pending: Clock,
  accepted: Check,
  rejected: X,
} as const;

/**
 * Card visualising a handoff between two agents — `from → to` with the
 * stated reason and an optional pending/accepted/rejected status. Drop
 * inline in `<AgentActivityFeed>` or use standalone after a planner
 * decision.
 */
export function AgentHandoff({
  handoff,
  hideStatus = false,
  compact = false,
  className,
  ...props
}: AgentHandoffProps) {
  const state = handoff.state ?? 'pending';
  const StateIcon = STATE_ICON[state];

  return (
    <div
      data-state={state}
      className={cn(
        'border-border bg-card flex flex-col gap-2 rounded-lg border p-3',
        'data-[state=accepted]:border-success/30',
        'data-[state=rejected]:border-destructive/30',
        compact && 'gap-1 p-2',
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'text-foreground rounded-full font-mono font-semibold',
            compact ? 'text-[11px]' : 'text-xs',
          )}
        >
          {handoff.fromAgentName ?? handoff.fromAgentId}
        </span>
        <ArrowRight className="text-muted-foreground size-3.5 shrink-0" aria-hidden />
        <span
          className={cn(
            'text-foreground rounded-full font-mono font-semibold',
            compact ? 'text-[11px]' : 'text-xs',
          )}
        >
          {handoff.toAgentName ?? handoff.toAgentId}
        </span>

        {!hideStatus && (
          <span
            className={cn(
              'ml-auto inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
              STATE_TONE[state],
            )}
          >
            <StateIcon className="size-2.5" aria-hidden />
            {state}
          </span>
        )}
      </div>

      {handoff.reason && !compact && (
        <p className="text-muted-foreground text-[11px] leading-snug">
          <span className="text-foreground/80 font-medium">Reason:</span> {handoff.reason}
        </p>
      )}

      {handoff.timestamp && !compact && (
        <time
          dateTime={
            typeof handoff.timestamp === 'string'
              ? handoff.timestamp
              : handoff.timestamp.toISOString()
          }
          className="text-muted-foreground font-mono text-[10px] tabular-nums"
        >
          {formatTime(handoff.timestamp)}
        </time>
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

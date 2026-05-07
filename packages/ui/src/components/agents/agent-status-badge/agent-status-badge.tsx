'use client';

import { AlertTriangle, Brain, Check, Circle, Loader2, Pause } from 'lucide-react';
import { type ComponentType, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { AgentStatus } from '@nyxis/core';

export interface AgentStatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: AgentStatus;
  /** Show only the dot/icon. */
  compact?: boolean;
  /** Override the human label. */
  label?: string;
}

const LABELS: Record<AgentStatus, string> = {
  idle: 'idle',
  thinking: 'thinking',
  working: 'working',
  blocked: 'blocked',
  done: 'done',
  errored: 'errored',
};

const ICONS: Record<AgentStatus, ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  idle: Circle,
  thinking: Brain,
  working: Loader2,
  blocked: Pause,
  done: Check,
  errored: AlertTriangle,
};

/**
 * Pill describing an agent's lifecycle. Drives icon, tone, and an
 * animated indicator (spin while `working`, pulse while `thinking`).
 * Use inline next to an agent name in any list, card, or feed.
 */
export function AgentStatusBadge({
  status,
  compact = false,
  label,
  className,
  ...props
}: AgentStatusBadgeProps) {
  const Icon = ICONS[status];
  const text = label ?? LABELS[status];

  return (
    <span
      data-status={status}
      role="status"
      aria-label={text}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        status === 'idle' && 'bg-muted text-muted-foreground',
        status === 'thinking' && 'bg-primary/15 text-primary',
        status === 'working' && 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
        status === 'blocked' && 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
        status === 'done' && 'bg-success/15 text-success',
        status === 'errored' && 'bg-destructive/15 text-destructive',
        compact && 'h-4 w-4 justify-center px-0',
        className,
      )}
      {...props}
    >
      <Icon
        className={cn(
          'size-3 shrink-0',
          status === 'working' && 'animate-spin',
          status === 'thinking' && 'animate-pulse',
        )}
        aria-hidden
      />
      {!compact && <span>{text}</span>}
    </span>
  );
}

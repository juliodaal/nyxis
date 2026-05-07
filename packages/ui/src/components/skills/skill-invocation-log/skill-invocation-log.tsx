'use client';

import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useState, type ComponentType, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { SkillInvocation, SkillInvocationStatus } from '@nyxis/core';

export interface SkillInvocationLogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Invocations, newest first. */
  invocations: readonly SkillInvocation[];
  /** Cap rendered entries (`+N more` footer). */
  limit?: number;
  /** Hide timestamps column. */
  hideTimestamps?: boolean;
  /** Click handler. */
  onSelect?: (invocation: SkillInvocation) => void;
  /** Empty-state placeholder. */
  emptyState?: React.ReactNode;
}

const STATUS_ICON: Record<
  SkillInvocationStatus,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  queued: Clock,
  running: Loader2,
  completed: Check,
  errored: AlertTriangle,
};

const STATUS_TONE: Record<SkillInvocationStatus, string> = {
  queued: 'bg-muted text-muted-foreground',
  running: 'bg-primary/15 text-primary',
  completed: 'bg-success/15 text-success',
  errored: 'bg-destructive/15 text-destructive',
};

/**
 * Vertical timeline of skill invocations. Each entry shows status,
 * skill name, action, duration, and an expandable input/result/error
 * payload.
 */
export function SkillInvocationLog({
  invocations,
  limit,
  hideTimestamps = false,
  onSelect,
  emptyState,
  className,
  ...props
}: SkillInvocationLogProps) {
  const [openIds, setOpenIds] = useState<readonly string[]>([]);

  if (invocations.length === 0) {
    return (
      <div
        className={cn(
          'border-border bg-card text-muted-foreground rounded-lg border p-6 text-center text-sm',
          className,
        )}
        {...props}
      >
        {emptyState ?? 'No skill invocations yet.'}
      </div>
    );
  }

  const visible = limit != null ? invocations.slice(0, limit) : invocations;
  const hidden = limit != null ? Math.max(0, invocations.length - limit) : 0;

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
        {visible.map((invocation) => {
          const StatusIcon = STATUS_ICON[invocation.status];
          const open = openIds.includes(invocation.id);
          const hasPayload =
            invocation.input !== undefined || invocation.result !== undefined || !!invocation.error;
          return (
            <li key={invocation.id}>
              <button
                type="button"
                onClick={() => {
                  if (hasPayload) toggle(invocation.id);
                  onSelect?.(invocation);
                }}
                aria-expanded={hasPayload ? open : undefined}
                className="hover:bg-muted/40 flex w-full items-start gap-2.5 px-3 py-2 text-left transition-colors"
              >
                <span
                  className={cn(
                    'mt-0.5 grid size-5 shrink-0 place-items-center rounded',
                    STATUS_TONE[invocation.status],
                  )}
                  aria-label={invocation.status}
                >
                  <StatusIcon
                    className={cn('size-3', invocation.status === 'running' && 'animate-spin')}
                    aria-hidden
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    {invocation.skillName && (
                      <span className="text-foreground inline-flex items-center gap-1 text-xs font-semibold">
                        <Sparkles className="text-muted-foreground size-3" aria-hidden />
                        {invocation.skillName}
                      </span>
                    )}
                    <code className="text-muted-foreground font-mono text-[11px]">
                      {invocation.action}
                    </code>
                  </div>
                  {invocation.error && !open && (
                    <p className="text-destructive line-clamp-1 text-[11px]">{invocation.error}</p>
                  )}
                </div>

                <div className="text-muted-foreground flex shrink-0 items-center gap-2 font-mono text-[10px] tabular-nums">
                  {invocation.durationMs != null && (
                    <span>{formatDuration(invocation.durationMs)}</span>
                  )}
                  {!hideTimestamps && (
                    <time
                      dateTime={
                        typeof invocation.startedAt === 'string'
                          ? invocation.startedAt
                          : invocation.startedAt.toISOString()
                      }
                    >
                      {formatTime(invocation.startedAt)}
                    </time>
                  )}
                  {hasPayload &&
                    (open ? (
                      <ChevronDown className="size-3" aria-hidden />
                    ) : (
                      <ChevronRight className="size-3" aria-hidden />
                    ))}
                </div>
              </button>

              {open && hasPayload && (
                <div className="border-border bg-muted/30 grid gap-2 border-t px-3 py-2 sm:grid-cols-2">
                  {invocation.input !== undefined && (
                    <PayloadCell label="input" value={invocation.input} />
                  )}
                  {invocation.result !== undefined && (
                    <PayloadCell label="result" value={invocation.result} />
                  )}
                  {invocation.error && (
                    <div className="sm:col-span-2">
                      <p className="text-destructive mb-1 text-[10px] font-semibold uppercase tracking-wider">
                        error
                      </p>
                      <pre className="text-destructive whitespace-pre-wrap break-words font-mono text-[11px]">
                        {invocation.error}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {hidden > 0 && (
        <div className="border-border text-muted-foreground border-t px-3 py-1.5 text-center text-[11px]">
          + {hidden} earlier invocation{hidden === 1 ? '' : 's'}
        </div>
      )}
    </div>
  );
}

function PayloadCell({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
        {label}
      </p>
      <pre className="text-foreground/85 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[10px] leading-relaxed">
        {stringify(value)}
      </pre>
    </div>
  );
}

function stringify(v: unknown): string {
  if (typeof v === 'string') return v;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 60_000)}m`;
}

function formatTime(value: Date | string): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return typeof value === 'string' ? value : '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

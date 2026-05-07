'use client';

import { ArrowLeft, ArrowRight, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import type { MCPLogDirection, MCPLogEntry } from '@nyxis/core';

export interface MCPLogStreamProps extends HTMLAttributes<HTMLDivElement> {
  /** Entries, newest first. */
  entries: readonly MCPLogEntry[];
  /** Cap rendered entries (`+N more` footer). */
  limit?: number;
  /** Hide timestamps column. */
  hideTimestamps?: boolean;
  /** Empty-state placeholder. */
  emptyState?: React.ReactNode;
}

const DIRECTION_ICON = {
  in: ArrowLeft,
  out: ArrowRight,
  event: Bell,
} as const;

const DIRECTION_LABEL: Record<MCPLogDirection, string> = {
  in: 'in',
  out: 'out',
  event: 'event',
};

/**
 * Real-time stream of MCP traffic — JSON-RPC requests/responses and
 * server-emitted events. Each entry is collapsible and shows the
 * payload as JSON when expanded. Pair with a server-side log feed or
 * `EventSource` listener.
 */
export function MCPLogStream({
  entries,
  limit,
  hideTimestamps = false,
  emptyState,
  className,
  ...props
}: MCPLogStreamProps) {
  const [openIds, setOpenIds] = useState<readonly string[]>([]);

  if (entries.length === 0) {
    return (
      <div
        className={cn(
          'border-border bg-card text-muted-foreground rounded-lg border p-6 text-center text-sm',
          className,
        )}
        {...props}
      >
        {emptyState ?? 'No traffic yet.'}
      </div>
    );
  }

  const visible = limit != null ? entries.slice(0, limit) : entries;
  const hidden = limit != null ? Math.max(0, entries.length - limit) : 0;

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
      <ol className="divide-border max-h-[28rem] divide-y overflow-y-auto">
        {visible.map((entry) => {
          const Icon = DIRECTION_ICON[entry.direction];
          const open = openIds.includes(entry.id);
          const hasPayload = entry.payload !== undefined;
          return (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => hasPayload && toggle(entry.id)}
                disabled={!hasPayload}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors',
                  hasPayload && 'hover:bg-muted/40',
                )}
                aria-expanded={hasPayload ? open : undefined}
              >
                {!hideTimestamps && (
                  <time
                    dateTime={
                      typeof entry.timestamp === 'string'
                        ? entry.timestamp
                        : entry.timestamp.toISOString()
                    }
                    className="text-muted-foreground w-16 shrink-0 font-mono text-[10px] tabular-nums"
                  >
                    {formatTime(entry.timestamp)}
                  </time>
                )}

                <span
                  className={cn(
                    'inline-flex shrink-0 items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider',
                    entry.direction === 'in' &&
                      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
                    entry.direction === 'out' && 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
                    entry.direction === 'event' &&
                      'bg-amber-500/15 text-amber-700 dark:text-amber-400',
                  )}
                >
                  <Icon className="size-2.5" aria-hidden />
                  {DIRECTION_LABEL[entry.direction]}
                </span>

                <code className="text-foreground min-w-0 flex-1 truncate font-mono text-[11px]">
                  {entry.method}
                </code>

                {entry.level && (
                  <span
                    className={cn(
                      'shrink-0 rounded px-1 py-0.5 text-[9px] font-semibold uppercase',
                      entry.level === 'error' && 'bg-destructive/15 text-destructive',
                      entry.level === 'warn' &&
                        'bg-amber-500/15 text-amber-700 dark:text-amber-400',
                      entry.level === 'info' && 'bg-muted text-muted-foreground',
                      entry.level === 'debug' && 'bg-muted text-muted-foreground/70',
                    )}
                  >
                    {entry.level}
                  </span>
                )}

                {hasPayload &&
                  (open ? (
                    <ChevronDown className="text-muted-foreground size-3" aria-hidden />
                  ) : (
                    <ChevronRight className="text-muted-foreground size-3" aria-hidden />
                  ))}
              </button>

              {open && hasPayload && (
                <div className="border-border bg-muted/30 border-t px-3 py-2">
                  <pre className="text-foreground/90 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[10px] leading-relaxed">
                    {stringify(entry.payload)}
                  </pre>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {hidden > 0 && (
        <div className="border-border text-muted-foreground border-t px-3 py-1.5 text-center text-[11px]">
          + {hidden} earlier entr{hidden === 1 ? 'y' : 'ies'}
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
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${ms.slice(0, 2)}`;
}

function stringify(value: unknown): string {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

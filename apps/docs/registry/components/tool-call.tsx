'use client';

import { AlertTriangle, Check, ChevronDown, ChevronRight, Loader2, Wrench } from 'lucide-react';
import { useState, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { AIToolCallStatus } from '@nyxis/core';

export interface ToolCallProps extends HTMLAttributes<HTMLDivElement> {
  /** Tool name (e.g. `search_documents`). */
  name: string;
  /** Arguments the model passed in. */
  args?: Record<string, unknown>;
  /** Current execution status. */
  status?: AIToolCallStatus;
  /** Total run time in ms (rendered as e.g. `420ms`). */
  durationMs?: number;
  /** Render the args block collapsed by default. */
  defaultOpen?: boolean;
  /** Use a one-line compact row instead of the full card. */
  compact?: boolean;
  /** Custom slot rendered after the header (e.g. live progress). */
  trailingSlot?: ReactNode;
}

/**
 * Card representing a single tool invocation by the model. Pair with
 * `<ToolResult>` to surface the output. Status drives the icon/colour.
 */
export function ToolCall({
  name,
  args,
  status = 'pending',
  durationMs,
  defaultOpen = false,
  compact = false,
  trailingSlot,
  className,
  children,
  ...props
}: ToolCallProps) {
  const [open, setOpen] = useState(defaultOpen);
  const hasArgs = args && Object.keys(args).length > 0;

  const tone =
    status === 'completed'
      ? 'success'
      : status === 'errored'
        ? 'error'
        : status === 'running'
          ? 'running'
          : 'pending';

  return (
    <div
      data-status={status}
      data-tone={tone}
      className={cn(
        'border-border bg-card group relative overflow-hidden rounded-lg border',
        'data-[tone=success]:border-success/30 data-[tone=error]:border-destructive/40',
        'data-[tone=running]:border-primary/40',
        compact && 'rounded-md',
        className,
      )}
      {...props}
    >
      <button
        type="button"
        onClick={() => hasArgs && setOpen((v) => !v)}
        disabled={!hasArgs}
        className={cn(
          'flex w-full items-center gap-2.5 px-3 py-2 text-left',
          'hover:bg-muted/50 transition-colors',
          'disabled:cursor-default',
          compact && 'py-1.5 text-xs',
        )}
        aria-expanded={hasArgs ? open : undefined}
      >
        <StatusIcon status={status} />
        <code className="text-foreground flex-1 truncate font-mono text-sm font-medium">
          {name}
        </code>
        {trailingSlot}
        {durationMs != null && status !== 'pending' && (
          <span className="text-muted-foreground text-[11px] font-medium tabular-nums">
            {formatDuration(durationMs)}
          </span>
        )}
        <StatusBadge status={status} />
        {hasArgs ? (
          open ? (
            <ChevronDown className="text-muted-foreground size-3.5" aria-hidden />
          ) : (
            <ChevronRight className="text-muted-foreground size-3.5" aria-hidden />
          )
        ) : null}
      </button>

      {hasArgs && open && (
        <div className="border-border bg-muted/30 border-t px-3 py-2.5">
          <p className="text-muted-foreground mb-1.5 text-[10px] font-semibold uppercase tracking-wider">
            Arguments
          </p>
          <pre className="text-foreground/90 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed">
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>
      )}

      {children}
    </div>
  );
}

function StatusIcon({ status }: { status: AIToolCallStatus }) {
  switch (status) {
    case 'completed':
      return (
        <span className="bg-success/15 text-success grid size-5 shrink-0 place-items-center rounded">
          <Check className="size-3" aria-hidden />
        </span>
      );
    case 'errored':
      return (
        <span className="bg-destructive/15 text-destructive grid size-5 shrink-0 place-items-center rounded">
          <AlertTriangle className="size-3" aria-hidden />
        </span>
      );
    case 'running':
      return (
        <span className="bg-primary/15 text-primary grid size-5 shrink-0 place-items-center rounded">
          <Loader2 className="size-3 animate-spin" aria-hidden />
        </span>
      );
    default:
      return (
        <span className="bg-muted text-muted-foreground grid size-5 shrink-0 place-items-center rounded">
          <Wrench className="size-3" aria-hidden />
        </span>
      );
  }
}

function StatusBadge({ status }: { status: AIToolCallStatus }) {
  const label =
    status === 'completed'
      ? 'done'
      : status === 'errored'
        ? 'error'
        : status === 'running'
          ? 'running'
          : 'pending';
  return (
    <span
      className={cn(
        'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        status === 'completed' && 'bg-success/15 text-success',
        status === 'errored' && 'bg-destructive/15 text-destructive',
        status === 'running' && 'bg-primary/15 text-primary',
        status === 'pending' && 'bg-muted text-muted-foreground',
      )}
    >
      {label}
    </span>
  );
}

function formatDuration(ms: number) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 1000)}s`;
}

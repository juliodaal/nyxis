'use client';

import { AlertTriangle, Ban, Check, Clock, Loader2 } from 'lucide-react';
import { type ComponentType, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { EvalRun, EvalRunStatus } from '@nyxis/core';
import { MetricCard } from '../metric-card/metric-card.js';

export interface EvalRunCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Run to render. */
  run: EvalRun;
  /** Compact one-line variant (no metrics). */
  compact?: boolean;
  /** Click handler — typically opens the full run page. */
  onSelect?: (id: string) => void;
  /** Whether the card is currently selected. */
  selected?: boolean;
  /** Hide the inline metric strip. */
  hideMetrics?: boolean;
}

const STATUS_ICON: Record<
  EvalRunStatus,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  queued: Clock,
  running: Loader2,
  completed: Check,
  failed: AlertTriangle,
  cancelled: Ban,
};

const STATUS_TONE: Record<EvalRunStatus, string> = {
  queued: 'bg-muted text-muted-foreground',
  running: 'bg-primary/15 text-primary',
  completed: 'bg-success/15 text-success',
  failed: 'bg-destructive/15 text-destructive',
  cancelled: 'bg-muted text-muted-foreground',
};

/**
 * Card summarising a single evaluation run. Surfaces status, prompt,
 * model, dataset, progress (when running), inline metric strip, and
 * duration. Pair with `<MetricCard>` for the headline metrics.
 */
export function EvalRunCard({
  run,
  compact = false,
  onSelect,
  selected = false,
  hideMetrics = false,
  className,
  children,
  ...props
}: EvalRunCardProps) {
  const StatusIcon = STATUS_ICON[run.status];
  const interactive = !!onSelect;
  const progressPct =
    run.totalRows && run.processedRows
      ? Math.min(100, Math.round((run.processedRows / run.totalRows) * 100))
      : null;

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onSelect ? () => onSelect(run.id) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(run.id);
              }
            }
          : undefined
      }
      data-status={run.status}
      data-selected={selected || undefined}
      aria-pressed={interactive ? selected : undefined}
      className={cn(
        'border-border bg-card flex flex-col gap-3 rounded-lg border p-4 text-left transition-colors',
        interactive &&
          'hover:bg-muted/40 focus-visible:ring-ring focus-visible:ring-offset-background cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'data-[selected]:border-primary/50 data-[selected]:bg-primary/5',
        'data-[status=failed]:border-destructive/30',
        compact && 'gap-2 p-3',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'grid shrink-0 place-items-center rounded-md',
            STATUS_TONE[run.status],
            compact ? 'size-7' : 'size-9',
          )}
          aria-label={run.status}
        >
          {run.status === 'running' ? (
            <Loader2 className={cn('animate-spin', compact ? 'size-3.5' : 'size-4')} aria-hidden />
          ) : (
            <StatusIcon className={cn(compact ? 'size-3.5' : 'size-4')} aria-hidden />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                'text-foreground truncate font-semibold',
                compact ? 'text-xs' : 'text-sm',
              )}
            >
              {run.name}
            </h3>
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                STATUS_TONE[run.status],
              )}
            >
              {run.status}
            </span>
          </div>

          {!compact && (
            <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-3 text-[11px]">
              {run.modelId && <span className="font-mono">model: {run.modelId}</span>}
              {run.datasetName && <span>dataset: {run.datasetName}</span>}
              {run.totalRows != null && (
                <span className="tabular-nums">
                  {run.processedRows ?? 0} / {run.totalRows} rows
                </span>
              )}
              {run.durationMs != null && (
                <span className="tabular-nums">{formatDuration(run.durationMs)}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {run.status === 'running' && progressPct != null && (
        <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
          <div className="bg-primary h-full transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      )}

      {run.status === 'failed' && run.error && (
        <p className="text-destructive border-destructive/30 bg-destructive/5 rounded border px-2 py-1 font-mono text-[11px]">
          {run.error}
        </p>
      )}

      {!hideMetrics && !compact && run.metrics && run.metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {run.metrics.slice(0, 6).map((metric) => (
            <MetricCard key={metric.name} metric={metric} compact hideSparkline />
          ))}
        </div>
      )}

      {children}
    </div>
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  return `${(ms / 3_600_000).toFixed(1)}h`;
}

'use client';

import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { EvalMetric } from '../../../ai/types.js';

export interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  metric: EvalMetric;
  /** Compact one-line variant. */
  compact?: boolean;
  /** Hide the sparkline even if present. */
  hideSparkline?: boolean;
}

/**
 * Card surfacing one metric from an eval run — current value, delta vs
 * baseline (with a tone driven by `goodDirection`), and an optional
 * inline sparkline.
 */
export function MetricCard({
  metric,
  compact = false,
  hideSparkline = false,
  className,
  ...props
}: MetricCardProps) {
  const formatted = formatValue(metric);
  const delta =
    metric.baseline != null ? roundTo(metric.value - metric.baseline, metric.precision ?? 1) : null;
  const tone = deltaTone(delta, metric.goodDirection ?? 'up');

  return (
    <div
      className={cn(
        'border-border bg-card flex flex-col gap-1 rounded-lg border p-3',
        compact && 'gap-0.5 p-2.5',
        className,
      )}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p
          className={cn(
            'text-muted-foreground font-medium uppercase tracking-wider',
            compact ? 'text-[10px]' : 'text-[11px]',
          )}
        >
          {metric.name}
        </p>
        {delta != null && (
          <span
            data-tone={tone}
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-mono tabular-nums',
              compact ? 'text-[10px]' : 'text-[11px]',
              'data-[tone=good]:bg-success/15 data-[tone=good]:text-success',
              'data-[tone=bad]:bg-destructive/15 data-[tone=bad]:text-destructive',
              'data-[tone=neutral]:bg-muted data-[tone=neutral]:text-muted-foreground',
            )}
          >
            {delta > 0 ? (
              <ArrowUp className="size-2.5" aria-hidden />
            ) : delta < 0 ? (
              <ArrowDown className="size-2.5" aria-hidden />
            ) : (
              <Minus className="size-2.5" aria-hidden />
            )}
            {Math.abs(delta).toLocaleString(undefined, {
              maximumFractionDigits: metric.precision ?? 1,
            })}
            {metric.unit ?? ''}
          </span>
        )}
      </div>

      <p
        className={cn(
          'text-foreground font-semibold tabular-nums',
          compact ? 'text-base' : 'text-2xl',
        )}
      >
        {formatted}
        {metric.unit && (
          <span className="text-muted-foreground ml-1 text-xs font-normal">{metric.unit}</span>
        )}
      </p>

      {!hideSparkline && metric.sparkline && metric.sparkline.length > 1 && (
        <Sparkline values={metric.sparkline} tone={tone} compact={compact} />
      )}
    </div>
  );
}

function Sparkline({
  values,
  tone,
  compact,
}: {
  values: readonly number[];
  tone: 'good' | 'bad' | 'neutral';
  compact: boolean;
}) {
  const width = compact ? 80 : 120;
  const height = compact ? 16 : 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const points = values
    .map((v, i) => `${i * stepX},${height - ((v - min) / range) * height}`)
    .join(' ');

  return (
    <svg width={width} height={height} className="mt-0.5" aria-hidden>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className={cn(
          tone === 'good' && 'text-success',
          tone === 'bad' && 'text-destructive',
          tone === 'neutral' && 'text-muted-foreground',
        )}
      />
    </svg>
  );
}

function formatValue(metric: EvalMetric): string {
  const precision = metric.precision ?? (Math.abs(metric.value) < 1 ? 3 : 1);
  return metric.value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  });
}

function roundTo(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

function deltaTone(delta: number | null, goodDirection: 'up' | 'down'): 'good' | 'bad' | 'neutral' {
  if (delta == null || delta === 0) return 'neutral';
  if (goodDirection === 'up') return delta > 0 ? 'good' : 'bad';
  return delta < 0 ? 'good' : 'bad';
}

'use client';

import { ArrowDown, ArrowRight, ArrowUp, Minus } from 'lucide-react';
import { type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { EvalMetric } from '../../../ai/types.js';

export interface ABCompareSide {
  /** Display label for this side. */
  label: string;
  /** Optional sub-label (e.g. version). */
  sublabel?: string;
  /** Metrics measured on this side. */
  metrics?: readonly EvalMetric[];
  /** Optional sample output for the demo input. */
  sample?: string;
  /** Optional model id. */
  modelId?: string;
}

export interface ABCompareProps extends HTMLAttributes<HTMLDivElement> {
  /** Left side ("A"). */
  a: ABCompareSide;
  /** Right side ("B"). */
  b: ABCompareSide;
  /** Optional shared input that both sides were tested with. */
  input?: string;
  /** Hide the sample-output rows even if present. */
  hideSamples?: boolean;
  /** Treat side B as the baseline (deltas point B → A). Default: A is the baseline. */
  baselineSide?: 'a' | 'b';
}

/**
 * Side-by-side comparison of two prompts (or two model runs of the
 * same prompt). Renders matched metrics with delta arrows showing
 * which side won each one, plus optional sample outputs.
 */
export function ABCompare({
  a,
  b,
  input,
  hideSamples = false,
  baselineSide = 'a',
  className,
  ...props
}: ABCompareProps) {
  const baseline = baselineSide === 'a' ? a : b;
  const challenger = baselineSide === 'a' ? b : a;

  const baselineMetrics = baseline.metrics ?? [];
  const challengerMetrics = challenger.metrics ?? [];
  const metricNames = unique([
    ...baselineMetrics.map((m) => m.name),
    ...challengerMetrics.map((m) => m.name),
  ]);

  return (
    <div
      className={cn('border-border bg-card flex flex-col gap-4 rounded-lg border p-4', className)}
      {...props}
    >
      {input && (
        <div>
          <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
            Input
          </p>
          <p className="text-foreground/90 bg-muted/30 rounded-md p-2.5 font-mono text-[11px] leading-relaxed">
            {input}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SidePanel label="A" side={a} accent="primary" />
        <SidePanel label="B" side={b} accent="violet" />
      </div>

      {metricNames.length > 0 && (
        <div className="border-border border-t pt-3">
          <p className="text-muted-foreground mb-2 text-[10px] font-semibold uppercase tracking-wider">
            Metric comparison
          </p>
          <ul className="flex flex-col gap-1.5">
            {metricNames.map((name) => {
              const aMetric = a.metrics?.find((m) => m.name === name);
              const bMetric = b.metrics?.find((m) => m.name === name);
              return (
                <MetricRow
                  key={name}
                  name={name}
                  {...(aMetric ? { aMetric } : {})}
                  {...(bMetric ? { bMetric } : {})}
                  baselineSide={baselineSide}
                />
              );
            })}
          </ul>
        </div>
      )}

      {!hideSamples && (a.sample || b.sample) && (
        <div className="border-border border-t pt-3">
          <p className="text-muted-foreground mb-2 text-[10px] font-semibold uppercase tracking-wider">
            Sample output
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SamplePanel label="A" {...(a.sample !== undefined ? { text: a.sample } : {})} />
            <SamplePanel label="B" {...(b.sample !== undefined ? { text: b.sample } : {})} />
          </div>
        </div>
      )}
    </div>
  );
}

function SidePanel({
  label,
  side,
  accent,
}: {
  label: string;
  side: ABCompareSide;
  accent: 'primary' | 'violet';
}) {
  return (
    <div
      className={cn(
        'border-border rounded-md border p-3',
        accent === 'primary'
          ? 'border-primary/30 bg-primary/5'
          : 'border-violet-500/30 bg-violet-500/5',
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span
          className={cn(
            'rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider',
            accent === 'primary'
              ? 'bg-primary text-primary-foreground'
              : 'bg-violet-500 text-white',
          )}
        >
          {label}
        </span>
        <span className="text-foreground text-sm font-semibold">{side.label}</span>
      </div>

      {side.sublabel && <p className="text-muted-foreground mt-0.5 text-[11px]">{side.sublabel}</p>}

      {side.modelId && (
        <p className="text-muted-foreground mt-1 font-mono text-[10px]">model: {side.modelId}</p>
      )}
    </div>
  );
}

function MetricRow({
  name,
  aMetric,
  bMetric,
  baselineSide,
}: {
  name: string;
  aMetric?: EvalMetric;
  bMetric?: EvalMetric;
  baselineSide: 'a' | 'b';
}) {
  const baseline = baselineSide === 'a' ? aMetric : bMetric;
  const challenger = baselineSide === 'a' ? bMetric : aMetric;
  const baselineLabel = baselineSide === 'a' ? 'A' : 'B';
  const challengerLabel = baselineSide === 'a' ? 'B' : 'A';

  let delta: number | null = null;
  let tone: 'good' | 'bad' | 'neutral' = 'neutral';

  if (baseline && challenger) {
    delta = challenger.value - baseline.value;
    if (delta === 0) tone = 'neutral';
    else {
      const dir = baseline.goodDirection ?? challenger.goodDirection ?? 'up';
      if (dir === 'up') tone = delta > 0 ? 'good' : 'bad';
      else tone = delta < 0 ? 'good' : 'bad';
    }
  }

  const aDisplay = formatMetric(aMetric);
  const bDisplay = formatMetric(bMetric);

  return (
    <li className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3">
      <span className="text-foreground/90 text-xs font-medium">{name}</span>
      <span
        className={cn(
          'font-mono text-xs tabular-nums',
          baselineLabel === 'A' ? 'text-primary' : 'text-violet-700 dark:text-violet-400',
        )}
      >
        {aDisplay}
      </span>
      <ArrowRight className="text-muted-foreground size-3" aria-hidden />
      <span
        data-tone={tone}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[11px] tabular-nums',
          'data-[tone=good]:bg-success/15 data-[tone=good]:text-success',
          'data-[tone=bad]:bg-destructive/15 data-[tone=bad]:text-destructive',
          'data-[tone=neutral]:bg-muted data-[tone=neutral]:text-muted-foreground',
        )}
      >
        <span
          className={
            baselineLabel === 'B' ? 'text-primary' : 'text-violet-700 dark:text-violet-400'
          }
        >
          {bDisplay}
        </span>
        {delta != null && delta !== 0 && (
          <>
            {delta > 0 ? (
              <ArrowUp className="size-2.5" aria-hidden />
            ) : (
              <ArrowDown className="size-2.5" aria-hidden />
            )}
            <span>{Math.abs(delta).toFixed(challenger?.precision ?? 1)}</span>
          </>
        )}
        {delta === 0 && <Minus className="size-2.5" aria-hidden />}
        <span className="text-muted-foreground">vs {challengerLabel}</span>
      </span>
    </li>
  );
}

function SamplePanel({ label, text }: { label: string; text?: string }) {
  return (
    <div className="border-border bg-muted/30 rounded-md border p-2.5">
      <p className="text-muted-foreground mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider">
        {label}
      </p>
      <pre className="text-foreground/90 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed">
        {text ?? '—'}
      </pre>
    </div>
  );
}

function formatMetric(metric?: EvalMetric): string {
  if (!metric) return '—';
  const precision = metric.precision ?? (Math.abs(metric.value) < 1 ? 3 : 1);
  return `${metric.value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  })}${metric.unit ?? ''}`;
}

function unique<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

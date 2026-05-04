import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils.js';

export interface KPICardProps extends HTMLAttributes<HTMLDivElement> {
  /** Metric label, e.g. "MRR". */
  label: string;
  /** Pre-formatted value. */
  value: string;
  /** Period covered (subtitle). */
  period?: string;
  /** Numeric delta as a fraction (0.12 = +12%). */
  delta?: number;
  /** Optional sparkline data (0..1 normalized). */
  sparkline?: readonly number[];
}

/**
 * Number + delta + optional sparkline. The headline component for
 * **PulseReport** dashboards.
 */
export const KPICard = forwardRef<HTMLDivElement, KPICardProps>(function KPICard(
  { label, value, period, delta, sparkline, className, ...props },
  ref,
) {
  const tone = delta === undefined ? 'flat' : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const Icon = tone === 'up' ? ArrowUpRight : tone === 'down' ? ArrowDownRight : Minus;
  const pct = delta === undefined ? null : `${delta > 0 ? '+' : ''}${(delta * 100).toFixed(1)}%`;

  return (
    <div
      ref={ref}
      className={cn(
        'border-border bg-card shadow-soft flex flex-col gap-3 rounded-lg border p-5',
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          {label}
        </p>
        {pct ? (
          <span
            data-tone={tone}
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium',
              'data-[tone=up]:bg-success/15 data-[tone=up]:text-success',
              'data-[tone=down]:bg-destructive/15 data-[tone=down]:text-destructive',
              'data-[tone=flat]:bg-muted data-[tone=flat]:text-muted-foreground',
            )}
          >
            <Icon className="size-3" aria-hidden="true" />
            {pct}
          </span>
        ) : null}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-foreground text-3xl font-bold tabular-nums">{value}</span>
        {period ? <span className="text-muted-foreground text-xs">{period}</span> : null}
      </div>
      {sparkline && sparkline.length > 1 ? <Sparkline points={sparkline} tone={tone} /> : null}
    </div>
  );
});

function Sparkline({ points, tone }: { points: readonly number[]; tone: 'up' | 'down' | 'flat' }) {
  const w = 200;
  const h = 36;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - p * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
  const stroke =
    tone === 'up'
      ? 'var(--color-success)'
      : tone === 'down'
        ? 'var(--color-destructive)'
        : 'var(--color-muted-foreground)';
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-9 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label="Trend sparkline"
    >
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

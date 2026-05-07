import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface SentimentIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Sentiment score, -1 (very negative) → 1 (very positive). */
  score: number;
  /** Show a numeric label alongside the bar. */
  showLabel?: boolean;
}

/**
 * Compact sentiment bar with positive/neutral/negative regions. Useful
 * for support tickets, call mood, review aggregation, etc.
 */
export const SentimentIndicator = forwardRef<HTMLDivElement, SentimentIndicatorProps>(
  function SentimentIndicator({ score, showLabel = true, className, ...props }, ref) {
    const clamped = Math.max(-1, Math.min(1, score));
    const tone = clamped > 0.2 ? 'positive' : clamped < -0.2 ? 'negative' : 'neutral';
    const left = ((clamped + 1) / 2) * 100;

    return (
      <div ref={ref} className={cn('flex items-center gap-3', className)} {...props}>
        <div className="bg-muted relative h-2 flex-1 overflow-hidden rounded-full">
          <div
            className="border-background absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{
              left: `${left}%`,
              background:
                tone === 'positive'
                  ? 'var(--color-success)'
                  : tone === 'negative'
                    ? 'var(--color-destructive)'
                    : 'var(--color-muted-foreground)',
            }}
          />
        </div>
        {showLabel ? (
          <span
            data-tone={tone}
            className={cn(
              'min-w-[3rem] text-right text-xs font-medium tabular-nums',
              'data-[tone=positive]:text-success',
              'data-[tone=neutral]:text-muted-foreground',
              'data-[tone=negative]:text-destructive',
            )}
          >
            {clamped > 0 ? '+' : ''}
            {clamped.toFixed(2)}
          </span>
        ) : null}
      </div>
    );
  },
);

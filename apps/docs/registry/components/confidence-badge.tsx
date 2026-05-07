import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface ConfidenceBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Confidence value, 0..1. */
  score: number;
  /** Threshold below which the badge turns red. Default 0.6. */
  lowThreshold?: number;
  /** Threshold above which the badge turns green. Default 0.85. */
  highThreshold?: number;
  /** Show the percentage label. */
  showLabel?: boolean;
}

/**
 * Color-coded confidence indicator for AI extractions and classifications.
 *
 * Tone tiers default to >=0.85 high (green), >=0.6 medium (amber), <0.6
 * low (red). Tones are driven by data-tone attributes so theming follows
 * your design tokens (`--success`, `--warning`, `--destructive`).
 */
export const ConfidenceBadge = forwardRef<HTMLSpanElement, ConfidenceBadgeProps>(
  function ConfidenceBadge(
    { score, lowThreshold = 0.6, highThreshold = 0.85, showLabel = true, className, ...props },
    ref,
  ) {
    const clamped = Math.max(0, Math.min(1, score));
    const tone = clamped >= highThreshold ? 'high' : clamped >= lowThreshold ? 'medium' : 'low';
    const pct = Math.round(clamped * 100);

    return (
      <span
        ref={ref}
        data-tone={tone}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
          'data-[tone=high]:bg-success/15 data-[tone=high]:text-success',
          'data-[tone=medium]:bg-warning/20 data-[tone=medium]:text-warning',
          'data-[tone=low]:bg-destructive/15 data-[tone=low]:text-destructive',
          className,
        )}
        title={`Confidence: ${pct}%`}
        {...props}
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
        {showLabel ? `${pct}%` : null}
      </span>
    );
  },
);

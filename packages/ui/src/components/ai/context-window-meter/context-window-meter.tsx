'use client';

import { useMemo } from 'react';

import { cn } from '../../../lib/utils.js';
import { findModel } from '@nyxis/core';

export interface ContextWindowMeterProps {
  /** Tokens currently consumed. */
  used: number;
  /** Total context window. Falls back to the model's declared window if `modelId` is set. */
  total?: number;
  /** Optional model id for automatic total. */
  modelId?: string;
  /** Compact mode: just the bar + percent, no detailed labels. */
  compact?: boolean;
  className?: string;
}

/**
 * Bar chart showing how much of the context window is consumed. Three
 * tones: green ≤70%, amber 70–90%, red >90%.
 */
export function ContextWindowMeter({
  used,
  total,
  modelId,
  compact = false,
  className,
}: ContextWindowMeterProps) {
  const model = useMemo(() => (modelId ? findModel(modelId) : undefined), [modelId]);
  const window = total ?? model?.contextWindow ?? 0;

  const pct = window > 0 ? Math.min(1, used / window) : 0;
  const tone = pct < 0.7 ? 'safe' : pct < 0.9 ? 'warn' : 'crit';

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {!compact && (
        <div className="flex items-baseline justify-between gap-3 text-xs">
          <span className="text-foreground font-medium">Context</span>
          <span className="text-muted-foreground font-mono tabular-nums">
            {used.toLocaleString()} / {window > 0 ? window.toLocaleString() : '?'} tokens
          </span>
        </div>
      )}
      <div className="bg-muted relative h-1.5 w-full overflow-hidden rounded-full">
        <div
          data-tone={tone}
          className={cn(
            'h-full rounded-full transition-all duration-300',
            'data-[tone=safe]:bg-success data-[tone=warn]:bg-warning data-[tone=crit]:bg-destructive',
          )}
          style={{ width: `${(pct * 100).toFixed(2)}%` }}
        />
      </div>
      {compact && (
        <span className="text-muted-foreground text-[11px]">
          <span className="font-mono tabular-nums">{(pct * 100).toFixed(1)}%</span> of context
        </span>
      )}
    </div>
  );
}

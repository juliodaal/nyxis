'use client';

import { Coins } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '../../../lib/utils.js';
import { nyxisAIEvents } from '../../../ai/events.js';
import type { AIUsage } from '../../../ai/types.js';

export interface CostMeterProps {
  /** Override / seed the running cost (USD). When omitted, the meter
   *  starts at 0 and accumulates from `usage` events. */
  initial?: number;
  /** Optional fallback rate when an event lacks `costUsd` — input + output blended price per 1M tokens. */
  fallbackRatePerMTokens?: number;
  /** Show input/output token breakdown alongside the cost. */
  detailed?: boolean;
  className?: string;
}

/**
 * Live USD cost meter for the current session. Subscribes to
 * `nyxisAIEvents` `usage` events and accumulates totals automatically.
 */
export function CostMeter({
  initial = 0,
  fallbackRatePerMTokens = 5,
  detailed = false,
  className,
}: CostMeterProps) {
  const [cost, setCost] = useState(initial);
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);

  useEffect(() => {
    return nyxisAIEvents.subscribe((event) => {
      if (event.type === 'usage') {
        const usage: AIUsage = event.usage;
        setInputTokens((n) => n + (usage.inputTokens ?? 0));
        setOutputTokens((n) => n + (usage.outputTokens ?? 0));
        const delta =
          usage.costUsd ??
          ((usage.totalTokens ?? usage.inputTokens + usage.outputTokens) / 1_000_000) *
            fallbackRatePerMTokens;
        setCost((current) => current + delta);
      } else if (event.type === 'session-reset') {
        setCost(initial);
        setInputTokens(0);
        setOutputTokens(0);
      }
    });
  }, [fallbackRatePerMTokens, initial]);

  return (
    <div
      className={cn(
        'border-border bg-card inline-flex items-center gap-2 rounded-md border px-3 py-1.5',
        className,
      )}
    >
      <Coins className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
      <div className="flex flex-col leading-tight">
        <span className="text-foreground font-mono text-sm tabular-nums">
          ${cost.toFixed(cost < 1 ? 4 : 2)}
        </span>
        {detailed ? (
          <span className="text-muted-foreground text-[10px]">
            {inputTokens.toLocaleString()} in · {outputTokens.toLocaleString()} out
          </span>
        ) : (
          <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
            session
          </span>
        )}
      </div>
    </div>
  );
}

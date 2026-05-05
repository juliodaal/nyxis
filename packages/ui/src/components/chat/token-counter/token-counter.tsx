'use client';

import { type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import { useTokenCount } from '../../../ai/hooks/use-token-count.js';

export interface TokenCounterProps extends HTMLAttributes<HTMLSpanElement> {
  /** Text whose token count we estimate. */
  text: string;
  /** Model id used to compute % of context window consumed. */
  modelId?: string;
  /** Show a small progress bar in addition to the count. */
  showBar?: boolean;
  /** Compact mode: just the number, no label. */
  compact?: boolean;
}

/**
 * Inline token counter for chat composers and prompt editors. Pairs with
 * `useTokenCount` and the model catalog so the percentage of context
 * window consumed is shown automatically.
 */
export function TokenCounter({
  text,
  modelId,
  showBar = false,
  compact = false,
  className,
  ...props
}: TokenCounterProps) {
  const { tokens, contextPct } = useTokenCount(text, modelId);
  const tone = contextPct < 0.7 ? 'safe' : contextPct < 0.9 ? 'warn' : 'crit';

  return (
    <span
      data-tone={tone}
      className={cn(
        'inline-flex items-center gap-2 text-[11px] font-medium tabular-nums',
        'data-[tone=safe]:text-muted-foreground data-[tone=warn]:text-warning data-[tone=crit]:text-destructive',
        className,
      )}
      {...props}
    >
      <span className="font-mono">~{tokens.toLocaleString()}</span>
      {!compact ? <span className="text-muted-foreground">tokens</span> : null}
      {showBar && contextPct > 0 ? (
        <span className="bg-muted relative inline-block h-1 w-16 overflow-hidden rounded-full align-middle">
          <span
            data-tone={tone}
            className={cn(
              'absolute inset-y-0 left-0 transition-all duration-300',
              'data-[tone=safe]:bg-success data-[tone=warn]:bg-warning data-[tone=crit]:bg-destructive',
            )}
            style={{ width: `${(contextPct * 100).toFixed(1)}%` }}
          />
        </span>
      ) : null}
    </span>
  );
}

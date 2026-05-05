'use client';

import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';

import { cn } from '../../../lib/utils.js';

export type ProviderHealthStatus = 'operational' | 'degraded' | 'down' | 'unknown';

export interface ProviderHealthBadgeProps {
  status: ProviderHealthStatus;
  /** Optional latency in ms shown next to the status. */
  latencyMs?: number;
  /** Compact mode: just the dot, no label. */
  compact?: boolean;
  className?: string;
}

const STATUS_LABEL: Record<ProviderHealthStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
  unknown: 'Unknown',
};

const STATUS_ICON: Record<ProviderHealthStatus, typeof CircleCheck> = {
  operational: CircleCheck,
  degraded: CircleAlert,
  down: CircleX,
  unknown: CircleAlert,
};

/**
 * Pill that surfaces the current health of an AI provider — fed either
 * from a status page polling hook or from your own observability layer.
 */
export function ProviderHealthBadge({
  status,
  latencyMs,
  compact = false,
  className,
}: ProviderHealthBadgeProps) {
  const Icon = STATUS_ICON[status];
  return (
    <span
      data-status={status}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium',
        'data-[status=operational]:border-success/30 data-[status=operational]:bg-success/10 data-[status=operational]:text-success',
        'data-[status=degraded]:border-warning/30 data-[status=degraded]:bg-warning/15 data-[status=degraded]:text-warning',
        'data-[status=down]:border-destructive/30 data-[status=down]:bg-destructive/15 data-[status=down]:text-destructive',
        'data-[status=unknown]:border-border data-[status=unknown]:bg-muted data-[status=unknown]:text-muted-foreground',
        className,
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {!compact && (
        <>
          <span>{STATUS_LABEL[status]}</span>
          {latencyMs !== undefined && (
            <span className="font-mono tabular-nums opacity-70">{latencyMs}ms</span>
          )}
        </>
      )}
    </span>
  );
}

'use client';

import { AlertTriangle, Loader2, PlugZap, Power } from 'lucide-react';
import { type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { MCPConnectionState } from '../../../ai/types.js';

export interface MCPConnectionStatusProps extends HTMLAttributes<HTMLSpanElement> {
  state: MCPConnectionState;
  /** Show only the dot, no label. */
  compact?: boolean;
  /** Override the human label. */
  label?: string;
  /** Round-trip latency to display when `connected`. */
  latencyMs?: number;
}

const LABELS: Record<MCPConnectionState, string> = {
  disconnected: 'disconnected',
  connecting: 'connecting',
  connected: 'connected',
  error: 'error',
};

/**
 * Inline pill describing the MCP connection lifecycle. Drives icon, tone,
 * and optionally a latency readout. Pair with `<MCPServerCard>` or use
 * standalone in a status bar.
 */
export function MCPConnectionStatus({
  state,
  compact = false,
  label,
  latencyMs,
  className,
  ...props
}: MCPConnectionStatusProps) {
  const text = label ?? LABELS[state];

  const Icon =
    state === 'connected'
      ? PlugZap
      : state === 'connecting'
        ? Loader2
        : state === 'error'
          ? AlertTriangle
          : Power;

  return (
    <span
      data-state={state}
      role="status"
      aria-label={text}
      className={cn(
        'inline-flex items-center gap-1.5 text-[11px] font-medium',
        'data-[state=connected]:text-success',
        'data-[state=connecting]:text-primary',
        'data-[state=error]:text-destructive',
        'data-[state=disconnected]:text-muted-foreground',
        compact && 'gap-1',
        className,
      )}
      {...props}
    >
      <Icon className={cn('size-3', state === 'connecting' && 'animate-spin')} aria-hidden />
      {state === 'connected' && (
        <span aria-hidden className="bg-success size-1.5 animate-pulse rounded-full" />
      )}
      {!compact && (
        <>
          <span className="uppercase tracking-wider">{text}</span>
          {state === 'connected' && latencyMs != null && (
            <span className="text-muted-foreground tabular-nums">· {Math.round(latencyMs)}ms</span>
          )}
        </>
      )}
    </span>
  );
}

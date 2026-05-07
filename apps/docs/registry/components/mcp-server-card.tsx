'use client';

import { ChevronDown, ChevronRight, Plug, PlugZap, Trash2 } from 'lucide-react';
import { useState, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { MCPServer } from '@nyxis/core';
import { MCPCapabilityBadge } from '@/components/nyxis/mcp-capability-badge';
import { MCPConnectionStatus } from '@/components/nyxis/mcp-connection-status';

export interface MCPServerCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onError'> {
  /** Configured MCP server to render. */
  server: MCPServer;
  /** Render the endpoint/details expanded by default. */
  defaultOpen?: boolean;
  /** Hide the action row (connect / disconnect / remove). */
  hideActions?: boolean;
  /** Called when the user clicks "connect". */
  onConnect?: (id: string) => void;
  /** Called when the user clicks "disconnect". */
  onDisconnect?: (id: string) => void;
  /** Called when the user clicks "remove". */
  onRemove?: (id: string) => void;
  /** Custom slot rendered next to the title (e.g. status pill). */
  trailingSlot?: ReactNode;
}

const TRANSPORT_TONE: Record<MCPServer['transport'], string> = {
  stdio: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  sse: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
  websocket: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
  http: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
};

/**
 * Card representing a single configured MCP server. Surfaces transport,
 * connection state, capabilities, and inline actions to (re)connect or
 * remove. Pair with `<MCPServerList>` for the multi-server view.
 */
export function MCPServerCard({
  server,
  defaultOpen = false,
  hideActions = false,
  onConnect,
  onDisconnect,
  onRemove,
  trailingSlot,
  className,
  children,
  ...props
}: MCPServerCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const isConnected = server.state === 'connected';

  return (
    <div
      data-state={server.state}
      className={cn(
        'border-border bg-card flex flex-col overflow-hidden rounded-lg border',
        'data-[state=error]:border-destructive/30',
        'data-[state=connected]:border-success/30',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-muted-foreground hover:text-foreground mt-1 transition-colors"
          aria-expanded={open}
          aria-label={open ? 'Collapse server details' : 'Expand server details'}
        >
          {open ? (
            <ChevronDown className="size-4" aria-hidden />
          ) : (
            <ChevronRight className="size-4" aria-hidden />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-foreground truncate text-sm font-semibold">{server.name}</h3>
            <span
              className={cn(
                'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                TRANSPORT_TONE[server.transport],
              )}
            >
              {server.transport}
            </span>
            {server.version && (
              <span className="text-muted-foreground text-[10px] tabular-nums">
                v{server.version}
              </span>
            )}
            {trailingSlot}
          </div>

          {server.description && (
            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-snug">
              {server.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <MCPConnectionStatus
              state={server.state}
              {...(server.latencyMs != null ? { latencyMs: server.latencyMs } : {})}
            />
            {server.capabilities && server.capabilities.length > 0 && (
              <span aria-hidden className="text-border">
                |
              </span>
            )}
            {server.capabilities?.map((cap) => (
              <MCPCapabilityBadge key={cap} capability={cap} compact />
            ))}
          </div>

          {server.state === 'error' && server.error && (
            <p className="text-destructive border-destructive/30 bg-destructive/5 mt-2 rounded border px-2 py-1 font-mono text-[11px]">
              {server.error}
            </p>
          )}
        </div>

        {!hideActions && (
          <div className="flex items-center gap-1">
            {isConnected ? (
              <button
                type="button"
                onClick={() => onDisconnect?.(server.id)}
                className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors"
              >
                <Plug className="size-3" aria-hidden />
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onConnect?.(server.id)}
                disabled={server.state === 'connecting'}
                className="text-primary hover:bg-primary/10 inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors disabled:opacity-50"
              >
                <PlugZap className="size-3" aria-hidden />
                {server.state === 'connecting' ? 'Connecting…' : 'Connect'}
              </button>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(server.id)}
                aria-label="Remove server"
                className="text-muted-foreground hover:text-destructive rounded p-1.5 transition-colors"
              >
                <Trash2 className="size-3" aria-hidden />
              </button>
            )}
          </div>
        )}
      </div>

      {open && (
        <div className="border-border bg-muted/20 border-t px-4 py-2.5">
          <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
            Endpoint
          </p>
          <code className="text-foreground/90 mt-0.5 block break-all font-mono text-[11px]">
            {server.endpoint}
          </code>
          {children}
        </div>
      )}
    </div>
  );
}

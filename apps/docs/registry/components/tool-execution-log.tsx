'use client';

import { type OlHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import type { AIToolCallStatus } from '@nyxis/core';
import { ToolCall } from '@/components/nyxis/tool-call';
import { ToolResult } from '@/components/nyxis/tool-result';

export interface ToolExecution {
  id: string;
  name: string;
  args?: Record<string, unknown> | undefined;
  result?: unknown;
  error?: string | undefined;
  status: AIToolCallStatus;
  /** Wall-clock when the tool was dispatched. */
  startedAt: Date | string;
  /** Total run time in ms. */
  durationMs?: number | undefined;
}

export interface ToolExecutionLogProps extends OlHTMLAttributes<HTMLOListElement> {
  /** Executions, newest first. */
  executions: readonly ToolExecution[];
  /** Hide the timestamps column. */
  hideTimestamps?: boolean;
  /** Cap the rendered list (`+N more` button at the end). */
  limit?: number;
  /** Show results inline below each call. */
  showResults?: boolean;
  /** Empty state when there are no executions. */
  emptyState?: React.ReactNode;
}

/**
 * Stacked timeline of tool invocations from the assistant. Each item
 * uses `<ToolCall>` for the header and optionally `<ToolResult>` for
 * the inline output. Pair with `<ChatThread>` for a per-conversation
 * inspector or place in a sidebar.
 */
export function ToolExecutionLog({
  executions,
  hideTimestamps = false,
  limit,
  showResults = true,
  emptyState,
  className,
  ...props
}: ToolExecutionLogProps) {
  if (executions.length === 0) {
    return (
      <ol
        className={cn(
          'border-border bg-card text-muted-foreground list-none rounded-lg border p-6 text-center text-sm',
          className,
        )}
        {...props}
      >
        <li>{emptyState ?? 'No tool calls yet.'}</li>
      </ol>
    );
  }

  const visible = limit != null ? executions.slice(0, limit) : executions;
  const hidden = limit != null ? Math.max(0, executions.length - limit) : 0;

  return (
    <ol className={cn('flex flex-col gap-2.5', className)} {...props}>
      {visible.map((exec) => (
        <li key={exec.id} className="flex flex-col gap-1.5">
          {!hideTimestamps && (
            <time
              dateTime={
                typeof exec.startedAt === 'string' ? exec.startedAt : exec.startedAt.toISOString()
              }
              className="text-muted-foreground text-[10px] font-medium uppercase tabular-nums tracking-wider"
            >
              {formatTimestamp(exec.startedAt)}
            </time>
          )}
          <ToolCall
            name={exec.name}
            {...(exec.args ? { args: exec.args } : {})}
            status={exec.status}
            {...(exec.durationMs != null ? { durationMs: exec.durationMs } : {})}
          />
          {showResults && (exec.result !== undefined || exec.error) && (
            <ToolResult
              result={exec.result}
              {...(exec.error ? { error: exec.error } : {})}
              label={exec.name}
              truncate={400}
            />
          )}
        </li>
      ))}

      {hidden > 0 && (
        <li className="text-muted-foreground pl-1 text-[11px]">
          + {hidden} more execution{hidden === 1 ? '' : 's'}
        </li>
      )}
    </ol>
  );
}

function formatTimestamp(value: Date | string): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return typeof value === 'string' ? value : '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

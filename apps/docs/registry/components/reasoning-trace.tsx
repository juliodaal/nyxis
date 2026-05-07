'use client';

import { Brain, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { StreamingText } from '@/components/nyxis/streaming-text';

export interface ReasoningTraceProps extends HTMLAttributes<HTMLDivElement> {
  /** The model's chain-of-thought / extended thinking output. */
  text: string;
  /** True while more reasoning tokens are still arriving. */
  streaming?: boolean;
  /** Render the trace expanded by default. */
  defaultOpen?: boolean;
  /** Force open/closed (controlled). */
  open?: boolean;
  /** Called when the user toggles the disclosure. */
  onOpenChange?: (open: boolean) => void;
  /** Optional one-line summary shown when collapsed. */
  summary?: string;
  /** Total reasoning duration in ms. */
  durationMs?: number;
  /** Custom heading; defaults to "Reasoning". */
  label?: string;
  /** Custom slot rendered next to the title (e.g. token count). */
  trailingSlot?: ReactNode;
}

/**
 * Disclosure card for the model's extended-thinking / chain-of-thought
 * output. Collapsed by default — keeps the conversation surface clean
 * while letting power users inspect *how* the assistant arrived at its
 * answer.
 */
export function ReasoningTrace({
  text,
  streaming = false,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  summary,
  durationMs,
  label = 'Reasoning',
  trailingSlot,
  className,
  ...props
}: ReasoningTraceProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const open = controlledOpen ?? internal;

  const setOpen = (next: boolean) => {
    setInternal(next);
    onOpenChange?.(next);
  };

  return (
    <div
      data-streaming={streaming || undefined}
      className={cn(
        'border-border bg-muted/20 rounded-lg border',
        'data-[streaming]:border-primary/30 data-[streaming]:bg-primary/5',
        className,
      )}
      {...props}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <span
          className={cn(
            'grid size-5 shrink-0 place-items-center rounded',
            streaming ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
          )}
        >
          <Brain className={cn('size-3', streaming && 'animate-pulse')} aria-hidden />
        </span>

        <span className="flex-1 truncate text-xs font-medium">
          <span className="text-foreground">{label}</span>
          {streaming && (
            <span className="text-primary ml-1.5 text-[10px] font-semibold uppercase tracking-wider">
              · thinking
            </span>
          )}
          {summary && !open && (
            <span className="text-muted-foreground ml-2 font-normal">— {summary}</span>
          )}
        </span>

        {trailingSlot}

        {durationMs != null && !streaming && (
          <span className="text-muted-foreground text-[10px] font-medium tabular-nums">
            {formatDuration(durationMs)}
          </span>
        )}

        {open ? (
          <ChevronDown className="text-muted-foreground size-3.5" aria-hidden />
        ) : (
          <ChevronRight className="text-muted-foreground size-3.5" aria-hidden />
        )}
      </button>

      {open && (
        <div className="border-border border-t px-3 py-2.5">
          <div className="text-muted-foreground prose prose-sm max-w-none whitespace-pre-wrap break-words text-[12px] italic leading-relaxed">
            <StreamingText text={text} streaming={streaming} className="text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}

function formatDuration(ms: number) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 1000)}s`;
}

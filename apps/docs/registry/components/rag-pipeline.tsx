'use client';

import { AlertTriangle, ArrowDown, ArrowRight, Check, Circle, Loader2 } from 'lucide-react';
import { type ComponentType, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import type { RAGStage, RAGStageStatus } from '@nyxis/core';

export interface RAGPipelineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Ordered stages in the pipeline. */
  stages: readonly RAGStage[];
  /** Layout direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Click handler on a stage. */
  onSelect?: (stage: RAGStage) => void;
  /** Currently selected stage id. */
  activeId?: string;
}

const STATUS_ICON: Record<
  RAGStageStatus,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  pending: Circle,
  running: Loader2,
  done: Check,
  errored: AlertTriangle,
};

const STATUS_TONE: Record<RAGStageStatus, string> = {
  pending: 'border-border bg-card text-muted-foreground',
  running: 'border-primary/40 bg-primary/10 text-primary',
  done: 'border-success/40 bg-success/10 text-success',
  errored: 'border-destructive/40 bg-destructive/10 text-destructive',
};

/**
 * Visualises a RAG pipeline as connected stage chips. Each stage
 * shows status icon, name, optional count, and duration. Pair with
 * an in-flight pipeline run by feeding stages from your orchestrator.
 */
export function RAGPipeline({
  stages,
  orientation = 'horizontal',
  onSelect,
  activeId,
  className,
  ...props
}: RAGPipelineProps) {
  const Arrow = orientation === 'horizontal' ? ArrowRight : ArrowDown;

  return (
    <div
      role="list"
      aria-label="RAG pipeline"
      className={cn(
        'border-border bg-card flex gap-2 overflow-hidden rounded-lg border p-3',
        orientation === 'horizontal'
          ? 'flex-row items-stretch overflow-x-auto'
          : 'flex-col items-stretch',
        className,
      )}
      {...props}
    >
      {stages.map((stage, index) => {
        const Icon = STATUS_ICON[stage.status];
        const isActive = stage.id === activeId;
        const interactive = !!onSelect;
        return (
          <div
            key={stage.id}
            role="listitem"
            className={cn(
              'flex shrink-0 items-stretch gap-2',
              orientation === 'horizontal' ? 'flex-row' : 'flex-col',
            )}
          >
            <button
              type="button"
              onClick={onSelect ? () => onSelect(stage) : undefined}
              disabled={!interactive}
              data-status={stage.status}
              data-active={isActive || undefined}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'flex flex-col gap-1 rounded-md border p-3 text-left transition-all',
                interactive && 'cursor-pointer hover:shadow-sm',
                'data-[active]:ring-primary/40 data-[active]:ring-2',
                STATUS_TONE[stage.status],
                orientation === 'horizontal' ? 'min-w-[10rem]' : 'w-full',
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'grid size-5 shrink-0 place-items-center rounded',
                    stage.status === 'done' && 'bg-success/20',
                    stage.status === 'running' && 'bg-primary/20',
                    stage.status === 'errored' && 'bg-destructive/20',
                    stage.status === 'pending' && 'bg-muted',
                  )}
                  aria-hidden
                >
                  <Icon
                    className={cn('size-3', stage.status === 'running' && 'animate-spin')}
                    aria-hidden
                  />
                </span>
                <span className="text-foreground text-xs font-semibold">{stage.name}</span>
              </div>

              {stage.description && (
                <p className="text-muted-foreground line-clamp-2 text-[11px] leading-snug">
                  {stage.description}
                </p>
              )}

              <div className="text-muted-foreground mt-auto flex items-center justify-between gap-2 font-mono text-[10px] tabular-nums">
                {stage.count != null && <span>{stage.count}</span>}
                {stage.durationMs != null && <span>{formatDuration(stage.durationMs)}</span>}
              </div>

              {stage.detail && (
                <p className="text-muted-foreground/80 truncate font-mono text-[10px]">
                  {stage.detail}
                </p>
              )}
            </button>

            {index < stages.length - 1 && (
              <div
                aria-hidden
                className={cn(
                  'text-muted-foreground/50 flex items-center justify-center',
                  orientation === 'horizontal' ? 'w-4' : 'h-4',
                )}
              >
                <Arrow className="size-3.5" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 60_000)}m`;
}

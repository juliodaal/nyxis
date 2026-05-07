'use client';

import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { useState, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { RetrievedChunk } from '@nyxis/core';

export interface ChunkCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Retrieved chunk to render. */
  chunk: RetrievedChunk;
  /** Compact one-line variant (no expansion, snippet truncated). */
  compact?: boolean;
  /** Click handler — typically opens the source. */
  onSelect?: (id: string) => void;
  /** Whether this chunk is currently selected. */
  selected?: boolean;
  /** Show metadata table when expanded. */
  showMetadata?: boolean;
  /** Trailing slot (e.g. quick actions). */
  trailingSlot?: ReactNode;
}

/**
 * Card for a single retrieved chunk. Surfaces source, locator, score
 * (with reranker delta when present), rank, and the chunk text.
 * Click to expand the full text and metadata table.
 */
export function ChunkCard({
  chunk,
  compact = false,
  onSelect,
  selected = false,
  showMetadata = true,
  trailingSlot,
  className,
  children,
  ...props
}: ChunkCardProps) {
  const [open, setOpen] = useState(false);
  const interactive = !!onSelect;

  const score = chunk.score;
  const rerank = chunk.rerankScore;
  const delta = score != null && rerank != null ? rerank - score : null;
  const tone = scoreTone(rerank ?? score);

  return (
    <div
      data-selected={selected || undefined}
      data-tone={tone}
      className={cn(
        'border-border bg-card flex flex-col gap-1.5 rounded-lg border p-3 transition-colors',
        'data-[selected]:border-primary/50 data-[selected]:bg-primary/5',
        compact && 'gap-1 p-2.5',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-2">
        <span
          className="bg-primary/10 text-primary mt-0.5 grid size-5 shrink-0 place-items-center rounded font-mono text-[10px] font-semibold tabular-nums"
          aria-hidden
        >
          {chunk.rank ?? '#'}
        </span>

        <button
          type="button"
          onClick={() => {
            if (!compact) setOpen((v) => !v);
            onSelect?.(chunk.id);
          }}
          aria-expanded={!compact ? open : undefined}
          className={cn('min-w-0 flex-1 text-left', (interactive || !compact) && 'cursor-pointer')}
        >
          <div className="flex flex-wrap items-baseline gap-2">
            <FileText className="text-muted-foreground size-3 shrink-0" aria-hidden />
            <code
              className={cn(
                'text-foreground truncate font-mono font-medium',
                compact ? 'text-[11px]' : 'text-xs',
              )}
            >
              {chunk.source}
            </code>
            {chunk.locator && (
              <span className="text-muted-foreground font-mono text-[10px]">{chunk.locator}</span>
            )}
          </div>

          <p
            className={cn(
              'text-foreground/85 mt-1 leading-snug',
              compact ? 'line-clamp-1 text-[11px]' : open ? 'text-xs' : 'line-clamp-2 text-xs',
            )}
          >
            {chunk.text}
          </p>
        </button>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <ScoreBadge score={rerank ?? score} tone={tone} compact={compact} />
          {delta != null && delta !== 0 && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-mono text-[9px] font-medium tabular-nums',
                delta > 0 ? 'text-success' : 'text-destructive',
              )}
              title={`Reranker moved score by ${delta > 0 ? '+' : ''}${delta.toFixed(3)}`}
            >
              {delta > 0 ? (
                <ArrowUp className="size-2" aria-hidden />
              ) : (
                <ArrowDown className="size-2" aria-hidden />
              )}
              {Math.abs(delta).toFixed(2)}
            </span>
          )}
          {trailingSlot}
        </div>

        {!compact && (
          <span className="text-muted-foreground mt-0.5 shrink-0">
            {open ? (
              <ChevronDown className="size-3" aria-hidden />
            ) : (
              <ChevronRight className="size-3" aria-hidden />
            )}
          </span>
        )}
      </div>

      {open &&
        !compact &&
        showMetadata &&
        chunk.metadata &&
        Object.keys(chunk.metadata).length > 0 && (
          <div className="border-border bg-muted/30 mt-1.5 rounded border p-2">
            <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
              Metadata
            </p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              {Object.entries(chunk.metadata).map(([k, v]) => (
                <li
                  key={k}
                  className="text-foreground/80 flex items-baseline gap-1.5 truncate text-[10px]"
                >
                  <code className="text-muted-foreground font-mono">{k}:</code>
                  <span className="font-mono">{formatValue(v)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {children}
    </div>
  );
}

function ScoreBadge({
  score,
  tone,
  compact,
}: {
  score?: number | undefined;
  tone: 'good' | 'warn' | 'bad' | 'neutral';
  compact: boolean;
}) {
  if (score == null) return null;
  return (
    <span
      data-tone={tone}
      className={cn(
        'rounded-full font-mono font-semibold tabular-nums',
        compact ? 'px-1 py-0 text-[9px]' : 'px-1.5 py-0.5 text-[10px]',
        'data-[tone=good]:bg-success/15 data-[tone=good]:text-success',
        'data-[tone=warn]:bg-amber-500/15 data-[tone=warn]:text-amber-700 dark:data-[tone=warn]:text-amber-400',
        'data-[tone=bad]:bg-destructive/15 data-[tone=bad]:text-destructive',
        'data-[tone=neutral]:bg-muted data-[tone=neutral]:text-muted-foreground',
      )}
    >
      {score.toFixed(3)}
    </span>
  );
}

function scoreTone(score?: number | undefined): 'good' | 'warn' | 'bad' | 'neutral' {
  if (score == null) return 'neutral';
  if (score >= 0.8) return 'good';
  if (score >= 0.5) return 'warn';
  return 'bad';
}

function formatValue(v: unknown): string {
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

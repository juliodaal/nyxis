'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { RetrievedChunk } from '../../../ai/types.js';
import { ChunkCard } from '../chunk-card/chunk-card.js';

export interface RetrievalResultsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Chunks returned by the retriever (post-rerank if applicable). */
  chunks: readonly RetrievedChunk[];
  /** The query that produced these chunks. Rendered in the header. */
  query?: string;
  /** Initial score threshold (0..1). */
  defaultThreshold?: number;
  /** Click handler for individual chunks. */
  onSelect?: (id: string) => void;
  /** Currently selected chunk id. */
  activeId?: string;
  /** Hide the threshold slider. */
  hideThreshold?: boolean;
  /** Hide the search box (filters within the result set). */
  hideSearch?: boolean;
}

/**
 * List of retrieved chunks with optional in-set search and a score
 * threshold slider. Each row composes `<ChunkCard>`. Pair with
 * `<VectorSearchInput>` for the upstream query controls.
 */
export function RetrievalResults({
  chunks,
  query,
  defaultThreshold = 0,
  onSelect,
  activeId,
  hideThreshold = false,
  hideSearch = false,
  className,
  ...props
}: RetrievalResultsProps) {
  const [text, setText] = useState('');
  const [threshold, setThreshold] = useState(defaultThreshold);

  const filtered = useMemo(() => {
    let out = chunks;
    if (threshold > 0) {
      out = out.filter((c) => (c.rerankScore ?? c.score ?? 0) >= threshold);
    }
    if (text) {
      const q = text.toLowerCase();
      out = out.filter(
        (c) =>
          c.text.toLowerCase().includes(q) ||
          c.source.toLowerCase().includes(q) ||
          c.locator?.toLowerCase().includes(q),
      );
    }
    return out;
  }, [chunks, text, threshold]);

  return (
    <div
      className={cn(
        'border-border bg-card flex flex-col overflow-hidden rounded-lg border',
        className,
      )}
      {...props}
    >
      <header className="border-border flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground text-sm font-semibold">Retrieved chunks</h3>
          {query && (
            <p className="text-muted-foreground mt-0.5 line-clamp-1 font-mono text-[11px]">
              query: {query}
            </p>
          )}
        </div>
        <span className="text-muted-foreground text-[11px] font-medium tabular-nums">
          {filtered.length} / {chunks.length}
        </span>
      </header>

      {(!hideSearch || !hideThreshold) && (
        <div className="border-border flex flex-wrap items-center gap-3 border-b px-4 py-2">
          {!hideSearch && (
            <div className="relative min-w-[10rem] flex-1">
              <Search
                className="text-muted-foreground absolute left-2 top-1/2 size-3 -translate-y-1/2"
                aria-hidden
              />
              <input
                type="search"
                placeholder="Filter chunks…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-7 w-full rounded-md border pl-7 pr-2 text-xs outline-none focus-visible:ring-2"
              />
            </div>
          )}

          {!hideThreshold && (
            <label className="text-muted-foreground inline-flex items-center gap-2 text-[11px]">
              <SlidersHorizontal className="size-3" aria-hidden />
              <span className="font-mono">≥ {threshold.toFixed(2)}</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                aria-label="Score threshold"
                className="accent-primary h-1 w-32 cursor-pointer"
              />
            </label>
          )}
        </div>
      )}

      <ol className="divide-border max-h-[36rem] divide-y overflow-y-auto p-2">
        {filtered.map((chunk) => (
          <li key={chunk.id} className="py-1">
            <ChunkCard
              chunk={chunk}
              {...(onSelect ? { onSelect } : {})}
              selected={chunk.id === activeId}
            />
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-muted-foreground px-4 py-6 text-center text-xs">
            {chunks.length === 0
              ? 'No chunks returned for this query.'
              : 'No chunks match the current filters.'}
          </li>
        )}
      </ol>
    </div>
  );
}

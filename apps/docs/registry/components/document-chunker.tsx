'use client';

import { useMemo, useState, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface DocumentChunk {
  id: string;
  /** Inclusive start offset (UTF-16 char index). */
  start: number;
  /** Exclusive end offset. */
  end: number;
  /** Optional label rendered as a chip (e.g. chunk number). */
  label?: string;
}

export interface DocumentChunkerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Source document text. */
  text: string;
  /** Chunk ranges. Must be sorted by `start` and non-overlapping. */
  chunks: readonly DocumentChunk[];
  /** Currently active chunk id. */
  activeId?: string;
  /** Click handler on a chunk. */
  onSelect?: (chunk: DocumentChunk) => void;
  /** Hover handler. */
  onHover?: (chunk: DocumentChunk | null) => void;
  /** Hide the chunk-count summary header. */
  hideHeader?: boolean;
}

/**
 * Renders the source document with chunk boundaries highlighted —
 * alternating tones, a small index badge per chunk, hover/click
 * selection. Use to validate a chunking strategy: did the splitter
 * cut sentences cleanly? Are chunk sizes balanced?
 */
export function DocumentChunker({
  text,
  chunks,
  activeId,
  onSelect,
  onHover,
  hideHeader = false,
  className,
  ...props
}: DocumentChunkerProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Build a flat segment array: alternating { kind: 'gap' | 'chunk' }
  // segments that cover the whole document.
  const segments = useMemo(() => {
    const sorted = [...chunks].sort((a, b) => a.start - b.start);
    const out: Array<
      | { kind: 'gap'; text: string }
      | { kind: 'chunk'; chunk: DocumentChunk; index: number; text: string }
    > = [];
    let cursor = 0;
    let index = 0;
    for (const c of sorted) {
      if (c.start > cursor) {
        out.push({ kind: 'gap', text: text.slice(cursor, c.start) });
      }
      out.push({
        kind: 'chunk',
        chunk: c,
        index,
        text: text.slice(c.start, c.end),
      });
      cursor = c.end;
      index += 1;
    }
    if (cursor < text.length) {
      out.push({ kind: 'gap', text: text.slice(cursor) });
    }
    return out;
  }, [text, chunks]);

  const stats = useMemo(() => {
    if (chunks.length === 0) return null;
    const sizes = chunks.map((c) => c.end - c.start);
    const total = sizes.reduce((a, b) => a + b, 0);
    return {
      count: chunks.length,
      avgSize: Math.round(total / chunks.length),
      minSize: Math.min(...sizes),
      maxSize: Math.max(...sizes),
    };
  }, [chunks]);

  return (
    <div
      className={cn(
        'border-border bg-card flex flex-col overflow-hidden rounded-lg border',
        className,
      )}
      {...props}
    >
      {!hideHeader && (
        <header className="border-border flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5">
          <h3 className="text-foreground text-sm font-semibold">Document chunks</h3>
          {stats && (
            <div className="text-muted-foreground flex flex-wrap items-center gap-3 font-mono text-[10px] tabular-nums">
              <span>chunks: {stats.count}</span>
              <span>avg: {stats.avgSize} chars</span>
              <span>min: {stats.minSize}</span>
              <span>max: {stats.maxSize}</span>
            </div>
          )}
        </header>
      )}

      <div className="text-foreground/90 max-h-[36rem] overflow-y-auto p-4 font-mono text-[11px] leading-relaxed">
        {segments.length === 0 ? (
          <span className="text-muted-foreground">{text}</span>
        ) : (
          segments.map((seg, i) => {
            if (seg.kind === 'gap') {
              return (
                <span key={`gap-${i}`} className="text-muted-foreground/70 whitespace-pre-wrap">
                  {seg.text}
                </span>
              );
            }
            const isActive = seg.chunk.id === activeId;
            const isHovered = seg.chunk.id === hovered;
            const alt = seg.index % 2 === 0;
            return (
              <button
                key={seg.chunk.id}
                type="button"
                onClick={() => onSelect?.(seg.chunk)}
                onMouseEnter={() => {
                  setHovered(seg.chunk.id);
                  onHover?.(seg.chunk);
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  onHover?.(null);
                }}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'group relative whitespace-pre-wrap rounded-sm px-0.5 transition-colors',
                  'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2',
                  isActive
                    ? 'bg-primary/20 text-foreground'
                    : isHovered
                      ? 'bg-muted text-foreground'
                      : alt
                        ? 'bg-primary/5 text-foreground/85'
                        : 'text-foreground/85 bg-violet-500/5 dark:bg-violet-500/10',
                )}
                title={`Chunk ${seg.index + 1} · ${seg.chunk.end - seg.chunk.start} chars`}
              >
                <span
                  aria-hidden
                  className={cn(
                    'mr-1 align-top text-[9px] font-semibold tabular-nums',
                    isActive ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {seg.chunk.label ?? seg.index + 1}
                </span>
                {seg.text}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

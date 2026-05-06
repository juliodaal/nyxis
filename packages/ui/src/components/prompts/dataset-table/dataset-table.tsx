'use client';

import { Check, ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { useMemo, useState, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { EvalRow } from '../../../ai/types.js';

export interface DatasetTableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Rows to render. */
  rows: readonly EvalRow[];
  /** Hide expected column (when there's no golden truth). */
  hideExpected?: boolean;
  /** Hide the score column. */
  hideScore?: boolean;
  /** Hide the search input. */
  hideSearch?: boolean;
  /** Bucket thresholds for the score-bucket filter. Default `[0.5, 0.8]` (low / mid / high). */
  scoreBuckets?: readonly [number, number];
  /** Click handler on a row — typically opens a detail drawer. */
  onSelect?: (row: EvalRow) => void;
  /** Currently selected row id. */
  activeId?: string;
}

type Bucket = 'low' | 'mid' | 'high' | null;

/**
 * Stacked table for an evaluation dataset / run. Each row shows
 * input → expected → actual → score with colour-coded buckets, plus
 * latency and cost when available. Search filters all text columns;
 * bucket pills filter by score range.
 */
export function DatasetTable({
  rows,
  hideExpected = false,
  hideScore = false,
  hideSearch = false,
  scoreBuckets = [0.5, 0.8] as const,
  onSelect,
  activeId,
  className,
  ...props
}: DatasetTableProps) {
  const [query, setQuery] = useState('');
  const [bucket, setBucket] = useState<Bucket>(null);
  const [expanded, setExpanded] = useState<readonly string[]>([]);

  const filtered = useMemo(() => {
    let out = rows;
    if (bucket && !hideScore) {
      out = out.filter((r) => {
        if (r.score == null) return false;
        if (bucket === 'low') return r.score < scoreBuckets[0];
        if (bucket === 'mid') return r.score >= scoreBuckets[0] && r.score < scoreBuckets[1];
        return r.score >= scoreBuckets[1];
      });
    }
    if (query) {
      const q = query.toLowerCase();
      out = out.filter(
        (r) =>
          r.input.toLowerCase().includes(q) ||
          r.expected?.toLowerCase().includes(q) ||
          r.actual?.toLowerCase().includes(q) ||
          r.notes?.toLowerCase().includes(q),
      );
    }
    return out;
  }, [rows, query, bucket, hideScore, scoreBuckets]);

  const counts = useMemo(() => {
    const out = { low: 0, mid: 0, high: 0 };
    if (hideScore) return out;
    for (const r of rows) {
      if (r.score == null) continue;
      if (r.score < scoreBuckets[0]) out.low += 1;
      else if (r.score < scoreBuckets[1]) out.mid += 1;
      else out.high += 1;
    }
    return out;
  }, [rows, hideScore, scoreBuckets]);

  const toggle = (id: string) =>
    setExpanded((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  return (
    <div
      className={cn(
        'border-border bg-card flex flex-col overflow-hidden rounded-lg border',
        className,
      )}
      {...props}
    >
      <header className="border-border flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-foreground text-sm font-semibold">Dataset</h3>
          <span className="text-muted-foreground text-[11px] font-medium tabular-nums">
            {filtered.length} / {rows.length} rows
          </span>
        </div>

        {!hideScore && (
          <div className="flex items-center gap-1">
            <BucketPill
              label="low"
              count={counts.low}
              tone="bad"
              active={bucket === 'low'}
              onClick={() => setBucket(bucket === 'low' ? null : 'low')}
            />
            <BucketPill
              label="mid"
              count={counts.mid}
              tone="warn"
              active={bucket === 'mid'}
              onClick={() => setBucket(bucket === 'mid' ? null : 'mid')}
            />
            <BucketPill
              label="high"
              count={counts.high}
              tone="good"
              active={bucket === 'high'}
              onClick={() => setBucket(bucket === 'high' ? null : 'high')}
            />
          </div>
        )}
      </header>

      {!hideSearch && (
        <div className="border-border border-b p-2">
          <div className="relative">
            <Search
              className="text-muted-foreground absolute left-2 top-1/2 size-3 -translate-y-1/2"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rows…"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-7 w-full rounded-md border pl-7 pr-2 text-xs outline-none focus-visible:ring-2"
            />
          </div>
        </div>
      )}

      <ol className="divide-border max-h-[36rem] divide-y overflow-y-auto">
        {filtered.map((row) => {
          const isOpen = expanded.includes(row.id);
          const tone = row.score != null ? scoreTone(row.score, scoreBuckets) : null;
          const isActive = row.id === activeId;
          return (
            <li
              key={row.id}
              data-active={isActive || undefined}
              className="data-[active]:bg-primary/5"
            >
              <button
                type="button"
                onClick={() => {
                  toggle(row.id);
                  onSelect?.(row);
                }}
                aria-expanded={isOpen}
                className="hover:bg-muted/40 flex w-full items-start gap-2 px-3 py-2 text-left transition-colors"
              >
                <span className="text-muted-foreground mt-0.5 shrink-0">
                  {isOpen ? (
                    <ChevronDown className="size-3" aria-hidden />
                  ) : (
                    <ChevronRight className="size-3" aria-hidden />
                  )}
                </span>

                <div className="grid min-w-0 flex-1 grid-cols-[2fr_2fr] gap-3 sm:grid-cols-[1fr_1fr_1fr]">
                  <Cell label="input">{row.input}</Cell>
                  {!hideExpected && <Cell label="expected">{row.expected ?? '—'}</Cell>}
                  <Cell label="actual">{row.actual ?? '—'}</Cell>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {row.status === 'pass' && (
                    <Check className="text-success size-3.5" aria-label="pass" />
                  )}
                  {row.status === 'fail' && (
                    <X className="text-destructive size-3.5" aria-label="fail" />
                  )}
                  {!hideScore && row.score != null && tone && (
                    <span
                      data-tone={tone}
                      className={cn(
                        'rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums',
                        'data-[tone=good]:bg-success/15 data-[tone=good]:text-success',
                        'data-[tone=warn]:bg-amber-500/15 data-[tone=warn]:text-amber-700 dark:data-[tone=warn]:text-amber-400',
                        'data-[tone=bad]:bg-destructive/15 data-[tone=bad]:text-destructive',
                      )}
                    >
                      {row.score.toFixed(2)}
                    </span>
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="border-border bg-muted/30 grid grid-cols-1 gap-3 border-t px-3 py-2 sm:grid-cols-3">
                  <ExpandedCell label="input" text={row.input} />
                  {!hideExpected && <ExpandedCell label="expected" text={row.expected ?? '—'} />}
                  <ExpandedCell label="actual" text={row.actual ?? '—'} />
                  {(row.latencyMs != null || row.costUsd != null || row.notes) && (
                    <div className="text-muted-foreground border-border/60 col-span-full flex flex-wrap items-center gap-3 border-t pt-2 font-mono text-[10px] tabular-nums">
                      {row.latencyMs != null && <span>latency: {row.latencyMs}ms</span>}
                      {row.costUsd != null && <span>cost: ${row.costUsd.toFixed(4)}</span>}
                      {row.notes && (
                        <span className="font-sans normal-case">notes: {row.notes}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}

        {filtered.length === 0 && (
          <li className="text-muted-foreground px-4 py-6 text-center text-xs">
            {rows.length === 0
              ? 'No rows in this dataset yet.'
              : 'No rows match the current filters.'}
          </li>
        )}
      </ol>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
        {label}
      </p>
      <p className="text-foreground/90 line-clamp-2 text-[11px] leading-snug">{children}</p>
    </div>
  );
}

function ExpandedCell({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
        {label}
      </p>
      <pre className="text-foreground/90 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed">
        {text}
      </pre>
    </div>
  );
}

function BucketPill({
  label,
  count,
  tone,
  active,
  onClick,
}: {
  label: string;
  count: number;
  tone: 'good' | 'warn' | 'bad';
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active || undefined}
      data-tone={tone}
      className={cn(
        'rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-all',
        'data-[active]:ring-primary/50 data-[active]:ring-2',
        'data-[tone=good]:bg-success/15 data-[tone=good]:text-success',
        'data-[tone=warn]:bg-amber-500/15 data-[tone=warn]:text-amber-700 dark:data-[tone=warn]:text-amber-400',
        'data-[tone=bad]:bg-destructive/15 data-[tone=bad]:text-destructive',
      )}
    >
      {label} <span className="ml-0.5 tabular-nums">{count}</span>
    </button>
  );
}

function scoreTone(score: number, buckets: readonly [number, number]): 'good' | 'warn' | 'bad' {
  if (score < buckets[0]) return 'bad';
  if (score < buckets[1]) return 'warn';
  return 'good';
}

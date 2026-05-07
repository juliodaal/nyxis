'use client';

import { Loader2, Search } from 'lucide-react';
import { type FormEvent, type HTMLAttributes, type KeyboardEvent, useId, useState } from 'react';

import { cn } from '@/lib/utils';

export interface VectorSearchInputProps extends Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'defaultValue'
> {
  /** Controlled query text. */
  value?: string;
  /** Default uncontrolled query. */
  defaultValue?: string;
  /** Called on every keystroke. */
  onValueChange?: (value: string) => void;
  /** Number of results to fetch. */
  topK?: number;
  /** Default uncontrolled topK. */
  defaultTopK?: number;
  /** Called when the user moves the topK slider. */
  onTopKChange?: (value: number) => void;
  /** Score threshold (0..1). */
  threshold?: number;
  /** Default uncontrolled threshold. */
  defaultThreshold?: number;
  /** Called when the user moves the threshold slider. */
  onThresholdChange?: (value: number) => void;
  /** Whether the reranker stage is enabled. */
  reranker?: boolean;
  /** Default uncontrolled reranker. */
  defaultReranker?: boolean;
  /** Called when the user toggles the reranker. */
  onRerankerChange?: (value: boolean) => void;
  /** Called when the user submits the search. */
  onSubmit?: (
    query: string,
    options: {
      topK: number;
      threshold: number;
      reranker: boolean;
    },
  ) => void;
  /** Loading state — disables submit while true. */
  loading?: boolean;
  /** Range for topK. */
  topKRange?: readonly [number, number];
  /** Placeholder. */
  placeholder?: string;
}

/**
 * Search input tuned for vector retrieval. Combines the query text
 * with `topK`, similarity `threshold`, and an optional reranker
 * toggle. Submit fires `onSubmit` with the full retrieval options.
 */
export function VectorSearchInput({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  topK: controlledTopK,
  defaultTopK = 5,
  onTopKChange,
  threshold: controlledThreshold,
  defaultThreshold = 0,
  onThresholdChange,
  reranker: controlledReranker,
  defaultReranker = false,
  onRerankerChange,
  onSubmit,
  loading = false,
  topKRange = [1, 20] as const,
  placeholder = 'Search the knowledge base…',
  className,
  ...props
}: VectorSearchInputProps) {
  const reactId = useId();
  const [text, setText] = useState(defaultValue);
  const [topK, setTopK] = useState(defaultTopK);
  const [threshold, setThreshold] = useState(defaultThreshold);
  const [reranker, setReranker] = useState(defaultReranker);

  const value = controlledValue ?? text;
  const topKValue = controlledTopK ?? topK;
  const thresholdValue = controlledThreshold ?? threshold;
  const rerankerValue = controlledReranker ?? reranker;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || !value.trim()) return;
    onSubmit?.(value, {
      topK: topKValue,
      threshold: thresholdValue,
      reranker: rerankerValue,
    });
  };

  const handleQueryKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      (event.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('border-border bg-card flex flex-col gap-3 rounded-lg border p-3', className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span
          className="bg-muted text-muted-foreground grid size-8 shrink-0 place-items-center rounded-md"
          aria-hidden
        >
          {loading ? (
            <Loader2 className="text-primary size-4 animate-spin" aria-hidden />
          ) : (
            <Search className="size-4" aria-hidden />
          )}
        </span>

        <input
          id={`nyxis-vsi-${reactId}`}
          type="text"
          value={value}
          onChange={(e) => {
            setText(e.target.value);
            onValueChange?.(e.target.value);
          }}
          onKeyDown={handleQueryKey}
          placeholder={placeholder}
          disabled={loading}
          className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-9 flex-1 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 shrink-0 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
        <label className="inline-flex items-center gap-2">
          <span className="font-mono">
            top-K: <span className="text-foreground tabular-nums">{topKValue}</span>
          </span>
          <input
            type="range"
            min={topKRange[0]}
            max={topKRange[1]}
            step={1}
            value={topKValue}
            onChange={(e) => {
              const v = Number(e.target.value);
              setTopK(v);
              onTopKChange?.(v);
            }}
            aria-label="Top K"
            className="accent-primary h-1 w-24 cursor-pointer"
          />
        </label>

        <label className="inline-flex items-center gap-2">
          <span className="font-mono">
            ≥ <span className="text-foreground tabular-nums">{thresholdValue.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={thresholdValue}
            onChange={(e) => {
              const v = Number(e.target.value);
              setThreshold(v);
              onThresholdChange?.(v);
            }}
            aria-label="Score threshold"
            className="accent-primary h-1 w-24 cursor-pointer"
          />
        </label>

        <label className="inline-flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={rerankerValue}
            onClick={() => {
              const v = !rerankerValue;
              setReranker(v);
              onRerankerChange?.(v);
            }}
            className={cn(
              'relative inline-flex h-4 w-7 items-center rounded-full transition-colors',
              rerankerValue ? 'bg-primary' : 'bg-muted',
            )}
          >
            <span
              className={cn(
                'bg-background block size-3 rounded-full shadow-sm transition-transform',
                rerankerValue ? 'translate-x-3.5' : 'translate-x-0.5',
              )}
            />
          </button>
          <span>reranker</span>
        </label>
      </div>
    </form>
  );
}

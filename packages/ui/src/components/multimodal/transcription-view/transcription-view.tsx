'use client';

import { useEffect, useMemo, useRef, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { TranscriptSegment } from '@nyxis/core';

export interface TranscriptionViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Time-anchored transcript segments. */
  segments: readonly TranscriptSegment[];
  /** Current playback time in seconds — drives the active segment. */
  currentTime?: number;
  /** Called when the user clicks a segment (e.g. to seek). */
  onSelect?: (segment: TranscriptSegment) => void;
  /** Hide speaker labels even when present. */
  hideSpeakers?: boolean;
  /** Hide timestamps. */
  hideTimestamps?: boolean;
  /** Auto-scroll the active segment into view. Default true. */
  autoScroll?: boolean;
}

/**
 * Vertical, time-anchored transcript. Highlights the segment that
 * contains `currentTime` and (optionally) auto-scrolls it into view.
 * Pair with `<AudioPlayer>` (or a video element) to wire `currentTime`
 * and `onSelect` for click-to-seek.
 */
export function TranscriptionView({
  segments,
  currentTime = 0,
  onSelect,
  hideSpeakers = false,
  hideTimestamps = false,
  autoScroll = true,
  className,
  ...props
}: TranscriptionViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const activeIndex = useMemo(() => {
    for (let i = 0; i < segments.length; i++) {
      const s = segments[i]!;
      if (currentTime >= s.start && currentTime < s.end) return i;
    }
    return -1;
  }, [segments, currentTime]);

  useEffect(() => {
    if (!autoScroll || activeIndex < 0) return;
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeIndex, autoScroll]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'border-border bg-card max-h-[28rem] overflow-y-auto rounded-lg border p-3',
        className,
      )}
      {...props}
    >
      <ol className="flex flex-col gap-1">
        {segments.map((segment, index) => {
          const active = index === activeIndex;
          return (
            <li key={segment.id}>
              <button
                ref={active ? activeRef : null}
                type="button"
                onClick={() => onSelect?.(segment)}
                disabled={!onSelect}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex w-full gap-3 rounded-md px-2 py-1.5 text-left transition-colors',
                  onSelect && 'cursor-pointer',
                  active ? 'bg-primary/10' : onSelect && 'hover:bg-muted/40',
                )}
              >
                {!hideTimestamps && (
                  <time
                    className={cn(
                      'shrink-0 font-mono text-[10px] tabular-nums leading-relaxed',
                      active ? 'text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {formatTime(segment.start)}
                  </time>
                )}

                <div className="min-w-0 flex-1">
                  {!hideSpeakers && segment.speaker && (
                    <span
                      className={cn(
                        'mr-2 inline-block text-[10px] font-semibold uppercase tracking-wider',
                        active ? 'text-primary' : 'text-muted-foreground',
                      )}
                    >
                      {segment.speaker}
                    </span>
                  )}
                  <span
                    className={cn(
                      'text-xs leading-relaxed',
                      active ? 'text-foreground font-medium' : 'text-foreground/85',
                    )}
                  >
                    {segment.text}
                  </span>
                </div>

                {segment.confidence != null && segment.confidence < 0.7 && (
                  <span
                    className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400"
                    title={`Confidence: ${Math.round(segment.confidence * 100)}%`}
                  >
                    low conf
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

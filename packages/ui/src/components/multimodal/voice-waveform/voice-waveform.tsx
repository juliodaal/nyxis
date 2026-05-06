'use client';

import { useEffect, useMemo, useState, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';

export interface VoiceWaveformProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Pre-computed amplitude values 0..1. If omitted, a sine-modulated
   * sequence is used while `isRecording` is true.
   */
  bars?: readonly number[];
  /** Currently recording — bars animate live. */
  isRecording?: boolean;
  /** Currently playing — progress fills the waveform. */
  isPlaying?: boolean;
  /** Playback progress 0..1 — required when `isPlaying`. */
  progress?: number;
  /** Number of bars rendered when no precomputed values supplied. */
  barCount?: number;
  /** Visual height of the waveform container. */
  height?: number;
  /** Bar width in px. */
  barWidth?: number;
  /** Gap between bars in px. */
  gap?: number;
}

/**
 * Bar-based audio waveform. Three modes:
 *
 * 1. **Recording** — bars animate from a sine wave + random jitter.
 * 2. **Playback** — bars render statically; the portion left of
 *    `progress` is highlighted in the primary tone.
 * 3. **Idle** — flat baseline, useful as a placeholder.
 *
 * Pair with `<AudioPlayer>` to drive `isPlaying` + `progress`.
 */
export function VoiceWaveform({
  bars,
  isRecording = false,
  isPlaying = false,
  progress = 0,
  barCount = 48,
  height = 32,
  barWidth = 2,
  gap = 2,
  className,
  ...props
}: VoiceWaveformProps) {
  const [tick, setTick] = useState(0);

  // Tick driver for live recording animation.
  useEffect(() => {
    if (!isRecording) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      if (now - last > 60) {
        setTick((v) => v + 1);
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isRecording]);

  const values = useMemo(() => {
    if (bars && bars.length > 0) return bars;
    const out: number[] = [];
    const seed = tick;
    for (let i = 0; i < barCount; i++) {
      // Smooth wave + noise so it feels alive while recording.
      const wave = Math.abs(Math.sin((i + seed * 0.6) * 0.45)) * 0.7;
      const noise = isRecording ? Math.random() * 0.3 : 0.1;
      out.push(Math.min(1, wave + noise));
    }
    return out;
  }, [bars, tick, isRecording, barCount]);

  const totalWidth = values.length * (barWidth + gap) - gap;

  return (
    <div
      role="img"
      aria-label={isRecording ? 'Recording audio' : isPlaying ? 'Playing audio' : 'Audio waveform'}
      className={cn('flex items-center', className)}
      style={{ height }}
      {...props}
    >
      <svg
        width={totalWidth}
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="overflow-visible"
        aria-hidden
      >
        {values.map((v, i) => {
          const barHeight = Math.max(2, v * height);
          const x = i * (barWidth + gap);
          const y = (height - barHeight) / 2;
          const positionFrac = (i + 0.5) / values.length;
          const filled = isPlaying && positionFrac <= progress;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={barWidth / 2}
              className={cn(
                'transition-all duration-100',
                isRecording
                  ? 'fill-destructive'
                  : filled
                    ? 'fill-primary'
                    : 'fill-muted-foreground/40',
              )}
            />
          );
        })}
      </svg>
    </div>
  );
}

'use client';

import { useEffect, useRef, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';

export interface TokenStreamProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether tokens are being emitted. */
  active?: boolean;
  /** Average ms between token spawns. */
  spawnEveryMs?: number;
  /** Max number of tokens alive at once. */
  maxTokens?: number;
  /** Layout direction: tokens flow `right` or `left` along the X axis. */
  direction?: 'right' | 'left';
  /** Height of the stream lane in px. */
  height?: number;
  /** Color override (CSS string). Defaults to `currentColor`. */
  color?: string;
}

interface Token {
  id: number;
  /** Birth timestamp. */
  birth: number;
  /** Lane offset 0..1 — drives Y position. */
  lane: number;
  /** Speed factor 0.6..1.4. */
  speed: number;
  /** Hue rotation 0..40 deg from primary, for variety. */
  hue: number;
}

/**
 * Visualises tokens flowing — animated dots traversing a lane.
 * Useful as a streaming indicator for chat composers, codegen
 * pipelines, or any "data is in transit" affordance.
 *
 * Each token spawns at one edge with a random lane and travels to
 * the opposite edge over ~1.4s. Honours `prefers-reduced-motion`.
 */
export function TokenStream({
  active = true,
  spawnEveryMs = 90,
  maxTokens = 18,
  direction = 'right',
  height = 24,
  color = 'currentColor',
  className,
  ...props
}: TokenStreamProps) {
  const tokensRef = useRef<Token[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  // Spawn loop.
  useEffect(() => {
    if (!active) {
      tokensRef.current = [];
      // Force a re-render to clear DOM.
      if (containerRef.current) containerRef.current.dataset['tick'] = '0';
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let mounted = true;
    let tickCount = 0;

    const interval = setInterval(() => {
      if (!mounted) return;
      const now = performance.now();
      tokensRef.current = tokensRef.current.filter((t) => now - t.birth < 1600);
      if (tokensRef.current.length < maxTokens) {
        tokensRef.current.push({
          id: idRef.current++,
          birth: now,
          lane: Math.random(),
          speed: 0.6 + Math.random() * 0.8,
          hue: Math.random() * 40 - 20,
        });
      }
      // Trigger React re-render via a data attribute mutation.
      if (containerRef.current) {
        tickCount += 1;
        containerRef.current.dataset['tick'] = String(tickCount);
      }
    }, spawnEveryMs);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [active, spawnEveryMs, maxTokens]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{ height, color }}
      {...props}
    >
      {tokensRef.current.map((t) => (
        <span
          key={t.id}
          className="absolute size-1.5 rounded-full motion-safe:animate-[nyxis-token-flow_var(--life)_linear_forwards]"
          style={{
            top: `${t.lane * 100}%`,
            background: 'currentColor',
            filter: `hue-rotate(${t.hue}deg)`,
            opacity: 0.85,
            ['--life' as string]: `${1400 / t.speed}ms`,
            ['--from' as string]: direction === 'right' ? '-2%' : '102%',
            ['--to' as string]: direction === 'right' ? '102%' : '-2%',
          }}
        />
      ))}

      <style>{`
        @keyframes nyxis-token-flow {
          0%   { left: var(--from); opacity: 0; transform: translateY(-50%) scale(0.6); }
          12%  { opacity: 0.9; transform: translateY(-50%) scale(1); }
          88%  { opacity: 0.9; transform: translateY(-50%) scale(1); }
          100% { left: var(--to); opacity: 0; transform: translateY(-50%) scale(0.6); }
        }
      `}</style>
    </div>
  );
}

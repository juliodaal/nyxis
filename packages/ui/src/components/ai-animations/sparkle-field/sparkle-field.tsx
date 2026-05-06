'use client';

import { useEffect, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface SparkleFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** How many sparkles are alive at any moment. */
  density?: number;
  /** How long each sparkle lives, in ms. */
  lifeMs?: number;
  /** Whether sparkles are currently being emitted. */
  active?: boolean;
  /** Force CSS colour for the sparkles. Defaults to `currentColor`. */
  color?: string;
  /** Children render above the sparkle field. */
  children?: ReactNode;
}

interface Sparkle {
  id: number;
  /** 0..1 */
  x: number;
  y: number;
  /** Size in px. */
  size: number;
  /** Random rotation in deg. */
  rotation: number;
  /** Birth timestamp. */
  birth: number;
}

/**
 * Animated sparkle backdrop — twinkles small four-point stars at
 * random positions inside the container. The "magic AI" affordance
 * popularised by Apple Intelligence and Anthropic's Claude. Pair as
 * a wrapper around AI-related buttons or generated content.
 *
 * Honours `prefers-reduced-motion` (renders a few static stars at low
 * opacity instead of animating).
 */
export function SparkleField({
  density = 8,
  lifeMs = 1400,
  active = true,
  color = 'currentColor',
  className,
  children,
  ...props
}: SparkleFieldProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [reduced, setReduced] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Periodically refresh the sparkle pool. Each sparkle lives `lifeMs`
  // and is replaced when it ages out.
  useEffect(() => {
    if (!active || reduced) {
      setSparkles([]);
      return;
    }

    const make = (): Sparkle => ({
      id: idRef.current++,
      x: Math.random(),
      y: Math.random(),
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 90,
      birth: performance.now(),
    });

    // Seed
    setSparkles(Array.from({ length: density }, make));

    const interval = setInterval(
      () => {
        const now = performance.now();
        setSparkles((prev) => {
          const alive = prev.filter((s) => now - s.birth < lifeMs);
          const need = density - alive.length;
          if (need <= 0) return alive;
          return [...alive, ...Array.from({ length: need }, make)];
        });
      },
      lifeMs / Math.max(2, density),
    );

    return () => clearInterval(interval);
  }, [active, density, lifeMs, reduced]);

  // Static sparkles for reduced-motion: scatter a few faintly.
  const staticPoints = useMemo<Sparkle[]>(() => {
    if (!reduced) return [];
    return Array.from({ length: Math.min(density, 6) }, (_, i) => ({
      id: i,
      x: ((i * 37) % 90) / 100 + 0.05,
      y: ((i * 19) % 80) / 100 + 0.1,
      size: 8,
      rotation: (i * 23) % 90,
      birth: 0,
    }));
  }, [density, reduced]);

  const visible = reduced ? staticPoints : sparkles;

  return (
    <div className={cn('relative', className)} {...props}>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {visible.map((s) => (
          <Sparkle key={s.id} sparkle={s} lifeMs={lifeMs} color={color} reduced={reduced} />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Sparkle({
  sparkle,
  lifeMs,
  color,
  reduced,
}: {
  sparkle: Sparkle;
  lifeMs: number;
  color: string;
  reduced: boolean;
}) {
  return (
    <span
      className={cn(
        'absolute',
        !reduced && 'animate-[nyxis-sparkle_var(--life)_ease-in-out_forwards]',
      )}
      style={{
        left: `${sparkle.x * 100}%`,
        top: `${sparkle.y * 100}%`,
        width: sparkle.size,
        height: sparkle.size,
        transform: `translate(-50%, -50%) rotate(${sparkle.rotation}deg)`,
        // Custom property consumed by the inline keyframe block below.
        ['--life' as string]: `${lifeMs}ms`,
        opacity: reduced ? 0.35 : undefined,
        color,
      }}
    >
      <svg viewBox="0 0 16 16" aria-hidden className="size-full">
        <path
          fill="currentColor"
          d="M8 0c.4 3.3 1.2 5.1 2.4 6.3 1.2 1.2 3 2 6.3 2.4-3.3.4-5.1 1.2-6.3 2.4-1.2 1.2-2 3-2.4 6.3-.4-3.3-1.2-5.1-2.4-6.3C4.4 9.9 2.6 9.1-.7 8.7 2.6 8.3 4.4 7.5 5.6 6.3 6.8 5.1 7.6 3.3 8 0Z"
          transform="translate(0.5,0.3)"
        />
      </svg>
      <style>{`
        @keyframes nyxis-sparkle {
          0%   { opacity: 0; transform: translate(-50%, -50%) rotate(${sparkle.rotation}deg) scale(0.4); }
          25%  { opacity: 1; transform: translate(-50%, -50%) rotate(${sparkle.rotation}deg) scale(1.0); }
          75%  { opacity: 1; transform: translate(-50%, -50%) rotate(${sparkle.rotation + 30}deg) scale(0.95); }
          100% { opacity: 0; transform: translate(-50%, -50%) rotate(${sparkle.rotation + 60}deg) scale(0.4); }
        }
      `}</style>
    </span>
  );
}

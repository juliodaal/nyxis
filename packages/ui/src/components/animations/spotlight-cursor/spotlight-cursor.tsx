'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '../../../lib/animation/use-reduced-motion.js';
import { cn } from '../../../lib/utils.js';

export interface SpotlightCursorProps {
  children: ReactNode;
  /** Radius of the spotlight in pixels. */
  size?: number;
  /** Spotlight color override. */
  color?: string;
  className?: string;
}

/**
 * Section wrapper that follows the cursor with a soft radial gradient.
 * Disabled on touch devices and under reduced motion.
 */
export function SpotlightCursor({ children, size = 480, color, className }: SpotlightCursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [pos, setPos] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  useEffect(() => {
    if (reduced) return;
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
    };
    const leave = () => setPos((p) => ({ ...p, visible: false }));
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [reduced]);

  return (
    <div ref={ref} className={cn('relative isolate overflow-hidden', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity"
        style={{
          opacity: pos.visible ? 1 : 0,
          background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${
            color ?? 'oklch(from var(--color-primary) l c h / 0.18)'
          }, transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

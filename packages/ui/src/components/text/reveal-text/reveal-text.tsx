'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { createElement } from 'react';
import { useReducedMotion } from '../../../lib/animation/use-reduced-motion.js';
import { cn } from '../../../lib/utils.js';

export interface RevealTextProps {
  children: ReactNode;
  /** Wrapper element. */
  as?: ElementType;
  /** Threshold for entering view (0..1). */
  threshold?: number;
  /** Replay every time the element re-enters the viewport. */
  repeat?: boolean;
  /** Delay (ms) once visible. */
  delay?: number;
  /** Animation duration (ms). */
  duration?: number;
  className?: string;
}

/**
 * Reveal content as it enters the viewport. Uses a `IntersectionObserver`
 * so it works without GSAP. Honours `prefers-reduced-motion`.
 */
export function RevealText({
  children,
  as = 'div',
  threshold = 0.2,
  repeat = false,
  delay = 0,
  duration = 600,
  className,
}: RevealTextProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            if (!repeat) obs.disconnect();
          } else if (repeat) {
            setVisible(false);
          }
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, repeat, reduced]);

  return createElement(as, {
    ref,
    className: cn(
      'transition-all',
      visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      className,
    ),
    style: {
      transitionDelay: `${delay}ms`,
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: 'var(--ease-out-expo)',
    },
    children,
  });
}

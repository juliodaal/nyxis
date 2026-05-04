'use client';

import { useEffect, useState, type ElementType } from 'react';
import { createElement } from 'react';
import { useReducedMotion } from '../../../lib/animation/use-reduced-motion.js';
import { cn } from '../../../lib/utils.js';

export interface RotatingTextProps {
  words: readonly string[];
  /** Milliseconds each word stays visible. */
  interval?: number;
  /** Animation style. */
  animation?: 'slide' | 'fade';
  /** Wrapper element. */
  as?: ElementType;
  className?: string;
}

/**
 * Cycles through a list of words with a slide or fade transition.
 * Falls back to showing only the first word under reduced motion.
 */
export function RotatingText({
  words,
  interval = 2500,
  animation = 'slide',
  as = 'span',
  className,
}: RotatingTextProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || words.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [interval, words.length, reduced]);

  const current = words[index] ?? '';

  return createElement(as, {
    className: cn('relative inline-grid overflow-hidden align-bottom', className),
    style: { lineHeight: 1.1 },
    children: (
      <>
        <span
          key={current}
          aria-live="polite"
          className={cn(
            'col-start-1 row-start-1 inline-block text-current',
            !reduced &&
              animation === 'slide' &&
              'motion-safe:animate-[nyxis-rotate-slide_400ms_var(--ease-out-expo)]',
            !reduced &&
              animation === 'fade' &&
              'motion-safe:animate-[nyxis-rotate-fade_400ms_ease-out]',
          )}
        >
          {current}
        </span>
        <style>{`
          @keyframes nyxis-rotate-slide {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
          @keyframes nyxis-rotate-fade {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        `}</style>
      </>
    ),
  });
}

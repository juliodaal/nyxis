'use client';

import { useEffect, useRef, useState, type ElementType } from 'react';
import { createElement } from 'react';
import { useReducedMotion } from '../../../lib/animation/use-reduced-motion.js';
import { cn } from '../../../lib/utils.js';

export interface ScrambleTextProps {
  children: string;
  /** Time per character (ms) before it locks to the final letter. */
  durationPerChar?: number;
  /** Alphabet of scramble glyphs. */
  alphabet?: string;
  /** Trigger animation on mount or on hover. */
  trigger?: 'mount' | 'hover';
  /** Wrapper element. */
  as?: ElementType;
  className?: string;
}

const DEFAULT_ALPHABET = '!<>-_\\/[]{}—=+*^?#________';

/**
 * Letters scramble through a glyph alphabet and resolve into the final
 * text. Inspired by classic terminal-decryption effects.
 */
export function ScrambleText({
  children,
  durationPerChar = 60,
  alphabet = DEFAULT_ALPHABET,
  trigger = 'mount',
  as = 'span',
  className,
}: ScrambleTextProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [shouldRun, setShouldRun] = useState(trigger === 'mount');

  useEffect(() => {
    if (reduced || !shouldRun) {
      if (ref.current) ref.current.textContent = children;
      return;
    }

    const target = children;
    const length = target.length;
    let frame = 0;
    let raf = 0;
    const lockedUntil: number[] = Array.from({ length }, (_, i) =>
      Math.round(i * (durationPerChar / 16)),
    );

    const update = () => {
      if (!ref.current) return;
      let output = '';
      let allLocked = true;
      for (let i = 0; i < length; i += 1) {
        if (frame >= (lockedUntil[i] ?? 0)) {
          output += target[i];
        } else {
          output += alphabet[Math.floor(Math.random() * alphabet.length)];
          allLocked = false;
        }
      }
      ref.current.textContent = output;
      frame += 1;
      if (!allLocked) raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [children, alphabet, durationPerChar, reduced, shouldRun]);

  return createElement(as, {
    ref,
    'aria-label': children,
    onMouseEnter: trigger === 'hover' ? () => setShouldRun(true) : undefined,
    className: cn('inline-block font-mono', className),
    children: reduced ? children : '',
  });
}

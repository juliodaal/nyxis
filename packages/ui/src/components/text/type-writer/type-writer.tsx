'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../../lib/animation/use-reduced-motion.js';
import { cn } from '../../../lib/utils.js';

export interface TypeWriterProps {
  /** Text or array of texts to cycle through. */
  text: string | readonly string[];
  /** Milliseconds per character when typing. */
  typeSpeed?: number;
  /** Milliseconds per character when deleting. */
  deleteSpeed?: number;
  /** Milliseconds to hold completed text before deleting (when cycling). */
  holdMs?: number;
  /** Loop the array. Single string never loops. */
  loop?: boolean;
  /** Show a blinking cursor. */
  cursor?: boolean;
  className?: string;
  /** Optional element role for accessibility. */
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';
}

/**
 * Typewriter effect with cursor and optional multi-string cycling.
 * Renders the full final text immediately under `prefers-reduced-motion`.
 */
export function TypeWriter({
  text,
  typeSpeed = 60,
  deleteSpeed = 30,
  holdMs = 1400,
  loop = true,
  cursor = true,
  className,
  as: Tag = 'span',
}: TypeWriterProps) {
  const reduced = useReducedMotion();
  const strings = Array.isArray(text) ? text : [text];
  const [displayed, setDisplayed] = useState<string>(reduced ? (strings[0] ?? '') : '');
  const [stringIdx, setStringIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced) return;
    const current = strings[stringIdx] ?? '';

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        timerRef.current = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          typeSpeed,
        );
      } else if (strings.length > 1 && loop) {
        timerRef.current = setTimeout(() => setPhase('holding'), holdMs);
      }
    } else if (phase === 'holding') {
      timerRef.current = setTimeout(() => setPhase('deleting'), holdMs);
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timerRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deleteSpeed);
      } else {
        setStringIdx((idx) => (idx + 1) % strings.length);
        setPhase('typing');
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [displayed, phase, stringIdx, strings, typeSpeed, deleteSpeed, holdMs, loop, reduced]);

  return (
    <Tag className={cn('inline-flex items-center', className)}>
      <span aria-live="polite">{displayed}</span>
      {cursor && !reduced ? (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-current"
        />
      ) : null}
    </Tag>
  );
}

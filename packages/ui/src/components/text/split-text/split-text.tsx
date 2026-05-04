'use client';

import {
  createElement,
  forwardRef,
  useImperativeHandle,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react';
import { useGsap } from '../../../lib/gsap/use-gsap.js';
import { splitText, splitLines, type SplitMode } from '../../../lib/gsap/split.js';
import { useReducedMotion } from '../../../lib/animation/use-reduced-motion.js';
import { cn } from '../../../lib/utils.js';

export interface SplitTextProps {
  children: string;
  /** Wrapper element type. Default `'span'`. */
  as?: ElementType;
  /** Split granularity. */
  splitBy?: SplitMode;
  /** Initial delay in seconds. */
  delay?: number;
  /** Stagger between segments (seconds). */
  stagger?: number;
  /** Animation duration (seconds). */
  duration?: number;
  /** GSAP ease string. */
  ease?: string;
  /** Trigger on mount or on scroll. */
  trigger?: 'mount' | 'scroll';
  /** y-offset (px) for the from-state. */
  fromY?: number;
  className?: string;
}

/**
 * Animate the entrance of text broken into characters, words, or lines.
 * Backed by GSAP. Falls back to an instant render under
 * `prefers-reduced-motion`.
 */
export const SplitText = forwardRef<HTMLElement, SplitTextProps>(function SplitText(
  {
    children,
    as = 'span',
    splitBy = 'chars',
    delay = 0,
    stagger = 0.03,
    duration = 0.6,
    ease = 'expo.out',
    trigger = 'mount',
    fromY = 24,
    className,
  },
  forwardedRef,
) {
  const ref = useRef<HTMLElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement, []);
  const reduced = useReducedMotion();

  useGsap(
    ref,
    ({ gsap, scope }) => {
      if (reduced) {
        // Render the text without splitting; keeps screen readers and
        // visual readers in sync, and avoids any animation cost.
        scope.textContent = children;
        return;
      }

      let selector: string;
      if (splitBy === 'lines') {
        scope.textContent = children;
        selector = splitLines(scope);
      } else {
        const result = splitText(children, splitBy);
        scope.innerHTML = result.html;
        selector = result.selector;
      }

      const targets = scope.querySelectorAll(selector);

      const tween = gsap.fromTo(
        targets,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration,
          ease,
          delay,
          stagger,
          ...(trigger === 'scroll'
            ? {
                scrollTrigger: {
                  trigger: scope,
                  start: 'top 85%',
                  toggleActions: 'play none none reset',
                },
              }
            : {}),
        },
      );

      if (trigger === 'scroll') {
        // Lazy-load ScrollTrigger if not already.
        void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger);
        });
      }

      return () => {
        tween.kill();
      };
    },
    [children, splitBy, delay, stagger, duration, ease, trigger, fromY, reduced],
  );

  return createElement(as, {
    ref,
    'aria-label': children,
    className: cn('inline-block whitespace-pre-wrap', className),
    children: reduced ? children : null,
  } as Record<string, unknown>);
}) as <As extends ElementType = 'span'>(props: SplitTextProps & { as?: As }) => ReactNode;

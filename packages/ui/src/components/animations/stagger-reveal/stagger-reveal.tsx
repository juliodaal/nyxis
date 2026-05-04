'use client';

import { useRef, type ReactNode } from 'react';
import { useGsap } from '../../../lib/gsap/use-gsap.js';
import { useReducedMotion } from '../../../lib/animation/use-reduced-motion.js';
import { cn } from '../../../lib/utils.js';

export interface StaggerRevealProps {
  children: ReactNode;
  /** Selector for the children to animate. Default: every direct child. */
  selector?: string;
  /** Stagger between children (seconds). */
  stagger?: number;
  /** Animation duration (seconds). */
  duration?: number;
  /** Initial offset (px). */
  fromY?: number;
  /** GSAP ease string. */
  ease?: string;
  /** Trigger on mount or when scrolled into view. */
  trigger?: 'mount' | 'scroll';
  className?: string;
}

/**
 * Reveal direct children in sequence — useful for landing-page lists,
 * card grids, and feature rows. Backed by GSAP.
 */
export function StaggerReveal({
  children,
  selector = ':scope > *',
  stagger = 0.08,
  duration = 0.6,
  fromY = 24,
  ease = 'expo.out',
  trigger = 'scroll',
  className,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGsap(
    ref,
    ({ gsap, scope }) => {
      if (reduced) return;
      const targets = scope.querySelectorAll(selector);
      const anim = gsap.fromTo(
        targets,
        { y: fromY, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          ease,
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
        void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger);
        });
      }
      return () => anim.kill();
    },
    [selector, stagger, duration, fromY, ease, trigger, reduced],
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

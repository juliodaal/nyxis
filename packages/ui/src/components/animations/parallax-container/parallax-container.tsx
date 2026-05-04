'use client';

import { useRef, type ReactNode } from 'react';
import { useGsap } from '../../../lib/gsap/use-gsap.js';
import { useReducedMotion } from '../../../lib/animation/use-reduced-motion.js';
import { cn } from '../../../lib/utils.js';

export interface ParallaxContainerProps {
  children: ReactNode;
  /** Depth of the parallax effect. Positive moves up on scroll, negative moves down. */
  depth?: number;
  className?: string;
}

/**
 * Wraps children with a scroll-triggered translate that slides them
 * relative to the page. Uses GSAP ScrollTrigger.
 */
export function ParallaxContainer({ children, depth = 80, className }: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGsap(
    ref,
    ({ gsap, scope }) => {
      if (reduced) return;
      let scrollTrigger: import('gsap/ScrollTrigger').ScrollTrigger | undefined;
      void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const tween = gsap.to(scope, {
          y: -depth,
          ease: 'none',
          scrollTrigger: {
            trigger: scope,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
        scrollTrigger = tween.scrollTrigger;
      });
      return () => {
        scrollTrigger?.kill();
      };
    },
    [depth, reduced],
  );

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
}

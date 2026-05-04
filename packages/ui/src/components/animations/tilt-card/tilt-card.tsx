'use client';

import { useRef, type ReactNode } from 'react';
import { useGsap } from '../../../lib/gsap/use-gsap.js';
import { useReducedMotion } from '../../../lib/animation/use-reduced-motion.js';
import { cn } from '../../../lib/utils.js';

export interface TiltCardProps {
  children: ReactNode;
  /** Maximum rotation in degrees on each axis. */
  maxTilt?: number;
  /** Show a soft glare highlight under the cursor. */
  glare?: boolean;
  className?: string;
}

/**
 * Cursor-tracked 3D tilt with optional glare. Disabled on touch devices
 * and under reduced motion.
 */
export function TiltCard({ children, maxTilt = 10, glare = true, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGsap(
    ref,
    ({ gsap, scope }) => {
      if (
        reduced ||
        (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)
      ) {
        return;
      }

      const inner = scope.querySelector<HTMLElement>('[data-tilt-inner]');
      const glareEl = scope.querySelector<HTMLElement>('[data-tilt-glare]');
      if (!inner) return;

      const xTo = gsap.quickTo(inner, 'rotationY', { duration: 0.4, ease: 'expo.out' });
      const yTo = gsap.quickTo(inner, 'rotationX', { duration: 0.4, ease: 'expo.out' });
      const sTo = gsap.quickTo(inner, 'scale', { duration: 0.3, ease: 'expo.out' });

      const onMove = (e: MouseEvent) => {
        const rect = scope.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (py - 0.5) * -2 * maxTilt;
        const ry = (px - 0.5) * 2 * maxTilt;
        xTo(ry);
        yTo(rx);
        sTo(1.02);
        if (glareEl) {
          glareEl.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, oklch(1 0 0 / 0.18), transparent 50%)`;
          glareEl.style.opacity = '1';
        }
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
        sTo(1);
        if (glareEl) glareEl.style.opacity = '0';
      };

      scope.addEventListener('mousemove', onMove);
      scope.addEventListener('mouseleave', onLeave);
      return () => {
        scope.removeEventListener('mousemove', onMove);
        scope.removeEventListener('mouseleave', onLeave);
      };
    },
    [maxTilt, glare, reduced],
  );

  return (
    <div ref={ref} className={cn('group [perspective:1000px]', className)}>
      <div
        data-tilt-inner
        className="relative h-full w-full rounded-[inherit] will-change-transform [transform-style:preserve-3d]"
      >
        {glare ? (
          <div
            data-tilt-glare
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-200"
          />
        ) : null}
        {children}
      </div>
    </div>
  );
}

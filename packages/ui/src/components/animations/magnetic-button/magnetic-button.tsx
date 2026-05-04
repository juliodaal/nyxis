'use client';

import { forwardRef, useRef, type ButtonHTMLAttributes } from 'react';
import { useGsap } from '../../../lib/gsap/use-gsap.js';
import { useReducedMotion } from '../../../lib/animation/use-reduced-motion.js';
import { cn } from '../../../lib/utils.js';

export interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Strength of the pull (0..1). Higher = follows the cursor more. */
  strength?: number;
  /** Distance (px) at which the magnetic effect activates. */
  distance?: number;
}

/**
 * Button that subtly pulls toward the cursor when the cursor is within
 * `distance` px. Uses `gsap.quickTo` for a cheap, jitter-free ease.
 */
export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton(
    { strength = 0.4, distance = 120, className, children, ...props },
    forwardedRef,
  ) {
    const innerRef = useRef<HTMLButtonElement>(null);
    const reduced = useReducedMotion();

    useGsap(
      innerRef,
      ({ gsap, scope }) => {
        if (reduced) return;
        const xTo = gsap.quickTo(scope, 'x', { duration: 0.4, ease: 'expo.out' });
        const yTo = gsap.quickTo(scope, 'y', { duration: 0.4, ease: 'expo.out' });

        const onMove = (event: MouseEvent) => {
          const rect = scope.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = event.clientX - cx;
          const dy = event.clientY - cy;
          const d = Math.hypot(dx, dy);
          if (d < distance) {
            xTo(dx * strength);
            yTo(dy * strength);
          } else {
            xTo(0);
            yTo(0);
          }
        };
        const reset = () => {
          xTo(0);
          yTo(0);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', reset);
        return () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseleave', reset);
        };
      },
      [strength, distance, reduced],
    );

    return (
      <button
        ref={(node) => {
          innerRef.current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        type="button"
        className={cn(
          'bg-primary text-primary-foreground inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-shadow',
          'hover:shadow-glow focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

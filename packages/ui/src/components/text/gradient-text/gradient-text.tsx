'use client';

import { forwardRef, type ElementType } from 'react';
import { cn } from '../../../lib/utils.js';

export interface GradientTextProps {
  children: React.ReactNode;
  as?: ElementType;
  /** Animation duration in seconds. */
  duration?: number;
  /** CSS gradient stops. Use the `from`/`via`/`to` Tailwind classes
   *  for finer control, or pass arbitrary CSS via `style`. */
  gradient?: string;
  className?: string;
}

const DEFAULT_GRADIENT =
  'linear-gradient(110deg, var(--color-primary) 0%, oklch(0.78 0.2 320) 35%, var(--color-primary) 70%, oklch(0.85 0.18 240) 100%)';

/**
 * Animated gradient that flows across the text. CSS-only — does not
 * require GSAP. Respects `prefers-reduced-motion` (gradient becomes
 * static).
 */
export const GradientText = forwardRef<HTMLElement, GradientTextProps>(function GradientText(
  { children, as: Tag = 'span', duration = 8, gradient = DEFAULT_GRADIENT, className },
  ref,
) {
  return (
    <>
      <Tag
        ref={ref as never}
        className={cn(
          'inline-block bg-clip-text text-transparent [background-size:200%_100%]',
          'motion-safe:[animation:nyxis-gradient-shift_var(--nyxis-grad-duration)_linear_infinite]',
          className,
        )}
        style={{
          backgroundImage: gradient,
          ['--nyxis-grad-duration' as string]: `${duration}s`,
        }}
      >
        {children}
      </Tag>
      <style>{`
        @keyframes nyxis-gradient-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </>
  );
});

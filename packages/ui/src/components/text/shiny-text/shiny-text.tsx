'use client';

import { forwardRef, type ElementType } from 'react';
import { cn } from '../../../lib/utils.js';

export interface ShinyTextProps {
  children: React.ReactNode;
  as?: ElementType;
  /** Animation duration in seconds. */
  duration?: number;
  className?: string;
}

/**
 * A subtle highlight that sweeps across the text. CSS-only.
 */
export const ShinyText = forwardRef<HTMLElement, ShinyTextProps>(function ShinyText(
  { children, as: Tag = 'span', duration = 3.5, className },
  ref,
) {
  return (
    <>
      <Tag
        ref={ref as never}
        className={cn(
          'inline-block bg-clip-text text-transparent [background-size:200%_100%]',
          'motion-safe:[animation:nyxis-shine_var(--nyxis-shine-duration)_linear_infinite]',
          className,
        )}
        style={{
          backgroundImage:
            'linear-gradient(110deg, currentColor 0%, currentColor 40%, oklch(0.95 0 0) 50%, currentColor 60%, currentColor 100%)',
          ['--nyxis-shine-duration' as string]: `${duration}s`,
          color: 'var(--color-foreground)',
        }}
      >
        {children}
      </Tag>
      <style>{`
        @keyframes nyxis-shine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
});

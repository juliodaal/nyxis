'use client';

import { Children, type ReactNode } from 'react';
import { cn } from '../../../lib/utils.js';

export interface MarqueeTextProps {
  children: ReactNode;
  /** Direction of travel. */
  direction?: 'left' | 'right';
  /** Speed in seconds for one full loop. Lower = faster. */
  speed?: number;
  /** Pause when the user hovers the marquee. */
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Infinite-scrolling horizontal marquee. CSS-only, GPU-accelerated.
 * Renders the children twice so the loop is seamless.
 */
export function MarqueeText({
  children,
  direction = 'left',
  speed = 30,
  pauseOnHover = true,
  className,
}: MarqueeTextProps) {
  const items = Children.toArray(children);
  return (
    <div
      className={cn('group flex w-full overflow-hidden', className)}
      role="marquee"
      aria-label="Auto-scrolling text"
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            'flex shrink-0 items-center gap-8 px-4 motion-safe:animate-[var(--nyxis-marquee-anim)_var(--nyxis-marquee-speed)_linear_infinite]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
          style={{
            ['--nyxis-marquee-speed' as string]: `${speed}s`,
            ['--nyxis-marquee-anim' as string]:
              direction === 'left' ? 'nyxis-marquee-left' : 'nyxis-marquee-right',
          }}
        >
          {items}
        </div>
      ))}
      <style>{`
        @keyframes nyxis-marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes nyxis-marquee-right {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

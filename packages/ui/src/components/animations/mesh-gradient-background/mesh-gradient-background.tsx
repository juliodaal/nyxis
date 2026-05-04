'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils.js';

export type MeshGradientBackgroundProps = HTMLAttributes<HTMLDivElement>;

/**
 * Animated mesh-gradient background. Pure CSS, no GSAP. Three filtered
 * blobs animate independently to create the impression of a soft,
 * shifting mesh. Disabled by `prefers-reduced-motion`.
 */
export function MeshGradientBackground({
  className,
  children,
  ...props
}: MeshGradientBackgroundProps) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)} {...props}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'conic-gradient(from 90deg at 50% 50%, oklch(0.6 0.22 300) 0deg, oklch(0.7 0.18 240) 120deg, oklch(0.78 0.2 320) 240deg, oklch(0.6 0.22 300) 360deg)',
          filter: 'blur(80px)',
          opacity: 0.5,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 motion-safe:animate-[nyxis-mesh-rotate_40s_linear_infinite]"
        style={{
          background:
            'radial-gradient(ellipse at 30% 30%, oklch(0.7 0.22 300 / 0.6), transparent 60%), radial-gradient(ellipse at 70% 70%, oklch(0.78 0.2 240 / 0.5), transparent 60%)',
          filter: 'blur(60px)',
        }}
      />
      {children}
      <style>{`
        @keyframes nyxis-mesh-rotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

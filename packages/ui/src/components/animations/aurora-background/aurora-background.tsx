'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils.js';

export type AuroraBackgroundProps = HTMLAttributes<HTMLDivElement>;

/**
 * Soft animated aurora behind a section. Pure CSS — three blurred radial
 * gradients that drift across the container. Reduced-motion freezes the
 * gradients in place but keeps the visual depth.
 */
export function AuroraBackground({ className, children, ...props }: AuroraBackgroundProps) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)} {...props}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 blur-3xl"
      >
        <div
          className="absolute -left-1/4 top-0 size-[60vmax] rounded-full motion-safe:animate-[nyxis-aurora-1_18s_ease-in-out_infinite_alternate]"
          style={{ background: 'oklch(0.7 0.22 300 / 0.7)' }}
        />
        <div
          className="absolute right-0 top-1/4 size-[50vmax] rounded-full motion-safe:animate-[nyxis-aurora-2_22s_ease-in-out_infinite_alternate]"
          style={{ background: 'oklch(0.78 0.2 240 / 0.55)' }}
        />
        <div
          className="absolute bottom-0 left-1/3 size-[55vmax] rounded-full motion-safe:animate-[nyxis-aurora-3_26s_ease-in-out_infinite_alternate]"
          style={{ background: 'oklch(0.82 0.18 320 / 0.5)' }}
        />
      </div>
      {children}
      <style>{`
        @keyframes nyxis-aurora-1 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(15%, 5%) scale(1.15); }
        }
        @keyframes nyxis-aurora-2 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-12%, 8%) scale(1.1); }
        }
        @keyframes nyxis-aurora-3 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(8%, -10%) scale(1.2); }
        }
      `}</style>
    </div>
  );
}

'use client';

import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface AIHaloBorderProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the halo animation is active. */
  active?: boolean;
  /** Border thickness in px. */
  thickness?: number;
  /** Outer radius in px (matches `border-radius`). */
  radius?: number;
  /** Animation period in ms. */
  speedMs?: number;
  /** Conic gradient stops — defaults to `from-primary via-violet to-sky`. */
  colors?: readonly [string, string, string];
  /** Children render inside the bordered area. */
  children?: ReactNode;
}

/**
 * Animated conic-gradient border for AI-touched content. Apply around
 * any element to signal "AI is at work" or "AI-generated". Two
 * configurations:
 *
 * - `active` — halo rotates continuously.
 * - `active={false}` — halo holds a static gradient (still nice).
 *
 * Honours `prefers-reduced-motion` via a static rotation when reduced.
 */
export function AIHaloBorder({
  active = true,
  thickness = 2,
  radius = 12,
  speedMs = 4000,
  colors = ['hsl(var(--primary))', '#a855f7', '#0ea5e9'] as const,
  className,
  children,
  ...props
}: AIHaloBorderProps) {
  const grad = `conic-gradient(from 0deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[0]})`;

  return (
    <div
      data-active={active || undefined}
      className={cn('relative inline-block', className)}
      style={{ borderRadius: radius, padding: thickness }}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 -z-0',
          active && 'motion-safe:animate-[nyxis-halo-spin_var(--halo-speed)_linear_infinite]',
        )}
        style={{
          background: grad,
          borderRadius: radius,
          ['--halo-speed' as string]: `${speedMs}ms`,
        }}
      />
      <div className="bg-card relative" style={{ borderRadius: Math.max(0, radius - thickness) }}>
        {children}
      </div>

      <style>{`
        @keyframes nyxis-halo-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

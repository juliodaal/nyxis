'use client';

import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface GradientAuraProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the aura animates. */
  active?: boolean;
  /** Aura intensity 0..1 (drives blur and opacity). */
  intensity?: number;
  /** Animation period in ms. */
  speedMs?: number;
  /** Conic gradient colour stops. */
  colors?: readonly [string, string, string];
  /** Children render above the aura. */
  children?: ReactNode;
}

/**
 * Soft animated gradient glow that sits behind a child element. Use
 * to give an element a "premium AI" feel without taking over the whole
 * viewport.
 *
 * Pure CSS, GPU-accelerated. Honours `prefers-reduced-motion` (the
 * gradient holds a static rotation when reduced).
 */
export function GradientAura({
  active = true,
  intensity = 0.55,
  speedMs = 7000,
  colors = ['hsl(var(--primary))', '#a855f7', '#0ea5e9'] as const,
  className,
  children,
  ...props
}: GradientAuraProps) {
  const opacity = Math.max(0, Math.min(1, intensity));
  const blur = 28 + opacity * 28;
  const grad = `conic-gradient(from 90deg at 50% 50%, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[0]})`;

  return (
    <div className={cn('relative inline-block', className)} {...props}>
      <span
        aria-hidden
        data-active={active || undefined}
        className={cn(
          'absolute -inset-6 -z-10 rounded-[inherit]',
          active && 'motion-safe:animate-[nyxis-aura-spin_var(--aura-speed)_linear_infinite]',
        )}
        style={{
          background: grad,
          opacity,
          filter: `blur(${blur}px)`,
          ['--aura-speed' as string]: `${speedMs}ms`,
        }}
      />
      <div className="relative">{children}</div>

      <style>{`
        @keyframes nyxis-aura-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

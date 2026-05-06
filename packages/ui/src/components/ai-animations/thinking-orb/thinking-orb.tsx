'use client';

import { type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';

export type ThinkingOrbState = 'idle' | 'thinking' | 'speaking' | 'errored';

export interface ThinkingOrbProps extends HTMLAttributes<HTMLDivElement> {
  /** Drives breathe / morph behaviour. */
  state?: ThinkingOrbState;
  /** Size in px. */
  size?: number;
  /** Optional label rendered under the orb. */
  label?: string;
}

/**
 * Siri / Apple-Intelligence-style breathing orb. Three states drive
 * the animation:
 *
 * - `idle` — gentle slow breathe, muted gradient.
 * - `thinking` — faster pulse + colour shift through the
 *   primary → violet → sky range.
 * - `speaking` — quick wave-like distortion (fast scale + rotation).
 * - `errored` — destructive tone, no animation.
 *
 * Pure CSS. Honours `prefers-reduced-motion` (static gradient).
 */
export function ThinkingOrb({
  state = 'idle',
  size = 80,
  label,
  className,
  ...props
}: ThinkingOrbProps) {
  return (
    <div
      data-state={state}
      role="status"
      aria-label={label ?? `Assistant is ${state}`}
      className={cn('inline-flex flex-col items-center gap-2', className)}
      {...props}
    >
      <div
        className={cn(
          'relative grid place-items-center',
          'motion-safe:data-[state=idle]:animate-[nyxis-orb-breathe_4.5s_ease-in-out_infinite]',
          'motion-safe:data-[state=thinking]:animate-[nyxis-orb-pulse_1.6s_ease-in-out_infinite]',
          'motion-safe:data-[state=speaking]:animate-[nyxis-orb-wave_900ms_ease-in-out_infinite]',
        )}
        data-state={state}
        style={{ width: size, height: size }}
      >
        {/* Outer halo */}
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 rounded-full opacity-70 blur-md',
            state === 'errored'
              ? 'bg-destructive'
              : 'bg-gradient-to-br from-[hsl(var(--primary))] via-violet-500 to-sky-500',
          )}
        />

        {/* Inner orb */}
        <span
          aria-hidden
          className={cn(
            'relative size-full rounded-full',
            state === 'errored'
              ? 'from-destructive/80 to-destructive bg-gradient-to-br'
              : 'bg-gradient-to-br from-[hsl(var(--primary))] via-violet-500 to-sky-500',
            'shadow-inner',
          )}
        >
          {/* Specular highlight */}
          <span
            aria-hidden
            className="absolute inset-1 rounded-full bg-gradient-to-br from-white/50 to-transparent opacity-50 blur-sm"
          />
        </span>
      </div>

      {label && <span className="text-muted-foreground text-[11px] font-medium">{label}</span>}

      <style>{`
        @keyframes nyxis-orb-breathe {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50%      { transform: scale(1.04); filter: brightness(1.05); }
        }
        @keyframes nyxis-orb-pulse {
          0%, 100% { transform: scale(0.97); filter: hue-rotate(0deg) brightness(1); }
          50%      { transform: scale(1.06); filter: hue-rotate(40deg) brightness(1.15); }
        }
        @keyframes nyxis-orb-wave {
          0%, 100% { transform: scale(1) rotate(0deg); filter: hue-rotate(0deg); }
          25%      { transform: scale(1.03) rotate(-2deg); filter: hue-rotate(20deg); }
          75%      { transform: scale(0.98) rotate(2deg); filter: hue-rotate(-20deg); }
        }
      `}</style>
    </div>
  );
}

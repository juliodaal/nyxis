'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TypingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional label rendered next to the dots. */
  label?: string;
  /** Subtle vs prominent styling. */
  variant?: 'subtle' | 'bubble';
}

/**
 * Three bouncing dots — the universally-understood "AI is typing" affordance.
 * Pair with `<ChatMessage role="assistant">` while a turn is streaming.
 */
export function TypingIndicator({
  label,
  variant = 'subtle',
  className,
  ...props
}: TypingIndicatorProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label ?? 'Assistant is typing'}
      className={cn(
        'text-muted-foreground inline-flex items-center gap-2 text-sm',
        variant === 'bubble' &&
          'border-border bg-card text-card-foreground rounded-2xl border px-4 py-2.5',
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-current"
            style={{
              animation: 'nyxis-typing-bounce 1.2s infinite ease-in-out',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </span>
      {label ? <span>{label}</span> : null}
      <style>{`
        @keyframes nyxis-typing-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%           { transform: translateY(-3px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-label="Assistant is typing"] span span { animation: none !important; opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

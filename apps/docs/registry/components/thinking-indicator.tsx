'use client';

import { Brain, Sparkles } from 'lucide-react';
import { type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface ThinkingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional label rendered next to the icon. Default: "Thinking…". */
  label?: string;
  /** Visual treatment. */
  variant?: 'pulse' | 'shimmer' | 'orbit';
  /** Use a brain icon (default) or sparkles. */
  icon?: 'brain' | 'sparkles';
  /** Mark the line as ARIA live for assistive tech. */
  ariaLive?: 'off' | 'polite' | 'assertive';
}

/**
 * Lightweight "the model is thinking" affordance — distinct from
 * `<TypingIndicator>`, which signals streaming output. Use this BEFORE
 * the assistant emits its first token (e.g. while extended thinking is
 * running, or while a tool call is dispatched).
 */
export function ThinkingIndicator({
  label = 'Thinking…',
  variant = 'shimmer',
  icon = 'brain',
  ariaLive = 'polite',
  className,
  ...props
}: ThinkingIndicatorProps) {
  const Icon = icon === 'sparkles' ? Sparkles : Brain;

  return (
    <div
      role="status"
      aria-live={ariaLive}
      aria-label={label}
      data-variant={variant}
      className={cn('inline-flex items-center gap-2 text-sm font-medium', className)}
      {...props}
    >
      <span
        className={cn(
          'bg-primary/15 text-primary grid size-6 place-items-center rounded-full',
          variant === 'pulse' && 'animate-pulse',
          variant === 'orbit' && 'relative',
        )}
      >
        <Icon className="size-3.5" aria-hidden />
        {variant === 'orbit' && (
          <>
            <span
              aria-hidden
              className="border-primary/30 border-t-primary absolute inset-0 rounded-full border"
              style={{ animation: 'nyxis-thinking-orbit 1.4s linear infinite' }}
            />
            <style>{`
              @keyframes nyxis-thinking-orbit {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </>
        )}
      </span>
      <span
        className={cn(
          variant === 'shimmer'
            ? 'from-foreground via-muted-foreground to-foreground bg-gradient-to-r bg-[length:200%_100%] bg-clip-text text-transparent'
            : 'text-foreground',
        )}
        style={
          variant === 'shimmer'
            ? { animation: 'nyxis-thinking-shimmer 2.2s linear infinite' }
            : undefined
        }
      >
        {label}
      </span>
      {variant === 'shimmer' && (
        <style>{`
          @keyframes nyxis-thinking-shimmer {
            from { background-position: 200% 0; }
            to { background-position: -200% 0; }
          }
        `}</style>
      )}
    </div>
  );
}

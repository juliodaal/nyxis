'use client';

import { Check, Loader2 } from 'lucide-react';
import { type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type ChainStepStatus = 'pending' | 'active' | 'done' | 'errored';

export interface ChainStep {
  id: string;
  /** Step body — short summary of what the model is doing. */
  text: string;
  /** Status drives the leading indicator. */
  status?: ChainStepStatus;
  /** Optional one-line detail rendered under the step. */
  detail?: string;
}

export interface ChainOfThoughtProps extends HTMLAttributes<HTMLOListElement> {
  /** Ordered list of reasoning steps. */
  steps: readonly ChainStep[];
  /** Compact dense layout without surrounding card. */
  bare?: boolean;
}

/**
 * Vertical stepper rendering an explicit chain-of-thought. Use when the
 * model exposes its plan as discrete steps (planning → searching →
 * synthesising → answering).
 *
 * Pair with `<ReasoningTrace>` when the model produces unstructured
 * extended-thinking text instead.
 */
export function ChainOfThought({ steps, bare = false, className, ...props }: ChainOfThoughtProps) {
  return (
    <ol
      className={cn(
        'flex flex-col',
        bare ? 'gap-3' : 'border-border bg-card gap-0 rounded-lg border p-4',
        className,
      )}
      {...props}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const status = step.status ?? 'pending';
        return (
          <li key={step.id} className="relative flex gap-3">
            <div className="flex flex-col items-center">
              <StepIndicator status={status} index={index + 1} />
              {!isLast && (
                <span
                  className={cn(
                    'mt-1 w-px flex-1 transition-colors',
                    status === 'done' ? 'bg-primary/40' : 'bg-border',
                  )}
                />
              )}
            </div>
            <div className={cn('flex flex-1 flex-col gap-0.5 pb-4 pt-0.5', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-sm leading-snug transition-colors',
                  status === 'active'
                    ? 'text-foreground font-medium'
                    : status === 'done'
                      ? 'text-foreground'
                      : status === 'errored'
                        ? 'text-destructive'
                        : 'text-muted-foreground',
                )}
              >
                {step.text}
              </p>
              {step.detail && (
                <p className="text-muted-foreground text-[11px] leading-snug">{step.detail}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StepIndicator({ status, index }: { status: ChainStepStatus; index: number }) {
  return (
    <span
      className={cn(
        'grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold transition-colors',
        status === 'done' && 'bg-primary text-primary-foreground',
        status === 'active' && 'bg-primary/15 text-primary ring-primary/30 ring-2',
        status === 'errored' && 'bg-destructive/15 text-destructive',
        status === 'pending' && 'bg-muted text-muted-foreground',
      )}
    >
      {status === 'done' ? (
        <Check className="size-3" aria-hidden />
      ) : status === 'active' ? (
        <Loader2 className="size-3 animate-spin" aria-hidden />
      ) : (
        index
      )}
    </span>
  );
}

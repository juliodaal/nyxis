'use client';

import { AlertTriangle } from 'lucide-react';
import { useId, useMemo } from 'react';

import { cn } from '@/lib/utils';
import { findModel } from '@nyxis/core';

export interface MaxTokensInputProps {
  /** Current value (controlled). */
  value?: number;
  /** Default uncontrolled value. */
  defaultValue?: number;
  /** Called on every change. */
  onValueChange?: (value: number) => void;
  /** Model id used to detect the model's `maxOutput` cap. */
  modelId?: string;
  /** Override the maximum allowed value (falls back to the model's cap). */
  max?: number;
  /** Step granularity. */
  step?: number;
  /** Disable the field. */
  disabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * Number input for `max_tokens` that knows the selected model's output
 * cap and warns when the user exceeds it.
 */
export function MaxTokensInput({
  value,
  defaultValue = 1024,
  onValueChange,
  modelId,
  max,
  step = 32,
  disabled,
  className,
  id,
}: MaxTokensInputProps) {
  const reactId = useId();
  const fieldId = id ?? `nyxis-max-tokens-${reactId}`;
  const current = value ?? defaultValue;

  const model = useMemo(() => (modelId ? findModel(modelId) : undefined), [modelId]);
  const limit = max ?? model?.maxOutput ?? model?.contextWindow ?? Infinity;
  const overflow = current > limit;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={fieldId} className="text-foreground text-sm font-medium">
          Max tokens
        </label>
        {Number.isFinite(limit) ? (
          <span className="text-muted-foreground text-[11px]">
            cap · <span className="font-mono">{limit.toLocaleString()}</span>
          </span>
        ) : null}
      </div>

      <div
        data-overflow={overflow}
        className={cn(
          'border-input bg-background flex h-10 items-center gap-2 rounded-md border px-3 transition-colors',
          'focus-within:ring-ring focus-within:ring-offset-background focus-within:ring-2 focus-within:ring-offset-2',
          'data-[overflow=true]:border-warning',
        )}
      >
        <input
          id={fieldId}
          type="number"
          inputMode="numeric"
          min={1}
          step={step}
          value={current}
          disabled={disabled}
          aria-invalid={overflow}
          onChange={(e) => onValueChange?.(Number(e.target.value))}
          className="text-foreground flex-1 bg-transparent font-mono text-sm tabular-nums outline-none disabled:opacity-50"
        />
        {overflow ? (
          <AlertTriangle className="text-warning size-4 shrink-0" aria-hidden="true" />
        ) : null}
      </div>

      {overflow ? (
        <p className="text-warning text-xs">
          Exceeds the model's <span className="font-mono">maxOutput</span> of{' '}
          {limit.toLocaleString()} tokens. The provider will likely reject the request or silently
          clamp it.
        </p>
      ) : null}
    </div>
  );
}

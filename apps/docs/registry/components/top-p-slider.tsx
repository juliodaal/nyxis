'use client';

import { type ChangeEvent, type CSSProperties, type ReactNode, useId } from 'react';

import { cn } from '@/lib/utils';

export interface TopPSliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * Slider for nucleus sampling (`top_p`). Range 0–1 with descriptive
 * endpoints. Most teams set this OR temperature, not both — the
 * description nudges users toward that.
 */
export function TopPSlider({
  value,
  defaultValue = 1,
  onValueChange,
  className,
  disabled,
  id,
}: TopPSliderProps) {
  const reactId = useId();
  const fieldId = id ?? `nyxis-topp-${reactId}`;

  const current = value ?? defaultValue;

  return (
    <SliderBase
      id={fieldId}
      label="Top-P (nucleus sampling)"
      value={current}
      min={0}
      max={1}
      step={0.05}
      onChange={(v) => onValueChange?.(v)}
      formatValue={(v) => v.toFixed(2)}
      endpoints={{ start: 'narrow', end: 'wide' }}
      description="prefer over temperature"
      className={className}
      disabled={disabled}
    />
  );
}

interface SliderBaseProps {
  id?: string | undefined;
  label: ReactNode;
  description?: ReactNode | undefined;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Render the value badge with an explicit format. */
  formatValue?: ((value: number) => string) | undefined;
  /** Optional anchor labels shown under the track. */
  endpoints?: { start: string; end: string } | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
}

function SliderBase({
  id,
  label,
  description,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  endpoints,
  className,
  disabled,
}: SliderBaseProps) {
  const percent = ((value - min) / (max - min)) * 100;
  const display = formatValue ? formatValue(value) : value.toFixed(2);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-foreground text-sm font-medium">
          {label}
        </label>
        <span className="border-border bg-card text-foreground rounded-md border px-2 py-0.5 font-mono text-xs tabular-nums">
          {display}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          'bg-muted h-1.5 w-full appearance-none rounded-full outline-none transition-colors',
          'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50',
        )}
        style={
          {
            background: `linear-gradient(to right, var(--color-primary) 0% ${percent}%, var(--color-muted) ${percent}% 100%)`,
            ['--nyxis-slider-thumb-bg' as string]: 'var(--color-primary)',
          } as CSSProperties
        }
      />

      {(description || endpoints) && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-[11px]">{endpoints?.start ?? ''}</span>
          {description ? (
            <span className="text-muted-foreground text-[11px]">{description}</span>
          ) : null}
          <span className="text-muted-foreground text-[11px]">{endpoints?.end ?? ''}</span>
        </div>
      )}

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--nyxis-slider-thumb-bg, var(--color-primary));
          border: 2px solid var(--color-background);
          box-shadow: 0 0 0 1px var(--color-border);
          cursor: pointer;
          transition: transform 0.12s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.15); }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--nyxis-slider-thumb-bg, var(--color-primary));
          border: 2px solid var(--color-background);
          box-shadow: 0 0 0 1px var(--color-border);
          cursor: pointer;
        }
        input[type="range"]:disabled::-webkit-slider-thumb { cursor: not-allowed; }
        input[type="range"]:disabled::-moz-range-thumb { cursor: not-allowed; }
      `}</style>
    </div>
  );
}

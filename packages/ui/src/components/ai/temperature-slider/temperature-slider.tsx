'use client';

import { useId } from 'react';
import { SliderBase } from '../_slider-base.js';

export interface TemperatureSliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Maximum value. Most providers cap at 1; some (Anthropic) at 1, others (OpenAI) at 2. */
  max?: number;
  /** Step granularity. */
  step?: number;
  className?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * Slider for the model's `temperature` parameter, with semantic endpoints
 * ("deterministic" ↔ "creative"). Defaults to a 0–1 range, matching most
 * providers; pass `max={2}` for OpenAI-style models.
 */
export function TemperatureSlider({
  value,
  defaultValue = 0.7,
  onValueChange,
  max = 1,
  step = 0.05,
  className,
  disabled,
  id,
}: TemperatureSliderProps) {
  const reactId = useId();
  const fieldId = id ?? `nyxis-temp-${reactId}`;

  const current = value ?? defaultValue;
  const handle = (next: number) => onValueChange?.(next);

  return (
    <SliderBase
      id={fieldId}
      label="Temperature"
      value={current}
      min={0}
      max={max}
      step={step}
      onChange={handle}
      formatValue={(v) => v.toFixed(2)}
      endpoints={{ start: 'deterministic', end: 'creative' }}
      className={className}
      disabled={disabled}
    />
  );
}

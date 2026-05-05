'use client';

import { useId } from 'react';
import { SliderBase } from '../_slider-base.js';

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

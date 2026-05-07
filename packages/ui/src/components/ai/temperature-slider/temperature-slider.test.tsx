import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';

import { TemperatureSlider } from './temperature-slider.js';

describe('TemperatureSlider', () => {
  it('renders with the default value', () => {
    render(<TemperatureSlider />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('0.7');
  });

  it('renders the controlled value', () => {
    render(<TemperatureSlider value={0.4} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('0.4');
  });

  it('fires onValueChange on input', () => {
    const onValueChange = vi.fn();
    render(<TemperatureSlider value={0.5} onValueChange={onValueChange} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '0.85' } });
    expect(onValueChange).toHaveBeenCalledWith(0.85);
  });

  it('respects max prop (e.g. OpenAI 0..2 range)', () => {
    render(<TemperatureSlider value={1.5} max={2} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('max', '2');
  });

  it('disables interaction when disabled', () => {
    render(<TemperatureSlider disabled />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });
});

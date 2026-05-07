import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { TopPSlider } from './top-p-slider.js';

describe('TopPSlider', () => {
  it('renders with the default value', () => {
    render(<TopPSlider />);
    expect(screen.getByRole('slider')).toHaveValue('1');
  });

  it('reflects controlled value', () => {
    render(<TopPSlider value={0.6} />);
    expect(screen.getByRole('slider')).toHaveValue('0.6');
  });

  it('fires onValueChange on input', () => {
    const onValueChange = vi.fn();
    render(<TopPSlider value={0.6} onValueChange={onValueChange} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0.8' } });
    expect(onValueChange).toHaveBeenCalledWith(0.8);
  });

  it('disables interaction when disabled', () => {
    render(<TopPSlider disabled />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });
});

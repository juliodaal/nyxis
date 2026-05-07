import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { MaxTokensInput } from './max-tokens-input.js';

describe('MaxTokensInput', () => {
  it('renders with the default value', () => {
    render(<MaxTokensInput />);
    expect(screen.getByRole('spinbutton')).toHaveValue(1024);
  });

  it('reflects controlled value', () => {
    render(<MaxTokensInput value={512} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(512);
  });

  it('fires onValueChange when changed', () => {
    const onValueChange = vi.fn();
    render(<MaxTokensInput value={512} onValueChange={onValueChange} />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '2048' } });
    expect(onValueChange).toHaveBeenCalledWith(2048);
  });

  it('disables interaction when disabled', () => {
    render(<MaxTokensInput disabled />);
    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });
});

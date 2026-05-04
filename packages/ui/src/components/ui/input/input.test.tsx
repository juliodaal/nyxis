import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input.js';

describe('Input', () => {
  it('accepts user typing', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="email" />);
    const input = screen.getByLabelText('email');
    await user.type(input, 'hello');
    expect(input).toHaveValue('hello');
  });

  it('forwards onChange', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Input aria-label="x" onChange={onChange} />);
    await user.type(screen.getByLabelText('x'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('respects disabled', () => {
    render(<Input aria-label="x" disabled />);
    expect(screen.getByLabelText('x')).toBeDisabled();
  });
});

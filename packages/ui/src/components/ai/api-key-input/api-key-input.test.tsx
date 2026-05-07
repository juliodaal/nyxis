import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { APIKeyInput } from './api-key-input.js';

function getKeyInput(): HTMLInputElement {
  // The component renders an unlabelled <input>; placeholder text is provider-aware.
  return document.querySelector('input[type="password"], input[type="text"]') as HTMLInputElement;
}

describe('APIKeyInput', () => {
  it('renders a password-typed input by default', () => {
    render(<APIKeyInput />);
    const input = getKeyInput();
    expect(input).toBeTruthy();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('reveals the value when the show toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<APIKeyInput defaultValue="sk-ant-secret" />);
    const input = getKeyInput();
    expect(input).toHaveAttribute('type', 'password');
    const toggle = screen.getByRole('button', { name: /show api key/i });
    await user.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('fires onValueChange on input', () => {
    const onValueChange = vi.fn();
    render(<APIKeyInput value="" onValueChange={onValueChange} />);
    fireEvent.change(getKeyInput(), { target: { value: 'sk-test' } });
    expect(onValueChange).toHaveBeenCalledWith('sk-test');
  });

  it('runs the validator on blur and surfaces a result', async () => {
    const validate = vi.fn(async () => 'valid' as const);
    render(
      <APIKeyInput defaultValue="sk-ant-test123456" validate={validate} provider="anthropic" />,
    );
    const input = getKeyInput();
    fireEvent.blur(input);
    await waitFor(() => expect(validate).toHaveBeenCalled());
  });

  it('disables interaction when disabled', () => {
    render(<APIKeyInput disabled />);
    expect(getKeyInput()).toBeDisabled();
  });
});

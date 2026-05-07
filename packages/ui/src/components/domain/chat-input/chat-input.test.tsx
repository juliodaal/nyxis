import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ChatInput } from './chat-input.js';

describe('ChatInput', () => {
  it('submits on Enter (without shift)', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText(/Type your message/i);
    await user.type(textarea, 'Hello');
    await user.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('Hello');
  });

  it('does NOT submit on Shift+Enter', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText(/Type your message/i);
    await user.type(textarea, 'Hello');
    await user.keyboard('{Shift>}{Enter}{/Shift}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits via the send button', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} />);
    await user.type(screen.getByPlaceholderText(/Type your message/i), 'Hi there');
    await user.click(screen.getByRole('button', { name: /Send message/i }));
    expect(onSubmit).toHaveBeenCalledWith('Hi there');
  });

  it('disables the send button when value is empty', () => {
    render(<ChatInput />);
    expect(screen.getByRole('button', { name: /Send message/i })).toBeDisabled();
  });

  it('renders an attachment button when attachments={true}', () => {
    render(<ChatInput attachments />);
    expect(screen.getByRole('button', { name: /Attach file/i })).toBeInTheDocument();
  });

  it('respects disabled — textarea and send button are disabled', () => {
    const onSubmit = vi.fn();
    render(<ChatInput disabled defaultValue="seeded" onSubmit={onSubmit} />);
    const sendButton = screen.getByRole('button', { name: /Send message/i });
    expect(sendButton).toBeDisabled();
    const textarea = screen.getByPlaceholderText(/Type your message/i);
    expect(textarea).toBeDisabled();
  });
});

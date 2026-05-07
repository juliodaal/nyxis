import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MessageActions } from './message-actions.js';

describe('MessageActions', () => {
  it('renders the default action set', () => {
    render(<MessageActions text="hi" />);
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /regenerate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('only renders requested actions', () => {
    render(<MessageActions actions={['copy', 'fork']} text="hi" />);
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fork/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /regenerate/i })).not.toBeInTheDocument();
  });

  it('fires onRegenerate when clicked', async () => {
    const onRegenerate = vi.fn();
    const user = userEvent.setup();
    render(<MessageActions onRegenerate={onRegenerate} text="hi" />);
    await user.click(screen.getByRole('button', { name: /regenerate/i }));
    expect(onRegenerate).toHaveBeenCalledOnce();
  });

  it('fires onShare when clicked', async () => {
    const onShare = vi.fn();
    const user = userEvent.setup();
    render(<MessageActions onShare={onShare} text="hi" />);
    await user.click(screen.getByRole('button', { name: /share/i }));
    expect(onShare).toHaveBeenCalledOnce();
  });
});

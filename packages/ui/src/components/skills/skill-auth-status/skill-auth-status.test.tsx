import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { SkillAuthStatus } from './skill-auth-status.js';

describe('SkillAuthStatus', () => {
  it('renders the connected heading + description', () => {
    render(<SkillAuthStatus state="connected" />);

    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText(/OAuth token valid/i)).toBeInTheDocument();
  });

  it('renders the never-connected heading and Connect button', () => {
    const onConnect = vi.fn();
    render(<SkillAuthStatus state="never" onConnect={onConnect} />);

    expect(screen.getByText('Not connected')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Connect/i }));
    expect(onConnect).toHaveBeenCalled();
  });

  it('renders the expired state with a Reconnect action', () => {
    const onConnect = vi.fn();
    render(<SkillAuthStatus state="expired" onConnect={onConnect} />);

    expect(screen.getByText(/Token expired/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Reconnect/i }));
    expect(onConnect).toHaveBeenCalled();
  });

  it('fires onDisconnect when connected and the disconnect button is clicked', () => {
    const onDisconnect = vi.fn();
    render(<SkillAuthStatus state="connected" onDisconnect={onDisconnect} />);

    fireEvent.click(screen.getByRole('button', { name: /Disconnect/i }));

    expect(onDisconnect).toHaveBeenCalled();
  });

  it('renders the compact pill variant', () => {
    const { container } = render(<SkillAuthStatus state="connected" compact />);

    // compact returns a span with data-state
    const pill = container.querySelector('[data-state="connected"]');
    expect(pill).toBeTruthy();
    expect(pill?.tagName).toBe('SPAN');
  });

  it('renders the errored state with a Retry button', () => {
    render(<SkillAuthStatus state="errored" onConnect={() => {}} />);

    expect(screen.getByText(/Connection error/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });
});

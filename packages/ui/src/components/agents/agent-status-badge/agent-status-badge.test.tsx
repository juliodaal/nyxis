import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AgentStatusBadge } from './agent-status-badge.js';

describe('AgentStatusBadge', () => {
  it('renders the working status with label and spin animation', () => {
    const { container } = render(<AgentStatusBadge status="working" />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveAttribute('data-status', 'working');
    expect(badge.textContent).toMatch(/working/i);
    // Lucide icon receives `animate-spin` while working.
    expect(container.querySelector('.animate-spin')).not.toBeNull();
  });

  it('renders the thinking status with pulse animation', () => {
    const { container } = render(<AgentStatusBadge status="thinking" />);
    expect(screen.getByRole('status').textContent).toMatch(/thinking/i);
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('renders idle, blocked, done, errored labels', () => {
    const statuses = ['idle', 'blocked', 'done', 'errored'] as const;
    for (const s of statuses) {
      const { unmount, getByRole } = render(<AgentStatusBadge status={s} />);
      expect(getByRole('status').textContent).toMatch(new RegExp(s, 'i'));
      unmount();
    }
  });

  it('hides the label when compact and exposes aria-label still', () => {
    render(<AgentStatusBadge status="done" compact />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveAttribute('aria-label', 'done');
    // No visible text node — the inner <span> with the word is omitted.
    expect(badge.querySelector('span')).toBeNull();
  });

  it('honours a custom label override', () => {
    render(<AgentStatusBadge status="working" label="In flight" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'In flight');
    expect(screen.getByText('In flight')).toBeInTheDocument();
  });
});

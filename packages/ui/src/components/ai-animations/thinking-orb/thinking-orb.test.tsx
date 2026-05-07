import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ThinkingOrb } from './thinking-orb.js';

describe('ThinkingOrb', () => {
  it('renders with role=status', () => {
    render(<ThinkingOrb />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses an aria-label that reflects the current state', () => {
    render(<ThinkingOrb state="thinking" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Assistant is thinking');
  });

  it('renders the optional label text below the orb', () => {
    render(<ThinkingOrb state="speaking" label="Replying…" />);

    expect(screen.getByText('Replying…')).toBeInTheDocument();
  });

  it('exposes the state via data-state', () => {
    const { container } = render(<ThinkingOrb state="errored" />);

    expect(container.querySelector('[data-state="errored"]')).toBeTruthy();
  });

  it('applies a destructive-tinted gradient when state=errored', () => {
    const { container } = render(<ThinkingOrb state="errored" />);

    // Either of the orb's spans should have a destructive-related class
    const destructive = container.querySelector('[class*="destructive"]');
    expect(destructive).toBeTruthy();
  });
});

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ThinkingIndicator } from './thinking-indicator.js';

describe('ThinkingIndicator', () => {
  it('renders the default label', () => {
    render(<ThinkingIndicator />);

    expect(screen.getByText('Thinking…')).toBeInTheDocument();
  });

  it('uses the provided label when supplied', () => {
    render(<ThinkingIndicator label="Reading docs" />);

    expect(screen.getByText('Reading docs')).toBeInTheDocument();
  });

  it('exposes role=status with aria-live for assistive tech', () => {
    render(<ThinkingIndicator label="Working" />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-label', 'Working');
  });

  it('respects an explicit ariaLive value', () => {
    render(<ThinkingIndicator ariaLive="assertive" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders all variants without crashing', () => {
    const { rerender } = render(<ThinkingIndicator variant="pulse" label="A" />);
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'pulse');

    rerender(<ThinkingIndicator variant="shimmer" label="A" />);
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'shimmer');

    rerender(<ThinkingIndicator variant="orbit" label="A" />);
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'orbit');
  });
});

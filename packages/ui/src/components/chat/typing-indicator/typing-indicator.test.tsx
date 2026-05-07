import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { TypingIndicator } from './typing-indicator.js';

describe('TypingIndicator', () => {
  it('renders with the default aria-label', () => {
    render(<TypingIndicator />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Assistant is typing');
  });

  it('renders the supplied label', () => {
    render(<TypingIndicator label="Compiling response" />);
    expect(screen.getByText('Compiling response')).toBeInTheDocument();
  });

  it('uses bubble styling when variant=bubble', () => {
    const { container } = render(<TypingIndicator variant="bubble" label="x" />);
    expect((container.firstChild as HTMLElement).className).toMatch(/border/);
  });
});

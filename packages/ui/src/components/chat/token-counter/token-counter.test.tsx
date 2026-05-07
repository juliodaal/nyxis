import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';

import { TokenCounter } from './token-counter.js';

describe('TokenCounter', () => {
  it('renders an estimated token count', () => {
    render(<TokenCounter text="Hello world" />);
    const text = document.body.textContent ?? '';
    expect(text).toMatch(/~?\d/);
    expect(text).toMatch(/tokens/i);
  });

  it('renders compact (no "tokens" label)', () => {
    render(<TokenCounter text="hello" compact />);
    expect(document.body.textContent ?? '').not.toMatch(/tokens$/);
  });

  it('renders a context bar when showBar', () => {
    const { container } = render(<TokenCounter text="hello" showBar modelId="claude-sonnet-4-5" />);
    // Bar uses a span with `data-tone` attribute matching the parent.
    const bar = container.querySelectorAll('[data-tone]');
    expect(bar.length).toBeGreaterThan(0);
  });
});

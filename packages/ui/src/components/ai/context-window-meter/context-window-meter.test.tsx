import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';

import { ContextWindowMeter } from './context-window-meter.js';

describe('ContextWindowMeter', () => {
  it('renders used and total when total is supplied', () => {
    const { container } = render(<ContextWindowMeter used={4_000} total={16_000} />);
    const text = container.textContent ?? '';
    // Locale may format with `,` or `.` or no grouping — accept any.
    expect(text).toMatch(/4[.,]?000/);
    expect(text).toMatch(/16[.,]?000/);
  });

  it('infers total from a known modelId', () => {
    const { container } = render(<ContextWindowMeter used={1_000} modelId="claude-sonnet-4-5" />);
    expect(container.textContent ?? '').toMatch(/\d/);
  });

  it('switches tone at high usage (≥ 90%)', () => {
    const { container } = render(<ContextWindowMeter used={195_000} modelId="claude-sonnet-4-5" />);
    const root = container.querySelector('[data-tone]');
    expect(root?.getAttribute('data-tone')).toBe('crit');
  });

  it('renders compact variant without crashing', () => {
    const { container } = render(<ContextWindowMeter used={4_000} total={16_000} compact />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

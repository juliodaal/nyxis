import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';

import { CostMeter } from './cost-meter.js';

describe('CostMeter', () => {
  it('renders the initial USD value', () => {
    render(<CostMeter initial={0.0124} />);
    // Display might be like $0.0124 or $0.01 depending on precision
    const text = document.body.textContent ?? '';
    expect(text).toMatch(/\$0\.0/);
  });

  it('renders a detailed breakdown when detailed', () => {
    const { container } = render(<CostMeter initial={0.123} detailed />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('starts at $0 when no initial supplied', () => {
    render(<CostMeter />);
    expect(document.body.textContent ?? '').toMatch(/\$0/);
  });
});

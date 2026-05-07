import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import type { EvalMetric } from '../../../ai/types.js';
import { MetricCard } from './metric-card.js';

describe('MetricCard', () => {
  it('renders the metric name and value', () => {
    const metric: EvalMetric = { name: 'accuracy', value: 0.92 };
    const { container } = render(<MetricCard metric={metric} />);

    expect(screen.getByText('accuracy')).toBeInTheDocument();
    // formatted value present
    expect(container.textContent).toMatch(/0[.,]92/);
  });

  it('renders a delta badge when baseline is provided', () => {
    const metric: EvalMetric = {
      name: 'accuracy',
      value: 0.95,
      baseline: 0.78,
      goodDirection: 'up',
      precision: 2,
    };
    const { container } = render(<MetricCard metric={metric} />);

    // delta is +0.17 → "good" tone (since goodDirection: 'up').
    const tonedEl = container.querySelector('[data-tone="good"]');
    expect(tonedEl).toBeTruthy();
  });

  it('renders an SVG sparkline when sparkline values are supplied', () => {
    const metric: EvalMetric = {
      name: 'accuracy',
      value: 0.9,
      sparkline: [0.7, 0.75, 0.8, 0.85, 0.9],
    };
    const { container } = render(<MetricCard metric={metric} />);

    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelector('polyline')).toBeTruthy();
  });

  it('does not render sparkline when hideSparkline=true', () => {
    const metric: EvalMetric = {
      name: 'accuracy',
      value: 0.9,
      sparkline: [0.7, 0.8, 0.9],
    };
    const { container } = render(<MetricCard metric={metric} hideSparkline />);

    expect(container.querySelector('svg')).toBeFalsy();
  });

  it('applies compact spacing when compact=true', () => {
    const metric: EvalMetric = { name: 'latency', value: 120, unit: 'ms' };
    const { container } = render(<MetricCard metric={metric} compact />);

    // compact uses tighter padding p-2.5 instead of p-3
    expect(container.firstChild).toHaveClass('p-2.5');
  });
});

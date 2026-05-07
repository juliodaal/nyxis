import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { EvalRun } from '@nyxis/core';
import { EvalRunCard } from './eval-run-card.js';

const BASE: EvalRun = {
  id: 'run-1',
  name: 'Summariser v3 vs golden set',
  status: 'running',
  modelId: 'claude-3-7-sonnet',
  datasetName: 'golden-100',
  totalRows: 100,
  processedRows: 40,
  metrics: [
    { name: 'accuracy', value: 0.85 },
    { name: 'latency', value: 220, unit: 'ms' },
  ],
};

describe('EvalRunCard', () => {
  it('renders the name and a status pill matching the status', () => {
    render(<EvalRunCard run={BASE} />);

    expect(screen.getByText('Summariser v3 vs golden set')).toBeInTheDocument();
    expect(screen.getByText('running')).toBeInTheDocument();
  });

  it('renders a progress bar at the right percentage when running', () => {
    const { container } = render(<EvalRunCard run={BASE} />);

    // 40/100 → 40%
    const bar = container.querySelector('[style*="width: 40%"]');
    expect(bar).toBeTruthy();
  });

  it('renders the error banner when status is failed', () => {
    render(
      <EvalRunCard
        run={{
          ...BASE,
          status: 'failed',
          error: 'Rate limit exceeded',
        }}
      />,
    );

    expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument();
  });

  it('composes MetricCard rows for each metric', () => {
    render(<EvalRunCard run={{ ...BASE, status: 'completed' }} />);

    expect(screen.getByText('accuracy')).toBeInTheDocument();
    expect(screen.getByText('latency')).toBeInTheDocument();
  });

  it('fires onSelect when clicked and the card is interactive', () => {
    const onSelect = vi.fn();
    render(<EvalRunCard run={BASE} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /Summariser v3/i }));

    expect(onSelect).toHaveBeenCalledWith('run-1');
  });

  it('hides the metric strip when hideMetrics=true', () => {
    render(<EvalRunCard run={{ ...BASE, status: 'completed' }} hideMetrics />);

    expect(screen.queryByText('accuracy')).not.toBeInTheDocument();
  });
});

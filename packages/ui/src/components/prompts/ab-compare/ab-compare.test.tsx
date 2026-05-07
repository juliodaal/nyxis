import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ABCompare } from './ab-compare.js';

describe('ABCompare', () => {
  it('renders both side labels (A and B)', () => {
    render(
      <ABCompare
        a={{ label: 'Prompt v1', metrics: [{ name: 'accuracy', value: 0.8 }] }}
        b={{ label: 'Prompt v2', metrics: [{ name: 'accuracy', value: 0.9 }] }}
      />,
    );

    expect(screen.getByText('Prompt v1')).toBeInTheDocument();
    expect(screen.getByText('Prompt v2')).toBeInTheDocument();
  });

  it('renders the input section when input is provided', () => {
    render(
      <ABCompare a={{ label: 'A' }} b={{ label: 'B' }} input="What is the capital of France?" />,
    );

    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
  });

  it('renders metric rows showing the matched metric name', () => {
    render(
      <ABCompare
        a={{ label: 'A', metrics: [{ name: 'accuracy', value: 0.8 }] }}
        b={{ label: 'B', metrics: [{ name: 'accuracy', value: 0.9 }] }}
      />,
    );

    expect(screen.getByText('Metric comparison')).toBeInTheDocument();
    expect(screen.getByText('accuracy')).toBeInTheDocument();
  });

  it('renders sample outputs when provided', () => {
    render(
      <ABCompare
        a={{ label: 'A', sample: 'Output from A.' }}
        b={{ label: 'B', sample: 'Output from B.' }}
      />,
    );

    expect(screen.getByText('Sample output')).toBeInTheDocument();
    expect(screen.getByText('Output from A.')).toBeInTheDocument();
    expect(screen.getByText('Output from B.')).toBeInTheDocument();
  });

  it('hides samples when hideSamples=true', () => {
    render(
      <ABCompare
        a={{ label: 'A', sample: 'A out' }}
        b={{ label: 'B', sample: 'B out' }}
        hideSamples
      />,
    );

    expect(screen.queryByText('Sample output')).not.toBeInTheDocument();
  });

  it('renders a delta tone for the metric improvement', () => {
    const { container } = render(
      <ABCompare
        a={{ label: 'A', metrics: [{ name: 'accuracy', value: 0.7, goodDirection: 'up' }] }}
        b={{ label: 'B', metrics: [{ name: 'accuracy', value: 0.9, goodDirection: 'up' }] }}
      />,
    );

    // Baseline = A; B beats A on an "up" metric → "good" tone
    const good = container.querySelector('[data-tone="good"]');
    expect(good).toBeTruthy();
  });
});

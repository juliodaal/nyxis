import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ChainOfThought, type ChainStep } from './chain-of-thought.js';

const STEPS: readonly ChainStep[] = [
  { id: 'a', text: 'Plan the search', status: 'done' },
  { id: 'b', text: 'Searching documents', status: 'active', detail: '12 candidates' },
  { id: 'c', text: 'Synthesise the answer', status: 'pending' },
];

describe('ChainOfThought', () => {
  it('renders all step titles', () => {
    render(<ChainOfThought steps={STEPS} />);

    for (const step of STEPS) {
      expect(screen.getByText(step.text)).toBeInTheDocument();
    }
  });

  it('renders optional detail under a step', () => {
    render(<ChainOfThought steps={STEPS} />);

    expect(screen.getByText('12 candidates')).toBeInTheDocument();
  });

  it('shows a spinner for active steps and a check for done steps', () => {
    const { container } = render(<ChainOfThought steps={STEPS} />);

    // Active = animated loader; Done = check icon. Both are rendered as svgs.
    expect(container.querySelector('svg.animate-spin')).not.toBeNull();
    // The check icon for the "done" step should be present (lucide adds class names).
    expect(container.querySelector('.lucide-check')).not.toBeNull();
  });

  it('renders the step number for pending steps', () => {
    render(<ChainOfThought steps={STEPS} />);

    // Third step (index 2 -> "3") is pending.
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('removes the surrounding card when bare is true', () => {
    const { container, rerender } = render(<ChainOfThought steps={STEPS} />);
    const cardEl = container.firstElementChild;
    expect(cardEl?.className).toMatch(/border/);
    expect(cardEl?.className).toMatch(/rounded-lg/);

    rerender(<ChainOfThought steps={STEPS} bare />);
    const bareEl = container.firstElementChild;
    expect(bareEl?.className).not.toMatch(/rounded-lg/);
    expect(bareEl?.className).not.toMatch(/border-border/);
  });
});

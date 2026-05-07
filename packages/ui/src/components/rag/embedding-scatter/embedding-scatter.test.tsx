import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import type { EmbeddingPoint } from '@nyxis/core';
import { EmbeddingScatter } from './embedding-scatter.js';

const POINTS: EmbeddingPoint[] = [
  { id: 'p1', x: 0.1, y: 0.2, label: 'A1', group: 'alpha' },
  { id: 'p2', x: 0.4, y: 0.5, label: 'A2', group: 'alpha' },
  { id: 'p3', x: 0.7, y: 0.6, label: 'B1', group: 'beta' },
  { id: 'p4', x: 0.9, y: 0.3, label: 'B2', group: 'beta' },
];

describe('EmbeddingScatter', () => {
  it('renders an SVG element with role=img', () => {
    render(<EmbeddingScatter points={POINTS} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders one circle per point', () => {
    const { container } = render(<EmbeddingScatter points={POINTS} />);

    const circles = container.querySelectorAll('svg circle');
    expect(circles.length).toBe(POINTS.length);
  });

  it('renders the legend with each group label', () => {
    render(<EmbeddingScatter points={POINTS} />);

    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.getByText('beta')).toBeInTheDocument();
  });

  it('renders without crashing on an empty point set', () => {
    const { container } = render(<EmbeddingScatter points={[]} />);

    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelectorAll('svg circle').length).toBe(0);
  });
});

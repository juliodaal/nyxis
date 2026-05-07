import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { RetrievedChunk } from '../../../ai/types.js';
import { ChunkCard } from './chunk-card.js';

const BASE: RetrievedChunk = {
  id: 'c1',
  source: 'docs/intro.md',
  locator: 'p.4',
  text: 'Vector search returns the closest chunks to the query.',
  score: 0.7,
  rerankScore: 0.92,
  rank: 1,
  metadata: { collection: 'docs', author: 'ada' },
};

describe('ChunkCard', () => {
  it('renders rank, source, and the chunk text', () => {
    render(<ChunkCard chunk={BASE} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('docs/intro.md')).toBeInTheDocument();
    expect(screen.getByText(/Vector search returns/)).toBeInTheDocument();
  });

  it('renders the score badge', () => {
    render(<ChunkCard chunk={BASE} />);

    // Rerank score 0.92 → badge text "0.920"
    expect(screen.getByText('0.920')).toBeInTheDocument();
  });

  it('renders a reranker delta arrow when rerankScore differs from score', () => {
    const { container } = render(<ChunkCard chunk={BASE} />);

    // Delta = 0.92 - 0.7 = 0.22 → positive arrow with "0.22"
    expect(container.textContent).toMatch(/0[.,]22/);
  });

  it('expands to reveal metadata on click', () => {
    render(<ChunkCard chunk={BASE} />);

    fireEvent.click(screen.getByRole('button', { expanded: false }));

    expect(screen.getByText('Metadata')).toBeInTheDocument();
    expect(screen.getByText(/collection:/)).toBeInTheDocument();
  });

  it('fires onSelect when the card body button is clicked', () => {
    const onSelect = vi.fn();
    render(<ChunkCard chunk={BASE} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledWith('c1');
  });
});

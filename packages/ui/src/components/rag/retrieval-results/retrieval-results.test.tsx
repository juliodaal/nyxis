import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { RetrievedChunk } from '../../../ai/types.js';
import { RetrievalResults } from './retrieval-results.js';

const CHUNKS: RetrievedChunk[] = [
  {
    id: 'c1',
    source: 'docs/intro.md',
    text: 'Introduction to retrieval-augmented generation.',
    score: 0.92,
    rank: 1,
  },
  {
    id: 'c2',
    source: 'docs/embeddings.md',
    text: 'Embeddings encode text as vectors.',
    score: 0.65,
    rank: 2,
  },
  {
    id: 'c3',
    source: 'docs/index.md',
    text: 'Index keeps the embeddings.',
    score: 0.3,
    rank: 3,
  },
];

describe('RetrievalResults', () => {
  it('renders all chunks', () => {
    render(<RetrievalResults chunks={CHUNKS} />);

    expect(screen.getByText('docs/intro.md')).toBeInTheDocument();
    expect(screen.getByText('docs/embeddings.md')).toBeInTheDocument();
    expect(screen.getByText('docs/index.md')).toBeInTheDocument();
  });

  it('renders the query in the header', () => {
    render(<RetrievalResults chunks={CHUNKS} query="how does RAG work?" />);

    expect(screen.getByText(/how does RAG work\?/)).toBeInTheDocument();
  });

  it('filters chunks by the threshold slider', () => {
    render(<RetrievalResults chunks={CHUNKS} />);

    const slider = screen.getByRole('slider', { name: /Score threshold/i });
    fireEvent.change(slider, { target: { value: '0.7' } });

    expect(screen.getByText('docs/intro.md')).toBeInTheDocument();
    expect(screen.queryByText('docs/embeddings.md')).not.toBeInTheDocument();
    expect(screen.queryByText('docs/index.md')).not.toBeInTheDocument();
  });

  it('filters chunks by the search input', () => {
    render(<RetrievalResults chunks={CHUNKS} />);

    fireEvent.change(screen.getByPlaceholderText(/Filter chunks/i), {
      target: { value: 'embeddings' },
    });

    expect(screen.getByText('docs/embeddings.md')).toBeInTheDocument();
    expect(screen.queryByText('docs/intro.md')).not.toBeInTheDocument();
  });

  it('shows an empty state when no chunks match', () => {
    render(<RetrievalResults chunks={CHUNKS} />);

    fireEvent.change(screen.getByPlaceholderText(/Filter chunks/i), {
      target: { value: 'definitely-not-here' },
    });

    expect(screen.getByText(/No chunks match/i)).toBeInTheDocument();
  });
});

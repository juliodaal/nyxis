import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { DocumentChunker } from './document-chunker.js';

const TEXT = 'The quick brown fox jumps over the lazy dog and runs away quickly.';

const CHUNKS = [
  { id: 'k1', start: 0, end: 19 }, // "The quick brown fox"
  { id: 'k2', start: 20, end: 40 }, // " jumps over the lazy"
  { id: 'k3', start: 41, end: TEXT.length }, // " dog and runs away quickly."
];

describe('DocumentChunker', () => {
  it('renders one button per chunk', () => {
    render(<DocumentChunker text={TEXT} chunks={CHUNKS} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  it('shows the chunk-count stats in the header', () => {
    render(<DocumentChunker text={TEXT} chunks={CHUNKS} />);

    expect(screen.getByText('Document chunks')).toBeInTheDocument();
    expect(screen.getByText(/chunks: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/avg:/i)).toBeInTheDocument();
  });

  it('hides the header when hideHeader=true', () => {
    render(<DocumentChunker text={TEXT} chunks={CHUNKS} hideHeader />);

    expect(screen.queryByText('Document chunks')).not.toBeInTheDocument();
  });

  it('fires onSelect when a chunk is clicked', () => {
    const onSelect = vi.fn();
    render(<DocumentChunker text={TEXT} chunks={CHUNKS} onSelect={onSelect} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]!);

    expect(onSelect).toHaveBeenCalledWith(CHUNKS[0]);
  });

  it('marks the active chunk with aria-current', () => {
    render(<DocumentChunker text={TEXT} chunks={CHUNKS} activeId="k2" />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveAttribute('aria-current', 'true');
  });
});

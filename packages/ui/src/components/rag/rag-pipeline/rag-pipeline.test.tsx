import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { RAGStage } from '@nyxis/core';
import { RAGPipeline } from './rag-pipeline.js';

const STAGES: RAGStage[] = [
  { id: 's1', name: 'Embed', status: 'done', durationMs: 120, count: 1 },
  { id: 's2', name: 'Retrieve', status: 'running', count: 12 },
  { id: 's3', name: 'Rerank', status: 'pending' },
  { id: 's4', name: 'Generate', status: 'errored' },
];

describe('RAGPipeline', () => {
  it('renders one entry per stage with its name', () => {
    render(<RAGPipeline stages={STAGES} />);

    expect(screen.getByText('Embed')).toBeInTheDocument();
    expect(screen.getByText('Retrieve')).toBeInTheDocument();
    expect(screen.getByText('Rerank')).toBeInTheDocument();
    expect(screen.getByText('Generate')).toBeInTheDocument();
  });

  it('exposes the stage status via data-status', () => {
    const { container } = render(<RAGPipeline stages={STAGES} />);

    expect(container.querySelector('[data-status="done"]')).toBeTruthy();
    expect(container.querySelector('[data-status="running"]')).toBeTruthy();
    expect(container.querySelector('[data-status="pending"]')).toBeTruthy();
    expect(container.querySelector('[data-status="errored"]')).toBeTruthy();
  });

  it('uses the horizontal layout by default and switches to vertical', () => {
    const { container, rerender } = render(<RAGPipeline stages={STAGES} />);

    expect(container.firstChild).toHaveClass('flex-row');

    rerender(<RAGPipeline stages={STAGES} orientation="vertical" />);
    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('fires onSelect with the clicked stage', () => {
    const onSelect = vi.fn();
    render(<RAGPipeline stages={STAGES} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /Embed/i }));

    expect(onSelect).toHaveBeenCalledWith(STAGES[0]);
  });
});

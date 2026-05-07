import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { VectorSearchInput } from './vector-search-input.js';

describe('VectorSearchInput', () => {
  it('submits the query and current options on Search click', () => {
    const onSubmit = vi.fn();
    render(<VectorSearchInput defaultValue="hello" onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      'hello',
      expect.objectContaining({ topK: 5, threshold: 0, reranker: false }),
    );
  });

  it('updates the topK display when the slider moves', () => {
    const onTopKChange = vi.fn();
    render(<VectorSearchInput onTopKChange={onTopKChange} />);

    const slider = screen.getByRole('slider', { name: /Top K/i });
    fireEvent.change(slider, { target: { value: '12' } });

    expect(onTopKChange).toHaveBeenCalledWith(12);
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('updates the threshold display when the slider moves', () => {
    const onThresholdChange = vi.fn();
    render(<VectorSearchInput onThresholdChange={onThresholdChange} />);

    const sliders = screen.getAllByRole('slider');
    // Second slider is threshold
    fireEvent.change(sliders[1]!, { target: { value: '0.42' } });

    expect(onThresholdChange).toHaveBeenCalledWith(0.42);
  });

  it('toggles the reranker switch', () => {
    const onRerankerChange = vi.fn();
    render(<VectorSearchInput onRerankerChange={onRerankerChange} />);

    const sw = screen.getByRole('switch');
    fireEvent.click(sw);

    expect(onRerankerChange).toHaveBeenCalledWith(true);
  });

  it('disables submit when loading=true', () => {
    render(<VectorSearchInput defaultValue="hello" loading />);

    const submit = screen.getByRole('button', { name: /Searching/i });
    expect(submit).toBeDisabled();
  });
});

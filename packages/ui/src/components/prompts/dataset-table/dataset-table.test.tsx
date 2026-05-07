import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { EvalRow } from '@nyxis/core';
import { DatasetTable } from './dataset-table.js';

const ROWS: EvalRow[] = [
  {
    id: 'r1',
    input: 'Capital of France?',
    expected: 'Paris',
    actual: 'Paris',
    score: 0.95,
    status: 'pass',
    latencyMs: 120,
  },
  {
    id: 'r2',
    input: 'Translate hello to Spanish.',
    expected: 'hola',
    actual: 'salut',
    score: 0.3,
    status: 'fail',
  },
  {
    id: 'r3',
    input: 'Summarise quantum computing.',
    expected: 'short summary',
    actual: 'partial summary',
    score: 0.65,
  },
];

describe('DatasetTable', () => {
  it('renders all rows with their input text', () => {
    render(<DatasetTable rows={ROWS} />);

    expect(screen.getAllByText('Capital of France?').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Translate hello/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Summarise quantum/).length).toBeGreaterThan(0);
  });

  it('filters rows by the search query', () => {
    render(<DatasetTable rows={ROWS} />);

    fireEvent.change(screen.getByPlaceholderText(/Search rows/i), {
      target: { value: 'France' },
    });

    expect(screen.getAllByText('Capital of France?').length).toBeGreaterThan(0);
    expect(screen.queryByText(/Translate hello/)).not.toBeInTheDocument();
  });

  it('filters rows by the score bucket pill', () => {
    render(<DatasetTable rows={ROWS} />);

    // Click "low" bucket → should keep only score < 0.5 (the r2 row)
    fireEvent.click(screen.getByRole('button', { name: /low/i }));

    expect(screen.getAllByText(/Translate hello/).length).toBeGreaterThan(0);
    expect(screen.queryByText('Capital of France?')).not.toBeInTheDocument();
  });

  it('expands a row to reveal latency details on click', () => {
    render(<DatasetTable rows={ROWS} />);

    // Click on the row's button (the row's own toggle button)
    const buttons = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(buttons[0]!);

    expect(screen.getByText(/latency: 120ms/)).toBeInTheDocument();
  });

  it('shows 0 / total when nothing matches the filters', () => {
    render(<DatasetTable rows={ROWS} />);

    fireEvent.change(screen.getByPlaceholderText(/Search rows/i), {
      target: { value: 'definitely-not-found-xyz' },
    });

    expect(screen.getByText(/No rows match/i)).toBeInTheDocument();
  });
});

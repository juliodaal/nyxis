import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { ToolRegistry, type RegisteredTool } from './tool-registry.js';

const TOOLS: readonly RegisteredTool[] = [
  { id: 'search', name: 'search_documents', description: 'Find docs by query' },
  { id: 'fetch', name: 'fetch_url', description: 'Download a remote URL' },
  { id: 'math', name: 'calculator', description: 'Run arithmetic expressions' },
];

describe('ToolRegistry', () => {
  it('renders every tool name and description', () => {
    render(<ToolRegistry tools={TOOLS} />);

    for (const tool of TOOLS) {
      expect(screen.getByText(tool.name)).toBeInTheDocument();
      expect(screen.getByText(tool.description)).toBeInTheDocument();
    }
  });

  it('shows the active count in the header', () => {
    render(<ToolRegistry tools={TOOLS} />);

    expect(screen.getByText('3/3 active')).toBeInTheDocument();
  });

  it('filters by name OR description via the search input', () => {
    render(<ToolRegistry tools={TOOLS} />);

    fireEvent.change(screen.getByPlaceholderText(/search tools/i), {
      target: { value: 'arithmetic' },
    });

    expect(screen.getByText('calculator')).toBeInTheDocument();
    expect(screen.queryByText('search_documents')).not.toBeInTheDocument();
    expect(screen.queryByText('fetch_url')).not.toBeInTheDocument();
  });

  it('renders an empty state when nothing matches the query', () => {
    render(<ToolRegistry tools={TOOLS} />);

    fireEvent.change(screen.getByPlaceholderText(/search tools/i), {
      target: { value: 'zzz-nope' },
    });

    expect(screen.getByText(/no tools match/i)).toBeInTheDocument();
  });

  it('calls onChange with the new enabled set when a tool is toggled off', () => {
    const onChange = vi.fn();
    render(<ToolRegistry tools={TOOLS} onChange={onChange} />);

    // Click the row for "search_documents" — the tool button wraps the entire row.
    fireEvent.click(screen.getByRole('button', { name: /search_documents/i }));

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0]![0]).toEqual(['fetch', 'math']);
  });
});

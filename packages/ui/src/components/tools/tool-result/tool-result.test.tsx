import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ToolResult } from './tool-result.js';

describe('ToolResult', () => {
  it('detects an object result and renders pretty-printed JSON', () => {
    render(<ToolResult result={{ count: 3, name: 'cats' }} />);

    // Header lists the detected format.
    expect(screen.getByText('json')).toBeInTheDocument();
    // Pretty JSON contains the keys/values we passed.
    expect(screen.getByText(/"count": 3/)).toBeInTheDocument();
    expect(screen.getByText(/"name": "cats"/)).toBeInTheDocument();
  });

  it('renders plain string results as text', () => {
    render(<ToolResult result="hello world" />);

    expect(screen.getByText('text')).toBeInTheDocument();
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('renders an <img> when the result is an image URL', () => {
    render(<ToolResult result="https://example.com/cat.png" label="cat" />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/cat.png');
    expect(img).toHaveAttribute('alt', 'cat');
  });

  it('shows a copy button by default and hides it when hideCopy is true', () => {
    const { rerender } = render(<ToolResult result="text-result" />);
    expect(screen.getByRole('button', { name: /copy result/i })).toBeInTheDocument();

    rerender(<ToolResult result="text-result" hideCopy />);
    expect(screen.queryByRole('button', { name: /copy result/i })).not.toBeInTheDocument();
  });

  it('renders the destructive error variant when error is set', () => {
    render(<ToolResult error="boom: bad request" label="search" />);

    expect(screen.getByText('boom: bad request')).toBeInTheDocument();
    expect(screen.getByText(/search · error/i)).toBeInTheDocument();
    // Copy button should NOT show in error variant.
    expect(screen.queryByRole('button', { name: /copy result/i })).not.toBeInTheDocument();
  });
});

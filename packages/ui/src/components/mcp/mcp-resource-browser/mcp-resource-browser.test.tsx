import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { MCPResource } from '@nyxis/core';
import { MCPResourceBrowser } from './mcp-resource-browser.js';

const RESOURCES: readonly MCPResource[] = [
  {
    uri: 'file:///docs/intro.md',
    name: 'Introduction',
    mimeType: 'text/markdown',
    description: 'Project overview',
  },
  {
    uri: 'file:///docs/api.md',
    name: 'API reference',
    mimeType: 'text/markdown',
  },
  {
    uri: 'db://users/42',
    name: 'User #42',
    mimeType: 'application/json',
  },
];

describe('MCPResourceBrowser', () => {
  it('renders all resource names and URIs', () => {
    render(<MCPResourceBrowser resources={RESOURCES} />);

    for (const r of RESOURCES) {
      expect(screen.getByText(r.name)).toBeInTheDocument();
      expect(screen.getByText(r.uri)).toBeInTheDocument();
    }
  });

  it('groups resources under their URI scheme by default', () => {
    render(<MCPResourceBrowser resources={RESOURCES} />);

    // Scheme headers are buttons whose accessible name is `<scheme>:// <count>`.
    const buttons = screen.getAllByRole('button');
    const labels = buttons.map((b) => (b.textContent ?? '').replace(/\s+/g, ' ').trim());
    expect(labels.some((l) => /^file:\/\/\s*\d+$/.test(l))).toBe(true);
    expect(labels.some((l) => /^db:\/\/\s*\d+$/.test(l))).toBe(true);
  });

  it('fires onSelect with the resource when a row is clicked', () => {
    const onSelect = vi.fn();
    render(<MCPResourceBrowser resources={RESOURCES} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /API reference/ }));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(RESOURCES[1]);
  });

  it('filters resources by name, uri or description', () => {
    render(<MCPResourceBrowser resources={RESOURCES} />);

    fireEvent.change(screen.getByPlaceholderText(/search resources/i), {
      target: { value: 'overview' },
    });

    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.queryByText('API reference')).not.toBeInTheDocument();
    expect(screen.queryByText('User #42')).not.toBeInTheDocument();
  });

  it('disables grouping when groupByScheme is false', () => {
    render(<MCPResourceBrowser resources={RESOURCES} groupByScheme={false} />);

    // No `<scheme>:// N` collapsible header buttons should remain.
    const buttons = screen.getAllByRole('button');
    const labels = buttons.map((b) => (b.textContent ?? '').replace(/\s+/g, ' ').trim());
    expect(labels.some((l) => /^[a-z]+:\/\/\s*\d+$/i.test(l))).toBe(false);
    expect(screen.getByText('Introduction')).toBeInTheDocument();
  });
});

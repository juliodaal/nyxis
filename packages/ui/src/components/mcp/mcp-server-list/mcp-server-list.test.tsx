import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { MCPServer } from '@nyxis/core';
import { MCPServerList } from './mcp-server-list.js';

const SERVERS: readonly MCPServer[] = [
  {
    id: 'a',
    name: 'GitHub MCP',
    description: 'Search and read repos.',
    transport: 'stdio',
    endpoint: 'npx server-github',
    state: 'connected',
  },
  {
    id: 'b',
    name: 'Postgres MCP',
    description: 'Query a Postgres database.',
    transport: 'sse',
    endpoint: 'http://localhost:7000',
    state: 'disconnected',
  },
];

describe('MCPServerList', () => {
  it('renders all servers and the connected count', () => {
    render(<MCPServerList servers={SERVERS} />);

    expect(screen.getByText('GitHub MCP')).toBeInTheDocument();
    expect(screen.getByText('Postgres MCP')).toBeInTheDocument();
    expect(screen.getByText('1/2 connected')).toBeInTheDocument();
  });

  it('filters servers by query', () => {
    render(<MCPServerList servers={SERVERS} />);

    fireEvent.change(screen.getByPlaceholderText(/search servers/i), {
      target: { value: 'postgres' },
    });

    expect(screen.queryByText('GitHub MCP')).not.toBeInTheDocument();
    expect(screen.getByText('Postgres MCP')).toBeInTheDocument();
  });

  it('shows an empty-search message when nothing matches the query', () => {
    render(<MCPServerList servers={SERVERS} />);

    fireEvent.change(screen.getByPlaceholderText(/search servers/i), {
      target: { value: 'zzz-nope' },
    });

    expect(screen.getByText(/no servers match/i)).toBeInTheDocument();
  });

  it('renders the empty state when no servers are configured', () => {
    render(<MCPServerList servers={[]} />);

    expect(screen.getByText('No MCP servers configured yet.')).toBeInTheDocument();
  });

  it('calls onAdd when the "Add server" button is clicked', () => {
    const onAdd = vi.fn();
    render(<MCPServerList servers={SERVERS} onAdd={onAdd} />);

    fireEvent.click(screen.getByRole('button', { name: /add server/i }));

    expect(onAdd).toHaveBeenCalledOnce();
  });
});

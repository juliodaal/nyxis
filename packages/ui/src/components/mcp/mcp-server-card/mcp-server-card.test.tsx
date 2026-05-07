import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { MCPServer } from '@nyxis/core';
import { MCPServerCard } from './mcp-server-card.js';

const BASE: MCPServer = {
  id: 'srv-1',
  name: 'GitHub MCP',
  description: 'Search and read repositories.',
  transport: 'stdio',
  endpoint: 'npx -y @modelcontextprotocol/server-github',
  state: 'disconnected',
  capabilities: ['tools', 'resources'],
  version: '1.4.0',
};

describe('MCPServerCard', () => {
  it('shows the server name, transport pill, and version', () => {
    render(<MCPServerCard server={BASE} />);

    expect(screen.getByText('GitHub MCP')).toBeInTheDocument();
    expect(screen.getByText('stdio')).toBeInTheDocument();
    expect(screen.getByText('v1.4.0')).toBeInTheDocument();
  });

  it('fires onConnect when disconnected and Connect is clicked', () => {
    const onConnect = vi.fn();
    render(<MCPServerCard server={BASE} onConnect={onConnect} />);

    fireEvent.click(screen.getByRole('button', { name: /connect/i }));

    expect(onConnect).toHaveBeenCalledWith('srv-1');
  });

  it('fires onDisconnect when the server is connected', () => {
    const onDisconnect = vi.fn();
    render(
      <MCPServerCard
        server={{ ...BASE, state: 'connected', latencyMs: 32 }}
        onDisconnect={onDisconnect}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /disconnect/i }));

    expect(onDisconnect).toHaveBeenCalledWith('srv-1');
  });

  it('renders the error message in the error state', () => {
    render(<MCPServerCard server={{ ...BASE, state: 'error', error: 'spawn ENOENT: npx' }} />);

    expect(screen.getByText('spawn ENOENT: npx')).toBeInTheDocument();
  });

  it('reveals the endpoint when defaultOpen is true', () => {
    render(<MCPServerCard server={BASE} defaultOpen />);

    expect(screen.getByText(/Endpoint/i)).toBeInTheDocument();
    expect(screen.getByText('npx -y @modelcontextprotocol/server-github')).toBeInTheDocument();
  });

  it('toggles the endpoint disclosure on click', () => {
    render(<MCPServerCard server={BASE} />);

    expect(screen.queryByText(/Endpoint/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /expand server details/i }));

    expect(screen.getByText(/Endpoint/i)).toBeInTheDocument();
  });
});

import type { Meta, StoryObj } from '@storybook/react';
import { MCPServerCard } from './mcp-server-card.js';
import type { MCPServer } from '@nyxis/core';

const meta = {
  title: 'AI · MCP/MCPServerCard',
  component: MCPServerCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MCPServerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const BASE: MCPServer = {
  id: 'github',
  name: 'GitHub',
  description: 'Read/write repositories, issues, pull requests, and CI checks.',
  transport: 'stdio',
  endpoint: 'npx -y @modelcontextprotocol/server-github',
  state: 'connected',
  capabilities: ['tools', 'resources'],
  version: '0.4.1',
  latencyMs: 38,
};

export const Connected: Story = {
  render: () => (
    <div className="w-[560px]">
      <MCPServerCard
        server={BASE}
        defaultOpen
        onConnect={(id) => alert(`connect ${id}`)}
        onDisconnect={(id) => alert(`disconnect ${id}`)}
      />
    </div>
  ),
};

export const Connecting: Story = {
  render: () => (
    <div className="w-[560px]">
      <MCPServerCard
        server={{
          ...BASE,
          id: 'fs',
          name: 'Filesystem',
          transport: 'stdio',
          endpoint: 'npx -y @modelcontextprotocol/server-filesystem /home/me/notes',
          state: 'connecting',
          latencyMs: undefined as unknown as number,
          capabilities: ['resources', 'tools'],
          version: '0.6.2',
        }}
      />
    </div>
  ),
};

export const Errored: Story = {
  render: () => (
    <div className="w-[560px]">
      <MCPServerCard
        server={{
          ...BASE,
          id: 'remote',
          name: 'Remote API',
          transport: 'sse',
          endpoint: 'https://mcp.example.com/sse',
          state: 'error',
          error: 'connect ECONNREFUSED 203.0.113.5:443',
          capabilities: ['tools', 'prompts', 'sampling'],
          latencyMs: undefined as unknown as number,
        }}
      />
    </div>
  ),
};

export const Disconnected: Story = {
  render: () => (
    <div className="w-[560px]">
      <MCPServerCard
        server={{
          id: 'pg',
          name: 'Postgres',
          description: 'Read-only access to the analytics replica.',
          transport: 'websocket',
          endpoint: 'wss://mcp.internal/postgres',
          state: 'disconnected',
          capabilities: ['resources'],
        }}
        onConnect={(id) => alert(`connect ${id}`)}
      />
    </div>
  ),
};

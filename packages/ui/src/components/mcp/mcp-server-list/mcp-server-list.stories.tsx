import type { Meta, StoryObj } from '@storybook/react';
import { MCPServerList } from './mcp-server-list.js';
import type { MCPServer } from '../../../ai/types.js';

const meta = {
  title: 'AI · MCP/MCPServerList',
  component: MCPServerList,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MCPServerList>;

export default meta;
type Story = StoryObj<typeof meta>;

const SERVERS: MCPServer[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Read/write repositories, issues, pull requests, and CI checks.',
    transport: 'stdio',
    endpoint: 'npx -y @modelcontextprotocol/server-github',
    state: 'connected',
    capabilities: ['tools', 'resources'],
    version: '0.4.1',
    latencyMs: 38,
  },
  {
    id: 'fs',
    name: 'Filesystem',
    description: 'Read-only access to the project workspace.',
    transport: 'stdio',
    endpoint: 'npx -y @modelcontextprotocol/server-filesystem /home/me/notes',
    state: 'connected',
    capabilities: ['resources', 'tools'],
    version: '0.6.2',
    latencyMs: 12,
  },
  {
    id: 'pg',
    name: 'Postgres',
    description: 'Read-only access to the analytics replica.',
    transport: 'websocket',
    endpoint: 'wss://mcp.internal/postgres',
    state: 'disconnected',
    capabilities: ['resources'],
  },
  {
    id: 'remote',
    name: 'Remote API',
    transport: 'sse',
    endpoint: 'https://mcp.example.com/sse',
    state: 'error',
    error: 'connect ECONNREFUSED 203.0.113.5:443',
    capabilities: ['tools', 'prompts', 'sampling'],
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-[600px]">
      <MCPServerList
        servers={SERVERS}
        onAdd={() => alert('add')}
        onConnect={(id) => alert(`connect ${id}`)}
        onDisconnect={(id) => alert(`disconnect ${id}`)}
        onRemove={(id) => alert(`remove ${id}`)}
      />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="w-[600px]">
      <MCPServerList servers={[]} onAdd={() => alert('add')} />
    </div>
  ),
};

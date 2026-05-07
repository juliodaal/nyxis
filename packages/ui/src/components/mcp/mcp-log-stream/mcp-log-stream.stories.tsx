import type { Meta, StoryObj } from '@storybook/react';
import { MCPLogStream } from './mcp-log-stream.js';
import type { MCPLogEntry } from '@nyxis/core';

const meta = {
  title: 'AI · MCP/MCPLogStream',
  component: MCPLogStream,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MCPLogStream>;

export default meta;
type Story = StoryObj<typeof meta>;

const NOW = new Date();
const ago = (ms: number) => new Date(NOW.getTime() - ms);

const ENTRIES: MCPLogEntry[] = [
  {
    id: '8',
    timestamp: ago(120),
    direction: 'out',
    method: 'tools/call',
    payload: { name: 'list_repos', arguments: { owner: 'juliodaal' } },
  },
  {
    id: '7',
    timestamp: ago(180),
    direction: 'in',
    method: 'tools/call (response)',
    payload: { content: [{ type: 'json', json: { repos: ['nyxis', 'taller'] } }] },
  },
  {
    id: '6',
    timestamp: ago(420),
    direction: 'event',
    method: 'notifications/message',
    level: 'info',
    payload: { logger: 'mcp-server-github', message: 'Authenticated as juliodaal' },
  },
  {
    id: '5',
    timestamp: ago(640),
    direction: 'out',
    method: 'resources/list',
  },
  {
    id: '4',
    timestamp: ago(720),
    direction: 'in',
    method: 'resources/list (response)',
    payload: { resources: [{ uri: 'file:///workspace/README.md', name: 'README.md' }] },
  },
  {
    id: '3',
    timestamp: ago(1240),
    direction: 'event',
    method: 'notifications/message',
    level: 'warn',
    payload: { logger: 'mcp-server-github', message: 'Rate limit at 80%' },
  },
  {
    id: '2',
    timestamp: ago(1820),
    direction: 'in',
    method: 'initialize (response)',
    payload: {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {}, resources: {} },
      serverInfo: { name: 'github', version: '0.4.1' },
    },
  },
  {
    id: '1',
    timestamp: ago(2120),
    direction: 'out',
    method: 'initialize',
    payload: { protocolVersion: '2024-11-05', clientInfo: { name: 'nyxis', version: '0.8.0' } },
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-[640px]">
      <MCPLogStream entries={ENTRIES} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="w-[640px]">
      <MCPLogStream entries={[]} />
    </div>
  ),
};

export const Limited: Story = {
  render: () => (
    <div className="w-[640px]">
      <MCPLogStream entries={ENTRIES} limit={4} />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MCPResourceBrowser } from './mcp-resource-browser.js';
import type { MCPResource } from '../../../ai/types.js';

const meta = {
  title: 'AI · MCP/MCPResourceBrowser',
  component: MCPResourceBrowser,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MCPResourceBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;

const RESOURCES: MCPResource[] = [
  {
    uri: 'file:///workspace/README.md',
    name: 'README.md',
    description: 'Project overview, install steps, link to the docs.',
    mimeType: 'text/markdown',
  },
  {
    uri: 'file:///workspace/src/index.ts',
    name: 'src/index.ts',
    description: 'Public surface of nyxis-ui.',
    mimeType: 'text/typescript',
  },
  {
    uri: 'file:///workspace/package.json',
    name: 'package.json',
    description: 'Manifest with peer deps and exports map.',
    mimeType: 'application/json',
  },
  {
    uri: 'db://analytics/users/42',
    name: 'users/42',
    description: 'Single row from the analytics replica.',
    mimeType: 'application/json',
  },
  {
    uri: 'db://analytics/sessions',
    name: 'sessions table',
    mimeType: 'application/json',
  },
  {
    uri: 'https://docs.nyxis.dev/api/index.html',
    name: 'API docs',
    description: 'Hosted API reference.',
    mimeType: 'text/html',
  },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('file:///workspace/README.md');
    return (
      <div className="w-[480px]">
        <MCPResourceBrowser
          resources={RESOURCES}
          activeUri={active}
          onSelect={(r) => setActive(r.uri)}
        />
      </div>
    );
  },
};

export const Flat: Story = {
  render: () => (
    <div className="w-[480px]">
      <MCPResourceBrowser resources={RESOURCES} groupByScheme={false} />
    </div>
  ),
};

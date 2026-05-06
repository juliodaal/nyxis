import type { Meta, StoryObj } from '@storybook/react';
import { MCPConnectionStatus } from './mcp-connection-status.js';

const meta = {
  title: 'AI · MCP/MCPConnectionStatus',
  component: MCPConnectionStatus,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MCPConnectionStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <MCPConnectionStatus state="connected" latencyMs={42} />
      <MCPConnectionStatus state="connecting" />
      <MCPConnectionStatus state="disconnected" />
      <MCPConnectionStatus state="error" />
    </div>
  ),
};

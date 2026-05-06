import type { Meta, StoryObj } from '@storybook/react';
import { MCPCapabilityBadge } from './mcp-capability-badge.js';

const meta = {
  title: 'AI · MCP/MCPCapabilityBadge',
  component: MCPCapabilityBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MCPCapabilityBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <MCPCapabilityBadge capability="tools" />
      <MCPCapabilityBadge capability="prompts" />
      <MCPCapabilityBadge capability="resources" />
      <MCPCapabilityBadge capability="sampling" />
      <MCPCapabilityBadge capability="roots" />
      <MCPCapabilityBadge capability="logging" />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-1.5">
      <MCPCapabilityBadge capability="tools" compact />
      <MCPCapabilityBadge capability="prompts" compact />
      <MCPCapabilityBadge capability="resources" compact />
      <MCPCapabilityBadge capability="sampling" compact />
      <MCPCapabilityBadge capability="roots" compact />
      <MCPCapabilityBadge capability="logging" compact />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <MCPCapabilityBadge capability="tools" enabled={false} />
      <MCPCapabilityBadge capability="prompts" enabled={false} />
    </div>
  ),
};

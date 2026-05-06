import type { Meta, StoryObj } from '@storybook/react';
import { AgentStatusBadge } from './agent-status-badge.js';

const meta = {
  title: 'AI · Agents/AgentStatusBadge',
  component: AgentStatusBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AgentStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <AgentStatusBadge status="idle" />
      <AgentStatusBadge status="thinking" />
      <AgentStatusBadge status="working" />
      <AgentStatusBadge status="blocked" />
      <AgentStatusBadge status="done" />
      <AgentStatusBadge status="errored" />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="flex items-center gap-1.5">
      <AgentStatusBadge status="thinking" compact />
      <AgentStatusBadge status="working" compact />
      <AgentStatusBadge status="blocked" compact />
      <AgentStatusBadge status="done" compact />
    </div>
  ),
};

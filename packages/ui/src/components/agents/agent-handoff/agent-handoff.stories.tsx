import type { Meta, StoryObj } from '@storybook/react';
import { AgentHandoff } from './agent-handoff.js';

const meta = {
  title: 'AI · Agents/AgentHandoff',
  component: AgentHandoff,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AgentHandoff>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="flex w-[440px] flex-col gap-3">
      <AgentHandoff
        handoff={{
          fromAgentId: 'planner',
          toAgentId: 'researcher',
          fromAgentName: 'Planner',
          toAgentName: 'Researcher',
          reason: 'Needs to gather facts about peer-dep architecture.',
          state: 'pending',
          timestamp: new Date(),
        }}
      />
      <AgentHandoff
        handoff={{
          fromAgentId: 'researcher',
          toAgentId: 'writer',
          fromAgentName: 'Researcher',
          toAgentName: 'Writer',
          reason: 'Found 6 sources, ready to synthesise.',
          state: 'accepted',
          timestamp: new Date(Date.now() - 90_000),
        }}
      />
      <AgentHandoff
        handoff={{
          fromAgentId: 'writer',
          toAgentId: 'critic',
          fromAgentName: 'Writer',
          toAgentName: 'Critic',
          reason: 'Draft ready for review.',
          state: 'rejected',
          timestamp: new Date(Date.now() - 240_000),
        }}
      />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="flex w-[440px] flex-col gap-1">
      <AgentHandoff
        handoff={{
          fromAgentId: 'a',
          toAgentId: 'b',
          fromAgentName: 'Planner',
          toAgentName: 'Researcher',
          state: 'accepted',
        }}
        compact
      />
      <AgentHandoff
        handoff={{
          fromAgentId: 'b',
          toAgentId: 'c',
          fromAgentName: 'Researcher',
          toAgentName: 'Writer',
          state: 'pending',
        }}
        compact
      />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { AgentActivityFeed } from './agent-activity-feed.js';
import type { AgentActivity } from '@nyxis/core';

const meta = {
  title: 'AI · Agents/AgentActivityFeed',
  component: AgentActivityFeed,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AgentActivityFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

const NOW = new Date();
const ago = (s: number) => new Date(NOW.getTime() - s * 1000);

const ACTIVITIES: AgentActivity[] = [
  {
    id: '8',
    agentId: 'writer',
    agentName: 'Writer',
    kind: 'message',
    summary: 'Drafted opening paragraph (124 words).',
    detail:
      'Nyxis ships adapters as peer dependencies for three reasons:\n1. Bundle size — apps targeting only one provider...',
    timestamp: ago(2),
  },
  {
    id: '7',
    agentId: 'researcher',
    agentName: 'Researcher',
    kind: 'handoff',
    summary: 'Handed off to Writer with 6 sources.',
    timestamp: ago(15),
  },
  {
    id: '6',
    agentId: 'researcher',
    agentName: 'Researcher',
    kind: 'tool-call',
    summary: 'search_documents("streaming protocol", limit=5)',
    detail: '{ "hits": [ ... 5 results ... ] }',
    timestamp: ago(45),
  },
  {
    id: '5',
    agentId: 'researcher',
    agentName: 'Researcher',
    kind: 'thought',
    summary: 'Cross-referencing peer-deps explanation against source code.',
    timestamp: ago(80),
  },
  {
    id: '4',
    agentId: 'researcher',
    agentName: 'Researcher',
    kind: 'tool-call',
    summary: 'fetch_url("https://nyxis.dev/docs/installation")',
    timestamp: ago(120),
  },
  {
    id: '3',
    agentId: 'planner',
    agentName: 'Planner',
    kind: 'handoff',
    summary: 'Handed off to Researcher with 3 sub-tasks.',
    timestamp: ago(180),
  },
  {
    id: '2',
    agentId: 'planner',
    agentName: 'Planner',
    kind: 'action',
    summary: 'Decomposed task into research → write → review.',
    timestamp: ago(220),
  },
  {
    id: '1',
    agentId: 'planner',
    agentName: 'Planner',
    kind: 'thought',
    summary: 'User asked about peer-dep architecture — needs research + synthesis.',
    timestamp: ago(240),
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-[560px]">
      <AgentActivityFeed activities={ACTIVITIES} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="w-[560px]">
      <AgentActivityFeed activities={[]} />
    </div>
  ),
};

export const Limited: Story = {
  render: () => (
    <div className="w-[560px]">
      <AgentActivityFeed activities={ACTIVITIES} limit={4} />
    </div>
  ),
};

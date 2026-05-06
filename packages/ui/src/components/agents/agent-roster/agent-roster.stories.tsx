import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AgentRoster } from './agent-roster.js';
import type { Agent } from '../../../ai/types.js';

const meta = {
  title: 'AI · Agents/AgentRoster',
  component: AgentRoster,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AgentRoster>;

export default meta;
type Story = StoryObj<typeof meta>;

const TEAM: Agent[] = [
  {
    id: 'planner',
    name: 'Planner',
    role: 'Decomposes the task into subtasks.',
    modelId: 'claude-opus-4',
    initials: 'PL',
    status: 'done',
    tools: ['decompose'],
  },
  {
    id: 'researcher',
    name: 'Researcher',
    role: 'Gathers facts from the web and corpora.',
    modelId: 'claude-sonnet-4-5',
    initials: 'RS',
    status: 'working',
    tools: ['search_web', 'fetch_url', 'search_documents'],
  },
  {
    id: 'writer',
    name: 'Writer',
    role: 'Synthesises findings into a final answer.',
    modelId: 'claude-opus-4',
    initials: 'WR',
    status: 'idle',
    tools: ['write_markdown'],
  },
  {
    id: 'critic',
    name: 'Critic',
    role: 'Reviews drafts for accuracy and tone.',
    modelId: 'gpt-4o',
    initials: 'CR',
    status: 'idle',
    tools: ['rate_text'],
  },
  {
    id: 'fact-check',
    name: 'Fact-checker',
    role: 'Validates citations against sources.',
    modelId: 'claude-sonnet-4-5',
    initials: 'FC',
    status: 'blocked',
    tools: ['verify_citation'],
  },
];

export const List: Story = {
  render: () => {
    const [active, setActive] = useState<string | undefined>(undefined);
    return (
      <div className="w-[460px]">
        <AgentRoster agents={TEAM} activeId={active} onSelect={setActive} layout="list" />
      </div>
    );
  },
};

export const Grid: Story = {
  render: () => (
    <div className="w-[640px]">
      <AgentRoster agents={TEAM} layout="grid" />
    </div>
  ),
};

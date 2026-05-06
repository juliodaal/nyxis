import type { Meta, StoryObj } from '@storybook/react';
import { AgentCard } from './agent-card.js';
import type { Agent } from '../../../ai/types.js';

const meta = {
  title: 'AI · Agents/AgentCard',
  component: AgentCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AgentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const RESEARCHER: Agent = {
  id: 'researcher',
  name: 'Researcher',
  role: 'Gathers facts from the web and internal corpora.',
  modelId: 'claude-sonnet-4-5',
  initials: 'RS',
  status: 'thinking',
  tools: ['search_web', 'fetch_url', 'search_documents', 'list_repos'],
  lastActiveAt: new Date(),
};

export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <AgentCard agent={RESEARCHER} />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="w-[420px]">
      <AgentCard agent={RESEARCHER} compact />
    </div>
  ),
};

export const Selected: Story = {
  render: () => (
    <div className="w-[420px]">
      <AgentCard agent={RESEARCHER} selected onSelect={(id) => alert(`select ${id}`)} />
    </div>
  ),
};

export const Done: Story = {
  render: () => (
    <div className="w-[420px]">
      <AgentCard
        agent={{
          id: 'writer',
          name: 'Writer',
          role: 'Synthesises findings into a final answer.',
          modelId: 'claude-opus-4',
          initials: 'WR',
          status: 'done',
          tools: ['write_markdown'],
        }}
      />
    </div>
  ),
};

export const Errored: Story = {
  render: () => (
    <div className="w-[420px]">
      <AgentCard
        agent={{
          id: 'critic',
          name: 'Critic',
          role: 'Reviews drafts for accuracy and tone.',
          modelId: 'gpt-4o',
          initials: 'CR',
          status: 'errored',
          tools: ['rate_text'],
        }}
      />
    </div>
  ),
};

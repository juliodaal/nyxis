import type { Meta, StoryObj } from '@storybook/react';
import { PromptCard } from './prompt-card.js';
import type { Prompt } from '@nyxis/core';

const meta = {
  title: 'AI · Prompts/PromptCard',
  component: PromptCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof PromptCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const SUMMARISE: Prompt = {
  id: 'summarise-pr',
  name: 'Summarise pull request',
  description: 'Condense a PR diff and recent activity into a 3-bullet summary.',
  body: 'Summarise the following pull request in 3 bullets:\n\nRepo: {{repo}}\nNumber: {{number}}\nDiff:\n{{diff}}\n\nTone: {{tone}}',
  version: '2.1',
  modelId: 'claude-sonnet-4-5',
  tags: ['code-review', 'github', 'summarisation'],
  updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
};

export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <PromptCard prompt={SUMMARISE} />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="w-[420px]">
      <PromptCard prompt={SUMMARISE} compact />
    </div>
  ),
};

export const Selected: Story = {
  render: () => (
    <div className="w-[420px]">
      <PromptCard prompt={SUMMARISE} selected onSelect={(id) => alert(`select ${id}`)} />
    </div>
  ),
};

export const Minimal: Story = {
  render: () => (
    <div className="w-[420px]">
      <PromptCard
        prompt={{
          id: 'incident',
          name: 'List open incidents',
          body: 'Return all open incidents with severity and owner.',
        }}
      />
    </div>
  ),
};

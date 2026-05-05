import type { Meta, StoryObj } from '@storybook/react';
import { AIConfigCard } from './ai-config-card.js';

const meta = {
  title: 'AI · Models & Providers/AIConfigCard',
  component: AIConfigCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof AIConfigCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <AIConfigCard
        defaultConfig={{
          systemPrompt:
            'You are a senior support engineer named {{agent_name}}. Reply only with information from the {{knowledge_base}} corpus.',
        }}
      />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <AIConfigCard hideApiKey hideSystemPrompt />
    </div>
  ),
};

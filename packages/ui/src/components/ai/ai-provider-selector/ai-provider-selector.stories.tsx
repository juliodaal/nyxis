import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AIProviderSelector } from './ai-provider-selector.js';
import type { AIProviderId } from '@nyxis/core';

const meta = {
  title: 'AI · Models & Providers/AIProviderSelector',
  component: AIProviderSelector,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AIProviderSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState<AIProviderId>('anthropic');
    return (
      <div className="w-[320px]">
        <AIProviderSelector value={v} onValueChange={setV} />
      </div>
    );
  },
};

export const Compact: Story = {
  render: () => {
    const [v, setV] = useState<AIProviderId>('openai');
    return (
      <div className="w-[260px]">
        <AIProviderSelector value={v} onValueChange={setV} compact />
      </div>
    );
  },
};

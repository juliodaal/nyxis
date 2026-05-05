import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MaxTokensInput } from './max-tokens-input.js';

const meta = {
  title: 'AI · Models & Providers/MaxTokensInput',
  component: MaxTokensInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MaxTokensInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState(2048);
    return (
      <div className="w-[360px]">
        <MaxTokensInput value={v} onValueChange={setV} modelId="claude-sonnet-4-5" />
      </div>
    );
  },
};

export const Overflow: Story = {
  render: () => {
    const [v, setV] = useState(20000);
    return (
      <div className="w-[360px]">
        <MaxTokensInput value={v} onValueChange={setV} modelId="claude-sonnet-4-5" />
      </div>
    );
  },
};

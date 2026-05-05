import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TokenCounter } from './token-counter.js';

const meta = {
  title: 'AI · Chat/TokenCounter',
  component: TokenCounter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TokenCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Live: Story = {
  render: () => {
    const [text, setText] = useState(
      'You are a helpful assistant. Answer concisely and cite sources.',
    );
    return (
      <div className="flex w-[420px] flex-col gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          className="border-input bg-background text-foreground w-full resize-none rounded-md border p-3 font-mono text-xs"
        />
        <div className="flex justify-end">
          <TokenCounter text={text} modelId="claude-sonnet-4-5" showBar />
        </div>
      </div>
    );
  },
};

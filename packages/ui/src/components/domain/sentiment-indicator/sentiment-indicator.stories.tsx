import type { Meta, StoryObj } from '@storybook/react';
import { SentimentIndicator } from './sentiment-indicator.js';

const meta = {
  title: 'Domain Patterns/SentimentIndicator',
  component: SentimentIndicator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SentimentIndicator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-3">
      <SentimentIndicator score={0.78} />
      <SentimentIndicator score={0.05} />
      <SentimentIndicator score={-0.62} />
    </div>
  ),
};

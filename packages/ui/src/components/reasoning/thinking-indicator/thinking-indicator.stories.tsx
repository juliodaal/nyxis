import type { Meta, StoryObj } from '@storybook/react';
import { ThinkingIndicator } from './thinking-indicator.js';

const meta = {
  title: 'AI · Reasoning/ThinkingIndicator',
  component: ThinkingIndicator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ThinkingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ThinkingIndicator variant="shimmer" />
      <ThinkingIndicator variant="pulse" />
      <ThinkingIndicator variant="orbit" />
      <ThinkingIndicator variant="shimmer" icon="sparkles" label="Reasoning across documents…" />
    </div>
  ),
};

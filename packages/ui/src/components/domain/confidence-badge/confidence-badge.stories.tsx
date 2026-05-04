import type { Meta, StoryObj } from '@storybook/react';
import { ConfidenceBadge } from './confidence-badge.js';

const meta = {
  title: 'Domain Patterns/ConfidenceBadge',
  component: ConfidenceBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ConfidenceBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Levels: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <ConfidenceBadge score={0.97} />
      <ConfidenceBadge score={0.74} />
      <ConfidenceBadge score={0.42} />
    </div>
  ),
};

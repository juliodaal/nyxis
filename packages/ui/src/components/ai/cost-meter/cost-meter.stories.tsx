import type { Meta, StoryObj } from '@storybook/react';
import { CostMeter } from './cost-meter.js';

const meta = {
  title: 'AI · Models & Providers/CostMeter',
  component: CostMeter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CostMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = {
  render: () => <CostMeter initial={0.0124} />,
};

export const Detailed: Story = {
  render: () => <CostMeter initial={0.412} detailed />,
};

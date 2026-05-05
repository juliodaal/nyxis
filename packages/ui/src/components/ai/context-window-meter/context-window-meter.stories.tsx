import type { Meta, StoryObj } from '@storybook/react';
import { ContextWindowMeter } from './context-window-meter.js';

const meta = {
  title: 'AI · Models & Providers/ContextWindowMeter',
  component: ContextWindowMeter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ContextWindowMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Levels: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-6">
      <ContextWindowMeter used={42_000} modelId="claude-sonnet-4-5" />
      <ContextWindowMeter used={148_000} modelId="claude-sonnet-4-5" />
      <ContextWindowMeter used={195_000} modelId="claude-sonnet-4-5" />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="w-[260px]">
      <ContextWindowMeter used={75_000} modelId="claude-sonnet-4-5" compact />
    </div>
  ),
};

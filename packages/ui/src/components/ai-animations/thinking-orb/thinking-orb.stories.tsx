import type { Meta, StoryObj } from '@storybook/react';
import { ThinkingOrb } from './thinking-orb.js';

const meta = {
  title: 'AI · Animations/ThinkingOrb',
  component: ThinkingOrb,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ThinkingOrb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <ThinkingOrb state="idle" label="idle" />
      <ThinkingOrb state="thinking" label="thinking" />
      <ThinkingOrb state="speaking" label="speaking" />
      <ThinkingOrb state="errored" label="errored" />
    </div>
  ),
};

export const Large: Story = {
  render: () => <ThinkingOrb state="thinking" size={160} label="Synthesising response…" />,
};

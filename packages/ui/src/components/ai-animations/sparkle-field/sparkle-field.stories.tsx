import type { Meta, StoryObj } from '@storybook/react';
import { SparkleField } from './sparkle-field.js';

const meta = {
  title: 'AI · Animations/SparkleField',
  component: SparkleField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SparkleField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AroundButton: Story = {
  render: () => (
    <SparkleField className="text-primary inline-block">
      <button
        type="button"
        className="from-primary text-primary-foreground rounded-md bg-gradient-to-br via-violet-500 to-sky-500 px-4 py-2 text-sm font-semibold"
      >
        ✨ Improve with AI
      </button>
    </SparkleField>
  ),
};

export const AroundCard: Story = {
  render: () => (
    <SparkleField density={12} className="text-violet-500">
      <div className="border-border bg-card text-foreground w-[320px] rounded-lg border p-5">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          Generated
        </p>
        <h3 className="mt-1 text-lg font-bold">A short, joyful poem</h3>
        <p className="mt-2 text-sm leading-relaxed">
          Sparrows split the morning quiet,
          <br />
          A coffee cup, a held-back yawn —
          <br />
          The day starts soft, the day starts kind.
        </p>
      </div>
    </SparkleField>
  ),
};

export const Disabled: Story = {
  render: () => (
    <SparkleField active={false} className="text-primary inline-block">
      <button
        type="button"
        className="bg-muted text-muted-foreground rounded-md px-4 py-2 text-sm font-medium"
      >
        AI off
      </button>
    </SparkleField>
  ),
};

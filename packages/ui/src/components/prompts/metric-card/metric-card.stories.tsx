import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './metric-card.js';

const meta = {
  title: 'AI · Prompts/MetricCard',
  component: MetricCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const SPARKLINE = [0.62, 0.66, 0.69, 0.71, 0.74, 0.78, 0.81, 0.84];
const DOWN = [240, 230, 215, 220, 200, 190, 180, 175];

export const Grid: Story = {
  render: () => (
    <div className="grid w-[640px] grid-cols-1 gap-3 sm:grid-cols-3">
      <MetricCard
        metric={{
          name: 'accuracy',
          value: 0.842,
          unit: '',
          baseline: 0.78,
          goodDirection: 'up',
          sparkline: SPARKLINE,
          precision: 3,
        }}
      />
      <MetricCard
        metric={{
          name: 'latency p95',
          value: 175,
          unit: 'ms',
          baseline: 240,
          goodDirection: 'down',
          sparkline: DOWN,
        }}
      />
      <MetricCard
        metric={{
          name: 'cost',
          value: 0.0124,
          unit: '$',
          baseline: 0.014,
          goodDirection: 'down',
          precision: 4,
        }}
      />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="grid w-[640px] grid-cols-2 gap-2 sm:grid-cols-4">
      <MetricCard
        compact
        metric={{
          name: 'accuracy',
          value: 0.842,
          baseline: 0.78,
          goodDirection: 'up',
        }}
      />
      <MetricCard
        compact
        metric={{ name: 'recall', value: 0.91, baseline: 0.93, goodDirection: 'up' }}
      />
      <MetricCard
        compact
        metric={{
          name: 'latency p95',
          value: 175,
          unit: 'ms',
          baseline: 240,
          goodDirection: 'down',
        }}
      />
      <MetricCard
        compact
        metric={{
          name: 'cost',
          value: 0.0124,
          unit: '$',
          baseline: 0.014,
          goodDirection: 'down',
          precision: 4,
        }}
      />
    </div>
  ),
};

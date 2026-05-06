import type { Meta, StoryObj } from '@storybook/react';
import { ABCompare } from './ab-compare.js';

const meta = {
  title: 'AI · Prompts/ABCompare',
  component: ABCompare,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ABCompare>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[760px]">
      <ABCompare
        input="Summarise PR #42 — refactor: split chat barrel into per-component subpaths."
        a={{
          label: 'summarise-pr v2.1',
          sublabel: 'baseline',
          modelId: 'claude-sonnet-4-5',
          metrics: [
            { name: 'accuracy', value: 0.78, baseline: 0.78, goodDirection: 'up', precision: 3 },
            {
              name: 'latency p95',
              value: 240,
              unit: 'ms',
              baseline: 240,
              goodDirection: 'down',
            },
            {
              name: 'cost',
              value: 0.014,
              unit: '$',
              baseline: 0.014,
              goodDirection: 'down',
              precision: 4,
            },
          ],
          sample:
            '- Split chat barrel\n- Per-component subpaths\n- Tree-shaking improvement (slight)',
        }}
        b={{
          label: 'summarise-pr v2.2',
          sublabel: 'challenger',
          modelId: 'claude-sonnet-4-5',
          metrics: [
            { name: 'accuracy', value: 0.842, baseline: 0.78, goodDirection: 'up', precision: 3 },
            {
              name: 'latency p95',
              value: 175,
              unit: 'ms',
              baseline: 240,
              goodDirection: 'down',
            },
            {
              name: 'cost',
              value: 0.0124,
              unit: '$',
              baseline: 0.014,
              goodDirection: 'down',
              precision: 4,
            },
          ],
          sample:
            '- Split chat barrel\n- Per-component subpaths\n- Better tree-shaking, smaller bundles',
        }}
      />
    </div>
  ),
};

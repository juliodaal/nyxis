import type { Meta, StoryObj } from '@storybook/react';
import { KPICard } from './kpi-card.js';

const meta = {
  title: 'Domain Patterns/KPICard',
  component: KPICard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof KPICard>;
export default meta;
type Story = StoryObj<typeof meta>;

const series = [0.2, 0.35, 0.3, 0.5, 0.55, 0.7, 0.6, 0.85];

export const Default: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KPICard label="MRR" value="€48,210" period="last 30d" delta={0.124} sparkline={series} />
      <KPICard
        label="Tickets / day"
        value="412"
        period="this week"
        delta={-0.083}
        sparkline={[...series].reverse()}
      />
      <KPICard label="Avg. confidence" value="92.4%" period="all time" delta={0} />
    </div>
  ),
};

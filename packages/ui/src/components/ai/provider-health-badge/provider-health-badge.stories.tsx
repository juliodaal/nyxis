import type { Meta, StoryObj } from '@storybook/react';
import { ProviderHealthBadge } from './provider-health-badge.js';

const meta = {
  title: 'AI · Models & Providers/ProviderHealthBadge',
  component: ProviderHealthBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ProviderHealthBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <ProviderHealthBadge status="operational" latencyMs={210} />
      <ProviderHealthBadge status="degraded" latencyMs={1240} />
      <ProviderHealthBadge status="down" />
      <ProviderHealthBadge status="unknown" />
    </div>
  ),
};

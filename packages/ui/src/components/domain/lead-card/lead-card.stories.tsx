import type { Meta, StoryObj } from '@storybook/react';
import { LeadCard } from './lead-card.js';

const meta = {
  title: 'Domain Patterns/LeadCard',
  component: LeadCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof LeadCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    company: 'Acme GmbH',
    contact: 'Lukas Müller · CFO',
    segment: 'Manufacturing · 200-500 FTE',
    score: 0.82,
    tags: ['Enterprise', 'EU', 'DATEV'],
    primaryAction: { label: 'Open in HubSpot', href: '#' },
    onEmail: () => alert('email'),
  },
};

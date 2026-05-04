import type { Meta, StoryObj } from '@storybook/react';
import { CountUp } from './count-up.js';

const meta = {
  title: 'Text Animations/CountUp',
  component: CountUp,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CountUp>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Number: Story = {
  args: { to: 12480, format: 'number', className: 'text-5xl font-bold text-foreground' },
};
export const Currency: Story = {
  args: {
    to: 4830,
    format: 'currency',
    currency: 'EUR',
    locale: 'en-US',
    className: 'text-5xl font-bold text-foreground',
  },
};
export const Percent: Story = {
  args: { to: 0.92, format: 'percent', decimals: 0, className: 'text-5xl font-bold text-success' },
};
export const Compact: Story = {
  args: { to: 1240000, format: 'compact', className: 'text-5xl font-bold text-foreground' },
};

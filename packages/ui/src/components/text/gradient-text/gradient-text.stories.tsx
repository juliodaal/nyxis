import type { Meta, StoryObj } from '@storybook/react';
import { GradientText } from './gradient-text.js';

const meta = {
  title: 'Text Animations/GradientText',
  component: GradientText,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof GradientText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'AI products that ship.',
    as: 'h1',
    className: 'text-6xl font-bold tracking-tight',
  },
};

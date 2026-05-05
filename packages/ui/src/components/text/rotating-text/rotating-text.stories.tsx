import type { Meta, StoryObj } from '@storybook/react';
import { RotatingText } from './rotating-text.js';

const meta = {
  title: 'Text Animations/RotatingText',
  component: RotatingText,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof RotatingText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Slide: Story = {
  args: {
    words: ['Document AI', 'AI Assistant', 'Lead Intelligence', 'Meeting Intelligence'],
    animation: 'slide',
    interval: 2200,
    className: 'text-5xl font-bold text-primary',
  },
};

export const Fade: Story = {
  args: {
    words: ['Sales', 'Operations', 'Finance', 'Support'],
    animation: 'fade',
    className: 'text-5xl font-bold text-foreground',
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { ShinyText } from './shiny-text.js';

const meta = {
  title: 'Text Animations/ShinyText',
  component: ShinyText,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ShinyText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Premium', as: 'span', className: 'text-2xl font-semibold' },
};

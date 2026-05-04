import type { Meta, StoryObj } from '@storybook/react';
import { ScrambleText } from './scramble-text.js';

const meta = {
  title: 'Text Animations/ScrambleText',
  component: ScrambleText,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrambleText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Mount: Story = {
  args: { children: 'extracting invoice fields...', className: 'text-2xl text-primary' },
};
export const Hover: Story = {
  args: {
    children: 'hover to decrypt',
    trigger: 'hover',
    className: 'text-2xl cursor-pointer text-primary',
  },
};

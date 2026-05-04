import type { Meta, StoryObj } from '@storybook/react';
import { DecryptText } from './decrypt-text.js';

const meta = {
  title: 'Text Animations/DecryptText',
  component: DecryptText,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof DecryptText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'classifying inbox...',
    durationPerChar: 80,
    className: 'text-2xl text-primary',
  },
};

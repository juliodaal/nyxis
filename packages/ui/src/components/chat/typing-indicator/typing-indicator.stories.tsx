import type { Meta, StoryObj } from '@storybook/react';
import { TypingIndicator } from './typing-indicator.js';

const meta = {
  title: 'AI · Chat/TypingIndicator',
  component: TypingIndicator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TypingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Subtle: Story = { args: { label: 'Compiling answer' } };
export const Bubble: Story = { args: { variant: 'bubble', label: 'Searching the docs' } };

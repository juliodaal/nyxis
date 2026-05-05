import type { Meta, StoryObj } from '@storybook/react';
import { MessageActions } from './message-actions.js';

const meta = {
  title: 'AI · Chat/MessageActions',
  component: MessageActions,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MessageActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Hello world',
  },
};

export const Panel: Story = {
  args: {
    variant: 'panel',
    text: 'Hello world',
  },
};

export const Subset: Story = {
  args: {
    text: 'Hello world',
    actions: ['copy', 'regenerate', 'fork'],
  },
};

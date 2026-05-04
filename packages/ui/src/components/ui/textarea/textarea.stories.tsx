import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea.js';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: 'Tell us more...' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Locked content' } };

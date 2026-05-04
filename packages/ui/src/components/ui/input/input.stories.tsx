import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input.js';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { placeholder: 'Email' } };
export const Disabled: Story = { args: { disabled: true, placeholder: 'Disabled' } };
export const Invalid: Story = {
  args: { 'aria-invalid': true, placeholder: 'Invalid', defaultValue: 'oops' },
};

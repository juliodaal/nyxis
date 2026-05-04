import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label.js';
import { Input } from '../input/input.js';

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex w-[260px] flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="hello@nyxis.dev" />
    </div>
  ),
};

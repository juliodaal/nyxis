import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge.js';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'success', 'warning', 'destructive', 'muted'],
    },
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'New' } };
export const WithDot: Story = { args: { children: 'Live', dot: true, variant: 'success' } };
export const All: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success" dot>
        Live
      </Badge>
      <Badge variant="warning" dot>
        Pending
      </Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="muted">Archived</Badge>
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { ActionItem } from './action-item.js';

const meta = {
  title: 'Domain Patterns/ActionItem',
  component: ActionItem,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ActionItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-2">
      <ActionItem
        text="Send Q3 reconciliation deck to finance"
        assignee="MS"
        due="Tue · 3pm"
        status="pending"
      />
      <ActionItem
        text="Confirm DATEV credentials for the new tenant"
        assignee="JD"
        due="Today"
        status="in-progress"
      />
      <ActionItem text="Sign off on the migration plan" assignee="AT" status="done" />
    </div>
  ),
};

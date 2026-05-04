import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverContent, PopoverTrigger } from './popover.js';
import { Button } from '../button/button.js';

const meta = {
  title: 'Components/Popover',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <h4 className="text-foreground text-sm font-medium">Filters</h4>
        <p className="text-muted-foreground mt-1 text-xs">
          Adjust how the list is filtered. Changes apply immediately.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

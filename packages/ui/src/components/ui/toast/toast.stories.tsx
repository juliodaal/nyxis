import type { Meta, StoryObj } from '@storybook/react';
import { Toaster, toast } from './toast.js';
import { Button } from '../button/button.js';

const meta = {
  title: 'Components/Toast',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <Toaster position="top-right" />
      <div className="flex gap-2">
        <Button
          onClick={() =>
            toast('Extraction complete', { description: '412 invoices ready for review.' })
          }
        >
          Notify
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success('Pushed to DATEV', { description: '412 invoices synced.' })}
        >
          Success
        </Button>
        <Button
          variant="destructive"
          onClick={() => toast.error('Sync failed', { description: 'Network error. Retry?' })}
        >
          Error
        </Button>
      </div>
    </div>
  ),
};

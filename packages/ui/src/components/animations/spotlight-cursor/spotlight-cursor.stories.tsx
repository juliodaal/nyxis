import type { Meta, StoryObj } from '@storybook/react';
import { SpotlightCursor } from './spotlight-cursor.js';

const meta = {
  title: 'Animations/SpotlightCursor',
  component: SpotlightCursor,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof SpotlightCursor>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SpotlightCursor className="bg-card grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-3 p-12 text-center">
        <h2 className="text-foreground text-3xl font-bold">Move your cursor</h2>
        <p className="text-muted-foreground">A soft spotlight follows you.</p>
      </div>
    </SpotlightCursor>
  ),
};

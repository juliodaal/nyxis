import type { Meta, StoryObj } from '@storybook/react';
import { DotGridBackground } from './dot-grid-background.js';

const meta = {
  title: 'Animations/DotGridBackground',
  component: DotGridBackground,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof DotGridBackground>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DotGridBackground className="bg-background grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <h2 className="text-foreground text-5xl font-bold tracking-tight">Move the cursor</h2>
        <p className="text-muted-foreground mt-2">Dots react around the pointer.</p>
      </div>
    </DotGridBackground>
  ),
};

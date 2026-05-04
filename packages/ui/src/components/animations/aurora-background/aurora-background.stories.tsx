import type { Meta, StoryObj } from '@storybook/react';
import { AuroraBackground } from './aurora-background.js';

const meta = {
  title: 'Animations/AuroraBackground',
  component: AuroraBackground,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AuroraBackground>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AuroraBackground className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <h2 className="text-foreground text-5xl font-bold tracking-tight">Nyxis</h2>
        <p className="text-muted-foreground mt-2">A modern React component library.</p>
      </div>
    </AuroraBackground>
  ),
};

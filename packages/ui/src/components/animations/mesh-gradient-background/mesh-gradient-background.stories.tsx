import type { Meta, StoryObj } from '@storybook/react';
import { MeshGradientBackground } from './mesh-gradient-background.js';

const meta = {
  title: 'Animations/MeshGradientBackground',
  component: MeshGradientBackground,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof MeshGradientBackground>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <MeshGradientBackground className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <h2 className="text-foreground text-5xl font-bold tracking-tight">Mesh gradient</h2>
        <p className="text-muted-foreground mt-2">Soft, shifting backdrop.</p>
      </div>
    </MeshGradientBackground>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { ParallaxContainer } from './parallax-container.js';

const meta = {
  title: 'Animations/ParallaxContainer',
  component: ParallaxContainer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ParallaxContainer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-12 p-12">
      <p className="text-muted-foreground">Scroll to see the parallax →</p>
      <ParallaxContainer
        depth={120}
        className="border-border bg-card h-[200px] rounded-lg border p-6"
      >
        <h3 className="text-foreground text-xl font-semibold">I move slower than the page.</h3>
      </ParallaxContainer>
      <div className="h-[120vh]" />
    </div>
  ),
};

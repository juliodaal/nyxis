import type { Meta, StoryObj } from '@storybook/react';
import { RevealText } from './reveal-text.js';

const meta = {
  title: 'Text Animations/RevealText',
  component: RevealText,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof RevealText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-[80vh] py-12">
      <p className="text-muted-foreground">Scroll down to see the reveal effect →</p>
      <RevealText className="text-foreground text-3xl font-bold">
        Built for AI-powered SaaS products.
      </RevealText>
      <RevealText delay={150} className="text-foreground text-3xl font-bold">
        Themeable. Accessible. Animated.
      </RevealText>
    </div>
  ),
};

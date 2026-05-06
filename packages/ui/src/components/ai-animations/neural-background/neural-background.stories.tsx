import type { Meta, StoryObj } from '@storybook/react';
import { NeuralBackground } from './neural-background.js';

const meta = {
  title: 'AI · Animations/NeuralBackground',
  component: NeuralBackground,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof NeuralBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hero: Story = {
  render: () => (
    <NeuralBackground className="bg-background text-primary grid h-screen w-full place-items-center">
      <div className="text-center">
        <h1 className="text-foreground text-5xl font-bold tracking-tight">Nyxis</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A modern React component library for AI-powered products.
        </p>
      </div>
    </NeuralBackground>
  ),
};

export const DenseFast: Story = {
  render: () => (
    <NeuralBackground
      nodeCount={70}
      edgeRadius={0.22}
      speed={2}
      className="bg-background h-[500px] w-full text-violet-500"
    />
  ),
};

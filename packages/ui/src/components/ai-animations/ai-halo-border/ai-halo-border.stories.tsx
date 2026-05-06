import type { Meta, StoryObj } from '@storybook/react';
import { AIHaloBorder } from './ai-halo-border.js';

const meta = {
  title: 'AI · Animations/AIHaloBorder',
  component: AIHaloBorder,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AIHaloBorder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  render: () => (
    <AIHaloBorder>
      <div className="text-foreground w-[360px] p-5">
        <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
          AI-generated
        </p>
        <p className="text-sm leading-relaxed">
          Nyxis ships adapters as peer dependencies so apps only pay for the providers they actually
          use.
        </p>
      </div>
    </AIHaloBorder>
  ),
};

export const Static: Story = {
  render: () => (
    <AIHaloBorder active={false}>
      <div className="text-foreground w-[360px] p-5">
        <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
          AI-generated · cached
        </p>
        <p className="text-sm leading-relaxed">
          Static halo — useful for content that was AI-generated but is no longer streaming.
        </p>
      </div>
    </AIHaloBorder>
  ),
};

export const Thicker: Story = {
  render: () => (
    <AIHaloBorder thickness={4} radius={20} speedMs={2500}>
      <div className="text-foreground w-[300px] p-6 text-center">
        <p className="text-2xl font-bold">✨ Premium</p>
        <p className="text-muted-foreground mt-1 text-xs">Thicker halo, faster spin</p>
      </div>
    </AIHaloBorder>
  ),
};

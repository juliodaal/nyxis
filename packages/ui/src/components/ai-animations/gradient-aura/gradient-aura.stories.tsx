import type { Meta, StoryObj } from '@storybook/react';
import { GradientAura } from './gradient-aura.js';

const meta = {
  title: 'AI · Animations/GradientAura',
  component: GradientAura,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof GradientAura>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AroundButton: Story = {
  render: () => (
    <GradientAura>
      <button
        type="button"
        className="bg-foreground text-background relative rounded-md px-4 py-2 text-sm font-semibold"
      >
        ✨ Try the AI demo
      </button>
    </GradientAura>
  ),
};

export const AroundCard: Story = {
  render: () => (
    <GradientAura intensity={0.7} speedMs={9000}>
      <div className="border-border bg-card text-foreground relative w-[360px] rounded-xl border p-6">
        <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
          Premium
        </p>
        <h3 className="mt-1 text-2xl font-bold">Nyxis Pro</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Aura behind the card. Pure CSS — no canvas, no deps.
        </p>
      </div>
    </GradientAura>
  ),
};

export const Subtle: Story = {
  render: () => (
    <GradientAura intensity={0.25} speedMs={12000}>
      <div className="border-border bg-card text-foreground relative w-[300px] rounded-lg border p-5">
        <p className="text-sm">Subtle backdrop glow.</p>
      </div>
    </GradientAura>
  ),
};

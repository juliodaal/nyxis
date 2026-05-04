import type { Meta, StoryObj } from '@storybook/react';
import { TiltCard } from './tilt-card.js';

const meta = {
  title: 'Animations/TiltCard',
  component: TiltCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TiltCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TiltCard className="size-72">
      <div className="border-border bg-card shadow-elevated grid h-full place-items-center rounded-2xl border p-6 text-center">
        <div>
          <h3 className="text-foreground text-xl font-semibold">DocuMind</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Document intelligence for finance teams.
          </p>
        </div>
      </div>
    </TiltCard>
  ),
};

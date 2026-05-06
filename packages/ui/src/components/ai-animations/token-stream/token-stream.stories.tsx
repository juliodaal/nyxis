import type { Meta, StoryObj } from '@storybook/react';
import { TokenStream } from './token-stream.js';

const meta = {
  title: 'AI · Animations/TokenStream',
  component: TokenStream,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TokenStream>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="border-border bg-card text-primary w-[480px] rounded-lg border p-3">
      <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
        Streaming
      </p>
      <TokenStream height={28} />
    </div>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <div className="border-border bg-card w-[480px] rounded-lg border p-3 text-violet-500">
      <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
        Direction left
      </p>
      <TokenStream direction="left" height={28} />
    </div>
  ),
};

export const Dense: Story = {
  render: () => (
    <div className="border-border bg-card w-[480px] rounded-lg border p-3 text-sky-500">
      <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
        Dense + fast
      </p>
      <TokenStream spawnEveryMs={45} maxTokens={32} height={36} />
    </div>
  ),
};

export const Inactive: Story = {
  render: () => (
    <div className="border-border bg-card text-muted-foreground w-[480px] rounded-lg border p-3">
      <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
        Idle
      </p>
      <TokenStream active={false} height={28} />
    </div>
  ),
};

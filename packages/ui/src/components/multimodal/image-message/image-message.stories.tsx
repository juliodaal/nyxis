import type { Meta, StoryObj } from '@storybook/react';
import { ImageMessage } from './image-message.js';

const meta = {
  title: 'AI · Multimodal/ImageMessage',
  component: ImageMessage,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ImageMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=640';

export const Ready: Story = {
  render: () => (
    <div className="w-[420px]">
      <ImageMessage
        src={SAMPLE}
        alt="Circuit board with brass-coloured traces."
        caption="Generated · 1024×1024 · 8s"
        onOpen={() => alert('open lightbox')}
      />
    </div>
  ),
};

export const Generating: Story = {
  render: () => (
    <div className="w-[420px]">
      <ImageMessage alt="Generating..." status="generating" progress={0.42} />
    </div>
  ),
};

export const Pending: Story = {
  render: () => (
    <div className="w-[420px]">
      <ImageMessage alt="Queued" status="pending" />
    </div>
  ),
};

export const Errored: Story = {
  render: () => (
    <div className="w-[420px]">
      <ImageMessage
        alt="Generation failed"
        status="errored"
        error="Content policy violation: image rejected by safety classifier."
      />
    </div>
  ),
};

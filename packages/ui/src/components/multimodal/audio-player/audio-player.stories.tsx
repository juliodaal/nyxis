import type { Meta, StoryObj } from '@storybook/react';
import { AudioPlayer } from './audio-player.js';

const meta = {
  title: 'AI · Multimodal/AudioPlayer',
  component: AudioPlayer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AudioPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Royalty-free demo audio.
const SAMPLE = 'https://www.soundjay.com/buttons/sounds/button-09a.mp3';

const WAVEFORM = Array.from(
  { length: 64 },
  (_, i) => 0.25 + Math.abs(Math.sin(i * 0.35) + Math.cos(i * 0.13) * 0.5) * 0.6,
);

export const Default: Story = {
  render: () => (
    <div className="w-[460px]">
      <AudioPlayer src={SAMPLE} title="Voice reply" waveform={WAVEFORM} />
    </div>
  ),
};

export const Untitled: Story = {
  render: () => (
    <div className="w-[460px]">
      <AudioPlayer src={SAMPLE} />
    </div>
  ),
};

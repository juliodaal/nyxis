import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { VoiceWaveform } from './voice-waveform.js';

const meta = {
  title: 'AI · Multimodal/VoiceWaveform',
  component: VoiceWaveform,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof VoiceWaveform>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATIC_BARS = Array.from({ length: 48 }, (_, i) => 0.3 + Math.abs(Math.sin(i * 0.4)) * 0.6);

export const Recording: Story = {
  render: () => (
    <div className="border-border bg-card w-[420px] rounded-lg border p-4">
      <VoiceWaveform isRecording height={36} />
    </div>
  ),
};

export const Playback: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
      const tick = setInterval(() => setProgress((p) => (p >= 1 ? 0 : p + 0.02)), 80);
      return () => clearInterval(tick);
    }, []);
    return (
      <div className="border-border bg-card w-[420px] rounded-lg border p-4">
        <VoiceWaveform bars={STATIC_BARS} isPlaying progress={progress} height={36} />
      </div>
    );
  },
};

export const Idle: Story = {
  render: () => (
    <div className="border-border bg-card w-[420px] rounded-lg border p-4">
      <VoiceWaveform bars={STATIC_BARS} height={36} />
    </div>
  ),
};

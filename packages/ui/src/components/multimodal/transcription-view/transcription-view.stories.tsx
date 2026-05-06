import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { TranscriptionView } from './transcription-view.js';
import type { TranscriptSegment } from '../../../ai/types.js';

const meta = {
  title: 'AI · Multimodal/TranscriptionView',
  component: TranscriptionView,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TranscriptionView>;

export default meta;
type Story = StoryObj<typeof meta>;

const SEGMENTS: TranscriptSegment[] = [
  { id: '1', start: 0, end: 3.2, speaker: 'Maria', text: 'Hi, thanks for joining the call today.' },
  {
    id: '2',
    start: 3.2,
    end: 8.4,
    speaker: 'Lukas',
    text: 'Of course — happy to walk you through how Nyxis ships its peer-dependency adapters.',
  },
  {
    id: '3',
    start: 8.4,
    end: 14.1,
    speaker: 'Maria',
    text: 'Great. The first thing I want to understand is the bundle-size argument. Can you elaborate?',
    confidence: 0.62,
  },
  {
    id: '4',
    start: 14.1,
    end: 22.5,
    speaker: 'Lukas',
    text: 'Right — apps that target only Anthropic should not pay for the OpenAI SDK. Peer deps mean the consumer chooses which providers to install.',
  },
  {
    id: '5',
    start: 22.5,
    end: 30.0,
    speaker: 'Lukas',
    text: 'On top of that, we lazy-load adapters server-side via createChatHandler — so cold-starts stay tight.',
  },
];

export const Static: Story = {
  render: () => (
    <div className="w-[520px]">
      <TranscriptionView segments={SEGMENTS} />
    </div>
  ),
};

export const Synced: Story = {
  render: () => {
    const [time, setTime] = useState(0);
    useEffect(() => {
      const tick = setInterval(() => setTime((t) => (t >= 30 ? 0 : t + 0.4)), 400);
      return () => clearInterval(tick);
    }, []);
    return (
      <div className="w-[520px]">
        <TranscriptionView
          segments={SEGMENTS}
          currentTime={time}
          onSelect={(s) => setTime(s.start)}
        />
      </div>
    );
  },
};

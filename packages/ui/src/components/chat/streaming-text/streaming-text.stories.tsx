import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { StreamingText } from './streaming-text.js';

const meta = {
  title: 'AI · Chat/StreamingText',
  component: StreamingText,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof StreamingText>;

export default meta;
type Story = StoryObj<typeof meta>;

const FULL =
  'Vercel AI SDK is the easiest way to wire an AI provider to your React app — and the protocol Nyxis speaks too.';

export const Default: Story = {
  render: () => {
    const [text, setText] = useState('');
    const [streaming, setStreaming] = useState(true);
    useEffect(() => {
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setText(FULL.slice(0, i));
        if (i >= FULL.length) {
          clearInterval(id);
          setStreaming(false);
        }
      }, 30);
      return () => clearInterval(id);
    }, []);
    return (
      <div className="text-foreground max-w-md text-base">
        <StreamingText text={text} streaming={streaming} />
      </div>
    );
  },
};

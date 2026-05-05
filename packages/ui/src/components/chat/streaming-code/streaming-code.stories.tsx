import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { StreamingCode } from './streaming-code.js';

const meta = {
  title: 'AI · Chat/StreamingCode',
  component: StreamingCode,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof StreamingCode>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE = `import { useChat } from 'nyxis-ui/ai';

export function Chat() {
  const { messages, input, setInput, send } = useChat({
    systemPrompt: 'You are a helpful assistant.',
  });

  return (
    <ChatThread messages={messages} streaming />
  );
}
`;

export const Streaming: Story = {
  render: () => {
    const [code, setCode] = useState('');
    const [streaming, setStreaming] = useState(true);
    useEffect(() => {
      let i = 0;
      const id = setInterval(() => {
        i += 6;
        setCode(SAMPLE.slice(0, i));
        if (i >= SAMPLE.length) {
          clearInterval(id);
          setStreaming(false);
        }
      }, 60);
      return () => clearInterval(id);
    }, []);
    return (
      <div className="w-full max-w-xl">
        <StreamingCode code={code} language="tsx" filename="app/Chat.tsx" streaming={streaming} />
      </div>
    );
  },
};

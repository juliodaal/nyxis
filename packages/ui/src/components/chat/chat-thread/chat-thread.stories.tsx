import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { ChatThread } from './chat-thread.js';
import type { AIMessage } from '@nyxis/core';

const meta = {
  title: 'AI · Chat/ChatThread',
  component: ChatThread,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ChatThread>;

export default meta;
type Story = StoryObj<typeof meta>;

const SEED: AIMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Why does Nyxis ship adapters as peer dependencies?',
    createdAt: '14:02',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      "Two reasons:\n\n1. **Bundle size** — apps that only target Anthropic don't need OpenAI bundled.\n2. **Version freedom** — you pin the AI SDK version that matches your server.\n\n```ts\npnpm add nyxis-ui ai @ai-sdk/anthropic\n```",
    createdAt: '14:02',
  },
];

const FOLLOWUP =
  'And on the server side, `createChatHandler` lazy-loads the right adapter at request time — so the cold-start of an Edge function only pays for the provider it actually uses.';

export const Live: Story = {
  render: () => {
    const [messages, setMessages] = useState<AIMessage[]>(SEED);
    const [streaming, setStreaming] = useState(false);

    useEffect(() => {
      // Append a streaming follow-up after a short pause.
      const start = setTimeout(() => {
        setStreaming(true);
        setMessages((prev) => [
          ...prev,
          { id: '3', role: 'user', content: 'Anything else?', createdAt: '14:03' },
          { id: '4', role: 'assistant', content: '', createdAt: '14:03' },
        ]);
        let i = 0;
        const tick = setInterval(() => {
          i += 4;
          setMessages((prev) =>
            prev.map((m) => (m.id === '4' ? { ...m, content: FOLLOWUP.slice(0, i) } : m)),
          );
          if (i >= FOLLOWUP.length) {
            clearInterval(tick);
            setStreaming(false);
          }
        }, 60);
      }, 800);
      return () => clearTimeout(start);
    }, []);

    return (
      <div className="bg-background h-screen">
        <ChatThread messages={messages} streaming={streaming} />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <div className="bg-background h-screen">
      <ChatThread
        messages={[]}
        emptyState={
          <div className="text-center">
            <p className="text-foreground text-base font-semibold">Start a conversation</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Ask anything. Replies stream in markdown.
            </p>
          </div>
        }
      />
    </div>
  ),
};

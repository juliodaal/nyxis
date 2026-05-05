import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { StreamingMarkdown } from './streaming-markdown.js';

const meta = {
  title: 'AI · Chat/StreamingMarkdown',
  component: StreamingMarkdown,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof StreamingMarkdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE = `### Setting up Nyxis with the AI SDK

Install the package and an adapter:

\`\`\`bash
pnpm add nyxis-ui ai @ai-sdk/anthropic
\`\`\`

Then mount the provider once:

\`\`\`tsx
import { AIProvider } from 'nyxis-ui/ai';

<AIProvider defaultProvider="anthropic" defaultModel="claude-sonnet-4-5">
  <App />
</AIProvider>;
\`\`\`

| Provider  | Best for          |
|-----------|-------------------|
| Anthropic | reasoning, tools  |
| OpenAI    | multimodal, audio |
| Ollama    | local development |

> **Tip:** keep your API key on the server. Never ship it to the browser.`;

export const Streaming: Story = {
  render: () => {
    const [text, setText] = useState('');
    const [streaming, setStreaming] = useState(true);
    useEffect(() => {
      let i = 0;
      const id = setInterval(() => {
        i += 12;
        setText(SAMPLE.slice(0, i));
        if (i >= SAMPLE.length) {
          clearInterval(id);
          setStreaming(false);
        }
      }, 80);
      return () => clearInterval(id);
    }, []);
    return (
      <div className="border-border bg-card w-full max-w-2xl rounded-2xl border p-5">
        <StreamingMarkdown text={text} streaming={streaming} />
      </div>
    );
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { ReasoningTrace } from './reasoning-trace.js';

const meta = {
  title: 'AI · Reasoning/ReasoningTrace',
  component: ReasoningTrace,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ReasoningTrace>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE = `The user is asking why Nyxis exposes adapters as peer dependencies.

I should focus on three points:
1. Bundle size — apps targeting only one provider shouldn't pay for the others.
2. Version freedom — the AI SDK and provider packages evolve quickly; pinning lets consumers control upgrades.
3. Lazy loading on the server — createChatHandler resolves the right adapter at request time.

Let me organise that as a numbered list with a short code example for the install command.`;

export const Collapsed: Story = {
  render: () => (
    <div className="w-[520px]">
      <ReasoningTrace
        text={SAMPLE}
        durationMs={1820}
        summary="3 key reasons + concrete install snippet"
      />
    </div>
  ),
};

export const Expanded: Story = {
  render: () => (
    <div className="w-[520px]">
      <ReasoningTrace text={SAMPLE} durationMs={1820} defaultOpen />
    </div>
  ),
};

export const Live: Story = {
  render: () => {
    const [text, setText] = useState('');
    const [streaming, setStreaming] = useState(true);

    useEffect(() => {
      let i = 0;
      const tick = setInterval(() => {
        i += 6;
        setText(SAMPLE.slice(0, i));
        if (i >= SAMPLE.length) {
          clearInterval(tick);
          setStreaming(false);
        }
      }, 40);
      return () => clearInterval(tick);
    }, []);

    return (
      <div className="w-[520px]">
        <ReasoningTrace text={text} streaming={streaming} defaultOpen />
      </div>
    );
  },
};

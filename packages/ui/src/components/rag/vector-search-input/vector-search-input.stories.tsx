import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { VectorSearchInput } from './vector-search-input.js';

const meta = {
  title: 'AI · RAG/VectorSearchInput',
  component: VectorSearchInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof VectorSearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [last, setLast] = useState<string | null>(null);
    return (
      <div className="flex w-[520px] flex-col gap-3">
        <VectorSearchInput
          defaultValue="when does the fiscal year end?"
          onSubmit={(query, opts) => {
            setLast(`${query} · ${JSON.stringify(opts)}`);
          }}
        />
        {last && <p className="text-muted-foreground font-mono text-[11px]">last submit: {last}</p>}
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => (
    <div className="w-[520px]">
      <VectorSearchInput
        defaultValue="when does the fiscal year end?"
        defaultTopK={8}
        defaultThreshold={0.3}
        defaultReranker
        loading
      />
    </div>
  ),
};

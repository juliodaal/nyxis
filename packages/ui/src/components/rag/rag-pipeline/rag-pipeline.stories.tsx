import type { Meta, StoryObj } from '@storybook/react';
import { RAGPipeline } from './rag-pipeline.js';
import type { RAGStage } from '@nyxis/core';

const meta = {
  title: 'AI · RAG/RAGPipeline',
  component: RAGPipeline,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof RAGPipeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const STAGES: RAGStage[] = [
  {
    id: 'embed',
    name: 'Embed query',
    description: 'text-embedding-3-large · 3072 dims',
    status: 'done',
    durationMs: 92,
  },
  {
    id: 'retrieve',
    name: 'Retrieve',
    description: 'Postgres + pgvector, k = 20',
    status: 'done',
    durationMs: 41,
    count: 20,
  },
  {
    id: 'rerank',
    name: 'Rerank',
    description: 'Cohere rerank-v3.5',
    status: 'running',
    count: 8,
  },
  {
    id: 'generate',
    name: 'Generate',
    description: 'claude-sonnet-4-5 · streaming',
    status: 'pending',
  },
];

export const Horizontal: Story = {
  render: () => (
    <div className="w-[820px]">
      <RAGPipeline stages={STAGES} orientation="horizontal" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="w-[360px]">
      <RAGPipeline stages={STAGES} orientation="vertical" />
    </div>
  ),
};

export const Errored: Story = {
  render: () => (
    <div className="w-[820px]">
      <RAGPipeline
        stages={[
          { ...STAGES[0]! },
          { ...STAGES[1]! },
          {
            ...STAGES[2]!,
            status: 'errored',
            detail: 'rerank API returned 429',
          },
          STAGES[3]!,
        ]}
      />
    </div>
  ),
};

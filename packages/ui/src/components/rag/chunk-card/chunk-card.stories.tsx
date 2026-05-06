import type { Meta, StoryObj } from '@storybook/react';
import { ChunkCard } from './chunk-card.js';
import type { RetrievedChunk } from '../../../ai/types.js';

const meta = {
  title: 'AI · RAG/ChunkCard',
  component: ChunkCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ChunkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE: RetrievedChunk = {
  id: 'doc-12-§4.2',
  source: 'employee-handbook.md',
  locator: '§4.2',
  rank: 1,
  score: 0.71,
  rerankScore: 0.94,
  text: 'The fiscal year ends on March 31. All quarterly reports must be submitted no later than ten business days after each quarter close, and a parallel review by audit and finance is required before release.',
  metadata: {
    collection: 'hr-corpus',
    docType: 'policy',
    lang: 'en',
    updated: '2026-01-15',
  },
};

export const Default: Story = {
  render: () => (
    <div className="w-[560px]">
      <ChunkCard chunk={SAMPLE} />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="flex w-[560px] flex-col gap-2">
      <ChunkCard chunk={SAMPLE} compact />
      <ChunkCard
        chunk={{
          ...SAMPLE,
          id: 'doc-12-§4.3',
          locator: '§4.3',
          rank: 2,
          score: 0.62,
          rerankScore: 0.58,
          text: 'Audit findings must be logged into the central tracker within five business days of identification.',
        }}
        compact
      />
      <ChunkCard
        chunk={{
          ...SAMPLE,
          id: 'doc-7-p3',
          source: 'finance-2025-Q4-review.pdf',
          locator: 'page 3',
          rank: 3,
          score: 0.42,
          text: 'Quarterly cadence remains unchanged: ten-day reporting window, parallel review by audit and finance.',
        }}
        compact
      />
    </div>
  ),
};

export const Selected: Story = {
  render: () => (
    <div className="w-[560px]">
      <ChunkCard chunk={SAMPLE} selected onSelect={(id) => alert(`open ${id}`)} />
    </div>
  ),
};

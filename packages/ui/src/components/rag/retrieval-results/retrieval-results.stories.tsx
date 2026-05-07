import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RetrievalResults } from './retrieval-results.js';
import type { RetrievedChunk } from '@nyxis/core';

const meta = {
  title: 'AI · RAG/RetrievalResults',
  component: RetrievalResults,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof RetrievalResults>;

export default meta;
type Story = StoryObj<typeof meta>;

const CHUNKS: RetrievedChunk[] = [
  {
    id: '1',
    source: 'employee-handbook.md',
    locator: '§4.2',
    rank: 1,
    score: 0.71,
    rerankScore: 0.94,
    text: 'The fiscal year ends on March 31. All quarterly reports must be submitted no later than ten business days after each quarter close.',
  },
  {
    id: '2',
    source: 'finance-2025-Q4-review.pdf',
    locator: 'page 3',
    rank: 2,
    score: 0.68,
    rerankScore: 0.86,
    text: 'Quarterly cadence remains unchanged: ten-day reporting window, parallel review by audit and finance.',
  },
  {
    id: '3',
    source: 'employee-handbook.md',
    locator: '§4.3',
    rank: 3,
    score: 0.62,
    rerankScore: 0.58,
    text: 'Audit findings must be logged into the central tracker within five business days of identification.',
  },
  {
    id: '4',
    source: 'sox-controls-matrix.xlsx',
    locator: 'row 412',
    rank: 4,
    score: 0.42,
    rerankScore: 0.31,
    text: 'Control SOX-412: monthly reconciliation evidence stored in the GRC vault.',
  },
  {
    id: '5',
    source: 'finance-onboarding.md',
    locator: '§2.1',
    rank: 5,
    score: 0.38,
    rerankScore: 0.22,
    text: 'New finance team members complete the SOX awareness module in their first week.',
  },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState<string | undefined>(undefined);
    return (
      <div className="w-[640px]">
        <RetrievalResults
          chunks={CHUNKS}
          query="When does the fiscal year end and how are quarterly reports submitted?"
          activeId={active}
          onSelect={setActive}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <div className="w-[640px]">
      <RetrievalResults chunks={[]} query="some unrelated query" />
    </div>
  ),
};

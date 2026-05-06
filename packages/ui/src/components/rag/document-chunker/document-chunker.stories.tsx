import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DocumentChunker, type DocumentChunk } from './document-chunker.js';

const meta = {
  title: 'AI · RAG/DocumentChunker',
  component: DocumentChunker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof DocumentChunker>;

export default meta;
type Story = StoryObj<typeof meta>;

const SOURCE = `# Fiscal year and reporting cadence

The fiscal year ends on March 31. All quarterly reports must be submitted no later than ten business days after each quarter close. Parallel review by audit and finance is required before release.

Audit findings must be logged into the central tracker within five business days of identification. Findings are triaged by severity (S0–S3) and assigned an owner.

New finance team members complete the SOX awareness module in their first week. The module is also re-administered annually as part of the compliance refresh.`;

// Simple word-boundary chunker producing ~3 chunks for demo purposes.
const CHUNKS: DocumentChunk[] = [
  { id: 'c1', start: 0, end: SOURCE.indexOf('Audit findings') },
  {
    id: 'c2',
    start: SOURCE.indexOf('Audit findings'),
    end: SOURCE.indexOf('New finance team members'),
  },
  { id: 'c3', start: SOURCE.indexOf('New finance team members'), end: SOURCE.length },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState<string | undefined>(undefined);
    return (
      <div className="w-[680px]">
        <DocumentChunker
          text={SOURCE}
          chunks={CHUNKS}
          activeId={active}
          onSelect={(c) => setActive(c.id)}
        />
      </div>
    );
  },
};

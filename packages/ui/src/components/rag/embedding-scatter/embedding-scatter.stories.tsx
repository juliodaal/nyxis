import type { Meta, StoryObj } from '@storybook/react';
import { EmbeddingScatter } from './embedding-scatter.js';
import type { EmbeddingPoint } from '../../../ai/types.js';

const meta = {
  title: 'AI · RAG/EmbeddingScatter',
  component: EmbeddingScatter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof EmbeddingScatter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate three loose clusters for demo purposes.
function generate(): EmbeddingPoint[] {
  const out: EmbeddingPoint[] = [];
  const clusters = [
    { name: 'finance', cx: 0.25, cy: 0.7, count: 14 },
    { name: 'hr', cx: 0.7, cy: 0.6, count: 12 },
    { name: 'engineering', cx: 0.5, cy: 0.25, count: 16 },
  ];
  let id = 0;
  for (const c of clusters) {
    for (let i = 0; i < c.count; i++) {
      const dx = (Math.random() - 0.5) * 0.18;
      const dy = (Math.random() - 0.5) * 0.18;
      out.push({
        id: `pt-${id++}`,
        label: `${c.name} chunk ${i + 1}`,
        group: c.name,
        x: c.cx + dx,
        y: c.cy + dy,
      });
    }
  }
  return out;
}

const POINTS = generate();

export const Default: Story = {
  render: () => (
    <div className="w-[520px]">
      <EmbeddingScatter points={POINTS} legendLabel="UMAP projection · 42 chunks · 3 collections" />
    </div>
  ),
};

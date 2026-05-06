import type { Meta, StoryObj } from '@storybook/react';
import { EvalRunCard } from './eval-run-card.js';
import type { EvalRun } from '../../../ai/types.js';

const meta = {
  title: 'AI · Prompts/EvalRunCard',
  component: EvalRunCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof EvalRunCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const COMPLETED: EvalRun = {
  id: '1',
  name: 'summarise-pr v2.1 · golden-100',
  status: 'completed',
  promptName: 'summarise-pr',
  modelId: 'claude-sonnet-4-5',
  datasetName: 'golden-100',
  totalRows: 100,
  processedRows: 100,
  durationMs: 184_000,
  metrics: [
    { name: 'accuracy', value: 0.842, baseline: 0.78, goodDirection: 'up', precision: 3 },
    { name: 'latency p95', value: 175, unit: 'ms', baseline: 240, goodDirection: 'down' },
    {
      name: 'cost',
      value: 0.0124,
      unit: '$',
      baseline: 0.014,
      goodDirection: 'down',
      precision: 4,
    },
  ],
};

const RUNNING: EvalRun = {
  id: '2',
  name: 'summarise-pr v2.2 · golden-100',
  status: 'running',
  promptName: 'summarise-pr',
  modelId: 'claude-sonnet-4-5',
  datasetName: 'golden-100',
  totalRows: 100,
  processedRows: 42,
  startedAt: new Date(Date.now() - 90_000).toISOString(),
};

const FAILED: EvalRun = {
  id: '3',
  name: 'extract-entities v0.4 · ner-eval',
  status: 'failed',
  promptName: 'extract-entities',
  modelId: 'gpt-4o',
  datasetName: 'ner-eval',
  totalRows: 50,
  processedRows: 18,
  durationMs: 22_000,
  error: 'Provider returned 429 — rate-limited after 18 rows.',
};

export const Completed: Story = {
  render: () => (
    <div className="w-[640px]">
      <EvalRunCard run={COMPLETED} onSelect={(id) => alert(`open ${id}`)} />
    </div>
  ),
};

export const Running: Story = {
  render: () => (
    <div className="w-[640px]">
      <EvalRunCard run={RUNNING} />
    </div>
  ),
};

export const Failed: Story = {
  render: () => (
    <div className="w-[640px]">
      <EvalRunCard run={FAILED} />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="flex w-[640px] flex-col gap-2">
      <EvalRunCard run={COMPLETED} compact />
      <EvalRunCard run={RUNNING} compact />
      <EvalRunCard run={FAILED} compact />
    </div>
  ),
};

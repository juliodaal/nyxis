import type { Meta, StoryObj } from '@storybook/react';
import { DatasetTable } from './dataset-table.js';
import type { EvalRow } from '../../../ai/types.js';

const meta = {
  title: 'AI · Prompts/DatasetTable',
  component: DatasetTable,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof DatasetTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS: EvalRow[] = [
  {
    id: '1',
    input: 'PR #42 — refactor: split chat barrel into per-component subpaths.',
    expected: '- Split chat barrel\n- Per-component subpaths\n- Tree-shaking improvement',
    actual: '- Split chat barrel\n- Per-component subpaths\n- Better tree-shaking',
    score: 0.94,
    status: 'pass',
    latencyMs: 420,
    costUsd: 0.0023,
  },
  {
    id: '2',
    input: 'PR #43 — fix: handle null adapter in createModel.',
    expected:
      '- Null adapter handling\n- Falls back to anthropic\n- Throws when no providers installed',
    actual: '- Null check on adapter\n- Defaults to anthropic\n- Errors gracefully',
    score: 0.78,
    status: 'pass',
    latencyMs: 380,
    costUsd: 0.0019,
  },
  {
    id: '3',
    input: 'PR #44 — feat: add tool execution log component.',
    expected: '- Tool execution timeline\n- Status icons\n- Args + result expandable',
    actual: '- New ToolExecutionLog\n- Includes timestamps and statuses',
    score: 0.62,
    status: 'pass',
    latencyMs: 510,
    costUsd: 0.0024,
  },
  {
    id: '4',
    input: 'PR #45 — chore: bump dependencies.',
    expected: '- Dependency upgrades\n- No breaking changes\n- CI passes',
    actual: 'Bumps several dependencies; no behaviour changes.',
    score: 0.41,
    status: 'fail',
    latencyMs: 290,
    costUsd: 0.0014,
    notes: 'Missing the "CI passes" bullet.',
  },
  {
    id: '5',
    input: 'PR #46 — docs: clarify peer-dep policy.',
    expected: '- Documents peer-dep policy\n- Lists optional providers\n- Explains lazy loading',
    actual: '- Adds peer-dep section to README\n- Mentions optional providers',
    score: 0.71,
    status: 'pass',
    latencyMs: 410,
    costUsd: 0.0021,
  },
  {
    id: '6',
    input: 'PR #47 — feat: add VisionInput dropzone.',
    expected: '- Drop, paste, camera input\n- File-type validation\n- Size cap',
    actual: '- Drop and paste support\n- Validates MIME type',
    score: 0.55,
    status: 'fail',
    latencyMs: 470,
    costUsd: 0.0022,
    notes: 'Missed camera capture.',
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-[720px]">
      <DatasetTable rows={ROWS} />
    </div>
  ),
};

export const NoExpected: Story = {
  render: () => (
    <div className="w-[720px]">
      <DatasetTable rows={ROWS} hideExpected />
    </div>
  ),
};

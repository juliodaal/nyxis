import type { Meta, StoryObj } from '@storybook/react';
import { ToolExecutionLog, type ToolExecution } from './tool-execution-log.js';

const meta = {
  title: 'AI · Tools/ToolExecutionLog',
  component: ToolExecutionLog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ToolExecutionLog>;

export default meta;
type Story = StoryObj<typeof meta>;

const NOW = new Date();
const seconds = (n: number) => new Date(NOW.getTime() - n * 1000);

const EXECUTIONS: ToolExecution[] = [
  {
    id: '4',
    name: 'search_documents',
    args: { query: 'streaming protocol', limit: 5 },
    status: 'running',
    startedAt: seconds(2),
  },
  {
    id: '3',
    name: 'fetch_url',
    args: { url: 'https://nyxis.dev/docs' },
    result: 'Nyxis is a React component library for AI products. 70+ components.',
    status: 'completed',
    startedAt: seconds(18),
    durationMs: 480,
  },
  {
    id: '2',
    name: 'execute_code',
    args: { language: 'js', code: 'return 2 + 2;' },
    error: 'Sandbox unreachable: timeout after 5000ms',
    status: 'errored',
    startedAt: seconds(34),
    durationMs: 5000,
  },
  {
    id: '1',
    name: 'list_models',
    args: {},
    result: { models: ['claude-sonnet-4-5', 'gpt-4o', 'gemini-1.5-pro'] },
    status: 'completed',
    startedAt: seconds(52),
    durationMs: 90,
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-[560px]">
      <ToolExecutionLog executions={EXECUTIONS} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="w-[560px]">
      <ToolExecutionLog executions={[]} />
    </div>
  ),
};

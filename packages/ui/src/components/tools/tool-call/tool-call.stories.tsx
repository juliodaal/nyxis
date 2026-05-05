import type { Meta, StoryObj } from '@storybook/react';
import { ToolCall } from './tool-call.js';

const meta = {
  title: 'AI · Tools/ToolCall',
  component: ToolCall,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ToolCall>;

export default meta;
type Story = StoryObj<typeof meta>;

const ARGS = {
  query: 'streaming chat protocol',
  filters: { lang: 'en', after: '2024-01-01' },
  limit: 5,
};

export const Pending: Story = {
  render: () => (
    <div className="w-[480px]">
      <ToolCall name="search_documents" args={ARGS} status="pending" />
    </div>
  ),
};

export const Running: Story = {
  render: () => (
    <div className="w-[480px]">
      <ToolCall name="search_documents" args={ARGS} status="running" defaultOpen />
    </div>
  ),
};

export const Completed: Story = {
  render: () => (
    <div className="w-[480px]">
      <ToolCall name="search_documents" args={ARGS} status="completed" durationMs={420} />
    </div>
  ),
};

export const Errored: Story = {
  render: () => (
    <div className="w-[480px]">
      <ToolCall name="search_documents" args={ARGS} status="errored" durationMs={120} />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="flex w-[480px] flex-col gap-1.5">
      <ToolCall name="search_documents" args={ARGS} status="completed" durationMs={380} compact />
      <ToolCall
        name="fetch_url"
        args={{ url: 'https://nyxis.dev' }}
        status="completed"
        durationMs={210}
        compact
      />
      <ToolCall name="execute_code" status="running" compact />
    </div>
  ),
};

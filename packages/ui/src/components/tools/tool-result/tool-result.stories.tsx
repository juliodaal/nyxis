import type { Meta, StoryObj } from '@storybook/react';
import { ToolResult } from './tool-result.js';

const meta = {
  title: 'AI · Tools/ToolResult',
  component: ToolResult,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ToolResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Json: Story = {
  render: () => (
    <div className="w-[520px]">
      <ToolResult
        label="search_documents"
        result={{
          hits: [
            { id: 'doc_1', title: 'Streaming chat architecture', score: 0.94 },
            { id: 'doc_2', title: 'Provider catalog', score: 0.88 },
          ],
          total: 2,
        }}
      />
    </div>
  ),
};

export const Text: Story = {
  render: () => (
    <div className="w-[520px]">
      <ToolResult
        label="summarise_url"
        result="The Nyxis library ships a streaming-first chat surface with a Vercel AI SDK adapter and lazy provider loading."
      />
    </div>
  ),
};

export const ImageResult: Story = {
  render: () => (
    <div className="w-[520px]">
      <ToolResult
        label="generate_image"
        result="https://images.unsplash.com/photo-1518770660439-4636190af475?w=640"
      />
    </div>
  ),
};

export const Errored: Story = {
  render: () => (
    <div className="w-[520px]">
      <ToolResult
        label="execute_code"
        error="ReferenceError: x is not defined\n  at Object.<anonymous> (/sandbox/main.ts:12:7)"
      />
    </div>
  ),
};

export const Truncated: Story = {
  render: () => (
    <div className="w-[520px]">
      <ToolResult
        label="fetch_url"
        result={'Lorem ipsum dolor sit amet. '.repeat(60)}
        truncate={200}
      />
    </div>
  ),
};

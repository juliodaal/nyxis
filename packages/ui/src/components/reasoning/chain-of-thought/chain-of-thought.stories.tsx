import type { Meta, StoryObj } from '@storybook/react';
import { ChainOfThought, type ChainStep } from './chain-of-thought.js';

const meta = {
  title: 'AI · Reasoning/ChainOfThought',
  component: ChainOfThought,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ChainOfThought>;

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS: ChainStep[] = [
  {
    id: '1',
    text: 'Plan: identify the three architectural choices behind peer-dep adapters',
    status: 'done',
  },
  {
    id: '2',
    text: 'Search the codebase for the createModel implementation',
    detail: 'Found in packages/ui/src/ai/adapters/create-model.ts',
    status: 'done',
  },
  {
    id: '3',
    text: 'Synthesise the answer as a numbered list with a code example',
    status: 'active',
  },
  {
    id: '4',
    text: 'Validate the example compiles against the Vercel AI SDK',
    status: 'pending',
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <ChainOfThought steps={STEPS} />
    </div>
  ),
};

export const Bare: Story = {
  render: () => (
    <div className="w-[420px]">
      <ChainOfThought steps={STEPS} bare />
    </div>
  ),
};

export const Errored: Story = {
  render: () => (
    <div className="w-[420px]">
      <ChainOfThought
        steps={[
          { id: '1', text: 'Open the connection', status: 'done' },
          { id: '2', text: 'Authenticate with the provider', status: 'done' },
          {
            id: '3',
            text: 'Stream tokens',
            detail: 'Connection closed by provider — quota exceeded',
            status: 'errored',
          },
        ]}
      />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { ConversationFork, type ForkNode } from './conversation-fork.js';

const meta = {
  title: 'AI · Chat/ConversationFork',
  component: ConversationFork,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ConversationFork>;

export default meta;
type Story = StoryObj<typeof meta>;

const TREE: ForkNode = {
  id: 'root',
  label: 'Why does Nyxis ship adapters as peer deps?',
  role: 'user',
  children: [
    {
      id: 'a1',
      label: 'Bundle size + version freedom + lazy server load.',
      role: 'assistant',
      children: [
        {
          id: 'a1-u1',
          label: 'Got it — show me the server-side example.',
          role: 'user',
          children: [
            {
              id: 'a1-u1-a1',
              label: "Use createChatHandler with anthropic('claude-sonnet-4-5').",
              role: 'assistant',
            },
          ],
        },
      ],
    },
    {
      id: 'a2',
      label: 'Bundle size, version freedom, and OPTIONAL adapter loading.',
      role: 'assistant',
    },
  ],
};

export const Default: Story = {
  render: () => (
    <div className="w-[480px]">
      <ConversationFork root={TREE} activeLeafId="a1-u1-a1" onSelect={(id) => alert(id)} />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ConversationSidebar, type ConversationItem } from './conversation-sidebar.js';

const meta = {
  title: 'AI · Chat/ConversationSidebar',
  component: ConversationSidebar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ConversationSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SEED: ConversationItem[] = [
  {
    id: '1',
    title: 'Onboarding flow review',
    snippet: 'Walk me through the new onboarding…',
    updatedAt: 'just now',
    pinned: true,
  },
  {
    id: '2',
    title: 'API spec for billing',
    snippet: "Here's the OpenAPI definition…",
    updatedAt: '2h ago',
    unread: 3,
  },
  {
    id: '3',
    title: 'Q3 retrospective notes',
    snippet: 'Summarise what went well…',
    updatedAt: 'Mon',
  },
  {
    id: '4',
    title: 'Marketing copy draft',
    snippet: '…',
    updatedAt: 'Last week',
  },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('1');
    return (
      <div className="bg-background flex h-screen">
        <ConversationSidebar
          conversations={SEED}
          activeId={active}
          onSelect={setActive}
          onNew={() => alert('new conversation')}
        />
        <main className="text-muted-foreground flex-1 p-6 text-sm">
          Conversation #{active} content goes here.
        </main>
      </div>
    );
  },
};

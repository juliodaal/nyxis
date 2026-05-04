import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessage } from './chat-message.js';

const meta = {
  title: 'Domain Patterns/ChatMessage',
  component: ChatMessage,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ChatMessage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Conversation: Story = {
  render: () => (
    <div className="flex w-[460px] flex-col gap-4">
      <ChatMessage role="user" timestamp="14:02">
        When does the fiscal year end?
      </ChatMessage>
      <ChatMessage role="assistant" timestamp="14:02">
        The fiscal year ends on March 31. Quarterly reports are due within ten business days of each
        quarter close.
      </ChatMessage>
      <ChatMessage role="assistant" streaming>
        Compiling source citations
      </ChatMessage>
      <ChatMessage role="system">Conversation closed by user.</ChatMessage>
    </div>
  ),
};

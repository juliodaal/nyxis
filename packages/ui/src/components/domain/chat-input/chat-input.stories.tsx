import type { Meta, StoryObj } from '@storybook/react';
import { ChatInput } from './chat-input.js';

const meta = {
  title: 'Domain Patterns/ChatInput',
  component: ChatInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ChatInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[480px]">
      <ChatInput attachments onSubmit={(v) => alert(v)} />
    </div>
  ),
};

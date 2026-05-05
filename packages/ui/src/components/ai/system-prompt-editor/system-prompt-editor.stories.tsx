import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SystemPromptEditor } from './system-prompt-editor.js';

const meta = {
  title: 'AI · Models & Providers/SystemPromptEditor',
  component: SystemPromptEditor,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SystemPromptEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState(
      'You are a senior support engineer named {{agent_name}}.\n\nReply only with information from the {{knowledge_base}} corpus. If unsure, say so and offer to escalate.',
    );
    return (
      <div className="w-[480px]">
        <SystemPromptEditor value={v} onValueChange={setV} />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <div className="w-[480px]">
        <SystemPromptEditor value={v} onValueChange={setV} />
      </div>
    );
  },
};

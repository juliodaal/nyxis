import type { Meta, StoryObj } from '@storybook/react';
import { SkillAuthStatus } from './skill-auth-status.js';

const meta = {
  title: 'AI · Skills/SkillAuthStatus',
  component: SkillAuthStatus,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SkillAuthStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-3">
      <SkillAuthStatus state="connected" onDisconnect={() => alert('disconnect')} />
      <SkillAuthStatus state="expired" onConnect={() => alert('reconnect')} />
      <SkillAuthStatus state="needs-reauth" onConnect={() => alert('reauth')} />
      <SkillAuthStatus state="never" onConnect={() => alert('connect')} />
      <SkillAuthStatus state="errored" onConnect={() => alert('retry')} />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <SkillAuthStatus state="connected" compact />
      <SkillAuthStatus state="expired" compact />
      <SkillAuthStatus state="needs-reauth" compact />
      <SkillAuthStatus state="never" compact />
      <SkillAuthStatus state="errored" compact />
    </div>
  ),
};

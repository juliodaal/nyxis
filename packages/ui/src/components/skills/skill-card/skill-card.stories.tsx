import type { Meta, StoryObj } from '@storybook/react';
import { SkillCard } from './skill-card.js';
import type { Skill } from '@nyxis/core';

const meta = {
  title: 'AI · Skills/SkillCard',
  component: SkillCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SkillCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const CALENDAR: Skill = {
  id: 'gcal',
  name: 'Google Calendar',
  description: 'Read events, schedule meetings, and check availability across calendars.',
  version: '2.4.0',
  author: 'nyxis-skills',
  initials: 'GC',
  status: 'enabled',
  authState: 'connected',
  category: 'productivity',
  tags: ['calendar', 'meetings', 'scheduling'],
  scopes: [
    { kind: 'read', resource: 'calendar' },
    { kind: 'write', resource: 'calendar' },
    { kind: 'read', resource: 'contacts' },
  ],
  lastUsedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
};

export const Default: Story = {
  render: () => (
    <div className="w-[480px]">
      <SkillCard skill={CALENDAR} toggleable onToggle={(id, on) => alert(`${id} → ${on}`)} />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="flex w-[480px] flex-col gap-2">
      <SkillCard skill={CALENDAR} compact />
      <SkillCard
        compact
        skill={{
          id: 'github',
          name: 'GitHub',
          description: 'Open issues, comment on PRs, and read repo metadata.',
          version: '1.8.2',
          initials: 'GH',
          status: 'disabled',
          authState: 'connected',
          scopes: [
            { kind: 'read', resource: 'repos' },
            { kind: 'write', resource: 'issues' },
          ],
        }}
      />
      <SkillCard
        compact
        skill={{
          id: 'slack',
          name: 'Slack',
          description: 'Send messages and read channel context for the assistant.',
          version: '0.9.1',
          initials: 'SL',
          status: 'errored',
          authState: 'expired',
          scopes: [
            { kind: 'read', resource: 'messages' },
            { kind: 'write', resource: 'messages' },
          ],
        }}
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[480px]">
      <SkillCard
        skill={{ ...CALENDAR, status: 'disabled' }}
        toggleable
        onToggle={() => undefined}
      />
    </div>
  ),
};

export const Errored: Story = {
  render: () => (
    <div className="w-[480px]">
      <SkillCard
        skill={{ ...CALENDAR, status: 'errored', authState: 'errored' }}
        toggleable
        onToggle={() => undefined}
      />
    </div>
  ),
};

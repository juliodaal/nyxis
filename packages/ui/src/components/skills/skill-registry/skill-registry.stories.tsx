import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SkillRegistry } from './skill-registry.js';
import type { Skill } from '@nyxis/core';

const meta = {
  title: 'AI · Skills/SkillRegistry',
  component: SkillRegistry,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SkillRegistry>;

export default meta;
type Story = StoryObj<typeof meta>;

const SKILLS: Skill[] = [
  {
    id: 'gcal',
    name: 'Google Calendar',
    description: 'Read events, schedule meetings, check availability.',
    version: '2.4.0',
    initials: 'GC',
    status: 'enabled',
    authState: 'connected',
    category: 'productivity',
    scopes: [
      { kind: 'read', resource: 'calendar' },
      { kind: 'write', resource: 'calendar' },
    ],
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Read repos, comment on PRs, open issues.',
    version: '1.8.2',
    initials: 'GH',
    status: 'enabled',
    authState: 'connected',
    category: 'dev',
    scopes: [
      { kind: 'read', resource: 'repos' },
      { kind: 'write', resource: 'issues' },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send and read messages across channels.',
    version: '0.9.1',
    initials: 'SL',
    status: 'enabled',
    authState: 'expired',
    category: 'productivity',
    scopes: [
      { kind: 'read', resource: 'messages' },
      { kind: 'write', resource: 'messages' },
    ],
  },
  {
    id: 'pg',
    name: 'Postgres',
    description: 'Read-only access to the analytics replica.',
    version: '3.0.0',
    initials: 'PG',
    status: 'disabled',
    authState: 'never',
    category: 'data',
    scopes: [{ kind: 'read', resource: 'database' }],
  },
  {
    id: 'sentry',
    name: 'Sentry',
    description: 'Search issues and track release health.',
    version: '1.2.4',
    initials: 'SE',
    status: 'disabled',
    authState: 'connected',
    category: 'dev',
    scopes: [{ kind: 'read', resource: 'issues' }],
  },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState<string | undefined>(undefined);
    return (
      <div className="w-[640px]">
        <SkillRegistry skills={SKILLS} activeId={active} onSelect={setActive} />
      </div>
    );
  },
};

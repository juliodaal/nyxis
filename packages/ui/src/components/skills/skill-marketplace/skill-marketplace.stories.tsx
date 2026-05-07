import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SkillMarketplace } from './skill-marketplace.js';
import type { Skill } from '@nyxis/core';

const meta = {
  title: 'AI · Skills/SkillMarketplace',
  component: SkillMarketplace,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SkillMarketplace>;

export default meta;
type Story = StoryObj<typeof meta>;

const CATALOG: Skill[] = [
  {
    id: 'gcal',
    name: 'Google Calendar',
    description: 'Read events, schedule meetings, and check availability across calendars.',
    version: '2.4.0',
    author: 'nyxis-skills',
    initials: 'GC',
    category: 'productivity',
    rating: 4.8,
    ratingCount: 1284,
    installs: 218_000,
    installed: true,
    scopes: [
      { kind: 'read', resource: 'calendar' },
      { kind: 'write', resource: 'calendar' },
    ],
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Read repos, open issues, comment on PRs, search code.',
    version: '1.8.2',
    author: 'nyxis-skills',
    initials: 'GH',
    category: 'dev',
    rating: 4.6,
    ratingCount: 902,
    installs: 145_000,
    scopes: [
      { kind: 'read', resource: 'repos' },
      { kind: 'write', resource: 'issues' },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send and read messages across channels and DMs.',
    version: '0.9.1',
    author: 'community',
    initials: 'SL',
    category: 'productivity',
    rating: 4.2,
    ratingCount: 412,
    installs: 38_400,
    scopes: [
      { kind: 'read', resource: 'messages' },
      { kind: 'write', resource: 'messages' },
    ],
  },
  {
    id: 'pg',
    name: 'Postgres',
    description: 'Read-only access to a Postgres database with safe schemas.',
    version: '3.0.0',
    author: 'data-team',
    initials: 'PG',
    category: 'data',
    rating: 4.9,
    ratingCount: 87,
    installs: 6_200,
    scopes: [{ kind: 'read', resource: 'database' }],
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Read and append to pages and databases.',
    version: '1.4.7',
    author: 'nyxis-skills',
    initials: 'NO',
    category: 'productivity',
    rating: 4.5,
    ratingCount: 612,
    installs: 64_000,
    scopes: [
      { kind: 'read', resource: 'pages' },
      { kind: 'write', resource: 'pages' },
    ],
  },
  {
    id: 'sentry',
    name: 'Sentry',
    description: 'Search issues, track release health, list recent regressions.',
    version: '1.2.4',
    author: 'community',
    initials: 'SE',
    category: 'dev',
    rating: 4.4,
    ratingCount: 188,
    installs: 9_400,
    scopes: [{ kind: 'read', resource: 'issues' }],
  },
];

export const Default: Story = {
  render: () => {
    const [installing, setInstalling] = useState<string | undefined>(undefined);
    return (
      <div className="w-[820px]">
        <SkillMarketplace
          skills={CATALOG}
          installingId={installing}
          onInstall={(id) => {
            setInstalling(id);
            setTimeout(() => setInstalling(undefined), 1500);
          }}
          onSelect={(id) => alert(`open ${id}`)}
        />
      </div>
    );
  },
};

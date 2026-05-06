import type { Meta, StoryObj } from '@storybook/react';
import { SkillInvocationLog } from './skill-invocation-log.js';
import type { SkillInvocation } from '../../../ai/types.js';

const meta = {
  title: 'AI · Skills/SkillInvocationLog',
  component: SkillInvocationLog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SkillInvocationLog>;

export default meta;
type Story = StoryObj<typeof meta>;

const NOW = new Date();
const ago = (s: number) => new Date(NOW.getTime() - s * 1000);

const ENTRIES: SkillInvocation[] = [
  {
    id: '5',
    skillId: 'gcal',
    skillName: 'Google Calendar',
    action: 'createEvent',
    status: 'running',
    startedAt: ago(2),
    input: { title: 'Sync with Maria', start: '2026-05-08T15:00:00Z', durationMin: 30 },
  },
  {
    id: '4',
    skillId: 'github',
    skillName: 'GitHub',
    action: 'commentOnPR',
    status: 'completed',
    startedAt: ago(40),
    durationMs: 312,
    input: { repo: 'juliodaal/nyxis', pr: 42, body: 'Approved.' },
    result: { id: 'comment_18271', url: 'https://github.com/juliodaal/nyxis/pull/42#…' },
  },
  {
    id: '3',
    skillId: 'slack',
    skillName: 'Slack',
    action: 'sendMessage',
    status: 'errored',
    startedAt: ago(120),
    durationMs: 4_200,
    error: 'token_expired — please reconnect Slack to continue.',
  },
  {
    id: '2',
    skillId: 'gcal',
    skillName: 'Google Calendar',
    action: 'listEvents',
    status: 'completed',
    startedAt: ago(420),
    durationMs: 180,
    input: { range: '2026-05-08' },
    result: { events: 4 },
  },
  {
    id: '1',
    skillId: 'github',
    skillName: 'GitHub',
    action: 'searchIssues',
    status: 'completed',
    startedAt: ago(900),
    durationMs: 240,
    input: { repo: 'juliodaal/nyxis', q: 'phase L' },
    result: { count: 3 },
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-[680px]">
      <SkillInvocationLog invocations={ENTRIES} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="w-[680px]">
      <SkillInvocationLog invocations={[]} />
    </div>
  ),
};

export const Limited: Story = {
  render: () => (
    <div className="w-[680px]">
      <SkillInvocationLog invocations={ENTRIES} limit={3} />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { SkillPermissions } from './skill-permissions.js';

const meta = {
  title: 'AI · Skills/SkillPermissions',
  component: SkillPermissions,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SkillPermissions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-3">
      <SkillPermissions
        scopes={[
          { kind: 'read', resource: 'files' },
          { kind: 'read', resource: 'calendar' },
          { kind: 'write', resource: 'email' },
          { kind: 'admin', resource: 'workspace' },
        ]}
      />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <SkillPermissions
      compact
      scopes={[
        { kind: 'read', resource: 'files' },
        { kind: 'write', resource: 'email' },
        { kind: 'admin', resource: 'workspace' },
      ]}
    />
  ),
};

export const Limited: Story = {
  render: () => (
    <div className="w-[420px]">
      <SkillPermissions
        limit={3}
        scopes={[
          { kind: 'read', resource: 'files' },
          { kind: 'read', resource: 'calendar' },
          { kind: 'read', resource: 'contacts' },
          { kind: 'write', resource: 'email' },
          { kind: 'write', resource: 'tasks' },
          { kind: 'admin', resource: 'workspace' },
        ]}
      />
    </div>
  ),
};

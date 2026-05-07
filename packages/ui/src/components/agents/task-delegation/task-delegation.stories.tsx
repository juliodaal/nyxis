import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TaskDelegation } from './task-delegation.js';
import type { DelegatedTask } from '@nyxis/core';

const meta = {
  title: 'AI · Agents/TaskDelegation',
  component: TaskDelegation,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TaskDelegation>;

export default meta;
type Story = StoryObj<typeof meta>;

const TASKS: DelegatedTask[] = [
  {
    id: 'root',
    title: 'Answer: why peer-dep adapters?',
    description: 'Research, draft, review, finalise.',
    status: 'in-progress',
    progress: 0.6,
    children: [
      {
        id: 'research',
        title: 'Research peer-dep architecture',
        agentName: 'Researcher',
        agentId: 'researcher',
        status: 'done',
        children: [
          {
            id: 'r-1',
            title: 'Search internal docs',
            agentName: 'Researcher',
            status: 'done',
          },
          {
            id: 'r-2',
            title: 'Fetch README + installation page',
            agentName: 'Researcher',
            status: 'done',
          },
          {
            id: 'r-3',
            title: 'Verify against source code',
            agentName: 'Researcher',
            status: 'done',
          },
        ],
      },
      {
        id: 'draft',
        title: 'Draft answer (3 reasons + example)',
        agentName: 'Writer',
        agentId: 'writer',
        status: 'in-progress',
        progress: 0.4,
      },
      {
        id: 'review',
        title: 'Review for accuracy and tone',
        agentName: 'Critic',
        agentId: 'critic',
        status: 'pending',
      },
      {
        id: 'finalise',
        title: 'Finalise + publish',
        status: 'blocked',
        description: 'Waiting on Critic approval.',
      },
    ],
  },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState<string>('draft');
    return (
      <div className="w-[480px]">
        <TaskDelegation tasks={TASKS} activeId={active} onSelect={(t) => setActive(t.id)} />
      </div>
    );
  },
};

export const Bare: Story = {
  render: () => (
    <div className="w-[480px]">
      <TaskDelegation tasks={TASKS} bare />
    </div>
  ),
};

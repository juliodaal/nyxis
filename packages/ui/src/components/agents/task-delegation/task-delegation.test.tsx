import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TaskDelegation } from './task-delegation.js';
import type { DelegatedTask } from '../../../ai/types.js';

const tasks: DelegatedTask[] = [
  {
    id: 't1',
    title: 'Plan the launch',
    status: 'in-progress',
    agentName: 'Rita',
    children: [
      { id: 't1a', title: 'Write the brief', status: 'done', agentName: 'Rita' },
      { id: 't1b', title: 'Draft the timeline', status: 'pending', agentName: 'Carl' },
    ],
  },
  {
    id: 't2',
    title: 'Ship the demo',
    status: 'errored',
    agentName: 'Quinn',
  },
];

describe('TaskDelegation', () => {
  it('renders all task titles in the hierarchy', () => {
    render(<TaskDelegation tasks={tasks} />);
    expect(screen.getByText('Plan the launch')).toBeInTheDocument();
    expect(screen.getByText('Write the brief')).toBeInTheDocument();
    expect(screen.getByText('Draft the timeline')).toBeInTheDocument();
    expect(screen.getByText('Ship the demo')).toBeInTheDocument();
  });

  it('renders agent chips for assigned tasks', () => {
    render(<TaskDelegation tasks={tasks} />);
    // Rita is assigned on more than one node (root + sub-task) — accept ≥1.
    expect(screen.getAllByText('@Rita').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('@Carl')).toBeInTheDocument();
    expect(screen.getByText('@Quinn')).toBeInTheDocument();
  });

  it('fires onSelect with the full task object on row click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TaskDelegation tasks={tasks} onSelect={onSelect} />);
    await user.click(screen.getByText('Ship the demo'));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 't2', title: 'Ship the demo' }),
    );
  });

  it('renders the in-progress spinner via animate-spin class', () => {
    const { container } = render(<TaskDelegation tasks={tasks} />);
    expect(container.querySelector('.animate-spin')).not.toBeNull();
  });

  it('removes outer card wrapper when bare', () => {
    const { container } = render(<TaskDelegation tasks={tasks} bare />);
    // bare={false} adds `border` and `bg-card` to the wrapper; bare={true} doesn't.
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).not.toMatch(/\bborder\b/);
    expect(wrapper.className).not.toMatch(/bg-card/);
  });
});

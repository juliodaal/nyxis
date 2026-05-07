import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AgentRoster } from './agent-roster.js';
import type { Agent } from '@nyxis/core';

const agents: Agent[] = [
  { id: 'a1', name: 'Researcher Rita', role: 'Search', status: 'thinking' },
  { id: 'a2', name: 'Coder Carl', role: 'Implement', status: 'working' },
  { id: 'a3', name: 'QA Quinn', role: 'Verify', status: 'idle' },
];

describe('AgentRoster', () => {
  it('renders all agents and the count', () => {
    render(<AgentRoster agents={agents} />);
    expect(screen.getByText('Researcher Rita')).toBeInTheDocument();
    expect(screen.getByText('Coder Carl')).toBeInTheDocument();
    expect(screen.getByText('QA Quinn')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('filters by search query', async () => {
    const user = userEvent.setup();
    render(<AgentRoster agents={agents} />);
    await user.type(screen.getByPlaceholderText(/Search agents/i), 'Carl');
    expect(screen.getByText('Coder Carl')).toBeInTheDocument();
    expect(screen.queryByText('Researcher Rita')).not.toBeInTheDocument();
  });

  it('filters by status pill', async () => {
    const user = userEvent.setup();
    const { container } = render(<AgentRoster agents={agents} />);
    // The status filter buttons each contain a compact AgentStatusBadge with
    // data-status. Find the badge for 'working' and click its parent <button>.
    const workingBadge = container.querySelector(
      'header + div [data-status="working"]',
    ) as HTMLElement | null;
    expect(workingBadge).not.toBeNull();
    const pillButton = workingBadge!.closest('button')!;
    await user.click(pillButton);
    expect(screen.getByText('Coder Carl')).toBeInTheDocument();
    expect(screen.queryByText('QA Quinn')).not.toBeInTheDocument();
  });

  it('renders both list and grid layouts', () => {
    const { rerender, container } = render(<AgentRoster agents={agents} layout="list" />);
    expect(container.querySelector('.flex.flex-col.gap-1\\.5')).not.toBeNull();
    rerender(<AgentRoster agents={agents} layout="grid" />);
    expect(container.querySelector('.grid')).not.toBeNull();
  });

  it('renders empty state when there are no agents', () => {
    render(<AgentRoster agents={[]} />);
    expect(screen.getByText(/No agents in this roster yet/i)).toBeInTheDocument();
  });
});

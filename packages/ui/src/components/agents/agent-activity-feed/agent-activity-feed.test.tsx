import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AgentActivityFeed } from './agent-activity-feed.js';
import type { AgentActivity } from '../../../ai/types.js';

const ts = new Date('2025-01-01T12:00:00Z');

const activities: AgentActivity[] = [
  {
    id: 'e1',
    agentId: 'a1',
    agentName: 'Rita',
    kind: 'thought',
    summary: 'Considering options',
    detail: 'Branch A vs Branch B',
    timestamp: ts,
  },
  {
    id: 'e2',
    agentId: 'a1',
    agentName: 'Rita',
    kind: 'tool-call',
    summary: 'Searched the web',
    timestamp: ts,
  },
  {
    id: 'e3',
    agentId: 'a2',
    agentName: 'Carl',
    kind: 'error',
    summary: 'Compile failed',
    timestamp: ts,
  },
];

describe('AgentActivityFeed', () => {
  it('renders all activities with their summaries', () => {
    render(<AgentActivityFeed activities={activities} />);
    expect(screen.getByText('Considering options')).toBeInTheDocument();
    expect(screen.getByText('Searched the web')).toBeInTheDocument();
    expect(screen.getByText('Compile failed')).toBeInTheDocument();
  });

  it('attaches kind labels via aria-label on the icon container', () => {
    render(<AgentActivityFeed activities={activities} />);
    expect(screen.getByLabelText('thought')).toBeInTheDocument();
    expect(screen.getByLabelText('tool')).toBeInTheDocument();
    expect(screen.getByLabelText('error')).toBeInTheDocument();
  });

  it('expands to reveal detail payload on click', async () => {
    const user = userEvent.setup();
    render(<AgentActivityFeed activities={activities} />);
    const trigger = screen.getByRole('button', { name: /Considering options/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Branch A vs Branch B')).toBeInTheDocument();
  });

  it('shows the empty state when no activities', () => {
    render(<AgentActivityFeed activities={[]} />);
    expect(screen.getByText(/No agent activity yet/i)).toBeInTheDocument();
  });

  it('shows a +N earlier footer when limit < activities', () => {
    render(<AgentActivityFeed activities={activities} limit={1} />);
    expect(screen.getByText(/\+ 2 earlier event/)).toBeInTheDocument();
  });
});

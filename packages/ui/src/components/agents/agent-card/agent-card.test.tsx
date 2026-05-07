import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AgentCard } from './agent-card.js';
import type { Agent } from '../../../ai/types.js';

const baseAgent: Agent = {
  id: 'agent-1',
  name: 'Ada Lovelace',
  role: 'Research Specialist',
  modelId: 'claude-sonnet-4-5',
  status: 'thinking',
  tools: ['web-search', 'calc', 'memory'],
};

describe('AgentCard', () => {
  it('renders name, role, model id, and tool chips', () => {
    render(<AgentCard agent={baseAgent} />);
    expect(screen.getByRole('heading', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getByText('Research Specialist')).toBeInTheDocument();
    expect(screen.getByText('claude-sonnet-4-5')).toBeInTheDocument();
    for (const tool of baseAgent.tools!) {
      expect(screen.getByText(tool)).toBeInTheDocument();
    }
  });

  it('renders avatar fallback initials when no avatarUrl', () => {
    render(<AgentCard agent={baseAgent} />);
    // "Ada Lovelace" → "AL"
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('fires onSelect with id on click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<AgentCard agent={baseAgent} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: /Ada Lovelace/i }));
    expect(onSelect).toHaveBeenCalledWith('agent-1');
  });

  it('activates via keyboard (Enter / Space)', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<AgentCard agent={baseAgent} onSelect={onSelect} />);
    const card = screen.getByRole('button', { name: /Ada Lovelace/i });
    card.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('reflects selected styling via aria-pressed and data attribute', () => {
    render(<AgentCard agent={baseAgent} onSelect={() => {}} selected />);
    const card = screen.getByRole('button', { name: /Ada Lovelace/i });
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(card).toHaveAttribute('data-selected');
  });
});

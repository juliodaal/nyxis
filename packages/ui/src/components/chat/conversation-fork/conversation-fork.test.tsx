import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ConversationFork } from './conversation-fork.js';
import type { ForkNode } from './conversation-fork.js';

const TREE: ForkNode = {
  id: 'root',
  label: 'Why peer deps?',
  role: 'user',
  children: [
    {
      id: 'a1',
      label: 'Bundle size + version freedom.',
      role: 'assistant',
      children: [{ id: 'a1-u1', label: 'Got it.', role: 'user' }],
    },
    {
      id: 'a2',
      label: 'Optional adapter loading.',
      role: 'assistant',
    },
  ],
};

describe('ConversationFork', () => {
  it('renders the root node label', () => {
    render(<ConversationFork root={TREE} />);
    expect(screen.getByText(/Why peer deps/)).toBeInTheDocument();
  });

  it('renders all branch labels', () => {
    render(<ConversationFork root={TREE} />);
    expect(screen.getByText(/Bundle size/)).toBeInTheDocument();
    expect(screen.getByText(/Got it/)).toBeInTheDocument();
    expect(screen.getByText(/Optional adapter loading/)).toBeInTheDocument();
  });

  it('uses role=tree on the outer container', () => {
    render(<ConversationFork root={TREE} />);
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  it('fires onSelect with the clicked node id', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<ConversationFork root={TREE} onSelect={onSelect} />);
    await user.click(screen.getByText(/Bundle size/));
    expect(onSelect).toHaveBeenCalledWith('a1');
  });
});

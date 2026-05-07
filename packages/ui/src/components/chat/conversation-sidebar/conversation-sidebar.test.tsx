import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ConversationSidebar } from './conversation-sidebar.js';
import type { ConversationItem } from './conversation-sidebar.js';

const ITEMS: ConversationItem[] = [
  {
    id: '1',
    title: 'Streaming chat',
    updatedAt: '2m ago',
    snippet: 'And on the server…',
    pinned: true,
  },
  {
    id: '2',
    title: 'Provider catalog',
    updatedAt: '1h ago',
    snippet: 'The catalog has every model…',
    unread: 2,
  },
  { id: '3', title: 'Tool calls with type-safe schemas', updatedAt: 'Yesterday' },
];

describe('ConversationSidebar', () => {
  it('renders all conversations', () => {
    render(<ConversationSidebar conversations={ITEMS} />);
    expect(screen.getByText('Streaming chat')).toBeInTheDocument();
    expect(screen.getByText('Provider catalog')).toBeInTheDocument();
    expect(screen.getByText('Tool calls with type-safe schemas')).toBeInTheDocument();
  });

  it('marks the active conversation with aria-current', () => {
    render(<ConversationSidebar conversations={ITEMS} activeId="2" onSelect={() => undefined} />);
    const buttons = screen.getAllByRole('button');
    const active = buttons.find((b) => b.getAttribute('aria-current') === 'true');
    expect(active?.textContent).toMatch(/Provider catalog/);
  });

  it('fires onSelect with the picked id', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<ConversationSidebar conversations={ITEMS} onSelect={onSelect} />);
    await user.click(screen.getByText('Provider catalog'));
    expect(onSelect).toHaveBeenCalledWith('2');
  });

  it('filters via the search input', () => {
    render(<ConversationSidebar conversations={ITEMS} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'tool' } });
    expect(screen.queryByText('Provider catalog')).not.toBeInTheDocument();
    expect(screen.getByText('Tool calls with type-safe schemas')).toBeInTheDocument();
  });

  it('fires onNew on the new-conversation button', async () => {
    const onNew = vi.fn();
    const user = userEvent.setup();
    render(<ConversationSidebar conversations={ITEMS} onNew={onNew} />);
    await user.click(screen.getByRole('button', { name: /new conversation|new chat/i }));
    expect(onNew).toHaveBeenCalledOnce();
  });

  it('shows the unread count badge', () => {
    render(<ConversationSidebar conversations={ITEMS} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

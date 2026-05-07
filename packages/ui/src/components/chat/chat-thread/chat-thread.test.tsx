import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ChatThread } from './chat-thread.js';
import type { AIMessage } from '@nyxis/core';

const SEED: AIMessage[] = [
  { id: '1', role: 'user', content: 'Hello there.' },
  { id: '2', role: 'assistant', content: 'How can I help?' },
];

describe('ChatThread', () => {
  it('renders all messages', () => {
    render(<ChatThread messages={SEED} markdown={false} />);
    expect(screen.getByText('Hello there.')).toBeInTheDocument();
    expect(screen.getByText('How can I help?')).toBeInTheDocument();
  });

  it('renders empty state when messages is empty', () => {
    render(<ChatThread messages={[]} emptyState={<div>Start chatting</div>} />);
    expect(screen.getByText('Start chatting')).toBeInTheDocument();
  });

  it('renders markdown by default for assistant messages', () => {
    render(<ChatThread messages={[{ id: '1', role: 'assistant', content: '**bold**' }]} />);
    expect(screen.getByText('bold').tagName.toLowerCase()).toBe('strong');
  });

  it('shows the typing indicator when streaming and last message is from user', () => {
    render(
      <ChatThread
        messages={[{ id: '1', role: 'user', content: 'hi' }]}
        streaming
        markdown={false}
      />,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

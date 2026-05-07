import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ChatMessage } from './chat-message.js';

describe('ChatMessage', () => {
  it('renders a user message body', () => {
    render(<ChatMessage role="user">Hello world</ChatMessage>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('aligns user messages right via flex-row-reverse', () => {
    const { container } = render(<ChatMessage role="user">Hi</ChatMessage>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toMatch(/flex-row-reverse/);
  });

  it('aligns assistant messages left (flex-row, not reverse)', () => {
    const { container } = render(<ChatMessage role="assistant">Hi</ChatMessage>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toMatch(/\bflex-row\b/);
    expect(root.className).not.toMatch(/flex-row-reverse/);
  });

  it('renders system role as a centered status bubble', () => {
    render(<ChatMessage role="system">Conversation closed</ChatMessage>);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Conversation closed');
    expect(status.className).toMatch(/mx-auto/);
  });

  it('renders the streaming cursor when streaming', () => {
    const { container } = render(
      <ChatMessage role="assistant" streaming>
        Thinking
      </ChatMessage>,
    );
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('renders the timestamp when supplied', () => {
    render(
      <ChatMessage role="user" timestamp="14:02">
        Hi
      </ChatMessage>,
    );
    expect(screen.getByText('14:02')).toBeInTheDocument();
  });
});

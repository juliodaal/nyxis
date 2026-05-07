'use client';

import { ArrowDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { ChatMessage } from '@/components/nyxis/chat-message';
import { TypingIndicator } from '@/components/nyxis/typing-indicator';
import { StreamingMarkdown } from '@/components/nyxis/streaming-markdown';
import type { AIMessage } from '@nyxis/core';

export interface ChatThreadProps {
  /** Conversation to render. */
  messages: readonly AIMessage[];
  /** True if the latest assistant turn is still streaming. */
  streaming?: boolean;
  /** Render markdown via `<StreamingMarkdown>` for assistant messages. */
  markdown?: boolean;
  /** Optional empty state when the thread is empty. */
  emptyState?: ReactNode;
  /** Optional pre-message slot rendered before the message list. */
  header?: ReactNode;
  /** Optional post-message slot rendered after the message list (e.g. `<TypingIndicator>` placement). */
  footer?: ReactNode;
  /** Disable the auto-scroll-to-bottom behaviour. */
  autoScroll?: boolean;
  className?: string;
}

/**
 * Scrollable conversation surface. Renders `<ChatMessage>` for each entry,
 * keeps the latest message in view while the user is "at the bottom",
 * and exposes a "scroll to latest" floating button when the user has
 * scrolled away from it.
 */
export function ChatThread({
  messages,
  streaming = false,
  markdown = true,
  emptyState,
  header,
  footer,
  autoScroll = true,
  className,
}: ChatThreadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [stickToBottom, setStickToBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Track whether the user is at the bottom.
  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceFromBottom < 24;
    setStickToBottom(atBottom);
    setShowScrollButton(!atBottom);
  };

  // When new messages arrive AND the user is at the bottom, follow them.
  useLayoutEffect(() => {
    if (!autoScroll || !stickToBottom) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, streaming]);

  // Force-scroll on first mount.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'end' });
  }, []);

  const isEmpty = messages.length === 0;

  return (
    <div className={cn('relative flex h-full min-h-0 flex-col', className)}>
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-6"
      >
        {header}
        {isEmpty && emptyState ? (
          <div className="flex h-full items-center justify-center">{emptyState}</div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.map((message, index) => {
              const isLast = index === messages.length - 1;
              const isStreaming = streaming && isLast && message.role === 'assistant';
              const body =
                markdown && message.role === 'assistant' ? (
                  <StreamingMarkdown text={message.content} streaming={isStreaming} />
                ) : (
                  message.content
                );
              return (
                <ChatMessage
                  key={message.id}
                  role={message.role === 'tool' ? 'system' : message.role}
                  streaming={isStreaming && !markdown}
                  {...(message.createdAt ? { timestamp: message.createdAt } : {})}
                >
                  {body}
                </ChatMessage>
              );
            })}
            {streaming &&
              messages.length > 0 &&
              messages[messages.length - 1]?.role !== 'assistant' && (
                <TypingIndicator label="Assistant is thinking" />
              )}
          </div>
        )}
        {footer}
        <div ref={endRef} />
      </div>

      {showScrollButton ? (
        <button
          type="button"
          onClick={() => {
            endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            setStickToBottom(true);
          }}
          aria-label="Scroll to latest"
          className="border-border bg-popover text-popover-foreground shadow-elevated hover:bg-muted absolute bottom-4 left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full border transition-colors"
        >
          <ArrowDown className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

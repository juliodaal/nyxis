'use client';

import { useChatThread, type AIMessage } from '@nyxis/core';
import { ArrowDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';

import { ChatMessage } from '@/components/nyxis/chat-message';
import { StreamingMarkdown } from '@/components/nyxis/streaming-markdown';
import { TypingIndicator } from '@/components/nyxis/typing-indicator';
import { cn } from '@/lib/utils';

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
 * Scrollable conversation surface. The decision logic for "stuck to
 * bottom" / "show scroll-to-latest button" lives in
 * `useChatThread` from `@nyxis/core`. The component still owns the
 * DOM refs and the actual `scrollIntoView` call — those are
 * framework-specific.
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
  const { stickToBottom, showScrollButton, recordScroll, pinToBottom } = useChatThread();

  const handleScroll = (): void => {
    const el = containerRef.current;
    if (!el) return;
    recordScroll({
      scrollTop: el.scrollTop,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    });
  };

  // When new messages arrive AND the user is at the bottom, follow them.
  useLayoutEffect(() => {
    if (!autoScroll || !stickToBottom) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: depend on length / streaming, not stickToBottom (closure)
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
        onScroll={handleScroll}
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
            pinToBottom();
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

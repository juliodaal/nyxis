'use client';

import { Bot, User } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ChatMessageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /** Conversation role. */
  role: 'user' | 'assistant' | 'system';
  /** Message body. Plain string or rich children. */
  children: ReactNode;
  /** Show a streaming indicator. */
  streaming?: boolean;
  /** Optional timestamp string. */
  timestamp?: string;
  /** Override the avatar. */
  avatar?: ReactNode;
}

/**
 * Chat message bubble for AI assistants and support copilots.
 * Distinguishes user, assistant, and system messages by tone and avatar.
 */
export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(function ChatMessage(
  { role, children, streaming = false, timestamp, avatar, className, ...props },
  ref,
) {
  const isUser = role === 'user';
  const isSystem = role === 'system';

  if (isSystem) {
    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          'bg-muted text-muted-foreground mx-auto rounded-md px-3 py-1.5 text-center text-xs',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        'flex w-full gap-3',
        isUser ? 'flex-row-reverse text-right' : 'flex-row',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-full text-xs font-medium',
          isUser ? 'bg-primary/10 text-primary' : 'bg-accent text-accent-foreground',
        )}
      >
        {avatar ?? (isUser ? <User className="size-4" /> : <Bot className="size-4" />)}
      </div>
      <div className={cn('flex max-w-[75%] flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-card-foreground border-border border',
          )}
        >
          {children}
          {streaming ? (
            <span
              aria-hidden="true"
              className="ml-1 inline-block h-3 w-0.5 animate-pulse bg-current align-middle"
            />
          ) : null}
        </div>
        {timestamp ? <span className="text-muted-foreground text-[10px]">{timestamp}</span> : null}
      </div>
    </div>
  );
});

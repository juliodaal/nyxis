'use client';

import { MessageSquare, Plus, Search } from 'lucide-react';
import { useMemo, useState, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface ConversationItem {
  id: string;
  title: string;
  /** Most recent activity, formatted for display. */
  updatedAt?: string;
  /** Optional 1-line snippet (last user message). */
  snippet?: string;
  /** Mark a conversation as pinned at the top of the list. */
  pinned?: boolean;
  /** Number of unread messages, if any. */
  unread?: number;
}

export interface ConversationSidebarProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'onSelect' | 'title'
> {
  /** Conversations to render. */
  conversations: readonly ConversationItem[];
  /** Currently selected conversation id. */
  activeId?: string;
  /** Called when the user picks a different conversation. */
  onSelect?: (id: string) => void;
  /** Called when the user clicks the "new conversation" button. */
  onNew?: () => void;
  /** Hide the search input. */
  hideSearch?: boolean;
  /** Header text. Default: "Conversations". */
  title?: string;
}

/**
 * Left-rail listing of past conversations with search and a "new chat"
 * affordance. Drop into a `<Sheet>` for mobile or a flex layout for
 * desktop.
 */
export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  hideSearch = false,
  title = 'Conversations',
  className,
  ...props
}: ConversationSidebarProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      if (c.title.toLowerCase().includes(q)) return true;
      if (c.snippet?.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [conversations, query]);

  // Pinned first.
  const ordered = useMemo(() => {
    return [...filtered].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  }, [filtered]);

  return (
    <aside
      aria-label="Conversation history"
      className={cn('border-border bg-background flex h-full w-72 flex-col border-r', className)}
      {...props}
    >
      <header className="border-border flex items-center justify-between gap-2 border-b px-3 py-3">
        <h2 className="text-foreground text-sm font-semibold">{title}</h2>
        {onNew ? (
          <button
            type="button"
            onClick={onNew}
            aria-label="New conversation"
            className="text-muted-foreground hover:bg-muted hover:text-foreground grid size-8 place-items-center rounded-md transition-colors"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </header>

      {!hideSearch && (
        <div className="border-border border-b p-2">
          <div className="border-input bg-background flex h-8 items-center gap-2 rounded-md border px-2 text-sm">
            <Search className="text-muted-foreground size-3.5" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations"
              className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-xs outline-none"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {ordered.length === 0 ? (
          <div className="text-muted-foreground flex h-full items-center justify-center px-4 text-center text-xs">
            No conversations yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5 p-2">
            {ordered.map((c) => {
              const active = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelect?.(c.id)}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors',
                      active
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <MessageSquare className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground truncate text-xs font-medium">
                          {c.title}
                        </span>
                        {c.pinned ? (
                          <span className="bg-primary/15 text-primary rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
                            pinned
                          </span>
                        ) : null}
                        {c.unread ? (
                          <span className="bg-primary text-primary-foreground ml-auto inline-flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
                            {c.unread > 9 ? '9+' : c.unread}
                          </span>
                        ) : null}
                      </div>
                      {c.snippet ? (
                        <p className="text-muted-foreground mt-0.5 truncate text-[11px]">
                          {c.snippet}
                        </p>
                      ) : null}
                      {c.updatedAt ? (
                        <p className="text-muted-foreground mt-0.5 text-[10px]">{c.updatedAt}</p>
                      ) : null}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

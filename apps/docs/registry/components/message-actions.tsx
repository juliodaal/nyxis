'use client';

import { Copy, GitBranch, Pencil, RotateCw, Share2, Trash2 } from 'lucide-react';
import { useState, type HTMLAttributes, type MouseEvent } from 'react';

import { cn } from '@/lib/utils';

export type MessageAction = 'copy' | 'regenerate' | 'edit' | 'delete' | 'fork' | 'share';

export interface MessageActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Which actions to show. Default: all six. */
  actions?: readonly MessageAction[];
  /** Text to copy when the user clicks copy. */
  text?: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onFork?: () => void;
  onShare?: () => void;
  /** Compact ghost row vs solid floating panel. */
  variant?: 'ghost' | 'panel';
}

const ACTION_DEFS: Record<MessageAction, { icon: typeof Copy; label: string }> = {
  copy: { icon: Copy, label: 'Copy' },
  regenerate: { icon: RotateCw, label: 'Regenerate' },
  edit: { icon: Pencil, label: 'Edit' },
  delete: { icon: Trash2, label: 'Delete' },
  fork: { icon: GitBranch, label: 'Fork conversation' },
  share: { icon: Share2, label: 'Share' },
};

/**
 * Hover-revealed row of icon buttons that act on a single chat message.
 * Designed to live inside `<ChatMessage>`'s footer slot, but can be
 * embedded anywhere.
 */
export function MessageActions({
  actions = ['copy', 'regenerate', 'edit', 'delete', 'fork', 'share'],
  text,
  onCopy,
  onRegenerate,
  onEdit,
  onDelete,
  onFork,
  onShare,
  variant = 'ghost',
  className,
  ...props
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const handle = async (action: MessageAction, event: MouseEvent) => {
    event.stopPropagation();
    if (action === 'copy') {
      if (text) {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard denied */
        }
      }
      onCopy?.();
      return;
    }
    if (action === 'regenerate') onRegenerate?.();
    if (action === 'edit') onEdit?.();
    if (action === 'delete') onDelete?.();
    if (action === 'fork') onFork?.();
    if (action === 'share') onShare?.();
  };

  return (
    <div
      role="toolbar"
      aria-label="Message actions"
      className={cn(
        'inline-flex items-center gap-1',
        variant === 'panel' && 'border-border bg-popover shadow-elevated rounded-md border p-1',
        className,
      )}
      {...props}
    >
      {actions.map((action) => {
        const def = ACTION_DEFS[action];
        const Icon = def.icon;
        const isCopy = action === 'copy';
        return (
          <button
            key={action}
            type="button"
            aria-label={isCopy && copied ? 'Copied' : def.label}
            onClick={(e) => handle(action, e)}
            className={cn(
              'text-muted-foreground grid size-7 place-items-center rounded-sm transition-colors',
              'hover:bg-muted hover:text-foreground',
              'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2',
              action === 'delete' && 'hover:bg-destructive/10 hover:text-destructive',
            )}
          >
            <Icon
              className={cn('size-3.5', isCopy && copied && 'text-success')}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

'use client';

import { Bot, FileText, Hash, Pencil, Tag } from 'lucide-react';
import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import type { Prompt } from '@nyxis/core';

export interface PromptCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Prompt to render. */
  prompt: Prompt;
  /** Compact one-line variant. */
  compact?: boolean;
  /** Click handler on the body (selection / open). */
  onSelect?: (id: string) => void;
  /** Highlight the card as currently selected. */
  selected?: boolean;
  /** Trailing slot (e.g. quick actions). */
  trailingSlot?: ReactNode;
}

/**
 * Card for a saved prompt template — surfaces name, description,
 * version, model, variable count, and tags. Pair as the row in any
 * prompt-library list.
 */
export function PromptCard({
  prompt,
  compact = false,
  onSelect,
  selected = false,
  trailingSlot,
  className,
  children,
  ...props
}: PromptCardProps) {
  const interactive = !!onSelect;
  const variableCount =
    prompt.variables?.length ?? prompt.body.match(/\{\{\s*[a-zA-Z_][\w.]*\s*\}\}/g)?.length ?? 0;

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onSelect ? () => onSelect(prompt.id) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(prompt.id);
              }
            }
          : undefined
      }
      data-selected={selected || undefined}
      aria-pressed={interactive ? selected : undefined}
      className={cn(
        'border-border bg-card flex flex-col gap-2 rounded-lg border p-3 text-left transition-colors',
        interactive &&
          'hover:bg-muted/40 focus-visible:ring-ring focus-visible:ring-offset-background cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'data-[selected]:border-primary/50 data-[selected]:bg-primary/5',
        compact && 'gap-1.5 p-2.5',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'bg-primary/15 text-primary grid shrink-0 place-items-center rounded-md',
            compact ? 'size-7' : 'size-9',
          )}
          aria-hidden
        >
          <FileText className={cn(compact ? 'size-3.5' : 'size-4')} aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                'text-foreground truncate font-semibold',
                compact ? 'text-xs' : 'text-sm',
              )}
            >
              {prompt.name}
            </h3>
            {prompt.version && (
              <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[10px]">
                v{prompt.version}
              </span>
            )}
          </div>

          {prompt.description && (
            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-[11px] leading-snug">
              {prompt.description}
            </p>
          )}

          {!compact && (
            <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-3 text-[10px]">
              {prompt.modelId && (
                <span className="inline-flex items-center gap-1 font-mono">
                  <Bot className="size-3" aria-hidden />
                  {prompt.modelId}
                </span>
              )}
              <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                <Hash className="size-3" aria-hidden />
                {variableCount} var{variableCount === 1 ? '' : 's'}
              </span>
              {prompt.updatedAt && (
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Pencil className="size-3" aria-hidden />
                  {formatRelative(prompt.updatedAt)}
                </span>
              )}
            </div>
          )}
        </div>

        {trailingSlot}
      </div>

      {!compact && prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <Tag className="text-muted-foreground size-3" aria-hidden />
          {prompt.tags.slice(0, 6).map((tag) => (
            <code
              key={tag}
              className="bg-muted text-foreground/80 rounded px-1.5 py-0.5 font-mono text-[10px]"
            >
              {tag}
            </code>
          ))}
          {prompt.tags.length > 6 && (
            <span className="text-muted-foreground text-[10px]">+{prompt.tags.length - 6}</span>
          )}
        </div>
      )}

      {children}
    </div>
  );
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diff = Date.now() - d.getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

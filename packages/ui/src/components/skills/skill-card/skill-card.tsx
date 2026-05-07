'use client';

import { Sparkles, User } from 'lucide-react';
import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import type { Skill } from '@nyxis/core';
import { SkillAuthStatus } from '../skill-auth-status/skill-auth-status.js';
import { SkillPermissions } from '../skill-permissions/skill-permissions.js';

export interface SkillCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect' | 'onToggle'
> {
  /** Skill to render. */
  skill: Skill;
  /** Compact one-line variant. */
  compact?: boolean;
  /** Click handler — opens the skill detail. */
  onSelect?: (id: string) => void;
  /** Currently selected. */
  selected?: boolean;
  /** Show the enable / disable toggle. */
  toggleable?: boolean;
  /** Called when the user toggles the skill. */
  onToggle?: (id: string, enabled: boolean) => void;
  /** Trailing slot (e.g. quick actions). */
  trailingSlot?: ReactNode;
}

/**
 * Card for a single skill. Surfaces icon, name, version, author,
 * description, scopes preview, auth pill, and a per-skill enable
 * toggle. Pair with `<SkillRegistry>` for the multi-skill list.
 */
export function SkillCard({
  skill,
  compact = false,
  onSelect,
  selected = false,
  toggleable = false,
  onToggle,
  trailingSlot,
  className,
  children,
  ...props
}: SkillCardProps) {
  const interactive = !!onSelect;
  const enabled = skill.status === 'enabled';

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onSelect ? () => onSelect(skill.id) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(skill.id);
              }
            }
          : undefined
      }
      data-status={skill.status}
      data-selected={selected || undefined}
      aria-pressed={interactive ? selected : undefined}
      className={cn(
        'border-border bg-card flex w-full flex-col gap-2 rounded-lg border p-3 text-left transition-colors',
        interactive &&
          'hover:bg-muted/40 focus-visible:ring-ring focus-visible:ring-offset-background cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'data-[selected]:border-primary/50 data-[selected]:bg-primary/5',
        skill.status === 'errored' && 'border-destructive/30',
        compact && 'gap-1.5 p-2.5',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <SkillIcon skill={skill} compact={compact} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                'text-foreground truncate font-semibold',
                compact ? 'text-xs' : 'text-sm',
              )}
            >
              {skill.name}
            </h3>
            {skill.version && (
              <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[10px]">
                v{skill.version}
              </span>
            )}
            {skill.authState && <SkillAuthStatus state={skill.authState} compact />}
          </div>

          {skill.description && (
            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-[11px] leading-snug">
              {skill.description}
            </p>
          )}

          {!compact && skill.author && (
            <p className="text-muted-foreground mt-1 inline-flex items-center gap-1 text-[10px]">
              <User className="size-3" aria-hidden />
              <span>{skill.author}</span>
            </p>
          )}
        </div>

        {toggleable && (
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={enabled ? 'Disable skill' : 'Enable skill'}
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.(skill.id, !enabled);
            }}
            className={cn(
              'relative mt-1 inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors',
              enabled ? 'bg-primary' : 'bg-muted',
            )}
          >
            <span
              className={cn(
                'bg-background block size-3 rounded-full shadow-sm transition-transform',
                enabled ? 'translate-x-3.5' : 'translate-x-0.5',
              )}
            />
          </button>
        )}

        {trailingSlot}
      </div>

      {!compact && skill.scopes && skill.scopes.length > 0 && (
        <SkillPermissions scopes={skill.scopes} limit={5} />
      )}

      {!compact && skill.tags && skill.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {skill.tags.slice(0, 6).map((tag) => (
            <code
              key={tag}
              className="bg-muted text-foreground/80 rounded px-1.5 py-0.5 font-mono text-[10px]"
            >
              {tag}
            </code>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}

function SkillIcon({ skill, compact }: { skill: Skill; compact: boolean }) {
  const fallback =
    skill.initials ??
    skill.name
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0])
      .join('')
      .toUpperCase();

  if (skill.iconUrl) {
    return (
      <img
        src={skill.iconUrl}
        alt={skill.name}
        className={cn(
          'border-border shrink-0 rounded-md border object-cover',
          compact ? 'size-7' : 'size-9',
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        'bg-primary/15 text-primary grid shrink-0 place-items-center rounded-md font-semibold',
        compact ? 'size-7 text-[10px]' : 'size-9 text-xs',
      )}
      aria-hidden
    >
      {fallback || <Sparkles className="size-3.5" aria-hidden />}
    </span>
  );
}

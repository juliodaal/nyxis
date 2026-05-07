'use client';

import { Eye, Pencil, Shield } from 'lucide-react';
import { type ComponentType, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import type { SkillScope, SkillScopeKind } from '@nyxis/core';

export interface SkillPermissionsProps extends HTMLAttributes<HTMLUListElement> {
  /** Required scopes. */
  scopes: readonly SkillScope[];
  /** Compact one-line variant — icons only, with hover tooltips. */
  compact?: boolean;
  /** Limit visible scopes; the rest collapse into a `+N` chip. */
  limit?: number;
}

const KIND_ICON: Record<
  SkillScopeKind,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  read: Eye,
  write: Pencil,
  admin: Shield,
};

const KIND_TONE: Record<SkillScopeKind, string> = {
  read: 'bg-muted text-muted-foreground',
  write: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  admin: 'bg-destructive/15 text-destructive',
};

const KIND_LABEL: Record<SkillScopeKind, string> = {
  read: 'read',
  write: 'write',
  admin: 'admin',
};

/**
 * Visual list of permission scopes a skill requires. Each scope is a
 * pill: icon (eye/pencil/shield) · `kind:resource`, with the resource
 * tone driven by severity.
 */
export function SkillPermissions({
  scopes,
  compact = false,
  limit,
  className,
  ...props
}: SkillPermissionsProps) {
  const visible = limit != null ? scopes.slice(0, limit) : scopes;
  const hidden = limit != null ? Math.max(0, scopes.length - limit) : 0;

  if (scopes.length === 0) {
    return <p className="text-muted-foreground text-[11px]">No special permissions.</p>;
  }

  return (
    <ul
      className={cn('flex flex-wrap items-center gap-1.5', className)}
      aria-label="Required permissions"
      {...props}
    >
      {visible.map((scope, index) => {
        const Icon = KIND_ICON[scope.kind];
        return (
          <li key={`${scope.kind}-${scope.resource}-${index}`}>
            <span
              data-kind={scope.kind}
              title={scope.description ?? `${KIND_LABEL[scope.kind]} ${scope.resource}`}
              className={cn(
                'inline-flex items-center gap-1 rounded-full font-mono font-medium',
                compact ? 'h-5 px-1 text-[9px]' : 'px-1.5 py-0.5 text-[10px]',
                KIND_TONE[scope.kind],
              )}
            >
              <Icon className={cn(compact ? 'size-2.5' : 'size-3')} aria-hidden />
              {!compact && (
                <span>
                  <span className="opacity-70">{KIND_LABEL[scope.kind]}:</span>
                  <span className="ml-0.5 normal-case">{scope.resource}</span>
                </span>
              )}
              {compact && <span className="sr-only">{KIND_LABEL[scope.kind]}</span>}
            </span>
          </li>
        );
      })}

      {hidden > 0 && (
        <li
          className="text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 font-mono text-[10px] font-medium"
          title={`${hidden} more permission${hidden === 1 ? '' : 's'}`}
        >
          +{hidden}
        </li>
      )}
    </ul>
  );
}

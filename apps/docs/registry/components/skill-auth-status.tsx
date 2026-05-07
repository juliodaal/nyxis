'use client';

import { AlertTriangle, CircleAlert, Link as LinkIcon, Lock, Plug, PlugZap } from 'lucide-react';
import { type ComponentType, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import type { SkillAuthState } from '@nyxis/core';

export interface SkillAuthStatusProps extends HTMLAttributes<HTMLDivElement> {
  state: SkillAuthState;
  /** Compact pill (no description). */
  compact?: boolean;
  /** Override the default human label. */
  label?: string;
  /** Override the default description. */
  description?: string;
  /** Connect / re-connect handler. */
  onConnect?: () => void;
  /** Disconnect handler. */
  onDisconnect?: () => void;
}

const ICON: Record<
  SkillAuthState,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  connected: PlugZap,
  expired: CircleAlert,
  'needs-reauth': Lock,
  never: Plug,
  errored: AlertTriangle,
};

const TONE: Record<SkillAuthState, string> = {
  connected: 'border-success/40 bg-success/5 text-success',
  expired: 'border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-400',
  'needs-reauth': 'border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-400',
  never: 'border-border bg-card text-muted-foreground',
  errored: 'border-destructive/40 bg-destructive/5 text-destructive',
};

const LABEL: Record<SkillAuthState, string> = {
  connected: 'Connected',
  expired: 'Token expired',
  'needs-reauth': 'Reauthorisation required',
  never: 'Not connected',
  errored: 'Connection error',
};

const DESCRIPTION: Record<SkillAuthState, string> = {
  connected: 'OAuth token valid. Skill is ready to invoke.',
  expired: 'OAuth token has expired. Reconnect to refresh.',
  'needs-reauth': 'Required scopes changed. Reauthorise to continue.',
  never: 'Skill has not been authorised yet.',
  errored: 'Last connection attempt failed. Retry or contact the publisher.',
};

const PRIMARY_LABEL: Record<SkillAuthState, string | null> = {
  connected: null,
  expired: 'Reconnect',
  'needs-reauth': 'Reauthorise',
  never: 'Connect',
  errored: 'Retry',
};

/**
 * Status card describing a skill's auth lifecycle. Five states map to
 * distinct tones and primary actions; pair with `<SkillCard>` for the
 * full skill surface, or use standalone in a settings page.
 */
export function SkillAuthStatus({
  state,
  compact = false,
  label,
  description,
  onConnect,
  onDisconnect,
  className,
  ...props
}: SkillAuthStatusProps) {
  const Icon = ICON[state];
  const heading = label ?? LABEL[state];
  const detail = description ?? DESCRIPTION[state];
  const primaryLabel = PRIMARY_LABEL[state];

  if (compact) {
    return (
      <span
        data-state={state}
        role="status"
        aria-label={heading}
        className={cn(
          'inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
          TONE[state],
          className,
        )}
        {...(props as HTMLAttributes<HTMLSpanElement>)}
      >
        <Icon className="size-2.5" aria-hidden />
        {heading}
      </span>
    );
  }

  return (
    <div
      data-state={state}
      role="status"
      className={cn('flex flex-col gap-2 rounded-lg border p-3', TONE[state], className)}
      {...props}
    >
      <div className="flex items-start gap-2">
        <span
          className="bg-background/60 grid size-7 shrink-0 place-items-center rounded-md"
          aria-hidden
        >
          <Icon className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-foreground text-xs font-semibold">{heading}</p>
          <p className="text-muted-foreground mt-0.5 text-[11px] leading-snug">{detail}</p>
        </div>
      </div>

      {(primaryLabel && onConnect) || (state === 'connected' && onDisconnect) ? (
        <div className="flex justify-end gap-1.5">
          {state === 'connected' && onDisconnect && (
            <button
              type="button"
              onClick={onDisconnect}
              className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors"
            >
              <Plug className="size-3" aria-hidden />
              Disconnect
            </button>
          )}
          {primaryLabel && onConnect && (
            <button
              type="button"
              onClick={onConnect}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors"
            >
              <LinkIcon className="size-3" aria-hidden />
              {primaryLabel}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

'use client';

import { Cog, FileText, FolderTree, MessageSquare, ScrollText, Sparkles } from 'lucide-react';
import { type ComponentType, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { MCPCapability } from '@nyxis/core';

export interface MCPCapabilityBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  capability: MCPCapability;
  /** Compact variant: just the icon. */
  compact?: boolean;
  /** Whether the capability is currently enabled. Disabled-looking when false. */
  enabled?: boolean;
}

const CAPABILITY_LABEL: Record<MCPCapability, string> = {
  tools: 'tools',
  prompts: 'prompts',
  resources: 'resources',
  sampling: 'sampling',
  roots: 'roots',
  logging: 'logging',
};

const CAPABILITY_ICON: Record<
  MCPCapability,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  tools: Cog,
  prompts: MessageSquare,
  resources: FileText,
  sampling: Sparkles,
  roots: FolderTree,
  logging: ScrollText,
};

/**
 * Pill that surfaces a single MCP capability (tools, prompts, resources,
 * sampling, roots, logging) with its canonical icon. Pair as a row to
 * describe what an MCP server offers at a glance.
 */
export function MCPCapabilityBadge({
  capability,
  compact = false,
  enabled = true,
  className,
  ...props
}: MCPCapabilityBadgeProps) {
  const Icon = CAPABILITY_ICON[capability];
  const label = CAPABILITY_LABEL[capability];

  return (
    <span
      data-capability={capability}
      data-enabled={enabled || undefined}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
        enabled
          ? 'bg-primary/10 text-primary border-primary/20 border'
          : 'bg-muted text-muted-foreground border-border border opacity-70',
        compact && 'h-5 w-5 justify-center px-0',
        className,
      )}
      title={label}
      {...props}
    >
      <Icon className="size-3" aria-hidden />
      {!compact && <span>{label}</span>}
    </span>
  );
}

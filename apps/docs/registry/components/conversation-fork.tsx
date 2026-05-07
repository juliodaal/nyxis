'use client';

import { type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface ForkNode {
  id: string;
  /** One-line preview of the message at this node. */
  label: string;
  /** Role used to colour the node. */
  role?: 'user' | 'assistant' | 'system';
  /** Children nodes — branches from this point. */
  children?: readonly ForkNode[];
}

export interface ConversationForkProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Root of the conversation tree. */
  root: ForkNode;
  /** Currently active leaf id. */
  activeLeafId?: string;
  /** Called when the user clicks a node — navigate to that branch. */
  onSelect?: (id: string) => void;
}

/**
 * Visualise a branched conversation as an indented tree. Each node is a
 * message; children are forks created when the user regenerated or
 * edited a turn. Click a node to switch the current view to that branch.
 */
export function ConversationFork({
  root,
  activeLeafId,
  onSelect,
  className,
  ...props
}: ConversationForkProps) {
  return (
    <div
      className={cn('border-border bg-card rounded-lg border p-3 text-sm', className)}
      role="tree"
      aria-label="Conversation branches"
      {...props}
    >
      <ForkBranch node={root} depth={0} activeLeafId={activeLeafId} onSelect={onSelect} isLast />
    </div>
  );
}

interface ForkBranchProps {
  node: ForkNode;
  depth: number;
  activeLeafId?: string | undefined;
  onSelect?: ((id: string) => void) | undefined;
  isLast: boolean;
}

function ForkBranch({ node, depth, activeLeafId, onSelect, isLast }: ForkBranchProps) {
  const active = activeLeafId === node.id;
  const hasChildren = !!node.children && node.children.length > 0;

  return (
    <div role="treeitem" aria-expanded={hasChildren ? true : undefined} className="relative">
      {/* Connector lines from parent. */}
      {depth > 0 ? (
        <span aria-hidden="true" className="bg-border absolute -left-3 top-3 h-px w-3" />
      ) : null}
      {!isLast && depth >= 0 ? (
        <span aria-hidden="true" className="bg-border absolute -left-3 top-3 h-full w-px" />
      ) : null}

      <button
        type="button"
        onClick={() => onSelect?.(node.id)}
        className={cn(
          'flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors',
          'hover:bg-muted',
          active && 'bg-primary/10 text-foreground',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'mt-1 size-2 shrink-0 rounded-full',
            node.role === 'user' && 'bg-primary',
            node.role === 'assistant' && 'bg-accent-foreground',
            node.role === 'system' && 'bg-muted-foreground',
            !node.role && 'bg-muted-foreground',
          )}
        />
        <span
          className={cn(
            'truncate text-xs',
            active ? 'text-foreground font-medium' : 'text-muted-foreground',
          )}
        >
          {node.label}
        </span>
      </button>

      {hasChildren ? (
        <div className="relative ml-3 mt-0.5 flex flex-col gap-0.5 pl-3">
          {node.children!.map((child, i) => (
            <ForkBranch
              key={child.id}
              node={child}
              depth={depth + 1}
              activeLeafId={activeLeafId}
              onSelect={onSelect}
              isLast={i === node.children!.length - 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

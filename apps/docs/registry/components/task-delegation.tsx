'use client';

import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  Loader2,
  Pause,
} from 'lucide-react';
import { useState, type ComponentType, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import type { DelegatedTask, DelegatedTaskStatus } from '@nyxis/core';

export interface TaskDelegationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Root task(s). Pass an array for multiple top-level tasks. */
  tasks: readonly DelegatedTask[];
  /** Render the bare tree without the surrounding card. */
  bare?: boolean;
  /** Default-collapsed task ids. */
  defaultCollapsed?: readonly string[];
  /** Click handler on a task row. */
  onSelect?: (task: DelegatedTask) => void;
  /** Currently selected task id. */
  activeId?: string;
}

const STATUS_ICON: Record<
  DelegatedTaskStatus,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  pending: Circle,
  'in-progress': Loader2,
  blocked: Pause,
  done: Check,
  errored: AlertTriangle,
};

const STATUS_TONE: Record<DelegatedTaskStatus, string> = {
  pending: 'text-muted-foreground',
  'in-progress': 'text-primary',
  blocked: 'text-amber-700 dark:text-amber-400',
  done: 'text-success',
  errored: 'text-destructive',
};

/**
 * Hierarchical task tree for multi-agent delegation. Each node shows
 * status, the agent it's assigned to, and an optional progress bar.
 * Click a row to select; expand/collapse the chevron to toggle
 * children.
 */
export function TaskDelegation({
  tasks,
  bare = false,
  defaultCollapsed,
  onSelect,
  activeId,
  className,
  ...props
}: TaskDelegationProps) {
  const [collapsed, setCollapsed] = useState<readonly string[]>(() => defaultCollapsed ?? []);

  const toggle = (id: string) =>
    setCollapsed((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  return (
    <div
      className={cn(
        bare ? 'flex flex-col gap-1' : 'border-border bg-card rounded-lg border p-3',
        className,
      )}
      {...props}
    >
      <ul className="flex flex-col gap-0.5">
        {tasks.map((task) => (
          <TaskNode
            key={task.id}
            task={task}
            depth={0}
            collapsed={collapsed}
            onToggle={toggle}
            {...(onSelect ? { onSelect } : {})}
            {...(activeId !== undefined ? { activeId } : {})}
          />
        ))}
      </ul>
    </div>
  );
}

interface TaskNodeProps {
  task: DelegatedTask;
  depth: number;
  collapsed: readonly string[];
  onToggle: (id: string) => void;
  onSelect?: (task: DelegatedTask) => void;
  activeId?: string;
}

function TaskNode({ task, depth, collapsed, onToggle, onSelect, activeId }: TaskNodeProps) {
  const hasChildren = task.children && task.children.length > 0;
  const isCollapsed = collapsed.includes(task.id);
  const isActive = task.id === activeId;
  const Icon = STATUS_ICON[task.status];
  const tone = STATUS_TONE[task.status];

  return (
    <li>
      <div
        className={cn(
          'group flex items-start gap-1.5 rounded-md px-1.5 py-1 transition-colors',
          onSelect && 'cursor-pointer',
          isActive ? 'bg-primary/10' : onSelect && 'hover:bg-muted/40',
        )}
        style={{ paddingLeft: `${depth * 16 + 6}px` }}
        onClick={onSelect ? () => onSelect(task) : undefined}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }}
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
            className="text-muted-foreground hover:text-foreground mt-0.5 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="size-3" aria-hidden />
            ) : (
              <ChevronDown className="size-3" aria-hidden />
            )}
          </button>
        ) : (
          <span className="mt-0.5 inline-block w-3" aria-hidden />
        )}

        <Icon
          className={cn(
            'mt-0.5 size-3 shrink-0',
            tone,
            task.status === 'in-progress' && 'animate-spin',
          )}
          aria-hidden
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span
              className={cn(
                'text-xs leading-snug',
                isActive ? 'text-foreground font-semibold' : 'text-foreground',
              )}
            >
              {task.title}
            </span>
            {task.agentName && (
              <code className="bg-muted text-muted-foreground rounded px-1 font-mono text-[10px]">
                @{task.agentName}
              </code>
            )}
          </div>
          {task.description && (
            <p className="text-muted-foreground line-clamp-1 text-[11px] leading-snug">
              {task.description}
            </p>
          )}
          {task.progress != null && task.progress > 0 && task.progress < 1 && (
            <div className="bg-muted mt-1 h-0.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all"
                style={{ width: `${Math.round(task.progress * 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {hasChildren && !isCollapsed && (
        <ul className="flex flex-col gap-0.5">
          {task.children!.map((child) => (
            <TaskNode
              key={child.id}
              task={child}
              depth={depth + 1}
              collapsed={collapsed}
              onToggle={onToggle}
              {...(onSelect ? { onSelect } : {})}
              {...(activeId !== undefined ? { activeId } : {})}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

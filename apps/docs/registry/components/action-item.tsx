'use client';

import { CalendarClock } from 'lucide-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

export type ActionItemStatus = 'pending' | 'in-progress' | 'done';

export interface ActionItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onToggle'
> {
  /** Action description. */
  text: string;
  /** Done / pending state. */
  done?: boolean;
  /** Triggered when the user toggles the checkbox. */
  onToggle?: (next: boolean) => void;
  /** Person assigned (initials, name, or full ReactNode). */
  assignee?: string;
  /** Due date label. */
  due?: string;
  /** Status badge (overrides done if both provided). */
  status?: ActionItemStatus;
}

const STATUS_LABELS: Record<ActionItemStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In progress',
  done: 'Done',
};

/**
 * Single action item — checkbox + text + assignee + due date. Used by
 * AI meeting intelligence to render extracted action items.
 */
export const ActionItem = forwardRef<HTMLDivElement, ActionItemProps>(function ActionItem(
  { text, done = false, onToggle, assignee, due, status, className, ...props },
  ref,
) {
  const checked = status === 'done' || done;

  return (
    <div
      ref={ref}
      className={cn(
        'border-border bg-card flex items-start gap-3 rounded-md border p-3 transition-colors',
        className,
      )}
      {...props}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onToggle?.(Boolean(value))}
        aria-label={text}
        className="mt-0.5"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p
          className={cn('text-foreground text-sm', checked && 'text-muted-foreground line-through')}
        >
          {text}
        </p>
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-[11px]">
          {assignee ? (
            <span className="bg-muted rounded-full px-2 py-0.5 font-medium">{assignee}</span>
          ) : null}
          {due ? (
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-3" aria-hidden="true" />
              {due}
            </span>
          ) : null}
          {status ? (
            <span
              data-status={status}
              className={cn(
                'rounded px-1.5 py-0.5 font-medium uppercase tracking-wider',
                'data-[status=pending]:bg-muted data-[status=pending]:text-muted-foreground',
                'data-[status=in-progress]:bg-warning/15 data-[status=in-progress]:text-warning',
                'data-[status=done]:bg-success/15 data-[status=done]:text-success',
              )}
            >
              {STATUS_LABELS[status]}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
});

'use client';

import { ChevronRight } from 'lucide-react';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils.js';

export interface AuditLogItemProps extends HTMLAttributes<HTMLDivElement> {
  /** When the action was performed. */
  timestamp: string;
  /** Who performed it. */
  actor: string;
  /** Action verb, e.g. "approved", "edited". */
  action: string;
  /** What was acted on (entity name or ID). */
  target?: string;
  /** Optional before/after diff. */
  diff?: {
    field: string;
    before?: string | number | null;
    after: string | number;
  }[];
}

/**
 * Single audit log entry with optional collapsible diff. Used in
 * **DocuMind** for compliance-grade extraction logs.
 */
export const AuditLogItem = forwardRef<HTMLDivElement, AuditLogItemProps>(function AuditLogItem(
  { timestamp, actor, action, target, diff, className, ...props },
  ref,
) {
  const [open, setOpen] = useState(false);
  const hasDiff = diff && diff.length > 0;

  return (
    <div ref={ref} className={cn('border-border flex gap-3 border-l-2 pl-4', className)} {...props}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
          <time className="text-muted-foreground text-xs">{timestamp}</time>
          <span className="text-foreground font-medium">{actor}</span>
          <span className="text-muted-foreground">{action}</span>
          {target ? (
            <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
              {target}
            </code>
          ) : null}
        </div>
        {hasDiff ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 self-start rounded text-xs transition-colors focus-visible:outline-none focus-visible:ring-2"
          >
            <ChevronRight
              className={cn('size-3 transition-transform', open && 'rotate-90')}
              aria-hidden="true"
            />
            {open ? 'Hide changes' : `Show ${diff.length} change${diff.length === 1 ? '' : 's'}`}
          </button>
        ) : null}
        {hasDiff && open ? (
          <ul className="border-border bg-muted/30 mt-1 flex flex-col gap-1 rounded-md border p-2 text-xs">
            {diff.map((d, i) => (
              <li key={i} className="grid grid-cols-[80px_1fr] gap-2 font-mono">
                <span className="text-muted-foreground">{d.field}</span>
                <span>
                  {d.before !== undefined && d.before !== null ? (
                    <>
                      <span className="bg-destructive/15 text-destructive rounded px-1">
                        {String(d.before)}
                      </span>{' '}
                      →{' '}
                    </>
                  ) : null}
                  <span className="bg-success/15 text-success rounded px-1">{String(d.after)}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
});

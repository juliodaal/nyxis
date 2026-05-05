'use client';

import { Check, ChevronDown, X } from 'lucide-react';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils.js';

export type EmailCategory = 'urgent' | 'internal' | 'newsletter' | 'sales' | 'support' | 'spam';

export interface EmailTriageCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Sender display string. */
  from: string;
  /** Subject line. */
  subject: string;
  /** Auto-detected category. */
  category: EmailCategory;
  /** Short preview of the message body. */
  preview: string;
  /** Optional draft response. When present, shown in an expandable panel. */
  draft?: string;
  /** Called when the user accepts the auto-classification or draft. */
  onAccept?: () => void;
  /** Called when the user rejects the auto-action. */
  onReject?: () => void;
}

const CATEGORY_LABELS: Record<EmailCategory, string> = {
  urgent: 'Urgent',
  internal: 'Internal',
  newsletter: 'Newsletter',
  sales: 'Sales',
  support: 'Support',
  spam: 'Spam',
};

/**
 * One row in an Email Triage triage queue: sender, subject, auto-detected
 * category, message preview, and an optional draft reply with accept /
 * reject actions.
 */
export const EmailTriageCard = forwardRef<HTMLDivElement, EmailTriageCardProps>(
  function EmailTriageCard(
    { from, subject, category, preview, draft, onAccept, onReject, className, ...props },
    ref,
  ) {
    const [draftOpen, setDraftOpen] = useState(false);
    return (
      <div
        ref={ref}
        className={cn(
          'border-border bg-card shadow-soft flex flex-col gap-3 rounded-lg border p-4',
          className,
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                data-cat={category}
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  'data-[cat=urgent]:bg-destructive/15 data-[cat=urgent]:text-destructive',
                  'data-[cat=internal]:bg-primary/15 data-[cat=internal]:text-primary',
                  'data-[cat=newsletter]:bg-muted data-[cat=newsletter]:text-muted-foreground',
                  'data-[cat=sales]:bg-warning/20 data-[cat=sales]:text-warning',
                  'data-[cat=support]:bg-accent data-[cat=support]:text-accent-foreground',
                  'data-[cat=spam]:bg-destructive/10 data-[cat=spam]:text-destructive',
                )}
              >
                {CATEGORY_LABELS[category]}
              </span>
              <p className="text-muted-foreground truncate text-xs">{from}</p>
            </div>
            <h3 className="text-foreground mt-1 truncate text-sm font-semibold">{subject}</h3>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{preview}</p>
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={onAccept}
              aria-label="Accept"
              className="bg-success/15 text-success hover:bg-success/25 grid size-8 place-items-center rounded-md"
            >
              <Check className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onReject}
              aria-label="Reject"
              className="bg-muted text-muted-foreground hover:bg-destructive/15 hover:text-destructive grid size-8 place-items-center rounded-md"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {draft ? (
          <div className="border-border bg-muted/30 rounded-md border">
            <button
              type="button"
              onClick={() => setDraftOpen((o) => !o)}
              aria-expanded={draftOpen}
              className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between px-3 py-2 text-xs font-medium"
            >
              <span>{draftOpen ? 'Hide draft' : 'Show draft response'}</span>
              <ChevronDown
                className={cn('size-3 transition-transform', draftOpen && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
            {draftOpen ? (
              <p className="border-border text-foreground border-t p-3 text-sm leading-relaxed">
                {draft}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);

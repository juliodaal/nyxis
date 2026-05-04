import { Building2, Mail } from 'lucide-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils.js';

export interface LeadCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Company name. */
  company: string;
  /** Contact name (optional). */
  contact?: string;
  /** Industry / segment label. */
  segment?: string;
  /** Score 0..1. */
  score: number;
  /** Tags shown as pills. */
  tags?: readonly string[];
  /** Email click handler. */
  onEmail?: () => void;
  /** Primary action label (e.g. "Open in HubSpot"). */
  primaryAction?: { label: string; href?: string; onClick?: () => void };
}

/**
 * Lead summary card with score ring + tags + actions. Used in
 * **LeadSift**.
 */
export const LeadCard = forwardRef<HTMLDivElement, LeadCardProps>(function LeadCard(
  { company, contact, segment, score, tags, onEmail, primaryAction, className, ...props },
  ref,
) {
  const pct = Math.round(Math.max(0, Math.min(1, score)) * 100);
  const tone = pct >= 75 ? 'high' : pct >= 50 ? 'medium' : 'low';

  return (
    <div
      ref={ref}
      className={cn(
        'border-border bg-card shadow-soft flex flex-col gap-4 rounded-lg border p-5',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div
          className="bg-muted text-muted-foreground grid size-12 shrink-0 place-items-center rounded-md"
          aria-hidden="true"
        >
          <Building2 className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground truncate text-base font-semibold">{company}</h3>
          {contact ? <p className="text-muted-foreground truncate text-sm">{contact}</p> : null}
          {segment ? (
            <p className="text-muted-foreground mt-0.5 text-xs uppercase tracking-wider">
              {segment}
            </p>
          ) : null}
        </div>
        <ScoreRing pct={pct} tone={tone} />
      </div>

      {tags && tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="border-border bg-background text-muted-foreground rounded-full border px-2 py-0.5 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        {primaryAction ? (
          primaryAction.href ? (
            <a
              href={primaryAction.href}
              className="bg-primary text-primary-foreground inline-flex h-9 flex-1 items-center justify-center rounded-md px-3 text-sm font-medium hover:opacity-90"
            >
              {primaryAction.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className="bg-primary text-primary-foreground inline-flex h-9 flex-1 items-center justify-center rounded-md px-3 text-sm font-medium hover:opacity-90"
            >
              {primaryAction.label}
            </button>
          )
        ) : null}
        {onEmail ? (
          <button
            type="button"
            onClick={onEmail}
            aria-label={`Email ${contact ?? company}`}
            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground grid h-9 w-9 place-items-center rounded-md border"
          >
            <Mail className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
});

function ScoreRing({ pct, tone }: { pct: number; tone: 'high' | 'medium' | 'low' }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const stroke =
    tone === 'high'
      ? 'var(--color-success)'
      : tone === 'medium'
        ? 'var(--color-warning)'
        : 'var(--color-destructive)';
  return (
    <div className="relative grid size-12 place-items-center" aria-label={`Score ${pct}%`}>
      <svg viewBox="0 0 44 44" className="size-12 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--color-muted)" strokeWidth="3" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <span className="text-foreground absolute text-xs font-semibold">{pct}</span>
    </div>
  );
}

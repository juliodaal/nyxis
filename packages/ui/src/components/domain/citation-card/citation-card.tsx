import { ExternalLink } from 'lucide-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils.js';

export interface CitationCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Source title, e.g. "Employee handbook §4.2". */
  source: string;
  /** Link to the source. */
  href?: string;
  /** Page number, timestamp, or section identifier. */
  locator?: string;
  /** The cited snippet. */
  snippet: string;
  /** Optional rank position when shown in a list (1-based). */
  rank?: number;
}

/**
 * Source citation card with snippet, locator, and external link.
 * Used in **AskCompany** (RAG citations) and **MeetingMind**
 * (transcript references).
 */
export const CitationCard = forwardRef<HTMLDivElement, CitationCardProps>(function CitationCard(
  { source, href, locator, snippet, rank, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'border-border bg-card hover:bg-accent/30 flex flex-col gap-2 rounded-lg border p-4 transition-colors',
        className,
      )}
      {...props}
    >
      <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
        <div className="flex min-w-0 items-center gap-2">
          {rank !== undefined ? (
            <span className="bg-primary/10 text-primary grid size-5 shrink-0 place-items-center rounded-full font-mono text-[10px]">
              {rank}
            </span>
          ) : null}
          <span className="text-foreground truncate font-medium">{source}</span>
          {locator ? <span className="text-muted-foreground shrink-0">· {locator}</span> : null}
        </div>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring shrink-0 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2"
            aria-label={`Open source: ${source}`}
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        <span className="text-foreground">"</span>
        {snippet}
        <span className="text-foreground">"</span>
      </p>
    </div>
  );
});

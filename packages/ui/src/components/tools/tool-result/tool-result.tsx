'use client';

import { Check, Copy } from 'lucide-react';
import { useState, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';

export type ToolResultFormat = 'auto' | 'json' | 'text' | 'image' | 'markdown';

export interface ToolResultProps extends HTMLAttributes<HTMLDivElement> {
  /** Tool output. Anything serialisable. */
  result?: unknown;
  /** Error message (renders error variant). */
  error?: string;
  /** How to render the result. `auto` infers from the value. */
  format?: ToolResultFormat;
  /** Optional small heading (e.g. tool name). */
  label?: string;
  /** Truncate the rendered text after N chars (with "show more" toggle). */
  truncate?: number;
  /** Hide the copy-to-clipboard button. */
  hideCopy?: boolean;
}

/**
 * Renders the output of a tool call. Pairs with `<ToolCall>` and detects
 * the appropriate render mode from the value (image URL → `<img>`,
 * object → JSON, string → text). Errors get a distinct destructive
 * variant.
 */
export function ToolResult({
  result,
  error,
  format = 'auto',
  label,
  truncate,
  hideCopy = false,
  className,
  ...props
}: ToolResultProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (error) {
    return (
      <div
        className={cn(
          'border-destructive/40 bg-destructive/5 text-destructive rounded-lg border px-3 py-2.5 text-sm',
          className,
        )}
        {...props}
      >
        {label && (
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-80">
            {label} · error
          </p>
        )}
        <p className="font-mono text-xs leading-relaxed">{error}</p>
      </div>
    );
  }

  const detected = detectFormat(result, format);
  const text = stringify(result, detected);
  const truncated = truncate != null && text.length > truncate && !expanded;
  const display = truncated ? text.slice(0, truncate) + '…' : text;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be denied — fail quietly.
    }
  };

  return (
    <div
      className={cn(
        'border-border bg-card group relative overflow-hidden rounded-lg border',
        className,
      )}
      {...props}
    >
      <header className="border-border bg-muted/30 text-muted-foreground flex items-center justify-between gap-2 border-b px-3 py-1.5 text-[11px] font-medium">
        <span>
          {label ? `${label} · ` : ''}
          <span className="uppercase tracking-wider">{detected}</span>
        </span>
        {!hideCopy && detected !== 'image' && (
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy result"
            className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            {copied ? (
              <Check className="size-3" aria-hidden />
            ) : (
              <Copy className="size-3" aria-hidden />
            )}
            <span>{copied ? 'copied' : 'copy'}</span>
          </button>
        )}
      </header>

      <div className="px-3 py-2.5">
        {detected === 'image' && typeof result === 'string' ? (
          <img
            src={result}
            alt={label ?? 'Tool result'}
            className="border-border max-h-64 rounded border object-contain"
          />
        ) : (
          <pre className="text-foreground/90 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed">
            {display}
          </pre>
        )}

        {truncated && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-primary mt-2 text-[11px] font-medium hover:underline"
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
}

function detectFormat(value: unknown, hint: ToolResultFormat): ToolResultFormat {
  if (hint !== 'auto') return hint;
  if (typeof value === 'string') {
    if (
      /^data:image\//.test(value) ||
      /^https?:\/\/.+\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i.test(value)
    )
      return 'image';
    return 'text';
  }
  if (value == null) return 'text';
  return 'json';
}

function stringify(value: unknown, format: ToolResultFormat): string {
  if (format === 'image') return typeof value === 'string' ? value : '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

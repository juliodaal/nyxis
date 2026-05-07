'use client';

import { Check, Copy } from 'lucide-react';
import { useState, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface StreamingCodeProps extends HTMLAttributes<HTMLPreElement> {
  /** Code text streamed so far. */
  code: string;
  /** Language hint (just for the badge — no syntax highlighting bundled). */
  language?: string;
  /** Optional filename shown in the header bar. */
  filename?: string;
  /** Show a copy-to-clipboard button. Default true. */
  copyable?: boolean;
  /** Whether more tokens are still arriving. */
  streaming?: boolean;
}

/**
 * Code block that updates incrementally as the model streams tokens. Keeps
 * a stable height when possible and shows a copy button when complete.
 *
 * Syntax highlighting is intentionally not bundled (would balloon the
 * package weight). Pair with your highlighter of choice (Shiki, Prism,
 * highlight.js) by passing pre-rendered HTML via `dangerouslySetInnerHTML`
 * inside the slot — or just use `<StreamingMarkdown>` which composes with
 * code blocks.
 */
export function StreamingCode({
  code,
  language,
  filename,
  copyable = true,
  streaming = false,
  className,
  ...props
}: StreamingCodeProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be denied — fail quietly.
    }
  };

  return (
    <figure
      className={cn(
        'not-prose border-border bg-card group relative overflow-hidden rounded-lg border',
        className,
      )}
    >
      {(filename || language) && (
        <figcaption className="border-border bg-muted/30 text-muted-foreground flex items-center justify-between gap-2 border-b px-4 py-2 text-[11px] font-medium">
          <span className="flex items-center gap-2">
            {filename ? <span className="font-mono">{filename}</span> : null}
            {language ? (
              <span className="border-border bg-background rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider">
                {language}
              </span>
            ) : null}
          </span>
          {copyable && !streaming ? (
            <button
              type="button"
              onClick={onCopy}
              aria-label={copied ? 'Copied' : 'Copy code'}
              className="text-muted-foreground hover:bg-background hover:text-foreground grid size-6 place-items-center rounded-sm transition-colors"
            >
              {copied ? (
                <Check className="text-success size-3" aria-hidden="true" />
              ) : (
                <Copy className="size-3" aria-hidden="true" />
              )}
            </button>
          ) : null}
        </figcaption>
      )}
      <pre
        className="text-foreground overflow-x-auto p-4 font-mono text-xs leading-relaxed"
        {...props}
      >
        <code>{code}</code>
        {streaming ? (
          <span aria-hidden="true" className="text-primary ml-0.5 animate-pulse">
            ▍
          </span>
        ) : null}
      </pre>
    </figure>
  );
}

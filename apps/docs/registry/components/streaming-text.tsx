'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface StreamingTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** Text streamed so far. */
  text: string;
  /** Whether more tokens are still arriving. */
  streaming?: boolean;
  /** Cursor character (default: solid block "▍"). */
  cursor?: string;
}

/**
 * Plain-text incremental renderer for streamed model output. Shows the
 * supplied `text` followed by a blinking cursor while `streaming` is
 * true. For markdown content use `<StreamingMarkdown>`.
 */
export function StreamingText({
  text,
  streaming = true,
  cursor = '▍',
  className,
  ...props
}: StreamingTextProps) {
  return (
    <span className={cn('inline whitespace-pre-wrap', className)} {...props}>
      {text}
      {streaming ? (
        <span aria-hidden="true" className="text-primary ml-0.5 inline-block animate-pulse">
          {cursor}
        </span>
      ) : null}
    </span>
  );
}

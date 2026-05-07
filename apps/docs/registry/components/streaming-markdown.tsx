'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type ComponentPropsWithoutRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import { StreamingCode } from '@/components/nyxis/streaming-code';

export interface StreamingMarkdownProps extends HTMLAttributes<HTMLDivElement> {
  /** Markdown source streamed so far. */
  text: string;
  /** Whether more tokens are still arriving — adds a trailing cursor. */
  streaming?: boolean;
  /** Custom code block renderer. By default uses `<StreamingCode>`. */
  codeBlock?: (props: { code: string; language?: string }) => React.ReactNode;
}

/**
 * Markdown renderer tuned for streaming model output.
 *
 * - Fenced code blocks render through `<StreamingCode>` (copy button +
 *   language badge).
 * - Inline code, lists, tables, blockquotes, links, and headings are
 *   styled with theme tokens so the result fits inside any
 *   `<ChatMessage>` bubble.
 * - GFM is enabled — task lists, strikethrough, autolinks, tables.
 *
 * Re-renders cheaply on each chunk because react-markdown internally
 * memoises its node tree by source string.
 */
export function StreamingMarkdown({
  text,
  streaming = false,
  codeBlock,
  className,
  ...props
}: StreamingMarkdownProps) {
  return (
    <div
      className={cn('prose-chat text-foreground max-w-none text-sm leading-relaxed', className)}
      {...props}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className: cn2, children, ...rest }: CodeProps) {
            const language = /language-(\w+)/.exec(cn2 ?? '')?.[1];
            const code = String(children).replace(/\n$/, '');
            if (!inline && language) {
              if (codeBlock) return <>{codeBlock({ code, language })}</>;
              return <StreamingCode code={code} language={language} />;
            }
            return (
              <code
                className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-[0.85em]"
                {...rest}
              >
                {children}
              </code>
            );
          },
          a({ href, children, ...rest }) {
            return (
              <a
                href={href}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-primary underline-offset-4 hover:underline"
                {...rest}
              >
                {children}
              </a>
            );
          },
          ul({ children, ...rest }) {
            return (
              <ul className="my-2 list-disc space-y-1 pl-5" {...rest}>
                {children}
              </ul>
            );
          },
          ol({ children, ...rest }) {
            return (
              <ol className="my-2 list-decimal space-y-1 pl-5" {...rest}>
                {children}
              </ol>
            );
          },
          blockquote({ children, ...rest }) {
            return (
              <blockquote
                className="border-primary/40 text-muted-foreground my-2 border-l-2 pl-3"
                {...rest}
              >
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return (
              <h1 className="text-foreground mb-2 mt-4 text-base font-semibold">{children}</h1>
            );
          },
          h2({ children }) {
            return <h2 className="text-foreground mb-2 mt-3 text-sm font-semibold">{children}</h2>;
          },
          h3({ children }) {
            return (
              <h3 className="text-foreground mb-1.5 mt-2 text-sm font-semibold">{children}</h3>
            );
          },
          table({ children }) {
            return (
              <div className="border-border my-2 overflow-x-auto rounded-md border">
                <table className="w-full text-xs">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-muted/50 text-muted-foreground">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-2 py-1.5 text-left font-medium">{children}</th>;
          },
          td({ children }) {
            return <td className="border-border border-t px-2 py-1.5">{children}</td>;
          },
          hr() {
            return <hr className="border-border my-3" />;
          },
        }}
      >
        {text}
      </ReactMarkdown>
      {streaming ? (
        <span aria-hidden="true" className="text-primary ml-0.5 inline-block animate-pulse">
          ▍
        </span>
      ) : null}
    </div>
  );
}

type CodeProps = ComponentPropsWithoutRef<'code'> & { inline?: boolean };

'use client';

import { AlertTriangle, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useState, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import type { MediaGenerationStatus } from '@nyxis/core';

export interface ImageMessageProps extends HTMLAttributes<HTMLElement> {
  /** Image URL (or data: URI). */
  src?: string;
  /** Required alt text for accessibility. */
  alt: string;
  /** Optional caption rendered beneath the image. */
  caption?: string;
  /** Lifecycle while the model generates the image. */
  status?: MediaGenerationStatus;
  /** Progress 0..1 during `generating`. */
  progress?: number;
  /** Error message when `status === 'errored'`. */
  error?: string;
  /** Aspect ratio enforced via CSS (e.g. `1 / 1`, `4 / 3`). */
  aspectRatio?: string;
  /** Show a download button on hover. */
  downloadable?: boolean;
  /** Click handler (e.g. open in lightbox). */
  onOpen?: () => void;
}

/**
 * Image bubble for a chat message — handles loading, generation
 * progress, error, and ready states. Use as the assistant's reply when
 * a vision-output model returns an image, or as a user-uploaded
 * attachment.
 */
export function ImageMessage({
  src,
  alt,
  caption,
  status = src ? 'ready' : 'pending',
  progress,
  error,
  aspectRatio = '4 / 3',
  downloadable = true,
  onOpen,
  className,
  ...props
}: ImageMessageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure
      className={cn(
        'border-border bg-muted/30 group relative overflow-hidden rounded-lg border',
        className,
      )}
      {...props}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio }}>
        {status === 'errored' ? (
          <ErrorState {...(error ? { message: error } : {})} />
        ) : status === 'generating' || status === 'pending' ? (
          <GeneratingState
            status={status}
            {...(progress != null ? { progress } : {})}
            {...(src ? { src } : {})}
          />
        ) : (
          <ReadyState
            src={src!}
            alt={alt}
            loaded={loaded}
            onLoad={() => setLoaded(true)}
            {...(onOpen ? { onOpen } : {})}
          />
        )}

        {downloadable && status === 'ready' && src && (
          <a
            href={src}
            download
            aria-label="Download image"
            onClick={(e) => e.stopPropagation()}
            className="bg-background/80 text-foreground hover:bg-background absolute right-2 top-2 grid size-7 place-items-center rounded-full opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
          >
            <Download className="size-3.5" aria-hidden />
          </a>
        )}
      </div>

      {caption && (
        <figcaption className="text-muted-foreground border-border border-t px-3 py-2 text-xs leading-snug">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function ReadyState({
  src,
  alt,
  loaded,
  onLoad,
  onOpen,
}: {
  src: string;
  alt: string;
  loaded: boolean;
  onLoad: () => void;
  onOpen?: () => void;
}) {
  return (
    <>
      {!loaded && <div className="bg-muted absolute inset-0 animate-pulse" aria-hidden />}
      <button
        type="button"
        onClick={onOpen}
        disabled={!onOpen}
        aria-label={onOpen ? `Open image: ${alt}` : alt}
        className={cn('absolute inset-0 size-full', onOpen && 'cursor-zoom-in')}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={onLoad}
          className={cn(
            'size-full object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        />
      </button>
    </>
  );
}

function GeneratingState({
  status,
  progress,
  src,
}: {
  status: MediaGenerationStatus;
  progress?: number;
  src?: string;
}) {
  const pct = progress != null ? Math.round(Math.max(0, Math.min(1, progress)) * 100) : null;

  return (
    <div className="bg-muted relative flex size-full items-center justify-center overflow-hidden">
      {/* Streaming preview when partial src is available. */}
      {src && (
        <img
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover opacity-60"
        />
      )}

      <div className="bg-background/60 relative flex flex-col items-center gap-2 rounded-md px-3 py-2 backdrop-blur">
        {status === 'generating' ? (
          <Loader2 className="text-primary size-5 animate-spin" aria-hidden />
        ) : (
          <ImageIcon className="text-muted-foreground size-5" aria-hidden />
        )}
        <p className="text-foreground text-xs font-medium">
          {status === 'generating' ? 'Generating…' : 'Queued'}
        </p>
        {pct != null && (
          <div className="bg-muted h-1 w-24 overflow-hidden rounded-full">
            <div className="bg-primary h-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message?: string }) {
  return (
    <div className="bg-destructive/5 text-destructive flex size-full flex-col items-center justify-center gap-2 p-4 text-center">
      <AlertTriangle className="size-6" aria-hidden />
      <p className="text-xs font-semibold uppercase tracking-wider">Generation failed</p>
      {message && <p className="font-mono text-[11px] leading-snug opacity-80">{message}</p>}
    </div>
  );
}

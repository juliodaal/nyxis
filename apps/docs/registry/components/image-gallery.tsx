'use client';

import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react';
import { useEffect, useState, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import type { MediaAttachment } from '@nyxis/core';

export interface ImageGalleryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Images to render (kind === 'image' is assumed). */
  images: readonly MediaAttachment[];
  /** Number of columns at md+; mobile is always one column. */
  columns?: 2 | 3 | 4;
  /** Open the lightbox at the given index (controlled). */
  activeIndex?: number;
  /** Called when the user clicks a thumbnail or navigates the lightbox. */
  onSelect?: (index: number) => void;
  /** Disable the built-in lightbox (you'll handle previews yourself). */
  disableLightbox?: boolean;
}

/**
 * Grid of images with a built-in lightbox. Built for image-generation
 * batches and vision-input galleries — pair with `<ImageMessage>` for
 * single-image surfaces.
 */
export function ImageGallery({
  images,
  columns = 3,
  activeIndex: controlledIndex,
  onSelect,
  disableLightbox = false,
  className,
  ...props
}: ImageGalleryProps) {
  const [internalIndex, setInternalIndex] = useState<number | null>(null);
  const activeIndex = controlledIndex ?? internalIndex;

  const open = (index: number) => {
    if (disableLightbox) {
      onSelect?.(index);
      return;
    }
    setInternalIndex(index);
    onSelect?.(index);
  };

  const close = () => setInternalIndex(null);
  const prev = () =>
    activeIndex != null && setInternalIndex((activeIndex - 1 + images.length) % images.length);
  const next = () => activeIndex != null && setInternalIndex((activeIndex + 1) % images.length);

  // Keyboard navigation in the lightbox.
  useEffect(() => {
    if (activeIndex == null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, images.length]);

  const colsClass =
    columns === 2 ? 'sm:grid-cols-2' : columns === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3';

  return (
    <>
      <div className={cn('grid grid-cols-1 gap-2', colsClass, className)} {...props}>
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => open(index)}
            aria-label={image.alt ?? image.name ?? `Image ${index + 1}`}
            className="border-border bg-muted group relative aspect-square overflow-hidden rounded-md border transition-transform hover:scale-[1.01]"
            style={{ aspectRatio: '1 / 1' }}
          >
            <img
              src={image.url}
              alt={image.alt ?? image.name ?? ''}
              loading="lazy"
              className="size-full object-cover"
            />
            {image.name && (
              <span className="bg-background/80 text-foreground absolute bottom-1 left-1 right-1 truncate rounded px-1.5 py-0.5 text-[10px] font-medium opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                {image.name}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeIndex != null && images[activeIndex] && (
        <Lightbox
          image={images[activeIndex]!}
          index={activeIndex}
          total={images.length}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}

function Lightbox({
  image,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  image: MediaAttachment;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt ?? image.name ?? 'Image preview'}
      className="bg-background/90 fixed inset-0 z-50 flex items-center justify-center backdrop-blur"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute inset-0 size-full cursor-zoom-out"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="bg-card text-foreground hover:bg-muted absolute right-4 top-4 grid size-9 place-items-center rounded-full transition-colors"
      >
        <X className="size-4" aria-hidden />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous"
            className="bg-card text-foreground hover:bg-muted absolute left-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full transition-colors"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next"
            className="bg-card text-foreground hover:bg-muted absolute right-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full transition-colors"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </>
      )}

      <figure
        className="relative z-10 flex max-h-[90vh] max-w-[92vw] flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.url}
          alt={image.alt ?? image.name ?? ''}
          className="border-border max-h-[80vh] max-w-full rounded-lg border object-contain shadow-2xl"
        />

        <figcaption className="bg-card border-border flex flex-wrap items-center gap-3 rounded-md border px-3 py-1.5 text-xs">
          <span className="text-foreground font-medium">
            {index + 1} / {total}
          </span>
          {image.name && (
            <>
              <span className="text-border" aria-hidden>
                |
              </span>
              <span className="text-muted-foreground">{image.name}</span>
            </>
          )}
          {image.width && image.height && (
            <>
              <span className="text-border" aria-hidden>
                |
              </span>
              <span className="text-muted-foreground tabular-nums">
                {image.width}×{image.height}
              </span>
            </>
          )}
          <a
            href={image.url}
            download
            className="text-primary ml-auto inline-flex items-center gap-1 hover:underline"
          >
            <Download className="size-3" aria-hidden />
            <span>download</span>
          </a>
        </figcaption>
      </figure>
    </div>
  );
}

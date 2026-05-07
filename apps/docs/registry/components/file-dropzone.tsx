'use client';

import { File as FileIcon, FileText, Image as ImageIcon, Upload, X } from 'lucide-react';
import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

export interface FileDropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Accepted MIME types (passed through to the file input). */
  accept?: string;
  /** Max file size in bytes. */
  maxSize?: number;
  /** Maximum number of files. */
  maxFiles?: number;
  /** Initial files (for controlled usage). */
  files?: readonly File[];
  /** Called when files are added or removed. */
  onFilesChange?: (files: File[]) => void;
}

/**
 * Drag-and-drop file uploader with thumbnails and validation. Used by
 * AI document pipelines for ingesting invoices, contracts, and POs.
 */
export const FileDropzone = forwardRef<HTMLDivElement, FileDropzoneProps>(function FileDropzone(
  {
    accept = 'application/pdf,image/*',
    maxSize = 25 * 1024 * 1024,
    maxFiles = 10,
    files: controlledFiles,
    onFilesChange,
    className,
    ...props
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(false);
  const [internal, setInternal] = useState<File[]>([]);
  const files = controlledFiles ?? internal;

  const update = useCallback(
    (next: File[]) => {
      const trimmed = next.slice(0, maxFiles);
      if (controlledFiles === undefined) setInternal(trimmed);
      onFilesChange?.(trimmed);
    },
    [controlledFiles, onFilesChange, maxFiles],
  );

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setActive(false);
    const dropped = Array.from(event.dataTransfer.files).filter((f) => f.size <= maxSize);
    update([...files, ...dropped]);
  };

  const onPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []).filter((f) => f.size <= maxSize);
    update([...files, ...picked]);
    event.target.value = '';
  };

  const remove = (index: number) => {
    update(files.filter((_, i) => i !== index));
  };

  return (
    <div ref={ref} className={cn('flex flex-col gap-3', className)} {...props}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setActive(true);
        }}
        onDragLeave={() => setActive(false)}
        onDrop={onDrop}
        data-active={active}
        className={cn(
          'border-border bg-background flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors',
          'hover:border-primary/60 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'data-[active=true]:border-primary data-[active=true]:bg-primary/5',
        )}
      >
        <div
          aria-hidden="true"
          className="bg-primary/10 text-primary grid size-10 place-items-center rounded-full"
        >
          <Upload className="size-5" />
        </div>
        <div>
          <p className="text-foreground text-sm font-medium">
            Drop files or <span className="text-primary underline">browse</span>
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {accept} · up to {(maxSize / 1024 / 1024).toFixed(0)} MB · max {maxFiles}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={onPick}
          className="sr-only"
          aria-label="Choose files to upload"
        />
      </div>

      {files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {files.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="border-border bg-card flex items-center gap-3 rounded-md border p-2"
            >
              <div
                aria-hidden="true"
                className="bg-muted text-muted-foreground grid size-9 shrink-0 place-items-center rounded-md"
              >
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="size-4" />
                ) : file.type === 'application/pdf' ? (
                  <FileText className="size-4" />
                ) : (
                  <FileIcon className="size-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm">{file.name}</p>
                <p className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => remove(idx)}
                aria-label={`Remove ${file.name}`}
                className="text-muted-foreground hover:bg-muted hover:text-foreground grid size-7 place-items-center rounded-md"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});

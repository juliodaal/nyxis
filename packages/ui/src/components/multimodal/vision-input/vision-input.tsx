'use client';

import { Camera, ImagePlus, X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type HTMLAttributes,
} from 'react';

import { cn } from '../../../lib/utils.js';

export interface VisionInputProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** Currently selected image (controlled). */
  value?: File | null;
  /** Default uncontrolled value. */
  defaultValue?: File | null;
  /** Called when the user picks, drops, or pastes a new image. */
  onChange?: (file: File | null) => void;
  /** Accept paste events from the document. Default true. */
  acceptPaste?: boolean;
  /** Show the camera button (uses `<input capture>`). Default true. */
  acceptCamera?: boolean;
  /** Maximum allowed file size in bytes. */
  maxBytes?: number;
  /** Disable the input. */
  disabled?: boolean;
  /** Custom placeholder text. */
  placeholder?: string;
}

/**
 * Vision-input dropzone tuned for sending images to vision-capable
 * models. Accepts drag-and-drop, file picker, paste, and (optionally)
 * camera capture. Surfaces a thumbnail + filename + remove control as
 * soon as a file is selected.
 */
export function VisionInput({
  value: controlledValue,
  defaultValue = null,
  onChange,
  acceptPaste = true,
  acceptCamera = true,
  maxBytes,
  disabled = false,
  placeholder = 'Drop, paste, or click to add an image',
  className,
  ...props
}: VisionInputProps) {
  const [internal, setInternal] = useState<File | null>(defaultValue);
  const file = controlledValue !== undefined ? controlledValue : internal;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const reactId = useId();
  const inputId = `nyxis-vision-${reactId}`;
  const cameraId = `nyxis-vision-cam-${reactId}`;
  const fileRef = useRef<HTMLInputElement>(null);

  // Derive a preview URL when the file changes.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const setFile = useCallback(
    (next: File | null) => {
      setError(null);
      if (next && maxBytes && next.size > maxBytes) {
        setError(`File too large (${formatBytes(next.size)} > ${formatBytes(maxBytes)})`);
        return;
      }
      if (next && !next.type.startsWith('image/')) {
        setError(`Not an image file (got ${next.type || 'unknown type'})`);
        return;
      }
      setInternal(next);
      onChange?.(next);
    },
    [maxBytes, onChange],
  );

  // Document-level paste handler.
  useEffect(() => {
    if (!acceptPaste || disabled) return;
    const handler = (e: globalThis.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const f = item.getAsFile();
          if (f) {
            e.preventDefault();
            setFile(f);
            return;
          }
        }
      }
    };
    document.addEventListener('paste', handler as never);
    return () => document.removeEventListener('paste', handler as never);
  }, [acceptPaste, disabled, setFile]);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setDragActive(true);
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    // Reset so the same file can be picked again.
    e.target.value = '';
  };

  const clear = () => setFile(null);

  // Surface inline paste events on the wrapper for keyboard users
  // who focus the dropzone and Cmd+V.
  const onWrapperPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    if (!acceptPaste || disabled) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const f = item.getAsFile();
        if (f) {
          e.preventDefault();
          setFile(f);
          return;
        }
      }
    }
  };

  return (
    <div
      data-state={file ? 'filled' : 'empty'}
      data-drag={dragActive || undefined}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={() => setDragActive(false)}
      onPaste={onWrapperPaste}
      tabIndex={disabled ? -1 : 0}
      role="region"
      aria-label="Vision input"
      className={cn(
        'border-border bg-card flex flex-col gap-2 rounded-lg border p-3 transition-colors',
        'data-[drag]:border-primary/60 data-[drag]:bg-primary/5',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
      {...props}
    >
      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt={file?.name ?? 'Selected image'}
            className="border-border max-h-64 w-full rounded-md border object-contain"
          />
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            aria-label="Remove image"
            className="bg-card text-foreground hover:bg-muted absolute right-2 top-2 grid size-7 place-items-center rounded-full shadow-md transition-colors"
          >
            <X className="size-3.5" aria-hidden />
          </button>
          <p className="text-muted-foreground mt-1.5 truncate font-mono text-[10px]">
            {file?.name} · {formatBytes(file?.size ?? 0)}
          </p>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={cn(
            'border-border flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed py-8',
            disabled && 'cursor-not-allowed',
          )}
        >
          <ImagePlus className="text-muted-foreground size-6" aria-hidden />
          <span className="text-muted-foreground text-xs font-medium">{placeholder}</span>
          {acceptPaste && (
            <span className="text-muted-foreground/70 text-[10px]">Cmd/Ctrl+V to paste</span>
          )}
        </label>
      )}

      <div className="flex items-center justify-between gap-2">
        <input
          id={inputId}
          ref={fileRef}
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={onPick}
          className="sr-only"
        />
        {acceptCamera && (
          <>
            <input
              id={cameraId}
              type="file"
              accept="image/*"
              capture="environment"
              disabled={disabled}
              onChange={onPick}
              className="sr-only"
            />
            <label
              htmlFor={cameraId}
              className={cn(
                'text-primary hover:bg-primary/10 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors',
                disabled && 'pointer-events-none opacity-50',
              )}
            >
              <Camera className="size-3" aria-hidden />
              Use camera
            </label>
          </>
        )}

        {error && <span className="text-destructive text-[10px] font-medium">{error}</span>}
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

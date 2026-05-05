'use client';

import { AlertCircle, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type FocusEvent,
} from 'react';

import { cn } from '../../../lib/utils.js';
import type { AIProviderId } from '../../../ai/types.js';

export type APIKeyInputStatus = 'idle' | 'validating' | 'valid' | 'invalid' | 'rate-limited';

export interface APIKeyInputProps {
  /** Provider this key targets — used purely for placeholder + helper text. */
  provider?: AIProviderId | string;
  /** Current value (controlled). */
  value?: string;
  /** Called on every keystroke. */
  onValueChange?: (value: string) => void;
  /** Default uncontrolled value. */
  defaultValue?: string;
  /**
   * Optional async validator. Called on blur (or with the explicit "validate"
   * button). Resolved status is reflected in the trailing icon.
   */
  validate?: (key: string) => Promise<APIKeyInputStatus>;
  /** Forced status — useful when validation lives elsewhere. */
  status?: APIKeyInputStatus;
  /** Override the placeholder. */
  placeholder?: string;
  /** Disable the field. */
  disabled?: boolean;
  /** Field id for accessibility. */
  id?: string;
  className?: string;
}

const PLACEHOLDERS: Record<string, string> = {
  anthropic: 'sk-ant-api03-...',
  openai: 'sk-...',
  google: 'AIza...',
  mistral: 'msk-...',
  ollama: '(local — no key required)',
};

const STATUS_LABEL: Record<APIKeyInputStatus, string> = {
  idle: '',
  validating: 'Validating',
  valid: 'Valid key',
  invalid: 'Invalid key',
  'rate-limited': 'Rate limited',
};

/**
 * Masked input for AI provider API keys with show/hide, validation status,
 * and provider-aware placeholder. Designed to live inside `<AIConfigCard>`.
 */
export const APIKeyInput = forwardRef<HTMLInputElement, APIKeyInputProps>(function APIKeyInput(
  {
    provider,
    value: controlledValue,
    onValueChange,
    defaultValue = '',
    validate,
    status: forcedStatus,
    placeholder,
    disabled,
    id,
    className,
  },
  forwardedRef,
) {
  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current as HTMLInputElement, []);

  const [internal, setInternal] = useState(defaultValue);
  const value = controlledValue ?? internal;
  const [revealed, setRevealed] = useState(false);
  const [autoStatus, setAutoStatus] = useState<APIKeyInputStatus>('idle');
  const status = forcedStatus ?? autoStatus;

  const update = (next: string) => {
    if (controlledValue === undefined) setInternal(next);
    onValueChange?.(next);
    if (autoStatus !== 'idle' && !forcedStatus) setAutoStatus('idle');
  };

  const onBlur = async (event: FocusEvent<HTMLInputElement>) => {
    if (!validate || !event.target.value || forcedStatus) return;
    setAutoStatus('validating');
    try {
      const next = await validate(event.target.value);
      setAutoStatus(next);
    } catch {
      setAutoStatus('invalid');
    }
  };

  // Reset auto-status when the provider changes (a key is per-provider).
  useEffect(() => {
    setAutoStatus('idle');
  }, [provider]);

  const showStatus = status !== 'idle';
  const StatusIcon =
    status === 'validating'
      ? Loader2
      : status === 'valid'
        ? Check
        : status === 'invalid' || status === 'rate-limited'
          ? AlertCircle
          : null;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div
        data-status={status}
        className={cn(
          'border-input bg-background flex h-10 items-center gap-2 rounded-md border px-3 text-sm transition-colors',
          'focus-within:ring-ring focus-within:ring-offset-background focus-within:ring-2 focus-within:ring-offset-2',
          'data-[status=invalid]:border-destructive data-[status=rate-limited]:border-warning data-[status=valid]:border-success',
        )}
      >
        <input
          ref={innerRef}
          id={id}
          type={revealed ? 'text' : 'password'}
          autoComplete="off"
          spellCheck={false}
          value={value}
          disabled={disabled}
          placeholder={placeholder ?? PLACEHOLDERS[provider ?? ''] ?? 'API key'}
          onChange={(e) => update(e.target.value)}
          onBlur={onBlur}
          aria-invalid={status === 'invalid' || status === 'rate-limited'}
          className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent font-mono text-xs outline-none disabled:opacity-50"
        />

        {StatusIcon ? (
          <StatusIcon
            aria-hidden="true"
            className={cn(
              'size-4 shrink-0',
              status === 'validating' && 'text-muted-foreground animate-spin',
              status === 'valid' && 'text-success',
              status === 'invalid' && 'text-destructive',
              status === 'rate-limited' && 'text-warning',
            )}
          />
        ) : null}

        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-label={revealed ? 'Hide API key' : 'Show API key'}
          aria-pressed={revealed}
          disabled={disabled || !value}
          className="text-muted-foreground hover:bg-muted hover:text-foreground grid size-7 place-items-center rounded-sm transition-colors disabled:opacity-50"
        >
          {revealed ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {showStatus ? (
        <p
          data-status={status}
          className={cn(
            'text-xs',
            'data-[status=valid]:text-success',
            'data-[status=validating]:text-muted-foreground',
            'data-[status=invalid]:text-destructive',
            'data-[status=rate-limited]:text-warning',
          )}
        >
          {STATUS_LABEL[status]}
        </p>
      ) : null}
    </div>
  );
});

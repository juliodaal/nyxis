'use client';

import { ArrowUp, Paperclip } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { cn } from '../../../lib/utils.js';

export interface ChatInputProps {
  /** Placeholder text. */
  placeholder?: string;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  /** Controlled value. */
  value?: string;
  /** Controlled change handler. */
  onValueChange?: (value: string) => void;
  /** Called on submit (Enter or send button). */
  onSubmit?: (value: string) => void;
  /** Show the attachment slot trigger. */
  attachments?: boolean;
  /** Disable the input + send button. */
  disabled?: boolean;
  /** Maximum lines before scroll. */
  maxRows?: number;
  className?: string;
}

/**
 * Auto-resizing chat composer with Enter-to-send and Shift+Enter newline.
 * Used by **AI Assistant** and **Support Copilot**.
 */
export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(function ChatInput(
  {
    placeholder = 'Type your message...',
    defaultValue = '',
    value: controlledValue,
    onValueChange,
    onSubmit,
    attachments = false,
    disabled = false,
    maxRows = 8,
    className,
  },
  forwardedRef,
) {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current as HTMLTextAreaElement, []);
  const [internal, setInternal] = useState(defaultValue);
  const value = controlledValue ?? internal;

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20');
    const max = lineHeight * maxRows;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  }, [value, maxRows]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit?.(trimmed);
    if (controlledValue === undefined) setInternal('');
    else onValueChange?.('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <form
      onSubmit={onFormSubmit}
      className={cn(
        'border-input bg-background shadow-soft flex items-end gap-2 rounded-xl border p-2',
        'focus-within:ring-ring focus-within:ring-offset-background focus-within:ring-2 focus-within:ring-offset-2',
        className,
      )}
    >
      {attachments ? (
        <button
          type="button"
          aria-label="Attach file"
          disabled={disabled}
          className="text-muted-foreground hover:bg-muted hover:text-foreground grid size-9 shrink-0 place-items-center rounded-md transition-colors disabled:opacity-50"
        >
          <Paperclip className="size-4" aria-hidden="true" />
        </button>
      ) : null}
      <textarea
        ref={innerRef}
        rows={1}
        value={value}
        onChange={(e) => {
          if (controlledValue === undefined) setInternal(e.target.value);
          onValueChange?.(e.target.value);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="text-foreground placeholder:text-muted-foreground flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        aria-label="Send message"
        disabled={disabled || value.trim().length === 0}
        className="bg-primary text-primary-foreground grid size-9 shrink-0 place-items-center rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <ArrowUp className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
});

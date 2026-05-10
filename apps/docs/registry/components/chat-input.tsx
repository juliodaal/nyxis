'use client';

import { useChatInput } from '@nyxis/core';
import { ArrowUp, Paperclip } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useRef, type FormEvent } from 'react';

import { cn } from '@/lib/utils';

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
 * Auto-resizing chat composer with Enter-to-send and Shift+Enter
 * newline. For AI assistants, support copilots, and agent interfaces.
 *
 * Powered by `useChatInput` from `@nyxis/core` — the state, derived
 * values, and keyboard handling live in a framework-agnostic
 * controller. Vue / Svelte / WC ports of this component reuse the
 * same controller via `createChatInputController`.
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

  const isControlled = controlledValue !== undefined;

  const headless = useChatInput({
    initialValue: defaultValue,
    disabled,
    onValueChange,
    onSubmit,
  });

  // Mirror controlled prop into the headless state so external resets work.
  useEffect(() => {
    if (isControlled && controlledValue !== headless.value) {
      headless.setValue(controlledValue);
    }
  }, [controlledValue, isControlled, headless]);

  const renderedValue = isControlled ? controlledValue : headless.value;

  // Auto-resize: framework-specific DOM access, not part of headless core.
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20');
    const max = lineHeight * maxRows;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  }, [renderedValue, maxRows]);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    headless.submit();
  };

  return (
    <form
      onSubmit={handleFormSubmit}
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
        value={renderedValue}
        onChange={(e) => headless.setValue(e.target.value)}
        onKeyDown={headless.handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="text-foreground placeholder:text-muted-foreground flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        aria-label="Send message"
        disabled={!headless.canSubmit}
        className="bg-primary text-primary-foreground grid size-9 shrink-0 place-items-center rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <ArrowUp className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
});

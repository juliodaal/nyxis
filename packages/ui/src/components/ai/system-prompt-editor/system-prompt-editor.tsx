'use client';

import { useEffect, useId, useMemo, useRef } from 'react';

import { cn } from '../../../lib/utils.js';
import { estimateTokens } from '@nyxis/core';

export interface SystemPromptEditorProps {
  /** Current value (controlled). */
  value?: string;
  /** Default uncontrolled value. */
  defaultValue?: string;
  /** Called on every keystroke. */
  onValueChange?: (value: string) => void;
  /** Placeholder text. */
  placeholder?: string;
  /** Hide the bottom utility bar (token count, variable list). */
  hideUtilityBar?: boolean;
  /** Maximum visual height in lines before scroll. */
  maxRows?: number;
  /** Disable the field. */
  disabled?: boolean;
  className?: string;
  id?: string;
}

const VARIABLE_RE = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_.]*)\s*\}\}/g;

/**
 * Editor for system prompts with auto-resize, live token estimate, and
 * automatic detection of `{{variables}}`. Pair with `<PromptVariableForm>`
 * (Phase K) to bind values for those variables.
 */
export function SystemPromptEditor({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  placeholder = 'You are a helpful assistant...',
  hideUtilityBar = false,
  maxRows = 14,
  disabled,
  className,
  id,
}: SystemPromptEditorProps) {
  const reactId = useId();
  const fieldId = id ?? `nyxis-system-prompt-${reactId}`;
  const ref = useRef<HTMLTextAreaElement>(null);

  const value = controlledValue ?? defaultValue;

  // Auto-resize.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20');
    const max = lineHeight * maxRows;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  }, [value, maxRows]);

  const variables = useMemo(() => {
    const found = new Set<string>();
    for (const match of value.matchAll(VARIABLE_RE)) {
      if (match[1]) found.add(match[1]);
    }
    return [...found];
  }, [value]);

  const tokens = useMemo(() => estimateTokens(value), [value]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={fieldId} className="text-foreground text-sm font-medium">
        System prompt
      </label>

      <div
        className={cn(
          'border-input bg-background rounded-md border transition-colors',
          'focus-within:ring-ring focus-within:ring-offset-background focus-within:ring-2 focus-within:ring-offset-2',
        )}
      >
        <textarea
          ref={ref}
          id={fieldId}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          spellCheck={false}
          rows={4}
          onChange={(e) => onValueChange?.(e.target.value)}
          className="text-foreground placeholder:text-muted-foreground block w-full resize-none bg-transparent p-3 font-mono text-xs leading-relaxed outline-none disabled:opacity-50"
        />
      </div>

      {!hideUtilityBar && (
        <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex flex-wrap items-center gap-1.5">
            {variables.length > 0 ? (
              <>
                <span>variables:</span>
                {variables.map((v) => (
                  <span
                    key={v}
                    className="border-border bg-card text-foreground rounded border px-1.5 py-0.5 font-mono text-[10px]"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </>
            ) : (
              <span className="text-muted-foreground">
                tip: use <code className="font-mono">{`{{name}}`}</code> for variables
              </span>
            )}
          </div>
          <span className="font-mono tabular-nums">~{tokens.toLocaleString()} tokens</span>
        </div>
      )}
    </div>
  );
}

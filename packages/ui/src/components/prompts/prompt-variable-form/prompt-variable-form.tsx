'use client';

import { useEffect, useId, useMemo, useState, type FormEvent, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';

const VARIABLE_RE = /\{\{\s*([a-zA-Z_][\w.]*)\s*\}\}/g;

export interface PromptVariableFormProps extends Omit<
  HTMLAttributes<HTMLFormElement>,
  'defaultValue' | 'onSubmit'
> {
  /** Prompt body — `{{variables}}` are auto-extracted. */
  template: string;
  /** Controlled values keyed by variable name. */
  value?: Record<string, string>;
  /** Default uncontrolled values. */
  defaultValue?: Record<string, string>;
  /** Called on every change. */
  onValueChange?: (value: Record<string, string>) => void;
  /** Render multiline `<textarea>` for variables longer than this many chars in the default. */
  multilineThreshold?: number;
  /** Optional submit button label. */
  submitLabel?: string;
  /** Called with the bound values on submit. */
  onSubmit?: (value: Record<string, string>, bound: { template: string; rendered: string }) => void;
  /** Disable the entire form. */
  disabled?: boolean;
  /** Show a live preview of the rendered template. */
  preview?: boolean;
}

/**
 * Auto-detects `{{variables}}` from a prompt template and renders a
 * field per variable. Pair with `<PromptCard>` (selection) and the
 * resulting bound values can be passed to your model call directly.
 */
export function PromptVariableForm({
  template,
  value: controlledValue,
  defaultValue,
  onValueChange,
  multilineThreshold = 80,
  submitLabel,
  onSubmit,
  disabled = false,
  preview = false,
  className,
  ...props
}: PromptVariableFormProps) {
  const variables = useMemo(() => {
    const found = new Set<string>();
    for (const match of template.matchAll(VARIABLE_RE)) {
      if (match[1]) found.add(match[1]);
    }
    return [...found];
  }, [template]);

  const [internal, setInternal] = useState<Record<string, string>>(
    () => controlledValue ?? defaultValue ?? {},
  );
  const value = controlledValue ?? internal;

  // When the template variables change, drop stale keys from internal
  // so we don't keep unrelated values around.
  useEffect(() => {
    if (controlledValue) return;
    setInternal((prev) => {
      const next: Record<string, string> = {};
      for (const v of variables) next[v] = prev[v] ?? '';
      return next;
    });
  }, [variables, controlledValue]);

  const update = (name: string, next: string) => {
    const merged = { ...value, [name]: next };
    setInternal(merged);
    onValueChange?.(merged);
  };

  const rendered = useMemo(
    () =>
      template.replace(VARIABLE_RE, (_, key: string) => (value[key] ? value[key]! : `{{${key}}}`)),
    [template, value],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(value, { template, rendered });
  };

  const allFilled = variables.every((v) => value[v]?.trim());

  return (
    <form
      onSubmit={handleSubmit}
      aria-disabled={disabled}
      className={cn('flex flex-col gap-3', className)}
      {...props}
    >
      {variables.length === 0 ? (
        <p className="text-muted-foreground rounded-md border border-dashed py-3 text-center text-[11px]">
          This template has no variables.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {variables.map((name) => (
            <Field
              key={name}
              name={name}
              value={value[name] ?? ''}
              onChange={(v) => update(name, v)}
              disabled={disabled}
              multiline={(value[name] ?? '').length > multilineThreshold}
            />
          ))}
        </ul>
      )}

      {preview && (
        <div className="border-border bg-muted/30 rounded-md border p-2.5">
          <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
            Preview
          </p>
          <pre className="text-foreground/90 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed">
            {rendered}
          </pre>
        </div>
      )}

      {submitLabel && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-[10px] font-medium">
            {variables.filter((v) => value[v]?.trim()).length} / {variables.length} filled
          </span>
          <button
            type="submit"
            disabled={disabled || !allFilled}
            className={cn(
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium',
              'disabled:opacity-50',
              'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            )}
          >
            {submitLabel}
          </button>
        </div>
      )}
    </form>
  );
}

function Field({
  name,
  value,
  onChange,
  disabled,
  multiline,
}: {
  name: string;
  value: string;
  onChange: (next: string) => void;
  disabled: boolean;
  multiline: boolean;
}) {
  const reactId = useId();
  const id = `nyxis-promptvar-${name}-${reactId}`;
  return (
    <li className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-foreground inline-flex items-center gap-1 text-[11px] font-medium"
      >
        <code className="bg-muted text-foreground/80 rounded px-1 py-0.5 font-mono text-[10px]">{`{{${name}}}`}</code>
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          rows={3}
          disabled={disabled}
          placeholder={`Enter ${name}…`}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'border-input bg-background text-foreground placeholder:text-muted-foreground',
            'min-h-[3rem] w-full resize-y rounded-md border px-2.5 py-1.5 text-xs leading-relaxed',
            'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:opacity-50',
          )}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          disabled={disabled}
          placeholder={`Enter ${name}…`}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'border-input bg-background text-foreground placeholder:text-muted-foreground',
            'h-8 w-full rounded-md border px-2.5 text-xs',
            'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:opacity-50',
          )}
        />
      )}
    </li>
  );
}

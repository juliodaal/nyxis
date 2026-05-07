'use client';

import { useId, useState, type FormEvent } from 'react';

import { cn } from '@/lib/utils';

/**
 * Minimal subset of JSON Schema we render natively. For richer schemas,
 * pass `customField` to override per-field rendering.
 */
export interface ParameterField {
  name: string;
  /** Human label; defaults to the prettified name. */
  label?: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'string[]' | 'json';
  required?: boolean;
  /** For `enum` / `string[]` — the available options. */
  options?: readonly string[];
  /** Default placeholder. */
  placeholder?: string;
  /** Default value (uncontrolled). */
  defaultValue?: unknown;
}

export interface ParameterFormProps {
  /** Field schema. Pass an array for ordered fields. */
  fields: readonly ParameterField[];
  /** Controlled values keyed by field name. */
  value?: Record<string, unknown>;
  /** Default uncontrolled values. */
  defaultValue?: Record<string, unknown>;
  /** Called on every change. */
  onValueChange?: (value: Record<string, unknown>) => void;
  /** If provided, renders a submit button with this label. */
  submitLabel?: string;
  /** Called with the current values when the user submits the form. */
  onSubmit?: (value: Record<string, unknown>) => void;
  /** Disable the entire form. */
  disabled?: boolean;
  className?: string;
}

/**
 * Auto-generated form for tool parameters. Built for the common AI
 * use-case: a model proposes a tool call with N parameters, the user
 * tweaks them before invoking the tool. Supports primitives + enum +
 * string list + raw JSON for escape hatches.
 */
export function ParameterForm({
  fields,
  value: controlledValue,
  defaultValue,
  onValueChange,
  submitLabel,
  onSubmit,
  disabled,
  className,
}: ParameterFormProps) {
  const [internal, setInternal] = useState<Record<string, unknown>>(
    () => controlledValue ?? defaultValue ?? initialFromFields(fields),
  );
  const value = controlledValue ?? internal;

  const update = (name: string, next: unknown) => {
    const merged = { ...value, [name]: next };
    setInternal(merged);
    onValueChange?.(merged);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-3.5', className)}
      aria-disabled={disabled}
    >
      {fields.map((field) => (
        <Field
          key={field.name}
          field={field}
          value={value[field.name]}
          onChange={(next) => update(field.name, next)}
          disabled={disabled ?? false}
        />
      ))}

      {submitLabel && (
        <div className="mt-1 flex justify-end">
          <button
            type="submit"
            disabled={disabled}
            className={cn(
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium',
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
  field,
  value,
  onChange,
  disabled,
}: {
  field: ParameterField;
  value: unknown;
  onChange: (next: unknown) => void;
  disabled: boolean;
}) {
  const reactId = useId();
  const id = `nyxis-param-${field.name}-${reactId}`;
  const label = field.label ?? prettify(field.name);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-foreground inline-flex items-center gap-1 text-xs font-medium"
      >
        <span>{label}</span>
        {field.required && (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        )}
        <code className="text-muted-foreground ml-1 font-mono text-[10px]">{field.type}</code>
      </label>

      {field.description && (
        <p className="text-muted-foreground text-[11px] leading-snug">{field.description}</p>
      )}

      {field.type === 'string' && (
        <input
          id={id}
          type="text"
          disabled={disabled}
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}

      {field.type === 'number' && (
        <input
          id={id}
          type="number"
          inputMode="decimal"
          disabled={disabled}
          placeholder={field.placeholder}
          value={value === undefined || value === null || value === '' ? '' : Number(value)}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          className={inputClass}
        />
      )}

      {field.type === 'boolean' && (
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          disabled={disabled}
          onClick={() => onChange(!value)}
          className={cn(
            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
            value ? 'bg-primary' : 'bg-muted',
            'disabled:opacity-50',
          )}
        >
          <span
            className={cn(
              'bg-background block size-4 rounded-full shadow-sm transition-transform',
              value ? 'translate-x-4' : 'translate-x-0.5',
            )}
          />
        </button>
      )}

      {field.type === 'enum' && field.options && (
        <select
          id={id}
          disabled={disabled}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value || undefined)}
          className={inputClass}
        >
          <option value="">{field.placeholder ?? '— pick one —'}</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {field.type === 'string[]' && (
        <ChipInput
          id={id}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
          options={field.options}
          placeholder={field.placeholder}
          disabled={disabled}
        />
      )}

      {field.type === 'json' && (
        <textarea
          id={id}
          disabled={disabled}
          placeholder={field.placeholder ?? '{}'}
          rows={4}
          value={typeof value === 'string' ? value : JSON.stringify(value ?? {}, null, 2)}
          onChange={(e) => onChange(safeParseJson(e.target.value))}
          className={cn(inputClass, 'font-mono text-[11px] leading-relaxed')}
        />
      )}
    </div>
  );
}

function ChipInput({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  id: string;
  value: readonly string[];
  onChange: (next: readonly string[]) => void;
  options?: readonly string[] | undefined;
  placeholder?: string | undefined;
  disabled: boolean;
}) {
  const [draft, setDraft] = useState('');
  const add = (raw: string) => {
    const v = raw.trim();
    if (!v || value.includes(v)) return;
    onChange([...value, v]);
    setDraft('');
  };

  return (
    <div
      className={cn(
        'border-input bg-background flex flex-wrap items-center gap-1.5 rounded-md border p-1.5',
        'focus-within:ring-ring focus-within:ring-offset-background focus-within:ring-2 focus-within:ring-offset-2',
      )}
    >
      {value.map((chip) => (
        <span
          key={chip}
          className="bg-muted text-foreground inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs"
        >
          {chip}
          {!disabled && (
            <button
              type="button"
              aria-label={`Remove ${chip}`}
              onClick={() => onChange(value.filter((v) => v !== chip))}
              className="hover:text-destructive opacity-60 transition-opacity"
            >
              ×
            </button>
          )}
        </span>
      ))}

      {options ? (
        <select
          id={id}
          disabled={disabled}
          value=""
          onChange={(e) => add(e.target.value)}
          className="bg-transparent text-xs outline-none"
        >
          <option value="">{placeholder ?? '+ add'}</option>
          {options
            .filter((o) => !value.includes(o))
            .map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
        </select>
      ) : (
        <input
          id={id}
          type="text"
          disabled={disabled}
          placeholder={placeholder ?? 'add and press Enter'}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add(draft);
            }
            if (e.key === 'Backspace' && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          className="text-foreground min-w-[8ch] flex-1 bg-transparent text-xs outline-none"
        />
      )}
    </div>
  );
}

const inputClass = cn(
  'border-input bg-background text-foreground placeholder:text-muted-foreground',
  'h-9 w-full rounded-md border px-3 text-sm',
  'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:opacity-50',
);

function initialFromFields(fields: readonly ParameterField[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.defaultValue !== undefined) result[f.name] = f.defaultValue;
    else if (f.type === 'boolean') result[f.name] = false;
    else if (f.type === 'string[]') result[f.name] = [];
  }
  return result;
}

function prettify(name: string) {
  return name
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase());
}

function safeParseJson(text: string): unknown {
  if (!text.trim()) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

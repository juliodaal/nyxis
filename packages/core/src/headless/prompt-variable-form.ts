/**
 * Framework-agnostic prompt-variable-form controller.
 *
 * Validates the "composed state" case of the headless pattern:
 * - Template is mutable input.
 * - `variables` is derived from the template (regex extraction).
 * - `values` is a per-variable map that mirrors the variables.
 * - `rendered` is the template with variables substituted.
 * - `filledCount` / `allFilled` are progress signals.
 *
 * Keeping the map-trimming logic (drop stale keys when variables
 * change) inside the controller means consumers don't have to
 * re-implement it for every framework adapter.
 */

const VARIABLE_RE = /\{\{\s*([a-zA-Z_][\w.]*)\s*\}\}/g;

export interface PromptVariableFormState {
  template: string;
  values: Readonly<Record<string, string>>;
}

export interface PromptVariableFormDerived {
  /** Variable names in declaration order, deduplicated. */
  variables: readonly string[];
  /** Template with `{{vars}}` substituted; missing vars stay as placeholders. */
  rendered: string;
  /** Number of variables with a non-empty (trimmed) value. */
  filledCount: number;
  /** True when every variable has a non-empty value. */
  allFilled: boolean;
}

export interface PromptVariableFormOptions {
  /** Starting template; defaults to `''`. */
  initialTemplate?: string;
  /** Starting values; keys outside the template's variables are kept until next template change. */
  initialValues?: Record<string, string>;
  /** Called whenever `values` changes (typing, programmatic set, template-trim). */
  onValueChange?: (values: Record<string, string>) => void;
  /** Called on `submit()` if every variable is filled. */
  onSubmit?: (
    values: Record<string, string>,
    bound: { template: string; rendered: string },
  ) => void;
}

export interface PromptVariableFormController {
  getState: () => PromptVariableFormState;
  getDerived: () => PromptVariableFormDerived;
  /** Replace the template. Strips stale variable values automatically. */
  setTemplate: (template: string) => void;
  /** Set one variable's value. */
  setValue: (name: string, value: string) => void;
  /** Replace the whole values map. */
  setValues: (values: Record<string, string>) => void;
  /** Fire `onSubmit` if `allFilled`, otherwise no-op. */
  submit: () => boolean;
  subscribe: (listener: () => void) => () => void;
}

function extractVariables(template: string): readonly string[] {
  const seen = new Set<string>();
  for (const match of template.matchAll(VARIABLE_RE)) {
    if (match[1]) seen.add(match[1]);
  }
  return [...seen];
}

function renderTemplate(template: string, values: Readonly<Record<string, string>>): string {
  return template.replace(VARIABLE_RE, (raw, key: string) => {
    const v = values[key];
    return v && v.length > 0 ? v : raw;
  });
}

export function createPromptVariableFormController(
  options: PromptVariableFormOptions = {},
): PromptVariableFormController {
  let state: PromptVariableFormState = {
    template: options.initialTemplate ?? '',
    values: { ...(options.initialValues ?? {}) },
  };

  const listeners = new Set<() => void>();
  const notify = (): void => {
    for (const listener of listeners) listener();
  };

  /** Trim values to only those whose key is in the template's variables. */
  const trimValuesToTemplate = (
    values: Record<string, string>,
    template: string,
  ): Record<string, string> => {
    const next: Record<string, string> = {};
    for (const v of extractVariables(template)) {
      next[v] = values[v] ?? '';
    }
    return next;
  };

  const setTemplate = (template: string): void => {
    if (state.template === template) return;
    const nextValues = trimValuesToTemplate({ ...state.values }, template);
    state = { template, values: nextValues };
    options.onValueChange?.({ ...nextValues });
    notify();
  };

  const setValue = (name: string, value: string): void => {
    if (state.values[name] === value) return;
    const nextValues = { ...state.values, [name]: value };
    state = { ...state, values: nextValues };
    options.onValueChange?.({ ...nextValues });
    notify();
  };

  const setValues = (values: Record<string, string>): void => {
    const nextValues = { ...values };
    state = { ...state, values: nextValues };
    options.onValueChange?.({ ...nextValues });
    notify();
  };

  const submit = (): boolean => {
    const variables = extractVariables(state.template);
    const allFilled = variables.every((v) => (state.values[v] ?? '').trim().length > 0);
    if (!allFilled) return false;
    const rendered = renderTemplate(state.template, state.values);
    options.onSubmit?.({ ...state.values }, { template: state.template, rendered });
    return true;
  };

  return {
    getState: () => state,
    getDerived: (): PromptVariableFormDerived => {
      const variables = extractVariables(state.template);
      const filledCount = variables.filter((v) => (state.values[v] ?? '').trim().length > 0).length;
      return {
        variables,
        rendered: renderTemplate(state.template, state.values),
        filledCount,
        allFilled: variables.length > 0 && filledCount === variables.length,
      };
    },
    setTemplate,
    setValue,
    setValues,
    submit,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

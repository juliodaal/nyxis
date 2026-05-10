'use client';

import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';

import {
  createPromptVariableFormController,
  type PromptVariableFormController,
  type PromptVariableFormDerived,
  type PromptVariableFormOptions,
  type PromptVariableFormState,
} from '../headless/prompt-variable-form.js';

export interface UsePromptVariableFormReturn
  extends PromptVariableFormState, PromptVariableFormDerived {
  setTemplate: (template: string) => void;
  setValue: (name: string, value: string) => void;
  setValues: (values: Record<string, string>) => void;
  submit: () => boolean;
}

/**
 * React adapter over `createPromptVariableFormController`.
 *
 * When the `template` option changes between renders, the hook calls
 * `setTemplate` on the controller, which prunes stale variable values
 * and notifies subscribers. The controller itself is stable across
 * renders so `setValue` references don't churn.
 */
export function usePromptVariableForm(
  options: PromptVariableFormOptions = {},
): UsePromptVariableFormReturn {
  const ref = useRef<PromptVariableFormController | null>(null);
  ref.current ??= createPromptVariableFormController(options);
  const controller = ref.current;

  // Sync template prop into the controller when it changes externally.
  useEffect(() => {
    if (options.initialTemplate !== undefined) {
      controller.setTemplate(options.initialTemplate);
    }
  }, [options.initialTemplate, controller]);

  const state = useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );

  // `state` is the trigger for recomputing — controller.getDerived reads the
  // latest snapshot internally. ESLint doesn't see the dependency edge.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const derived = useMemo<PromptVariableFormDerived>(() => controller.getDerived(), [state]);

  return {
    ...state,
    ...derived,
    setTemplate: controller.setTemplate,
    setValue: controller.setValue,
    setValues: controller.setValues,
    submit: controller.submit,
  };
}

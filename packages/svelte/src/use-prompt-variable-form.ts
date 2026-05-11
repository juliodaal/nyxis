import {
  createPromptVariableFormController,
  type PromptVariableFormDerived,
  type PromptVariableFormOptions,
  type PromptVariableFormState,
} from '@nyxis/core';
import { readable, type Readable } from 'svelte/store';

/**
 * Svelte adapter for the prompt-variable-form controller. Template,
 * values map, extracted variables, rendered preview, and fill-progress
 * are all kept in sync through the framework-agnostic controller.
 */
export interface UsePromptVariableFormReturn {
  state: Readable<PromptVariableFormState>;
  derived: Readable<PromptVariableFormDerived>;
  setTemplate: (template: string) => void;
  setValue: (name: string, value: string) => void;
  setValues: (values: Record<string, string>) => void;
  submit: () => boolean;
}

export function usePromptVariableForm(
  options: PromptVariableFormOptions = {},
): UsePromptVariableFormReturn {
  const controller = createPromptVariableFormController(options);

  // Sync to the current snapshot on first subscribe so mutations made
  // between construction and subscription are reflected.
  const state = readable<PromptVariableFormState>(controller.getState(), (set) => {
    set(controller.getState());
    return controller.subscribe(() => set(controller.getState()));
  });

  const derived = readable<PromptVariableFormDerived>(controller.getDerived(), (set) => {
    set(controller.getDerived());
    return controller.subscribe(() => set(controller.getDerived()));
  });

  return {
    state,
    derived,
    setTemplate: controller.setTemplate,
    setValue: controller.setValue,
    setValues: controller.setValues,
    submit: controller.submit,
  };
}

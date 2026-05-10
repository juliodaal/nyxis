import {
  createPromptVariableFormController,
  type PromptVariableFormDerived,
  type PromptVariableFormOptions,
  type PromptVariableFormState,
} from '@nyxis/core';
import { onScopeDispose, reactive, readonly, type DeepReadonly } from 'vue';

/**
 * Vue 3 composable over the prompt-variable-form controller. Template,
 * values map, extracted variables, rendered preview, and fill-progress
 * are all kept in lockstep through the framework-agnostic controller.
 */
export interface UsePromptVariableFormReturn {
  state: DeepReadonly<PromptVariableFormState>;
  derived: DeepReadonly<PromptVariableFormDerived>;
  setTemplate: (template: string) => void;
  setValue: (name: string, value: string) => void;
  setValues: (values: Record<string, string>) => void;
  submit: () => boolean;
}

export function usePromptVariableForm(
  options: PromptVariableFormOptions = {},
): UsePromptVariableFormReturn {
  const controller = createPromptVariableFormController(options);
  const snap0 = controller.getState();
  const derived0 = controller.getDerived();

  const state = reactive<PromptVariableFormState>({
    template: snap0.template,
    values: { ...snap0.values },
  });
  const derived = reactive<PromptVariableFormDerived>({
    variables: [...derived0.variables],
    rendered: derived0.rendered,
    filledCount: derived0.filledCount,
    allFilled: derived0.allFilled,
  });

  const unsubscribe = controller.subscribe(() => {
    const next = controller.getState();
    const nextDerived = controller.getDerived();

    state.template = next.template;
    // Prune keys removed by setTemplate, then merge new ones, so Vue's
    // proxy keeps reactive notifications consistent for downstream `v-for`s.
    for (const k of Object.keys(state.values)) {
      if (!(k in next.values)) delete (state.values as Record<string, string>)[k];
    }
    Object.assign(state.values, next.values);

    // For derived, replace the variables array wholesale; primitives copy fine.
    derived.variables = [...nextDerived.variables];
    derived.rendered = nextDerived.rendered;
    derived.filledCount = nextDerived.filledCount;
    derived.allFilled = nextDerived.allFilled;
  });
  onScopeDispose(unsubscribe);

  return {
    state: readonly(state),
    derived: readonly(derived),
    setTemplate: controller.setTemplate,
    setValue: controller.setValue,
    setValues: controller.setValues,
    submit: controller.submit,
  };
}

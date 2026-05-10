import {
  createChatInputController,
  type ChatInputDerived,
  type ChatInputOptions,
  type ChatInputState,
  type KeyboardLike,
} from '@nyxis/core';
import { onScopeDispose, reactive, readonly, type DeepReadonly } from 'vue';

/**
 * Vue 3 composable over the framework-agnostic `chat-input` controller.
 *
 * Both `state` and `derived` are mirrored as Vue reactive objects;
 * Vue's tracking picks up template accesses automatically. The
 * subscription is torn down via `onScopeDispose` so consumers don't
 * leak listeners on component unmount.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useChatInput } from '@nyxis/vue';
 * const { state, derived, setValue, submit, handleKeyDown } = useChatInput({
 *   onSubmit: (msg) => console.log('sent:', msg),
 * });
 * </script>
 *
 * <template>
 *   <textarea
 *     :value="state.value"
 *     @input="(e) => setValue((e.target as HTMLTextAreaElement).value)"
 *     @keydown="(e) => handleKeyDown(e)"
 *   />
 *   <button :disabled="!derived.canSubmit" @click="submit">Send</button>
 * </template>
 * ```
 */
export interface UseChatInputReturn {
  /** Read-only reactive snapshot of `ChatInputState`. */
  state: DeepReadonly<ChatInputState>;
  /** Read-only reactive snapshot of derived values. */
  derived: DeepReadonly<ChatInputDerived>;
  setValue: (value: string) => void;
  clear: () => void;
  submit: () => void;
  setDisabled: (disabled: boolean) => void;
  handleKeyDown: (e: KeyboardLike) => void;
}

export function useChatInput(options: ChatInputOptions = {}): UseChatInputReturn {
  const controller = createChatInputController(options);
  const state = reactive<ChatInputState>({ ...controller.getState() });
  const derived = reactive<ChatInputDerived>({ ...controller.getDerived() });

  const unsubscribe = controller.subscribe(() => {
    Object.assign(state, controller.getState());
    Object.assign(derived, controller.getDerived());
  });
  onScopeDispose(unsubscribe);

  return {
    state: readonly(state),
    derived: readonly(derived),
    setValue: controller.setValue,
    clear: controller.clear,
    submit: controller.submit,
    setDisabled: controller.setDisabled,
    handleKeyDown: controller.handleKeyDown,
  };
}

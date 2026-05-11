import {
  createChatInputController,
  type ChatInputDerived,
  type ChatInputOptions,
  type ChatInputState,
  type KeyboardLike,
} from '@nyxis/core';
import { readable, type Readable } from 'svelte/store';

/**
 * Svelte adapter for the framework-agnostic `chat-input` controller.
 *
 * Returns Svelte readable stores backed by the controller. The store
 * subscribes to the controller the first time a consumer subscribes,
 * and unsubscribes when the last consumer leaves — so consumers don't
 * have to wire `onDestroy`. The action functions (`setValue`,
 * `submit`, etc.) come straight from the controller.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useChatInput } from '@nyxis/svelte';
 *   const { state, derived, setValue, submit, handleKeyDown } = useChatInput({
 *     onSubmit: (msg) => console.log('sent:', msg),
 *   });
 * </script>
 *
 * <textarea
 *   value={$state.value}
 *   on:input={(e) => setValue(e.currentTarget.value)}
 *   on:keydown={(e) => handleKeyDown(e)}
 * />
 * <button disabled={!$derived.canSubmit} on:click={submit}>Send</button>
 * ```
 */
export interface UseChatInputReturn {
  state: Readable<ChatInputState>;
  derived: Readable<ChatInputDerived>;
  setValue: (value: string) => void;
  clear: () => void;
  submit: () => void;
  setDisabled: (disabled: boolean) => void;
  handleKeyDown: (e: KeyboardLike) => void;
}

export function useChatInput(options: ChatInputOptions = {}): UseChatInputReturn {
  const controller = createChatInputController(options);

  // The start function runs on first subscribe. We re-sync to the
  // current controller snapshot then, so mutations made between
  // construction and the first subscribe are picked up.
  const state = readable<ChatInputState>(controller.getState(), (set) => {
    set(controller.getState());
    return controller.subscribe(() => set(controller.getState()));
  });

  const derived = readable<ChatInputDerived>(controller.getDerived(), (set) => {
    set(controller.getDerived());
    return controller.subscribe(() => set(controller.getDerived()));
  });

  return {
    state,
    derived,
    setValue: controller.setValue,
    clear: controller.clear,
    submit: controller.submit,
    setDisabled: controller.setDisabled,
    handleKeyDown: controller.handleKeyDown,
  };
}

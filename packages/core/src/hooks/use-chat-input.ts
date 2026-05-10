'use client';

import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';

import {
  createChatInputController,
  type ChatInputDerived,
  type ChatInputOptions,
  type ChatInputState,
  type KeyboardLike,
} from '../headless/chat-input.js';

export interface UseChatInputReturn extends ChatInputState, ChatInputDerived {
  /** Replace the value (typing, programmatic). */
  setValue: (value: string) => void;
  /** Clear the input. */
  clear: () => void;
  /** Submit the current value if `canSubmit`. */
  submit: () => void;
  /** Toggle disabled at runtime. */
  setDisabled: (disabled: boolean) => void;
  /** Enter submits, Shift+Enter newline. */
  handleKeyDown: (e: KeyboardLike) => void;
}

/**
 * React adapter over the framework-agnostic chat-input controller.
 *
 * The controller is created once and survives across renders. State
 * snapshots are pulled via `useSyncExternalStore`, which means React
 * 18+ handles tearing correctly and SSR returns the initial snapshot.
 *
 * Pass `disabled` to keep the controller in sync with the parent's
 * disabled state — `useEffect` mirrors it into the controller so
 * derived `canSubmit` updates correctly without prop drilling.
 *
 * @example
 * ```tsx
 * function ChatInput() {
 *   const { value, setValue, submit, canSubmit, handleKeyDown } = useChatInput({
 *     onSubmit: (msg) => console.log('sent:', msg),
 *   });
 *   return (
 *     <textarea
 *       value={value}
 *       onChange={(e) => setValue(e.target.value)}
 *       onKeyDown={handleKeyDown}
 *     />
 *   );
 * }
 * ```
 */
export function useChatInput(options: ChatInputOptions = {}): UseChatInputReturn {
  // Stable controller across renders. We only construct once.
  const controllerRef = useRef<ReturnType<typeof createChatInputController> | null>(null);
  controllerRef.current ??= createChatInputController(options);
  const controller = controllerRef.current;

  // Mirror the prop into controller state so canSubmit derivation
  // updates when consumers toggle `disabled` at runtime.
  useEffect(() => {
    if (options.disabled !== undefined) controller.setDisabled(options.disabled);
  }, [options.disabled, controller]);

  const state = useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );

  // Derived values are computed from `state`; memoise to keep
  // referential stability.
  const derived = useMemo<ChatInputDerived>(
    () => ({
      trimmed: state.value.trim(),
      canSubmit: state.value.trim().length > 0 && !state.disabled,
    }),
    [state.value, state.disabled],
  );

  return {
    ...state,
    ...derived,
    setValue: controller.setValue,
    clear: controller.clear,
    submit: controller.submit,
    setDisabled: controller.setDisabled,
    handleKeyDown: controller.handleKeyDown,
  };
}

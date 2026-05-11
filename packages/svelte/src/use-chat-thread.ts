import {
  createChatThreadController,
  type ChatThreadDerived,
  type ChatThreadOptions,
  type ChatThreadState,
  type ScrollMetrics,
} from '@nyxis/core';
import { readable, type Readable } from 'svelte/store';

/**
 * Svelte adapter for the chat-thread controller. The DOM concerns
 * (refs, scrollIntoView) stay in the `.svelte` component; the
 * decision logic (am I at the bottom?) lives in the controller.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useChatThread } from '@nyxis/svelte';
 *   let container: HTMLDivElement;
 *   let end: HTMLDivElement;
 *   const { state, derived, recordScroll, pinToBottom } = useChatThread();
 *
 *   function onScroll() {
 *     recordScroll({
 *       scrollTop: container.scrollTop,
 *       scrollHeight: container.scrollHeight,
 *       clientHeight: container.clientHeight,
 *     });
 *   }
 * </script>
 * ```
 */
export interface UseChatThreadReturn {
  state: Readable<ChatThreadState>;
  derived: Readable<ChatThreadDerived>;
  recordScroll: (metrics: ScrollMetrics) => void;
  pinToBottom: () => void;
  setStickToBottom: (sticky: boolean) => void;
}

export function useChatThread(options: ChatThreadOptions = {}): UseChatThreadReturn {
  const controller = createChatThreadController(options);

  // Sync to the current snapshot on first subscribe so mutations made
  // between construction and subscription are reflected.
  const state = readable<ChatThreadState>(controller.getState(), (set) => {
    set(controller.getState());
    return controller.subscribe(() => set(controller.getState()));
  });

  const derived = readable<ChatThreadDerived>(controller.getDerived(), (set) => {
    set(controller.getDerived());
    return controller.subscribe(() => set(controller.getDerived()));
  });

  return {
    state,
    derived,
    recordScroll: controller.recordScroll,
    pinToBottom: controller.pinToBottom,
    setStickToBottom: controller.setStickToBottom,
  };
}

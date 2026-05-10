import {
  createChatThreadController,
  type ChatThreadDerived,
  type ChatThreadOptions,
  type ChatThreadState,
  type ScrollMetrics,
} from '@nyxis/core';
import { onScopeDispose, reactive, readonly, type DeepReadonly } from 'vue';

/**
 * Vue 3 composable over the chat-thread controller. The decision
 * logic (am I at the bottom?) is framework-free; the consumer wires
 * the container's `@scroll` to `recordScroll` and calls
 * `scrollIntoView()` from a Vue-side ref.
 */
export interface UseChatThreadReturn {
  state: DeepReadonly<ChatThreadState>;
  derived: DeepReadonly<ChatThreadDerived>;
  recordScroll: (metrics: ScrollMetrics) => void;
  pinToBottom: () => void;
  setStickToBottom: (sticky: boolean) => void;
}

export function useChatThread(options: ChatThreadOptions = {}): UseChatThreadReturn {
  const controller = createChatThreadController(options);
  const state = reactive<ChatThreadState>({ ...controller.getState() });
  const derived = reactive<ChatThreadDerived>({ ...controller.getDerived() });

  const unsubscribe = controller.subscribe(() => {
    Object.assign(state, controller.getState());
    Object.assign(derived, controller.getDerived());
  });
  onScopeDispose(unsubscribe);

  return {
    state: readonly(state),
    derived: readonly(derived),
    recordScroll: controller.recordScroll,
    pinToBottom: controller.pinToBottom,
    setStickToBottom: controller.setStickToBottom,
  };
}

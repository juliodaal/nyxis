/**
 * Svelte adapters for `@nyxis/core` headless controllers.
 *
 * The pattern: every composable returns Svelte `readable` stores
 * backed by the controller. Subscription happens lazily on first
 * `subscribe` and is torn down when the last subscriber leaves —
 * no manual `onDestroy` calls in consumer components.
 *
 * Works with both Svelte 4 (stores) and Svelte 5 (stores still
 * supported alongside runes).
 */

export { useChatInput, type UseChatInputReturn } from './use-chat-input.js';
export { useChatThread, type UseChatThreadReturn } from './use-chat-thread.js';
export {
  usePromptVariableForm,
  type UsePromptVariableFormReturn,
} from './use-prompt-variable-form.js';
export { useTokenCounter } from './use-token-counter.js';

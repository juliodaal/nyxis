/**
 * Vue 3 adapters for `@nyxis/core` headless controllers.
 *
 * The pattern: every composable wraps the framework-agnostic
 * controller from `@nyxis/core` and exposes its state + derived
 * values as Vue reactive objects. `onScopeDispose` cleans up the
 * subscription on component unmount.
 *
 * This package validates the multi-framework strategy: the same
 * controller code drives React (via `@nyxis/core` hooks),
 * Vue (this package), and future Svelte / Web Components adapters.
 */

export { useChatInput, type UseChatInputReturn } from './use-chat-input.js';
export { useChatThread, type UseChatThreadReturn } from './use-chat-thread.js';
export {
  usePromptVariableForm,
  type UsePromptVariableFormReturn,
} from './use-prompt-variable-form.js';
export { useTokenCounter } from './use-token-counter.js';

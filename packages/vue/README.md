# @nyxis/vue

Vue 3 adapters over Nyxis's framework-agnostic controllers from `@nyxis/core`.
Validates that the same state-machine code drives both React and Vue without
rewriting any logic.

> **Status:** private pilot package. Not published to npm yet. Once the API
> stabilizes and the registry ships Vue components, this moves to `@nyxis/vue`
> on npm.

## Composables

- `useChatInput(options)` — composer state + Enter / Shift+Enter keyboard
  handling
- `useChatThread(options)` — auto-scroll-to-bottom decision logic
- `usePromptVariableForm(options)` — `{{variable}}` extraction + per-variable
  values + render preview + fill-progress
- `useTokenCounter(text, contextWindow?)` — pure derivation of estimated tokens,
  % context consumed, and tone band

## Pattern

Every composable wraps the same controller used by the React adapter:

```ts
import { reactive, readonly, onScopeDispose } from 'vue';
import { createChatInputController } from '@nyxis/core';

export function useChatInput(options = {}) {
  const ctrl = createChatInputController(options);
  const state = reactive({ ...ctrl.getState() });
  const derived = reactive({ ...ctrl.getDerived() });

  const unsub = ctrl.subscribe(() => {
    Object.assign(state, ctrl.getState());
    Object.assign(derived, ctrl.getDerived());
  });
  onScopeDispose(unsub);

  return {
    state: readonly(state),
    derived: readonly(derived),
    ...ctrl,
  };
}
```

The pattern works for any framework with a reactivity primitive: React
(`useSyncExternalStore`), Svelte (`writable`), Solid (`createSignal`), Web
Components (manual subscription).

## License

MIT

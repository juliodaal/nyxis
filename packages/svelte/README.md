# @nyxis/svelte

Svelte adapters over Nyxis's framework-agnostic controllers from `@nyxis/core`.
Same controller code as React (`@nyxis/core`) and Vue (`@nyxis/vue`); zero
state-machine rewrites.

> **Status:** private pilot package. Not published to npm yet.

## Composables

- `useChatInput(options)` — composer state + Enter / Shift+Enter
- `useChatThread(options)` — auto-scroll-to-bottom decision logic
- `usePromptVariableForm(options)` — `{{variable}}` extraction + per-variable
  values + render preview + fill-progress
- `useTokenCounter(textStore, contextWindow?)` — pure derivation

## Pattern

Svelte's `readable` store auto-subscribes when consumers attach and unsubscribes
when the last consumer leaves. No `onDestroy` calls needed in user components:

```ts
import { readable, type Readable } from 'svelte/store';
import { createChatInputController } from '@nyxis/core';

export function useChatInput(options = {}) {
  const ctrl = createChatInputController(options);

  const state = readable(ctrl.getState(), (set) =>
    ctrl.subscribe(() => set(ctrl.getState())),
  );

  const derived = readable(ctrl.getDerived(), (set) =>
    ctrl.subscribe(() => set(ctrl.getDerived())),
  );

  return { state, derived, ...ctrl };
}
```

Works with Svelte 4 and Svelte 5 (stores remain a first-class option alongside
runes).

## License

MIT

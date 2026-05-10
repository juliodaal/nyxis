# Headless Controllers

Framework-agnostic state machines that power Nyxis components. The React hooks
in `../hooks/` are thin adapters over these; ports to Vue, Svelte, Solid, or Web
Components reuse the same controllers.

## Pattern

Every controller follows the same shape:

```ts
interface Controller {
  getState(): State;          // pure read
  getDerived(): Derived;      // computed values
  // …mutators that update state and notify
  subscribe(cb: () => void): () => void; // returns unsubscribe
}

interface Options {
  initialValue?: …;
  onSomething?: (value) => void; // event callbacks
}

function createController(options?: Options): Controller { … }
```

- **State is replaced, never mutated.** `state = { ...state, x: y }`.
- **`subscribe` is called once per state change.** Subscribers should pull the
  latest snapshot via `getState()` after each notification.
- **Derived values are pure functions** of state; computing them on read is fine
  because state changes are bounded.
- **No DOM, no `window`, no React.** Every dependency is the consumer's
  responsibility (e.g. `KeyboardLike` for keyboard events).
- **Pluggable callbacks** (`onSubmit`, `onValueChange`) replace
  framework-specific event systems.

## Why this matters

Nyxis components are React-only today, but the registry catalog should serve any
framework eventually. The headless layer is the path:

```
@nyxis/core/headless/<feature>      framework-agnostic logic
  └──── consumed by ────┐
                        ├── @nyxis/core/hooks/use-<feature>   (React adapter)
                        ├── @nyxis/core/vue/<feature>          (planned)
                        ├── @nyxis/core/svelte/<feature>       (planned)
                        └── @nyxis/core/wc/<feature>           (planned)
```

When we port `chat-input` to Vue, we don't rewrite the state machine — we wrap
`createChatInputController` in `reactive()` and bind the markup. Same for Svelte
(`writable`), Solid (`createSignal`), and Web Components (manual subscription).

## Example: React adapter

```ts
// hooks/use-chat-input.ts
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { createChatInputController } from '../headless/chat-input.js';

export function useChatInput(options = {}) {
  const ref = useRef(null);
  ref.current ??= createChatInputController(options);
  const ctrl = ref.current;

  const state = useSyncExternalStore(
    ctrl.subscribe,
    ctrl.getState,
    ctrl.getState,
  );
  const derived = useMemo(() => ctrl.getDerived(), [state]);

  return { ...state, ...derived, ...ctrl };
}
```

## Example: Vue adapter (sketch)

```ts
// vue/use-chat-input.ts
import { onScopeDispose, reactive, computed } from 'vue';
import { createChatInputController } from '@nyxis/core';

export function useChatInput(options = {}) {
  const ctrl = createChatInputController(options);
  const state = reactive(ctrl.getState());
  const sync = () => Object.assign(state, ctrl.getState());
  const unsub = ctrl.subscribe(sync);
  onScopeDispose(unsub);

  return {
    state,
    canSubmit: computed(() => ctrl.getDerived().canSubmit),
    setValue: ctrl.setValue,
    submit: ctrl.submit,
    handleKeyDown: ctrl.handleKeyDown,
  };
}
```

## Authoring checklist

When you add a new headless controller:

- [ ] No imports of `react`, `vue`, `svelte`, or anything DOM-aware.
- [ ] State is a plain object (no class instances) so it round-trips through
      `JSON.stringify` cleanly.
- [ ] Mutators replace the state record; never mutate in place.
- [ ] `subscribe` returns an unsubscribe function and `setX` skips notifying
      when the value didn't change (`if (state.x === value) return`).
- [ ] Adapter callbacks (`onSubmit`, etc.) accept primitives, never
      framework-specific event types.
- [ ] Co-located vitest test that exercises every public method (subscribe /
      unsubscribe / setX / derived / event handlers).
- [ ] Co-located React adapter in `../hooks/use-<feature>.ts`.
- [ ] Re-exported from `../index.ts` so downstream packages can use the
      controller directly when porting to non-React frameworks.

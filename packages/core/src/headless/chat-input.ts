/**
 * Framework-agnostic chat-input controller.
 *
 * Implements the input-and-submit state machine without committing to
 * a UI framework. Subscribers (React via `useSyncExternalStore`, Vue
 * via `reactive`, Svelte via a custom store, Web Components manually)
 * wire themselves to `subscribe()` and read `state` on each notify.
 *
 * Design notes:
 * - State is kept as a single immutable record; mutations replace the
 *   record so identity-based change detection is reliable.
 * - DOM-level concerns (auto-resizing the textarea, `preventDefault`
 *   on Enter) live behind framework-neutral adapter callbacks
 *   (`handleKeyDown` accepts a minimal `KeyboardLike` shape).
 * - `submit` re-reads `state.value` on every call, so callers don't
 *   need to wire stale closures.
 */

export interface ChatInputState {
  /** Current input value. Always a string; never `null`. */
  value: string;
  /** When `true`, `submit` becomes a no-op and `canSubmit` is false. */
  disabled: boolean;
}

export interface ChatInputDerived {
  /** Whitespace-trimmed value. */
  trimmed: string;
  /** True when there's a non-empty trimmed value AND not disabled. */
  canSubmit: boolean;
}

export interface ChatInputOptions {
  /** Initial value of the input. Defaults to `''`. */
  initialValue?: string;
  /** Initial disabled state. Defaults to `false`. */
  disabled?: boolean;
  /** Called with the trimmed value when the user submits. */
  onSubmit?: (value: string) => void;
  /** Called whenever the value changes (typing, clear, programmatic set). */
  onValueChange?: (value: string) => void;
}

/** Minimal keyboard-event shape so we don't depend on DOM types. */
export interface KeyboardLike {
  key: string;
  shiftKey: boolean;
  preventDefault: () => void;
}

export interface ChatInputController {
  /** Read the current state snapshot. */
  getState: () => ChatInputState;
  /** Read the current derived values. */
  getDerived: () => ChatInputDerived;
  /** Replace the value. Triggers `onValueChange` and notifies subscribers. */
  setValue: (value: string) => void;
  /** Force-clear the value (programmatic). */
  clear: () => void;
  /** Submit the current value if `canSubmit`. Triggers `onSubmit` and clears. */
  submit: () => void;
  /** Toggle disabled at runtime. */
  setDisabled: (disabled: boolean) => void;
  /**
   * Standard chat-input keyboard handling: Enter submits,
   * Shift+Enter inserts a newline. Pass any keyboard-like event.
   */
  handleKeyDown: (e: KeyboardLike) => void;
  /**
   * Subscribe to state changes. Returns an unsubscribe function.
   * Called once per `setValue` / `clear` / `submit` / `setDisabled`.
   */
  subscribe: (listener: () => void) => () => void;
}

/**
 * Construct a chat-input controller. Stable identity across the
 * lifetime of the consumer — mount once, subscribe forever.
 */
export function createChatInputController(options: ChatInputOptions = {}): ChatInputController {
  let state: ChatInputState = {
    value: options.initialValue ?? '',
    disabled: options.disabled ?? false,
  };

  const listeners = new Set<() => void>();
  const notify = (): void => {
    for (const listener of listeners) listener();
  };

  const setValue = (value: string): void => {
    if (state.value === value) return;
    state = { ...state, value };
    options.onValueChange?.(value);
    notify();
  };

  const clear = (): void => setValue('');

  const submit = (): void => {
    const trimmed = state.value.trim();
    if (!trimmed || state.disabled) return;
    options.onSubmit?.(trimmed);
    clear();
  };

  const setDisabled = (disabled: boolean): void => {
    if (state.disabled === disabled) return;
    state = { ...state, disabled };
    notify();
  };

  const handleKeyDown = (e: KeyboardLike): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return {
    getState: () => state,
    getDerived: () => ({
      trimmed: state.value.trim(),
      canSubmit: state.value.trim().length > 0 && !state.disabled,
    }),
    setValue,
    clear,
    submit,
    setDisabled,
    handleKeyDown,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

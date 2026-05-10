/**
 * Framework-agnostic chat-thread scroll controller.
 *
 * Validates the "DOM-coupled" case of the headless pattern: the
 * controller owns the *decision* logic (am I at the bottom? should
 * I follow new messages? should I show the scroll-to-latest button?)
 * but never touches the DOM. The React/Vue/etc. adapter wires the
 * scroll event in and calls `scrollIntoView` out.
 *
 * The split lets the same controller drive the auto-follow logic in
 * any framework — the React adapter handles refs and effects, a Vue
 * adapter would handle `ref` + watchers, a Svelte adapter would handle
 * `bind:this` + reactive statements. Zero re-implementation of the
 * "stuck to bottom" math.
 */

export interface ChatThreadState {
  /** Whether the user is "stuck to the bottom" (auto-follow active). */
  stickToBottom: boolean;
}

export interface ChatThreadDerived {
  /** Whether the floating "scroll to latest" button should be visible. */
  showScrollButton: boolean;
}

/** Minimal scroll snapshot the controller needs to decide stickiness. */
export interface ScrollMetrics {
  /** Current scrollTop of the container. */
  scrollTop: number;
  /** Total scrollable height. */
  scrollHeight: number;
  /** Visible height of the viewport. */
  clientHeight: number;
}

export interface ChatThreadOptions {
  /**
   * Distance from the bottom (px) below which we treat the user as
   * "stuck to bottom". Defaults to 24, which matches the spring-back
   * threshold most browsers feel comfortable with.
   */
  bottomThreshold?: number;
  /** Initial value of `stickToBottom`. Defaults to `true`. */
  initialStickToBottom?: boolean;
}

export interface ChatThreadController {
  getState: () => ChatThreadState;
  getDerived: () => ChatThreadDerived;
  /** Update the controller with the latest scroll metrics. */
  recordScroll: (metrics: ScrollMetrics) => void;
  /** Force-pin to bottom (called after a programmatic scrollIntoView). */
  pinToBottom: () => void;
  /** Manually set stickiness (rare — prefer `recordScroll` / `pinToBottom`). */
  setStickToBottom: (sticky: boolean) => void;
  subscribe: (listener: () => void) => () => void;
}

/**
 * Construct a chat-thread controller. The consumer wires scroll
 * events from a scrollable container into `recordScroll` and calls
 * `pinToBottom` after programmatic scrolls.
 */
export function createChatThreadController(options: ChatThreadOptions = {}): ChatThreadController {
  const threshold = options.bottomThreshold ?? 24;
  let state: ChatThreadState = {
    stickToBottom: options.initialStickToBottom ?? true,
  };

  const listeners = new Set<() => void>();
  const notify = (): void => {
    for (const listener of listeners) listener();
  };

  const setStickToBottom = (sticky: boolean): void => {
    if (state.stickToBottom === sticky) return;
    state = { ...state, stickToBottom: sticky };
    notify();
  };

  const recordScroll = ({ scrollTop, scrollHeight, clientHeight }: ScrollMetrics): void => {
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setStickToBottom(distanceFromBottom < threshold);
  };

  const pinToBottom = (): void => setStickToBottom(true);

  return {
    getState: () => state,
    getDerived: () => ({ showScrollButton: !state.stickToBottom }),
    recordScroll,
    pinToBottom,
    setStickToBottom,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

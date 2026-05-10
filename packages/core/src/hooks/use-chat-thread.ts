'use client';

import { useMemo, useRef, useSyncExternalStore } from 'react';

import {
  createChatThreadController,
  type ChatThreadController,
  type ChatThreadDerived,
  type ChatThreadOptions,
  type ChatThreadState,
  type ScrollMetrics,
} from '../headless/chat-thread.js';

export interface UseChatThreadReturn extends ChatThreadState, ChatThreadDerived {
  /** Wire to the container's `onScroll`. */
  recordScroll: (metrics: ScrollMetrics) => void;
  /** Call after a programmatic `scrollIntoView`. */
  pinToBottom: () => void;
  /** Manually toggle stickiness. */
  setStickToBottom: (sticky: boolean) => void;
}

/**
 * React adapter over `createChatThreadController`. The controller is
 * stable across renders; consumers pass scroll metrics in and read
 * `stickToBottom` / `showScrollButton` out.
 *
 * The component still owns the `useRef` for the container and the
 * actual `scrollIntoView()` call — those are DOM concerns that don't
 * belong in headless logic. The controller only owns the decision.
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const endRef = useRef<HTMLDivElement>(null);
 * const { stickToBottom, showScrollButton, recordScroll, pinToBottom } = useChatThread();
 *
 * const handleScroll = () => {
 *   const el = containerRef.current;
 *   if (el) recordScroll({ scrollTop: el.scrollTop, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight });
 * };
 *
 * const scrollToLatest = () => {
 *   endRef.current?.scrollIntoView({ behavior: 'smooth' });
 *   pinToBottom();
 * };
 * ```
 */
export function useChatThread(options: ChatThreadOptions = {}): UseChatThreadReturn {
  const ref = useRef<ChatThreadController | null>(null);
  ref.current ??= createChatThreadController(options);
  const controller = ref.current;

  const state = useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );

  const derived = useMemo<ChatThreadDerived>(
    () => ({ showScrollButton: !state.stickToBottom }),
    [state.stickToBottom],
  );

  return {
    ...state,
    ...derived,
    recordScroll: controller.recordScroll,
    pinToBottom: controller.pinToBottom,
    setStickToBottom: controller.setStickToBottom,
  };
}

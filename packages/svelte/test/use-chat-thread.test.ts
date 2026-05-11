import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';

import { useChatThread } from '../src/use-chat-thread.js';

describe('useChatThread (svelte)', () => {
  it('starts pinned to bottom by default', () => {
    const { state, derived } = useChatThread();
    expect(get(state).stickToBottom).toBe(true);
    expect(get(derived).showScrollButton).toBe(false);
  });

  it('recordScroll unpins when scrolled away from bottom', () => {
    const { state, derived, recordScroll } = useChatThread();
    recordScroll({ scrollTop: 0, scrollHeight: 1000, clientHeight: 200 });
    expect(get(state).stickToBottom).toBe(false);
    expect(get(derived).showScrollButton).toBe(true);
  });

  it('pinToBottom restores stickiness', () => {
    const { state, recordScroll, pinToBottom } = useChatThread();
    recordScroll({ scrollTop: 0, scrollHeight: 1000, clientHeight: 200 });
    expect(get(state).stickToBottom).toBe(false);

    pinToBottom();
    expect(get(state).stickToBottom).toBe(true);
  });
});

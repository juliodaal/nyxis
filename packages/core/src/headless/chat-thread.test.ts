import { describe, expect, it, vi } from 'vitest';

import { createChatThreadController } from './chat-thread.js';

describe('createChatThreadController', () => {
  it('starts pinned to the bottom by default', () => {
    const c = createChatThreadController();
    expect(c.getState().stickToBottom).toBe(true);
    expect(c.getDerived().showScrollButton).toBe(false);
  });

  it('honours initialStickToBottom = false', () => {
    const c = createChatThreadController({ initialStickToBottom: false });
    expect(c.getState().stickToBottom).toBe(false);
    expect(c.getDerived().showScrollButton).toBe(true);
  });

  it('recordScroll unpins when scrolled away from bottom', () => {
    const c = createChatThreadController();
    const listener = vi.fn();
    c.subscribe(listener);

    // 100 px from the bottom — well past the default 24 threshold
    c.recordScroll({ scrollTop: 0, scrollHeight: 1000, clientHeight: 900 });

    expect(c.getState().stickToBottom).toBe(false);
    expect(c.getDerived().showScrollButton).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('recordScroll pins when within threshold of bottom', () => {
    const c = createChatThreadController({ initialStickToBottom: false });

    // 10 px from the bottom — under the threshold
    c.recordScroll({ scrollTop: 990, scrollHeight: 1000, clientHeight: 0 });

    expect(c.getState().stickToBottom).toBe(true);
    expect(c.getDerived().showScrollButton).toBe(false);
  });

  it('respects a custom bottomThreshold', () => {
    const c = createChatThreadController({ bottomThreshold: 200, initialStickToBottom: false });

    // 100 px from the bottom — would unpin with default 24, pins with 200
    c.recordScroll({ scrollTop: 700, scrollHeight: 1000, clientHeight: 200 });
    expect(c.getState().stickToBottom).toBe(true);
  });

  it('pinToBottom forces state to true', () => {
    const c = createChatThreadController({ initialStickToBottom: false });
    c.pinToBottom();
    expect(c.getState().stickToBottom).toBe(true);
  });

  it('skips notifying when the value is unchanged', () => {
    const c = createChatThreadController();
    const listener = vi.fn();
    c.subscribe(listener);

    // Already at bottom; pinToBottom is a no-op
    c.pinToBottom();
    expect(listener).not.toHaveBeenCalled();

    // First unpin notifies
    c.recordScroll({ scrollTop: 0, scrollHeight: 1000, clientHeight: 100 });
    expect(listener).toHaveBeenCalledTimes(1);

    // Second far-from-bottom event doesn't notify again
    c.recordScroll({ scrollTop: 0, scrollHeight: 1000, clientHeight: 100 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe stops further notifications', () => {
    const c = createChatThreadController();
    const listener = vi.fn();
    const unsub = c.subscribe(listener);

    c.recordScroll({ scrollTop: 0, scrollHeight: 1000, clientHeight: 100 });
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();
    c.pinToBottom();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

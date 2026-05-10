import { describe, expect, it } from 'vitest';
import { effectScope } from 'vue';

import { useChatThread } from '../src/use-chat-thread.js';

describe('useChatThread (vue)', () => {
  it('starts pinned to bottom by default', () => {
    const scope = effectScope();
    scope.run(() => {
      const { state, derived } = useChatThread();
      expect(state.stickToBottom).toBe(true);
      expect(derived.showScrollButton).toBe(false);
    });
    scope.stop();
  });

  it('recordScroll unpins when scrolled away from bottom', () => {
    const scope = effectScope();
    scope.run(() => {
      const { state, derived, recordScroll } = useChatThread();
      recordScroll({ scrollTop: 0, scrollHeight: 1000, clientHeight: 200 });
      expect(state.stickToBottom).toBe(false);
      expect(derived.showScrollButton).toBe(true);
    });
    scope.stop();
  });

  it('pinToBottom restores stickiness', () => {
    const scope = effectScope();
    scope.run(() => {
      const { state, recordScroll, pinToBottom } = useChatThread();
      recordScroll({ scrollTop: 0, scrollHeight: 1000, clientHeight: 200 });
      expect(state.stickToBottom).toBe(false);

      pinToBottom();
      expect(state.stickToBottom).toBe(true);
    });
    scope.stop();
  });
});

import { describe, expect, it } from 'vitest';
import { effectScope, ref } from 'vue';

import { useTokenCounter } from '../src/use-token-counter.js';

describe('useTokenCounter (vue)', () => {
  it('returns a reactive computed of the derivation', () => {
    const scope = effectScope();
    scope.run(() => {
      const counter = useTokenCounter('hello world');
      expect(counter.value.tokens).toBeGreaterThan(0);
      expect(counter.value.contextPct).toBe(0);
      expect(counter.value.tone).toBe('safe');
    });
    scope.stop();
  });

  it('re-evaluates when the source ref updates', () => {
    const scope = effectScope();
    scope.run(() => {
      const text = ref('');
      const counter = useTokenCounter(text);
      expect(counter.value.tokens).toBe(0);

      text.value = 'hello world';
      expect(counter.value.tokens).toBeGreaterThan(0);
    });
    scope.stop();
  });

  it('applies the contextWindow when provided', () => {
    const scope = effectScope();
    scope.run(() => {
      const counter = useTokenCounter('x'.repeat(1000), 50);
      expect(counter.value.contextPct).toBe(1);
      expect(counter.value.tone).toBe('crit');
    });
    scope.stop();
  });
});

import { describe, expect, it } from 'vitest';
import { get, writable } from 'svelte/store';

import { useTokenCounter } from '../src/use-token-counter.js';

describe('useTokenCounter (svelte)', () => {
  it('returns a readable derived from the source store', () => {
    const text = writable('hello world');
    const counter = useTokenCounter(text);
    expect(get(counter).tokens).toBeGreaterThan(0);
    expect(get(counter).contextPct).toBe(0);
    expect(get(counter).tone).toBe('safe');
  });

  it('re-evaluates when the source store changes', () => {
    const text = writable('');
    const counter = useTokenCounter(text);
    expect(get(counter).tokens).toBe(0);

    text.set('hello world');
    expect(get(counter).tokens).toBeGreaterThan(0);
  });

  it('applies a fixed contextWindow', () => {
    const text = writable('x'.repeat(1000));
    const counter = useTokenCounter(text, 50);
    expect(get(counter).contextPct).toBe(1);
    expect(get(counter).tone).toBe('crit');
  });

  it('reacts to a reactive contextWindow store', () => {
    const text = writable('x'.repeat(1000));
    const window = writable<number | undefined>(undefined);
    const counter = useTokenCounter(text, window);

    expect(get(counter).contextPct).toBe(0);
    expect(get(counter).tone).toBe('safe');

    window.set(50);
    expect(get(counter).contextPct).toBe(1);
    expect(get(counter).tone).toBe('crit');
  });
});

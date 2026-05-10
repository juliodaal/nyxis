import { describe, expect, it } from 'vitest';

import { computeTokenCounter } from './token-counter.js';

describe('computeTokenCounter', () => {
  it('returns tokens, zero contextPct, and safe tone when no window given', () => {
    const result = computeTokenCounter('hello world');
    expect(result.tokens).toBeGreaterThan(0);
    expect(result.contextPct).toBe(0);
    expect(result.tone).toBe('safe');
  });

  it('clamps contextPct to 1.0 when text exceeds the window', () => {
    const result = computeTokenCounter('x'.repeat(10_000), 100);
    expect(result.contextPct).toBe(1);
    expect(result.tone).toBe('crit');
  });

  it('returns safe tone when below 70%', () => {
    // ~50 tokens for "hello world" repeated; window 1000 → 5%
    const result = computeTokenCounter('hello world '.repeat(10), 10_000);
    expect(result.tone).toBe('safe');
  });

  it('returns warn tone between 70% and 90%', () => {
    // contextWindow chosen so we land in the warn band
    const text = 'hello world '.repeat(20); // ~60 tokens
    const tokens = computeTokenCounter(text, 100).tokens;
    const window = Math.round(tokens / 0.8); // target 80%
    const result = computeTokenCounter(text, window);
    expect(result.tone).toBe('warn');
    expect(result.contextPct).toBeGreaterThanOrEqual(0.7);
    expect(result.contextPct).toBeLessThan(0.9);
  });

  it('returns crit tone at or above 90%', () => {
    const text = 'hello world '.repeat(20);
    const tokens = computeTokenCounter(text, 100).tokens;
    const window = Math.round(tokens / 0.95); // target 95%
    const result = computeTokenCounter(text, window);
    expect(result.tone).toBe('crit');
  });

  it('handles empty text without crashing', () => {
    const result = computeTokenCounter('', 1000);
    // estimateTokens returns 0 for empty string; tone stays safe
    expect(result.tokens).toBe(0);
    expect(result.contextPct).toBe(0);
    expect(result.tone).toBe('safe');
  });
});

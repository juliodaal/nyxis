import { describe, expect, it } from 'vitest';
import { estimateTokens } from './use-token-count.js';

describe('estimateTokens', () => {
  it('returns 0 for empty input', () => {
    expect(estimateTokens('')).toBe(0);
  });

  it('returns at least 1 for any non-empty input', () => {
    expect(estimateTokens('hi')).toBeGreaterThanOrEqual(1);
  });

  it('grows roughly linearly with text length', () => {
    const short = estimateTokens('Lorem ipsum dolor sit amet.');
    const long = estimateTokens('Lorem ipsum dolor sit amet. '.repeat(20));
    expect(long).toBeGreaterThan(short * 10);
  });
});

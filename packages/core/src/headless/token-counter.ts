/**
 * Framework-agnostic token-counter derivation.
 *
 * Pure-function case of the headless pattern: no state to manage, just
 * a computed view of (text, contextWindow) → (tokens, contextPct,
 * tone). This proves the pattern accommodates components that are
 * purely derived — Vue's `computed`, Svelte's `$derived`, React's
 * `useMemo` all consume the same function with zero adapter glue.
 *
 * For an exact token count, swap `estimateTokens` for a provider-
 * specific tokenizer (`js-tiktoken` for OpenAI, `@anthropic-ai/tokenizer`
 * for Anthropic). The downstream API stays identical.
 */

import { estimateTokens } from '../hooks/use-token-count.js';

export type TokenCounterTone = 'safe' | 'warn' | 'crit';

export interface TokenCounterDerived {
  /** Estimated token count. */
  tokens: number;
  /** Fraction (0..1) of the context window consumed. 0 when unknown. */
  contextPct: number;
  /** Tone for the visual indicator: safe (< 70%), warn (< 90%), crit (≥ 90%). */
  tone: TokenCounterTone;
}

/**
 * Compute the token-count view for a given string and context window.
 *
 * @param text          The text to estimate.
 * @param contextWindow Optional context window size for the target model.
 *                      When omitted, `contextPct` is 0 and `tone` is `'safe'`.
 */
export function computeTokenCounter(text: string, contextWindow?: number): TokenCounterDerived {
  const tokens = estimateTokens(text);
  const contextPct =
    contextWindow !== undefined && contextWindow > 0 ? Math.min(1, tokens / contextWindow) : 0;
  const tone: TokenCounterTone = contextPct < 0.7 ? 'safe' : contextPct < 0.9 ? 'warn' : 'crit';
  return { tokens, contextPct, tone };
}

// Re-export the estimator so consumers can swap it for a provider
// tokenizer without re-importing from `../hooks`.
export { estimateTokens };

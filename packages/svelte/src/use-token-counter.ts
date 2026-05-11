import { computeTokenCounter, type TokenCounterDerived } from '@nyxis/core';
import { derived, type Readable } from 'svelte/store';

/**
 * Svelte adapter for the pure-derivation `computeTokenCounter`.
 *
 * Takes a `Readable<string>` (or any store) and returns a derived
 * store with `{ tokens, contextPct, tone }`. For static text, pass
 * `readable('text')` from `svelte/store`.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { writable } from 'svelte/store';
 *   import { useTokenCounter } from '@nyxis/svelte';
 *
 *   const text = writable('');
 *   const counter = useTokenCounter(text, 100_000);
 *   // $counter.tokens, $counter.tone — reactive
 * </script>
 * ```
 */
export function useTokenCounter(
  text: Readable<string>,
  contextWindow?: number | Readable<number | undefined>,
): Readable<TokenCounterDerived> {
  // Static contextWindow → just derive from text.
  if (typeof contextWindow !== 'object' || contextWindow === null) {
    const fixed = contextWindow;
    return derived(text, ($text) => computeTokenCounter($text, fixed));
  }
  // Reactive contextWindow → combine both stores.
  return derived([text, contextWindow], ([$text, $window]) => computeTokenCounter($text, $window));
}

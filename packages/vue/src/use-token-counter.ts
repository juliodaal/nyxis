import { computeTokenCounter, type TokenCounterDerived } from '@nyxis/core';
import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue';

/**
 * Vue 3 adapter for the pure-derivation `computeTokenCounter`.
 *
 * Accepts `MaybeRefOrGetter` for ergonomic use with both `ref()`
 * values and reactive properties:
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { useTokenCounter } from '@nyxis/vue';
 *
 * const text = ref('');
 * const counter = useTokenCounter(text, 100_000);
 * // counter.value.tokens, counter.value.tone — reactive
 * </script>
 * ```
 *
 * For model-aware usage, pass the model's `contextWindow` (resolve it
 * via `findModel` from `@nyxis/core`).
 */
export function useTokenCounter(
  text: MaybeRefOrGetter<string>,
  contextWindow?: MaybeRefOrGetter<number | undefined>,
): ComputedRef<TokenCounterDerived> {
  return computed(() => computeTokenCounter(toValue(text), toValue(contextWindow) ?? undefined));
}

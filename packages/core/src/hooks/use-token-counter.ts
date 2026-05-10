'use client';

import { useMemo } from 'react';

import { findModel } from '../adapters/registry.js';
import { computeTokenCounter, type TokenCounterDerived } from '../headless/token-counter.js';

/**
 * React adapter over `computeTokenCounter`. Resolves the model from
 * the catalog to get its context window, then memoises the derivation.
 *
 * Use this for any token-aware UI (chat input, prompt editor, context
 * meter). For the pure derivation without the model lookup, import
 * `computeTokenCounter` from `@nyxis/core` directly.
 *
 * @example
 * ```tsx
 * const { tokens, tone } = useTokenCounter(messageText, 'gpt-4o');
 * ```
 */
export function useTokenCounter(text: string, modelId?: string): TokenCounterDerived {
  const model = useMemo(() => (modelId ? findModel(modelId) : undefined), [modelId]);
  return useMemo(() => computeTokenCounter(text, model?.contextWindow), [text, model]);
}

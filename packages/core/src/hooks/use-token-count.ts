'use client';

import { useEffect, useState } from 'react';

import { findModel } from '../adapters/registry.js';

import type { AIModel } from '../types.js';

interface UseTokenCountReturn {
  /** Estimated token count. Defaults to 0 while computing. */
  tokens: number;
  /** True for the first render before the estimate has been computed. */
  estimating: boolean;
  /** Percentage of the model's context window consumed (0..1). */
  contextPct: number;
}

/**
 * Estimate the token count of a given string for a given model. The
 * implementation is a fast, dependency-free approximation:
 *
 *   tokens ≈ chars / 4 + word_count / 1.6
 *
 * For an exact count, install a tokenizer per provider (e.g. `js-tiktoken`
 * for OpenAI, `@anthropic-ai/tokenizer` for Anthropic) and replace
 * `estimateTokens` with that. The hook keeps the same return shape.
 */
export function useTokenCount(text: string, modelId?: string): UseTokenCountReturn {
  const model: AIModel | undefined = modelId ? findModel(modelId) : undefined;
  const [tokens, setTokens] = useState(0);
  const [estimating, setEstimating] = useState(true);

  useEffect(() => {
    setEstimating(true);
    // Defer the (cheap) estimation so very long strings don't block render.
    const id = setTimeout(() => {
      setTokens(estimateTokens(text));
      setEstimating(false);
    }, 0);
    return () => clearTimeout(id);
  }, [text]);

  const contextPct =
    model && model.contextWindow > 0 ? Math.min(1, tokens / model.contextWindow) : 0;

  return { tokens, estimating, contextPct };
}

export function estimateTokens(text: string): number {
  if (!text) return 0;
  const chars = text.length;
  // Count whitespace-separated words; coerce to a positive number.
  const words = text.trim().split(/\s+/).length || 0;
  // Blend two heuristics — character density and word density — and round.
  const fromChars = chars / 4;
  const fromWords = words / 0.75;
  return Math.max(1, Math.round((fromChars + fromWords) / 2));
}

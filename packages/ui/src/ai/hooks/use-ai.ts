'use client';

import { useContext } from 'react';
import { AIContext, type AIContextValue } from '../ai-context.js';

/**
 * Returns the current AI configuration from the surrounding `<AIProvider>`.
 * Throws if used outside a provider — failing loud is preferred to silent
 * fallbacks that ship a broken UI.
 */
export function useAI(): AIContextValue {
  const ctx = useContext(AIContext);
  if (!ctx) {
    throw new Error('[nyxis-ui/ai] useAI must be used inside <AIProvider>');
  }
  return ctx;
}

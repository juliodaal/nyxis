/**
 * Single-shot completion endpoint. Accepts `{ prompt, provider?, model?,
 * system? }` and streams plain text back. Use this when you don't need
 * the full conversation history of `useChat` — for one-off generations,
 * autocomplete-style flows, or quick prompt previews.
 *
 * Set the relevant API key in your environment:
 *
 *   ANTHROPIC_API_KEY            (default provider)
 *   OPENAI_API_KEY
 *   GOOGLE_GENERATIVE_AI_API_KEY
 *   MISTRAL_API_KEY
 */

import { createCompletionHandler } from '@nyxis/core/server';

import { systemPrompt } from '@/lib/ai/system-prompt';

export const runtime = 'edge';
export const maxDuration = 30;

export const POST = createCompletionHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  system: systemPrompt,
  maxTokens: 512,
  temperature: 0.5,
});

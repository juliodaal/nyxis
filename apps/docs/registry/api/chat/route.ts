/**
 * Streaming chat endpoint. Compatible with the `useChat` hook from
 * `@nyxis/core` and the standard Vercel AI SDK message format.
 *
 * Provider and model can be overridden per request from the client; the
 * defaults below apply when the client doesn't specify them. Set the
 * relevant API key in your environment:
 *
 *   ANTHROPIC_API_KEY            (default provider)
 *   OPENAI_API_KEY
 *   GOOGLE_GENERATIVE_AI_API_KEY
 *   MISTRAL_API_KEY
 *
 * Ollama uses no key but expects `ollama serve` on `localhost:11434`.
 */

import { createChatHandler } from '@nyxis/core/server';

import { systemPrompt } from '@/lib/ai/system-prompt';

export const runtime = 'edge';
export const maxDuration = 30;

export const POST = createChatHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  system: systemPrompt,
  maxTokens: 1024,
  temperature: 0.7,
});

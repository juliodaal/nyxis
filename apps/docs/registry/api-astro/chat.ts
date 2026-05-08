/**
 * Streaming chat endpoint for Astro. Compatible with `useChat` from
 * `@nyxis/core` and the Vercel AI SDK message format.
 *
 * Astro endpoints expose a Web standard `Request` directly, so this
 * file is the thinnest possible bridge between the framework and
 * `createChatHandler`.
 *
 * Set the relevant API key in your environment:
 *   ANTHROPIC_API_KEY            (default provider)
 *   OPENAI_API_KEY
 *   GOOGLE_GENERATIVE_AI_API_KEY
 *   MISTRAL_API_KEY
 */

import type { APIRoute } from 'astro';

import { createChatHandler } from '@nyxis/core/server';

import { systemPrompt } from '@/lib/ai/system-prompt';

// Astro runs server endpoints on demand; mark this route SSR.
export const prerender = false;

const handler = createChatHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  system: systemPrompt,
  maxTokens: 1024,
  temperature: 0.7,
});

export const POST: APIRoute = ({ request }) => handler(request);

/**
 * Streaming chat endpoint for SvelteKit. Compatible with `useChat`
 * from `@nyxis/core` and the Vercel AI SDK message format.
 *
 * SvelteKit's `RequestHandler` exposes a Web standard `Request` and
 * expects a `Response` back, so this file is a thin bridge to
 * `createChatHandler`.
 *
 * Set the relevant API key in your environment:
 *   ANTHROPIC_API_KEY            (default provider)
 *   OPENAI_API_KEY
 *   GOOGLE_GENERATIVE_AI_API_KEY
 *   MISTRAL_API_KEY
 */

import type { RequestHandler } from './$types';

import { createChatHandler } from '@nyxis/core/server';

import { systemPrompt } from '$lib/ai/system-prompt';

const handler = createChatHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  system: systemPrompt,
  maxTokens: 1024,
  temperature: 0.7,
});

export const POST: RequestHandler = ({ request }) => handler(request);

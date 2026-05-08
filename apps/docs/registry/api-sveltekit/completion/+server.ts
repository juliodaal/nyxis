/**
 * Single-shot completion endpoint for SvelteKit. Accepts `{ prompt }`
 * and streams plain text back. For autocomplete, summary previews,
 * one-off prompts.
 */

import type { RequestHandler } from './$types';

import { createCompletionHandler } from '@nyxis/core/server';

import { systemPrompt } from '$lib/ai/system-prompt';

const handler = createCompletionHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  system: systemPrompt,
  maxTokens: 512,
  temperature: 0.5,
});

export const POST: RequestHandler = ({ request }) => handler(request);

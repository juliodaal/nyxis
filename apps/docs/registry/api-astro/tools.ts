/**
 * Streaming chat with tool calling for Astro. The model can invoke
 * any tool defined in `lib/ai/tools.ts`; results are sent back to the
 * model in subsequent rounds until the conversation completes.
 *
 * Pair with the `<ToolCall>` and `<ToolResult>` registry components.
 */

import type { APIRoute } from 'astro';

import { createChatHandler } from '@nyxis/core/server';

import { systemPrompt } from '@/lib/ai/system-prompt';
import { tools } from '@/lib/ai/tools';

export const prerender = false;

const handler = createChatHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  system: systemPrompt,
  tools,
  maxTokens: 2048,
  temperature: 0.4,
});

export const POST: APIRoute = ({ request }) => handler(request);

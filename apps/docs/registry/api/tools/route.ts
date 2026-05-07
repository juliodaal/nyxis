/**
 * Streaming chat endpoint with tool calling. The model can invoke any
 * tool defined in `lib/ai/tools.ts`; results are sent back to the model
 * in subsequent rounds until the conversation completes.
 *
 * On the client, render tool calls with `<ToolCall>` and `<ToolResult>`
 * (registry items) for a polished UX. The wire format is the standard
 * Vercel AI SDK tool stream protocol — `useChat` handles it for you.
 */

import { createChatHandler } from '@nyxis/core/server';

import { systemPrompt } from '@/lib/ai/system-prompt';
import { tools } from '@/lib/ai/tools';

export const runtime = 'edge';
export const maxDuration = 60;

export const POST = createChatHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  system: systemPrompt,
  tools,
  maxTokens: 2048,
  temperature: 0.4,
});

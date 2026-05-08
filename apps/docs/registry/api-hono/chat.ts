/**
 * Streaming chat route for Hono. Mounts as `POST /chat` on the Hono
 * router exported below; combine with the rest of your app:
 *
 *   import { Hono } from 'hono';
 *   import { aiChatRoutes } from './lib/ai/chat';
 *
 *   const app = new Hono();
 *   app.route('/api', aiChatRoutes);  // POST /api/chat
 *
 * Hono passes a Web standard `Request` through `c.req.raw`, so the
 * adapter is a thin pipe to `createChatHandler`.
 *
 * Set the relevant API key in your environment:
 *   ANTHROPIC_API_KEY            (default provider)
 *   OPENAI_API_KEY
 *   GOOGLE_GENERATIVE_AI_API_KEY
 *   MISTRAL_API_KEY
 */

import { Hono } from 'hono';

import { createChatHandler } from '@nyxis/core/server';

import { systemPrompt } from './system-prompt';

const handler = createChatHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  system: systemPrompt,
  maxTokens: 1024,
  temperature: 0.7,
});

export const aiChatRoutes = new Hono().post('/chat', (c) => handler(c.req.raw));

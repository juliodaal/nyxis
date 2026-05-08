/**
 * Tool-calling chat route for Hono. Mounts as `POST /chat-tools`.
 *
 *   import { aiToolsRoutes } from './lib/ai/tools-route';
 *   app.route('/api', aiToolsRoutes);  // POST /api/chat-tools
 */

import { Hono } from 'hono';

import { createChatHandler } from '@nyxis/core/server';

import { systemPrompt } from './system-prompt';
import { tools } from './tools';

const handler = createChatHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  system: systemPrompt,
  tools,
  maxTokens: 2048,
  temperature: 0.4,
});

export const aiToolsRoutes = new Hono().post('/chat-tools', (c) => handler(c.req.raw));

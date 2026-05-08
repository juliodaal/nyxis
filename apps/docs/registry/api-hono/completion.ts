/**
 * Single-shot completion route for Hono. Mounts as `POST /completion`.
 *
 *   import { aiCompletionRoutes } from './lib/ai/completion';
 *   app.route('/api', aiCompletionRoutes);  // POST /api/completion
 */

import { Hono } from 'hono';

import { createCompletionHandler } from '@nyxis/core/server';

import { systemPrompt } from './system-prompt';

const handler = createCompletionHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  system: systemPrompt,
  maxTokens: 512,
  temperature: 0.5,
});

export const aiCompletionRoutes = new Hono().post('/completion', (c) => handler(c.req.raw));

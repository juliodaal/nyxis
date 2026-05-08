/**
 * Tool-calling chat route for Express. Mounts as `POST /chat-tools`.
 *
 *   import { aiToolsRouter } from './lib/ai/tools-route';
 *   app.use('/api', aiToolsRouter);  // POST /api/chat-tools
 */

import { Readable } from 'node:stream';

import express, { type Request, type Response } from 'express';

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

export const aiToolsRouter = express
  .Router()
  .use(express.raw({ type: 'application/json', limit: '4mb' }))
  .post('/chat-tools', async (req: Request, res: Response) => {
    const webRequest = new Request(`http://localhost${req.originalUrl}`, {
      method: 'POST',
      headers: Object.fromEntries(
        Object.entries(req.headers).filter(([, v]) => typeof v === 'string') as [string, string][],
      ),
      body: req.body as Buffer,
    });

    const response = await handler(webRequest);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      Readable.fromWeb(response.body as never).pipe(res);
    } else {
      res.end();
    }
  });

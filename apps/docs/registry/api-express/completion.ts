/**
 * Single-shot completion route for Express. Mounts as `POST /completion`.
 *
 *   import { aiCompletionRouter } from './lib/ai/completion';
 *   app.use('/api', aiCompletionRouter);  // POST /api/completion
 */

import { Readable } from 'node:stream';

import express, { type Request, type Response } from 'express';

import { createCompletionHandler } from '@nyxis/core/server';

import { systemPrompt } from './system-prompt';

const handler = createCompletionHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  system: systemPrompt,
  maxTokens: 512,
  temperature: 0.5,
});

export const aiCompletionRouter = express
  .Router()
  .use(express.raw({ type: 'application/json', limit: '4mb' }))
  .post('/completion', async (req: Request, res: Response) => {
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

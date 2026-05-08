/**
 * Streaming chat route for Express. Mounts as `POST /chat` on the
 * Router exported below; combine with the rest of your app:
 *
 *   import express from 'express';
 *   import { aiChatRouter } from './lib/ai/chat';
 *
 *   const app = express();
 *   app.use('/api', aiChatRouter);  // POST /api/chat
 *
 * Express's req/res are not Web standard, so the adapter wraps them:
 * the body is read into a Web `Request`, `createChatHandler` returns
 * a Web `Response`, and we pipe it back into `res`.
 *
 * Set the relevant API key in your environment:
 *   ANTHROPIC_API_KEY            (default provider)
 *   OPENAI_API_KEY
 *   GOOGLE_GENERATIVE_AI_API_KEY
 *   MISTRAL_API_KEY
 */

import { Readable } from 'node:stream';

import express, { type Request, type Response } from 'express';

import { createChatHandler } from '@nyxis/core/server';

import { systemPrompt } from './system-prompt';

const handler = createChatHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  system: systemPrompt,
  maxTokens: 1024,
  temperature: 0.7,
});

export const aiChatRouter = express
  .Router()
  // Use raw JSON; createChatHandler reads the body itself.
  .use(express.raw({ type: 'application/json', limit: '4mb' }))
  .post('/chat', async (req: Request, res: Response) => {
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
      // Stream the AI SDK response back to Express.
      Readable.fromWeb(response.body as never).pipe(res);
    } else {
      res.end();
    }
  });

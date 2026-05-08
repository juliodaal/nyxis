/**
 * RAG-style chat route for Express. Mounts as `POST /rag`.
 *
 *   import { aiRagRouter } from './lib/ai/rag';
 *   app.use('/api', aiRagRouter);  // POST /api/rag
 */

import { Readable } from 'node:stream';

import express, { type Request, type Response } from 'express';

import { createChatHandler } from '@nyxis/core/server';

import { systemPrompt } from './system-prompt';
import { retrieve } from './retrieve';

const handler = createChatHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  maxTokens: 1024,
  temperature: 0.3,
});

export const aiRagRouter = express
  .Router()
  .use(express.json({ limit: '4mb' }))
  .post('/rag', async (req: Request, res: Response) => {
    const body = req.body as { messages?: { role: string; content: string }[] };
    const lastUser = body.messages?.filter((m) => m.role === 'user').pop();
    const query = lastUser?.content ?? '';

    const chunks = await retrieve(query, { topK: 5 });
    const context =
      chunks.length === 0
        ? '(no relevant chunks retrieved)'
        : chunks.map((c) => `[${c.rank}] ${c.source}\n${c.snippet}`).join('\n\n');

    const augmented = `${systemPrompt}

You have been given the following context from the knowledge base.
Answer the user's question using ONLY this context. If the answer is
not contained here, say so explicitly. Cite each fact with the chunk
rank in square brackets, e.g. "Nyxis is a registry of AI components [1]."

<context>
${context}
</context>`;

    const webRequest = new Request(`http://localhost${req.originalUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, system: augmented }),
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

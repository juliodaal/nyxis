/**
 * RAG-style chat route for Hono. Mounts as `POST /rag`.
 *
 *   import { aiRagRoutes } from './lib/ai/rag';
 *   app.route('/api', aiRagRoutes);  // POST /api/rag
 */

import { Hono } from 'hono';

import { createChatHandler } from '@nyxis/core/server';

import { systemPrompt } from './system-prompt';
import { retrieve } from './retrieve';

const handler = createChatHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  maxTokens: 1024,
  temperature: 0.3,
});

export const aiRagRoutes = new Hono().post('/rag', async (c) => {
  const cloned = c.req.raw.clone();
  let query = '';
  try {
    const body = (await cloned.json()) as { messages?: { role: string; content: string }[] };
    const lastUser = body.messages?.filter((m) => m.role === 'user').pop();
    query = lastUser?.content ?? '';
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const chunks = await retrieve(query, { topK: 5 });
  const context =
    chunks.length === 0
      ? '(no relevant chunks retrieved)'
      : chunks.map((ch) => `[${ch.rank}] ${ch.source}\n${ch.snippet}`).join('\n\n');

  const augmented = `${systemPrompt}

You have been given the following context from the knowledge base.
Answer the user's question using ONLY this context. If the answer is
not contained here, say so explicitly. Cite each fact with the chunk
rank in square brackets, e.g. "Nyxis is a registry of AI components [1]."

<context>
${context}
</context>`;

  const body = (await c.req.raw.json()) as Record<string, unknown>;
  const forwarded = new Request(c.req.raw.url, {
    method: 'POST',
    headers: c.req.raw.headers,
    body: JSON.stringify({ ...body, system: augmented }),
  });

  return handler(forwarded);
});

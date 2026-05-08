/**
 * RAG-style chat endpoint for Astro. Retrieves chunks from your
 * knowledge base and injects them into the system prompt before
 * delegating to the chat handler. The model is instructed to answer
 * only from the retrieved chunks and to cite by `[rank]`.
 */

import type { APIRoute } from 'astro';

import { createChatHandler } from '@nyxis/core/server';

import { systemPrompt } from '@/lib/ai/system-prompt';
import { retrieve } from '@/lib/ai/retrieve';

export const prerender = false;

const handler = createChatHandler({
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-5',
  maxTokens: 1024,
  temperature: 0.3,
});

export const POST: APIRoute = async ({ request }) => {
  // Read the latest user message and use it as the retrieval query.
  // Clone first because the body is consumed on read.
  const cloned = request.clone();
  let query = '';
  try {
    const body = (await cloned.json()) as { messages?: { role: string; content: string }[] };
    const lastUser = body.messages?.filter((m) => m.role === 'user').pop();
    query = lastUser?.content ?? '';
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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

  const body = (await request.json()) as Record<string, unknown>;
  const forwarded = new Request(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify({ ...body, system: augmented }),
  });

  return handler(forwarded);
};

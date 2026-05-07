/**
 * Tool definitions for the `/api/chat-tools` endpoint. Each tool is a
 * Vercel AI SDK `tool({ ... })` value: a JSON Schema (via Zod) and an
 * `execute` function the model calls when it picks the tool.
 *
 * Add and remove tools freely. Names you use here are exactly what the
 * model sees, so keep them descriptive (`search_web`, not `tool1`).
 *
 * The two examples below are stubs — wire them to your real backend.
 */

import { tool } from 'ai';
import { z } from 'zod';

export const tools = {
  /** Search the public web. Replace the stub with your real provider. */
  searchWeb: tool({
    description: 'Search the public web for up-to-date information.',
    parameters: z.object({
      query: z.string().describe('What to search for. Be specific.'),
      maxResults: z.number().int().min(1).max(10).default(5),
    }),
    async execute({ query, maxResults }) {
      // TODO: replace with your real search API (Tavily, Exa, Brave, etc.).
      return {
        query,
        results: Array.from({ length: maxResults }, (_, i) => ({
          title: `Stub result ${i + 1} for "${query}"`,
          url: `https://example.com/${encodeURIComponent(query)}/${i + 1}`,
          snippet: 'Replace this stub in lib/ai/tools.ts with a real search backend.',
        })),
      };
    },
  }),

  /** Compute a math expression. Pure function, safe to ship. */
  calculate: tool({
    description: 'Evaluate a basic arithmetic expression. Supports + - * / and parentheses.',
    parameters: z.object({
      expression: z.string().describe('e.g. "2 + 2 * 5", "(120 / 4) ** 2"'),
    }),
    async execute({ expression }) {
      // Whitelist a tiny grammar so we don't `eval` arbitrary code.
      if (!/^[\d+\-*/().\s**]+$/.test(expression)) {
        throw new Error('Only numbers and + - * / ** ( ) are allowed.');
      }
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
      const result = Function(`"use strict"; return (${expression});`)();
      return { expression, result };
    },
  }),
};

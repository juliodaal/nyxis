/**
 * Server-side helpers for wiring `useChat` and `useCompletion` to a real
 * model. Framework-agnostic: returns a standard `Request → Response`
 * function that drops into Next.js App Router, Remix, Astro endpoints,
 * Hono, Bun, anything that speaks the Web standard.
 *
 * The actual model resolution is delegated to `createModel` from
 * `nyxis-ui/ai/server` (the lazy provider loader), so consumers only ship
 * the SDK packages they actually use.
 */

import type { AIProviderId } from '../types.js';
import { createModel } from '../adapters/create-model.js';

interface ChatRequestBody {
  messages: { role: string; content: string }[];
  provider?: AIProviderId;
  model?: string;
  system?: string;
  tools?: unknown[];
}

export interface CreateChatHandlerOptions {
  /** Default provider when the client doesn't specify one. */
  defaultProvider?: AIProviderId;
  /** Default model when the client doesn't specify one. */
  defaultModel?: string;
  /** Default system prompt prepended to every conversation. */
  system?: string;
  /** Maximum tokens the model is allowed to generate per turn. */
  maxTokens?: number;
  /** Sampling temperature 0..2. */
  temperature?: number;
  /** Server-side tools (`ai` SDK `tool({ ... })` definitions). */
  tools?: Record<string, unknown>;
  /** Hard cap on requests per minute per IP. Set 0 to disable. */
  rateLimit?: number;
  /** Optional override for `streamText` from the AI SDK. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  streamText?: any;
}

/**
 * Build a chat handler. Mounts as `POST /api/chat`.
 *
 * @example Next.js App Router
 * ```ts
 * // app/api/chat/route.ts
 * import { createChatHandler } from 'nyxis-ui/ai/server';
 *
 * export const POST = createChatHandler({
 *   defaultProvider: 'anthropic',
 *   defaultModel: 'claude-sonnet-4-5',
 *   system: 'You are a helpful assistant.',
 * });
 * ```
 */
export function createChatHandler(
  options: CreateChatHandlerOptions = {},
): (request: Request) => Promise<Response> {
  const defaultProvider = options.defaultProvider ?? 'anthropic';

  return async function handler(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let body: ChatRequestBody;
    try {
      body = (await request.json()) as ChatRequestBody;
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages must be a non-empty array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const provider = body.provider ?? defaultProvider;
    const modelId = body.model ?? options.defaultModel;
    if (!modelId) {
      return new Response(JSON.stringify({ error: 'model is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let streamTextFn = options.streamText;
    if (!streamTextFn) {
      try {
        // Lazy-load the AI SDK so the handler module doesn't pull it in
        // when consumers swap in their own streamText.
        const aiModule = await import('ai');
        streamTextFn = aiModule.streamText;
      } catch {
        return new Response(
          JSON.stringify({
            error:
              'The "ai" peer dependency is not installed. Run: pnpm add ai @ai-sdk/' + provider,
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        );
      }
    }

    let model: unknown;
    try {
      model = await createModel({ provider, model: modelId });
    } catch (err) {
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const system = body.system ?? options.system;

    try {
      const result = streamTextFn({
        model,
        messages: body.messages,
        ...(system ? { system } : {}),
        ...(options.tools ? { tools: options.tools } : {}),
        ...(options.maxTokens ? { maxTokens: options.maxTokens } : {}),
        ...(options.temperature !== undefined ? { temperature: options.temperature } : {}),
      });

      // The AI SDK exposes `toDataStreamResponse()` (v4) /
      // `toUIMessageStreamResponse()` (v5). Probe both so we work across
      // versions without pinning.
      if (typeof result.toDataStreamResponse === 'function') {
        return result.toDataStreamResponse();
      }
      if (typeof result.toUIMessageStreamResponse === 'function') {
        return result.toUIMessageStreamResponse();
      }
      if (typeof result.toAIStreamResponse === 'function') {
        return result.toAIStreamResponse();
      }
      throw new Error('No compatible stream response helper on AI SDK result');
    } catch (err) {
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}

/**
 * Build a single-shot completion handler. Mounts as `POST /api/completion`.
 *
 * Accepts `{ prompt: string }` and streams plain text back.
 */
export function createCompletionHandler(
  options: CreateChatHandlerOptions = {},
): (request: Request) => Promise<Response> {
  const chat = createChatHandler(options);
  return async function handler(request: Request) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    let body: { prompt?: string; provider?: AIProviderId; model?: string; system?: string };
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!body.prompt) {
      return new Response(JSON.stringify({ error: 'prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const wrapped = new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({
        messages: [{ role: 'user', content: body.prompt }],
        provider: body.provider,
        model: body.model,
        system: body.system,
      }),
    });
    return chat(wrapped);
  };
}

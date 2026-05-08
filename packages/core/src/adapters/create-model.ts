/**
 * Resolves a Vercel AI SDK `LanguageModel` for the given provider.
 *
 * Provider adapters live in the registry (`provider-registry.ts`).
 * Built-ins are registered automatically when this module is loaded;
 * consumers can register additional providers at runtime via
 * `registerProvider`.
 *
 * Usage (server-side):
 * ```ts
 * import { createModel } from '@nyxis/core/server';
 * import { streamText } from 'ai';
 *
 * const model = await createModel({ provider: 'anthropic', model: 'claude-sonnet-4-5' });
 * const result = streamText({ model, messages });
 * ```
 *
 * Custom provider (Cohere example):
 * ```ts
 * import { registerProvider, createModel } from '@nyxis/core';
 * import { createCohere } from '@ai-sdk/cohere';
 *
 * registerProvider('cohere', {
 *   loadModel: ({ apiKey, model }) => createCohere({ apiKey })(model),
 * });
 *
 * const model = await createModel({ provider: 'cohere', model: 'command-r-plus' });
 * ```
 */

import type { AIProviderId } from '../types.js';
import { getRegisteredProvider, listProviders } from './provider-registry.js';

export interface CreateModelOptions {
  provider: AIProviderId;
  model: string;
  /** API key. If omitted, the underlying SDK reads from environment. */
  apiKey?: string;
  /** Custom base URL (Ollama, proxies, OpenRouter-style routes). */
  baseURL?: string;
  /** Additional provider-specific settings forwarded as-is. */
  settings?: Record<string, unknown>;
}

/**
 * Build a Vercel AI SDK model for the given provider/model combination.
 *
 * Throws a descriptive error if the provider is unknown, or if the
 * provider's optional peer dependency is not installed.
 */
export async function createModel(options: CreateModelOptions): Promise<unknown> {
  const registration = getRegisteredProvider(options.provider);

  if (!registration) {
    const known = listProviders();
    throw new Error(
      `[@nyxis/core] unknown provider: "${options.provider}". ` +
        `Known providers: ${known.map((id) => `"${id}"`).join(', ')}. ` +
        `To add a custom one, call registerProvider('${options.provider}', { loadModel })`,
    );
  }

  try {
    return await registration.loadModel(options);
  } catch (err) {
    if (err instanceof Error && /Cannot find module|MODULE_NOT_FOUND/.test(err.message)) {
      throw new Error(
        `[@nyxis/core] provider "${options.provider}" requires installing its SDK package. ` +
          `Run: pnpm add @ai-sdk/${options.provider}` +
          (options.provider === 'ollama' ? ' (or: pnpm add ollama-ai-provider)' : '') +
          ' ai',
      );
    }
    throw err;
  }
}

/**
 * Lazily resolves a Vercel AI SDK `LanguageModel` for the given provider.
 * Each provider's package is dynamically imported so consumers only ship
 * the adapters they actually use.
 *
 * Usage (server-side):
 * ```ts
 * import { createModel } from 'nyxis-ui/ai/server';
 * import { streamText } from 'ai';
 *
 * const model = await createModel({ provider: 'anthropic', model: 'claude-sonnet-4-5' });
 * const result = streamText({ model, messages });
 * ```
 */

import type { AIProviderId } from '../types.js';

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

type AnyModel = unknown;

/** Build a settings object stripped of undefined values so the AI SDK's
 *  exactOptionalPropertyTypes-strict signatures accept it. */
function compactSettings(opts: CreateModelOptions): Record<string, unknown> {
  const out: Record<string, unknown> = { ...(opts.settings ?? {}) };
  if (opts.apiKey !== undefined) out.apiKey = opts.apiKey;
  if (opts.baseURL !== undefined) out.baseURL = opts.baseURL;
  return out;
}

async function loadAnthropic(opts: CreateModelOptions): Promise<AnyModel> {
  const mod = await import('@ai-sdk/anthropic');
  const settings = compactSettings(opts);
  const factory =
    Object.keys(settings).length > 0
      ? mod.createAnthropic(settings as Parameters<typeof mod.createAnthropic>[0])
      : mod.anthropic;
  return factory(opts.model);
}

async function loadOpenAI(opts: CreateModelOptions): Promise<AnyModel> {
  const mod = await import('@ai-sdk/openai');
  const settings = compactSettings(opts);
  const factory =
    Object.keys(settings).length > 0
      ? mod.createOpenAI(settings as Parameters<typeof mod.createOpenAI>[0])
      : mod.openai;
  return factory(opts.model);
}

async function loadGoogle(opts: CreateModelOptions): Promise<AnyModel> {
  const mod = await import('@ai-sdk/google');
  const settings = compactSettings(opts);
  const factory =
    Object.keys(settings).length > 0
      ? mod.createGoogleGenerativeAI(settings as Parameters<typeof mod.createGoogleGenerativeAI>[0])
      : mod.google;
  return factory(opts.model);
}

async function loadMistral(opts: CreateModelOptions): Promise<AnyModel> {
  const mod = await import('@ai-sdk/mistral');
  const settings = compactSettings(opts);
  const factory =
    Object.keys(settings).length > 0
      ? mod.createMistral(settings as Parameters<typeof mod.createMistral>[0])
      : mod.mistral;
  return factory(opts.model);
}

async function loadOllama(opts: CreateModelOptions): Promise<AnyModel> {
  const mod = (await import('ollama-ai-provider')) as unknown as {
    ollama: (id: string) => unknown;
    createOllama: (settings: Record<string, unknown>) => (id: string) => unknown;
  };
  const settings = compactSettings(opts);
  const factory = Object.keys(settings).length > 0 ? mod.createOllama(settings) : mod.ollama;
  return factory(opts.model);
}

const LOADERS: Record<
  Exclude<AIProviderId, 'custom'>,
  (opts: CreateModelOptions) => Promise<AnyModel>
> = {
  anthropic: loadAnthropic,
  openai: loadOpenAI,
  google: loadGoogle,
  mistral: loadMistral,
  ollama: loadOllama,
};

/**
 * Build a Vercel AI SDK model for the given provider/model combination.
 * Throws a descriptive error if the provider's optional peer dependency
 * is not installed.
 */
export async function createModel(options: CreateModelOptions): Promise<AnyModel> {
  if (options.provider === 'custom') {
    throw new Error(
      `[nyxis-ui/ai] provider="custom" requires building the model yourself and passing it to streamText/generateText directly.`,
    );
  }
  const loader = LOADERS[options.provider];
  if (!loader) {
    throw new Error(`[nyxis-ui/ai] unknown provider: ${options.provider}`);
  }
  try {
    return await loader(options);
  } catch (err) {
    if (err instanceof Error && /Cannot find module|MODULE_NOT_FOUND/.test(err.message)) {
      throw new Error(
        `[nyxis-ui/ai] provider "${options.provider}" requires installing its SDK package. ` +
          `Run: pnpm add @ai-sdk/${options.provider}` +
          (options.provider === 'ollama' ? ' (or: pnpm add ollama-ai-provider)' : '') +
          ' ai',
      );
    }
    throw err;
  }
}

/**
 * Extensible registry of AI provider adapters.
 *
 * Built-in providers (anthropic, openai, google, mistral, ollama)
 * register themselves automatically as a side-effect of importing this
 * module. Consumers can register their own providers at runtime to
 * support models we don't yet ship — Cohere, Groq, Together, AWS
 * Bedrock, an internal proxy, anything that returns a Vercel AI SDK
 * `LanguageModel`:
 *
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
 *
 * The registry is a process-wide singleton — call `registerProvider`
 * once at startup. For test isolation, `unregisterProvider` and
 * `resetProviderRegistry` revert state.
 */

import type { CreateModelOptions } from './create-model.js';

export interface ProviderRegistration {
  /**
   * Build a Vercel AI SDK `LanguageModel` for the given options. Sync
   * or async. Receives the full `CreateModelOptions` so providers can
   * use `apiKey`, `baseURL`, and `settings` as needed.
   */
  loadModel: (opts: CreateModelOptions) => unknown | Promise<unknown>;
  /**
   * Optional human-readable label (used by Models & Providers UI
   * components when the provider is rendered in pickers).
   */
  label?: string;
  /**
   * Optional documentation URL.
   */
  docsUrl?: string;
}

const REGISTRY = new Map<string, ProviderRegistration>();

/**
 * Register (or replace) a provider adapter. Subsequent calls to
 * `createModel({ provider: id, … })` will use the registered loader.
 *
 * Re-registering an existing provider replaces the loader without
 * warning — that's how built-ins can be swapped for proxied versions.
 */
export function registerProvider(id: string, registration: ProviderRegistration): void {
  REGISTRY.set(id, registration);
}

/**
 * Remove a provider from the registry. Returns true if it was
 * registered, false otherwise.
 */
export function unregisterProvider(id: string): boolean {
  return REGISTRY.delete(id);
}

/**
 * Get a registered provider by id, or undefined if not registered.
 * Used internally by `createModel`; useful externally for sanity
 * checks before calling the model.
 */
export function getRegisteredProvider(id: string): ProviderRegistration | undefined {
  return REGISTRY.get(id);
}

/**
 * List the ids of every registered provider, in insertion order.
 * Built-ins come first because this module registers them on import.
 */
export function listProviders(): string[] {
  return [...REGISTRY.keys()];
}

/**
 * Drop every entry from the registry, then re-register the built-ins.
 * Useful between tests when a previous test installed a stub provider.
 *
 * Calling this in production code defeats the purpose of the registry;
 * it exists for test isolation only.
 */
export function resetProviderRegistry(): void {
  REGISTRY.clear();
  registerBuiltIns();
}

// ── Built-in providers ────────────────────────────────────────────────
//
// Each built-in uses a lazy dynamic import so the SDK is only loaded
// when the provider is actually used. If the SDK isn't installed,
// `createModel` rewrites the error into an actionable install hint.

function compactSettings(opts: CreateModelOptions): Record<string, unknown> {
  const out: Record<string, unknown> = { ...(opts.settings ?? {}) };
  if (opts.apiKey !== undefined) out.apiKey = opts.apiKey;
  if (opts.baseURL !== undefined) out.baseURL = opts.baseURL;
  return out;
}

function registerBuiltIns(): void {
  registerProvider('anthropic', {
    label: 'Anthropic',
    docsUrl: 'https://docs.anthropic.com',
    async loadModel(opts) {
      const mod = await import('@ai-sdk/anthropic');
      const settings = compactSettings(opts);
      const factory =
        Object.keys(settings).length > 0
          ? mod.createAnthropic(settings as Parameters<typeof mod.createAnthropic>[0])
          : mod.anthropic;
      return factory(opts.model);
    },
  });

  registerProvider('openai', {
    label: 'OpenAI',
    docsUrl: 'https://platform.openai.com/docs',
    async loadModel(opts) {
      const mod = await import('@ai-sdk/openai');
      const settings = compactSettings(opts);
      const factory =
        Object.keys(settings).length > 0
          ? mod.createOpenAI(settings as Parameters<typeof mod.createOpenAI>[0])
          : mod.openai;
      return factory(opts.model);
    },
  });

  registerProvider('google', {
    label: 'Google',
    docsUrl: 'https://ai.google.dev/gemini-api/docs',
    async loadModel(opts) {
      const mod = await import('@ai-sdk/google');
      const settings = compactSettings(opts);
      const factory =
        Object.keys(settings).length > 0
          ? mod.createGoogleGenerativeAI(
              settings as Parameters<typeof mod.createGoogleGenerativeAI>[0],
            )
          : mod.google;
      return factory(opts.model);
    },
  });

  registerProvider('mistral', {
    label: 'Mistral',
    docsUrl: 'https://docs.mistral.ai',
    async loadModel(opts) {
      const mod = await import('@ai-sdk/mistral');
      const settings = compactSettings(opts);
      const factory =
        Object.keys(settings).length > 0
          ? mod.createMistral(settings as Parameters<typeof mod.createMistral>[0])
          : mod.mistral;
      return factory(opts.model);
    },
  });

  registerProvider('ollama', {
    label: 'Ollama',
    docsUrl: 'https://ollama.com',
    async loadModel(opts) {
      const mod = (await import('ollama-ai-provider')) as unknown as {
        ollama: (id: string) => unknown;
        createOllama: (settings: Record<string, unknown>) => (id: string) => unknown;
      };
      const settings = compactSettings(opts);
      const factory = Object.keys(settings).length > 0 ? mod.createOllama(settings) : mod.ollama;
      return factory(opts.model);
    },
  });
}

/** Set of provider ids the registry shipped with — for tests / introspection. */
export const BUILT_IN_PROVIDER_IDS = [
  'anthropic',
  'openai',
  'google',
  'mistral',
  'ollama',
] as const;

// Side effect: register the built-ins as a free benefit of importing.
registerBuiltIns();

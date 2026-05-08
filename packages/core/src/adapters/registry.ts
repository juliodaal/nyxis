/**
 * Provider metadata used by Models & Providers UI components
 * (`<AIProviderSelector>`, `<ModelPicker>`, etc.). The actual model
 * factories live in `@ai-sdk/<provider>` and `ollama-ai-provider` and
 * are loaded on-demand so consumers only pay for the providers they use.
 */

import type { AIModel, AIProviderId, BuiltInAIProviderId } from '../types.js';

export interface ProviderInfo {
  id: AIProviderId;
  /** Human-readable name. */
  label: string;
  /** Short marketing tagline. */
  tagline?: string;
  /** Where to get an API key. */
  signupUrl?: string;
  /** Documentation URL. */
  docsUrl?: string;
  /** Whether the provider runs locally (no key required). */
  local?: boolean;
  /** Recommended default model for new users. */
  defaultModel: string;
  /** Curated catalog (the wider model space is huge and changes often). */
  models: readonly AIModel[];
}

/**
 * Curated metadata for the providers Nyxis ships with. UI components
 * read from this map to render pickers and capability badges.
 *
 * Custom providers registered via `registerProvider` do not appear
 * here — UI components that want to surface them must look them up
 * through `listProviders()` from the provider-registry module and
 * provide their own labels.
 */
export const PROVIDERS: Record<BuiltInAIProviderId, ProviderInfo> = {
  anthropic: {
    id: 'anthropic',
    label: 'Anthropic',
    tagline: "Claude — Anthropic's Constitutional AI family.",
    signupUrl: 'https://console.anthropic.com',
    docsUrl: 'https://docs.anthropic.com',
    defaultModel: 'claude-sonnet-4-5',
    models: [
      {
        id: 'claude-sonnet-4-5',
        label: 'Claude Sonnet 4.5',
        provider: 'anthropic',
        contextWindow: 200_000,
        maxOutput: 8_192,
        capabilities: ['chat', 'tools', 'vision', 'reasoning', 'json-mode', 'structured-output'],
        pricing: { inputPerMTokens: 3, outputPerMTokens: 15 },
        status: 'stable',
      },
      {
        id: 'claude-opus-4-1',
        label: 'Claude Opus 4.1',
        provider: 'anthropic',
        contextWindow: 200_000,
        maxOutput: 8_192,
        capabilities: ['chat', 'tools', 'vision', 'reasoning', 'json-mode', 'structured-output'],
        pricing: { inputPerMTokens: 15, outputPerMTokens: 75 },
        status: 'stable',
      },
      {
        id: 'claude-haiku-4-5',
        label: 'Claude Haiku 4.5',
        provider: 'anthropic',
        contextWindow: 200_000,
        maxOutput: 8_192,
        capabilities: ['chat', 'tools', 'vision', 'json-mode'],
        pricing: { inputPerMTokens: 0.8, outputPerMTokens: 4 },
        status: 'stable',
      },
    ],
  },

  openai: {
    id: 'openai',
    label: 'OpenAI',
    tagline: 'GPT family from OpenAI.',
    signupUrl: 'https://platform.openai.com',
    docsUrl: 'https://platform.openai.com/docs',
    defaultModel: 'gpt-4o',
    models: [
      {
        id: 'gpt-4o',
        label: 'GPT-4o',
        provider: 'openai',
        contextWindow: 128_000,
        maxOutput: 16_384,
        capabilities: [
          'chat',
          'tools',
          'vision',
          'audio-in',
          'audio-out',
          'json-mode',
          'structured-output',
        ],
        pricing: { inputPerMTokens: 2.5, outputPerMTokens: 10 },
        status: 'stable',
      },
      {
        id: 'gpt-4o-mini',
        label: 'GPT-4o mini',
        provider: 'openai',
        contextWindow: 128_000,
        maxOutput: 16_384,
        capabilities: ['chat', 'tools', 'vision', 'json-mode', 'structured-output'],
        pricing: { inputPerMTokens: 0.15, outputPerMTokens: 0.6 },
        status: 'stable',
      },
      {
        id: 'o3',
        label: 'o3',
        provider: 'openai',
        contextWindow: 200_000,
        capabilities: ['chat', 'tools', 'reasoning'],
        status: 'stable',
      },
      {
        id: 'text-embedding-3-large',
        label: 'Text Embedding 3 Large',
        provider: 'openai',
        contextWindow: 8_191,
        capabilities: ['embedding'],
        pricing: { inputPerMTokens: 0.13 },
        status: 'stable',
      },
    ],
  },

  google: {
    id: 'google',
    label: 'Google',
    tagline: 'Gemini family from Google DeepMind.',
    signupUrl: 'https://aistudio.google.com',
    docsUrl: 'https://ai.google.dev/gemini-api/docs',
    defaultModel: 'gemini-2.0-flash',
    models: [
      {
        id: 'gemini-2.0-pro',
        label: 'Gemini 2.0 Pro',
        provider: 'google',
        contextWindow: 2_000_000,
        capabilities: ['chat', 'tools', 'vision', 'audio-in', 'reasoning', 'json-mode'],
        status: 'stable',
      },
      {
        id: 'gemini-2.0-flash',
        label: 'Gemini 2.0 Flash',
        provider: 'google',
        contextWindow: 1_000_000,
        capabilities: ['chat', 'tools', 'vision', 'audio-in', 'json-mode'],
        pricing: { inputPerMTokens: 0.075, outputPerMTokens: 0.3 },
        status: 'stable',
      },
    ],
  },

  mistral: {
    id: 'mistral',
    label: 'Mistral',
    tagline: 'Open and proprietary models from Mistral AI.',
    signupUrl: 'https://console.mistral.ai',
    docsUrl: 'https://docs.mistral.ai',
    defaultModel: 'mistral-large-latest',
    models: [
      {
        id: 'mistral-large-latest',
        label: 'Mistral Large',
        provider: 'mistral',
        contextWindow: 128_000,
        capabilities: ['chat', 'tools', 'json-mode'],
        pricing: { inputPerMTokens: 2, outputPerMTokens: 6 },
        status: 'stable',
      },
      {
        id: 'mistral-small-latest',
        label: 'Mistral Small',
        provider: 'mistral',
        contextWindow: 128_000,
        capabilities: ['chat', 'tools', 'json-mode'],
        pricing: { inputPerMTokens: 0.2, outputPerMTokens: 0.6 },
        status: 'stable',
      },
    ],
  },

  ollama: {
    id: 'ollama',
    label: 'Ollama',
    tagline: 'Local models — no key, no cloud.',
    docsUrl: 'https://ollama.com',
    local: true,
    defaultModel: 'llama3.3',
    models: [
      {
        id: 'llama3.3',
        label: 'Llama 3.3 (70B)',
        provider: 'ollama',
        contextWindow: 128_000,
        capabilities: ['chat', 'tools', 'json-mode'],
        status: 'stable',
      },
      {
        id: 'qwen2.5',
        label: 'Qwen 2.5 (32B)',
        provider: 'ollama',
        contextWindow: 32_768,
        capabilities: ['chat', 'tools'],
        status: 'stable',
      },
      {
        id: 'gemma3',
        label: 'Gemma 3',
        provider: 'ollama',
        contextWindow: 8_192,
        capabilities: ['chat', 'vision'],
        status: 'stable',
      },
    ],
  },
};

export const PROVIDER_ORDER: readonly BuiltInAIProviderId[] = [
  'anthropic',
  'openai',
  'google',
  'mistral',
  'ollama',
];

export function listAllModels(): readonly AIModel[] {
  return PROVIDER_ORDER.flatMap((id) => PROVIDERS[id].models);
}

/**
 * Look up a built-in provider's metadata. Returns undefined for
 * provider ids that aren't built-in — custom providers registered
 * via `registerProvider` don't carry curated metadata, so callers
 * should fall back to the registration's `label` / `docsUrl`.
 */
export function getProviderInfo(id: AIProviderId): ProviderInfo | undefined {
  return (PROVIDERS as Record<string, ProviderInfo | undefined>)[id];
}

export function findModel(modelId: string): AIModel | undefined {
  for (const id of PROVIDER_ORDER) {
    const found = PROVIDERS[id].models.find((m) => m.id === modelId);
    if (found) return found;
  }
  return undefined;
}

export function modelsByCapability(
  capability: AIModel['capabilities'][number],
): readonly AIModel[] {
  return listAllModels().filter((m) => m.capabilities.includes(capability));
}

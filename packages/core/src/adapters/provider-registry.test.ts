import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createModel, type CreateModelOptions } from './create-model.js';
import {
  BUILT_IN_PROVIDER_IDS,
  getRegisteredProvider,
  listProviders,
  registerProvider,
  resetProviderRegistry,
  unregisterProvider,
} from './provider-registry.js';

describe('provider-registry', () => {
  beforeEach(() => {
    resetProviderRegistry();
  });

  afterEach(() => {
    resetProviderRegistry();
  });

  it('auto-registers the five built-ins on import', () => {
    const ids = listProviders();
    for (const builtIn of BUILT_IN_PROVIDER_IDS) {
      expect(ids).toContain(builtIn);
    }
  });

  it('lets a consumer register a custom provider', async () => {
    const stubModel = { __tag: 'cohere-stub' };
    registerProvider('cohere', {
      label: 'Cohere',
      loadModel: ({ model }) => ({ ...stubModel, model }),
    });

    expect(listProviders()).toContain('cohere');

    const reg = getRegisteredProvider('cohere');
    expect(reg).toBeDefined();
    expect(reg?.label).toBe('Cohere');

    const model = (await createModel({
      provider: 'cohere',
      model: 'command-r-plus',
    } satisfies CreateModelOptions)) as { __tag: string; model: string };

    expect(model.__tag).toBe('cohere-stub');
    expect(model.model).toBe('command-r-plus');
  });

  it('passes apiKey, baseURL, and settings to the loader', async () => {
    let received: CreateModelOptions | undefined;
    registerProvider('captured', {
      loadModel: (opts) => {
        received = opts;
        return { ok: true };
      },
    });

    await createModel({
      provider: 'captured',
      model: 'test-model',
      apiKey: 'secret',
      baseURL: 'https://example.test',
      settings: { temperature: 0.1 },
    });

    expect(received).toEqual({
      provider: 'captured',
      model: 'test-model',
      apiKey: 'secret',
      baseURL: 'https://example.test',
      settings: { temperature: 0.1 },
    });
  });

  it('replaces an existing registration without warning', async () => {
    registerProvider('shadow', { loadModel: () => 'first' });
    registerProvider('shadow', { loadModel: () => 'second' });

    const result = await createModel({ provider: 'shadow', model: 'x' });
    expect(result).toBe('second');
  });

  it('unregisterProvider removes an entry', () => {
    registerProvider('temporary', { loadModel: () => null });
    expect(listProviders()).toContain('temporary');
    expect(unregisterProvider('temporary')).toBe(true);
    expect(listProviders()).not.toContain('temporary');
    // Removing twice returns false the second time.
    expect(unregisterProvider('temporary')).toBe(false);
  });

  it('createModel throws a descriptive error for unknown providers', async () => {
    await expect(createModel({ provider: 'unknown-xyz', model: 'm' })).rejects.toThrow(
      /unknown provider.*"unknown-xyz".*registerProvider/,
    );
  });

  it('createModel propagates loader errors as-is when not a missing module', async () => {
    registerProvider('faulty', {
      loadModel: () => {
        throw new Error('Boom from the loader');
      },
    });

    await expect(createModel({ provider: 'faulty', model: 'x' })).rejects.toThrow(
      /Boom from the loader/,
    );
  });

  it('rewrites missing-module errors into install hints', async () => {
    registerProvider('absent', {
      loadModel: () => {
        throw new Error("Cannot find module '@ai-sdk/absent'");
      },
    });

    await expect(createModel({ provider: 'absent', model: 'x' })).rejects.toThrow(
      /requires installing its SDK package/,
    );
  });

  it('resetProviderRegistry restores the built-ins', () => {
    registerProvider('temp', { loadModel: () => null });
    expect(listProviders()).toContain('temp');

    resetProviderRegistry();

    expect(listProviders()).not.toContain('temp');
    for (const builtIn of BUILT_IN_PROVIDER_IDS) {
      expect(listProviders()).toContain(builtIn);
    }
  });
});

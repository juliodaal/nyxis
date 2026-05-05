import { describe, expect, it } from 'vitest';
import {
  PROVIDERS,
  PROVIDER_ORDER,
  findModel,
  listAllModels,
  modelsByCapability,
} from './registry.js';

describe('provider registry', () => {
  it('exposes the five core providers in order', () => {
    expect(PROVIDER_ORDER.slice(0, 5)).toEqual([
      'anthropic',
      'openai',
      'google',
      'mistral',
      'ollama',
    ]);
  });

  it('every provider has at least one model except `custom`', () => {
    for (const id of PROVIDER_ORDER) {
      if (id === 'custom') continue;
      expect(PROVIDERS[id].models.length).toBeGreaterThan(0);
    }
  });

  it('every model declares chat capability except embedding-only models', () => {
    for (const model of listAllModels()) {
      if (model.capabilities.includes('embedding') && model.capabilities.length === 1) continue;
      expect(model.capabilities).toContain('chat');
    }
  });

  it('findModel returns the correct entry', () => {
    const m = findModel('claude-sonnet-4-5');
    expect(m).toBeDefined();
    expect(m?.provider).toBe('anthropic');
  });

  it('modelsByCapability filters correctly', () => {
    const visionModels = modelsByCapability('vision');
    expect(visionModels.length).toBeGreaterThan(0);
    for (const m of visionModels) {
      expect(m.capabilities).toContain('vision');
    }
  });
});

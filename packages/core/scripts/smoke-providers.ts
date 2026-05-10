#!/usr/bin/env tsx
/**
 * Smoke test for the AI integration layer.
 *
 *   pnpm --filter nyxis-ui smoke:providers anthropic
 *   pnpm --filter nyxis-ui smoke:providers openai
 *   pnpm --filter nyxis-ui smoke:providers google
 *   pnpm --filter nyxis-ui smoke:providers mistral
 *   pnpm --filter nyxis-ui smoke:providers ollama   # local, no API key
 *   pnpm --filter nyxis-ui smoke:providers all      # try every key that's set
 *
 * Reads API keys from environment variables — never put them in code:
 *   ANTHROPIC_API_KEY, OPENAI_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY,
 *   MISTRAL_API_KEY. (Ollama needs no key, but expects ollama serve on
 *   localhost:11434.)
 *
 * Exits 0 on success, 1 on any failure. Streams the response to stdout
 * so you can see tokens arriving in real time — that's the whole point.
 */

import { streamText } from 'ai';

import { createModel } from '../src/adapters/create-model.js';

import type { AIProviderId } from '../src/types.js';

interface ProviderProbe {
  provider: Exclude<AIProviderId, 'custom'>;
  envVar: string | null;
  defaultModel: string;
}

const PROBES: readonly ProviderProbe[] = [
  { provider: 'anthropic', envVar: 'ANTHROPIC_API_KEY', defaultModel: 'claude-sonnet-4-5' },
  { provider: 'openai', envVar: 'OPENAI_API_KEY', defaultModel: 'gpt-4o-mini' },
  {
    provider: 'google',
    envVar: 'GOOGLE_GENERATIVE_AI_API_KEY',
    defaultModel: 'gemini-1.5-flash',
  },
  { provider: 'mistral', envVar: 'MISTRAL_API_KEY', defaultModel: 'mistral-small-latest' },
  { provider: 'ollama', envVar: null, defaultModel: 'llama3.2' },
];

const PROMPT = 'Reply with exactly one short sentence about why peer dependencies are useful.';

async function probe(p: ProviderProbe): Promise<boolean> {
  const apiKey = p.envVar ? process.env[p.envVar] : undefined;
  if (p.envVar && !apiKey) {
    console.log(`  ⊘ ${p.provider}: skipped — set ${p.envVar} to test this provider.`);
    return true;
  }

  const startedAt = Date.now();
  try {
    console.log(`\n  → ${p.provider} · ${p.defaultModel}`);
    const model = await createModel({
      provider: p.provider,
      model: p.defaultModel,
      ...(apiKey ? { apiKey } : {}),
    });
    // The createModel return type is intentionally `unknown` so the AI SDK's
    // strict types don't leak across the boundary; cast back here.
    const result = streamText({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      model: model as any,
      messages: [{ role: 'user', content: PROMPT }],
      maxTokens: 80,
    });

    process.stdout.write('    ');
    let totalChars = 0;
    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
      totalChars += chunk.length;
    }
    process.stdout.write('\n');

    const ms = Date.now() - startedAt;
    console.log(`    ✓ ${p.provider}: ${totalChars} chars · ${ms}ms`);
    return true;
  } catch (err) {
    console.error(`    ✗ ${p.provider}: ${(err as Error).message}`);
    return false;
  }
}

async function main(): Promise<void> {
  const arg = (process.argv[2] ?? 'all').toLowerCase();
  const targets = arg === 'all' ? PROBES : PROBES.filter((p) => p.provider === arg);

  if (targets.length === 0) {
    console.error(`Unknown provider: ${arg}`);
    console.error(`Usage: smoke:providers [${PROBES.map((p) => p.provider).join('|')}|all]`);
    process.exit(2);
  }

  console.log(`Smoke-testing ${targets.length} provider(s)…`);
  let okAll = true;
  for (const target of targets) {
    const ok = await probe(target);
    if (!ok) okAll = false;
  }

  console.log('\n' + (okAll ? '✓ All probed providers OK.' : '✗ At least one provider failed.'));
  process.exit(okAll ? 0 : 1);
}

void main();

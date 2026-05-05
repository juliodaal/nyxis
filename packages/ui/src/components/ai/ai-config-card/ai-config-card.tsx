'use client';

import { useState } from 'react';

import { cn } from '../../../lib/utils.js';
import type { AIProviderId } from '../../../ai/types.js';
import { PROVIDERS } from '../../../ai/adapters/registry.js';
import { AIProviderSelector } from '../ai-provider-selector/ai-provider-selector.js';
import { ModelPicker } from '../model-picker/model-picker.js';
import { APIKeyInput, type APIKeyInputStatus } from '../api-key-input/api-key-input.js';
import { TemperatureSlider } from '../temperature-slider/temperature-slider.js';
import { TopPSlider } from '../top-p-slider/top-p-slider.js';
import { MaxTokensInput } from '../max-tokens-input/max-tokens-input.js';
import { SystemPromptEditor } from '../system-prompt-editor/system-prompt-editor.js';

export interface AIConfig {
  provider: AIProviderId;
  model: string;
  apiKey: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface AIConfigCardProps {
  /** Initial config when uncontrolled. */
  defaultConfig?: Partial<AIConfig>;
  /** Controlled config. */
  config?: Partial<AIConfig>;
  /** Called whenever any value changes. */
  onConfigChange?: (config: AIConfig) => void;
  /** Async API key validator forwarded to `<APIKeyInput>`. */
  validateApiKey?: (key: string) => Promise<APIKeyInputStatus>;
  /** Hide the API key input — useful when keys live server-side. */
  hideApiKey?: boolean;
  /** Hide the system prompt editor for compact dashboards. */
  hideSystemPrompt?: boolean;
  className?: string;
}

const DEFAULTS: AIConfig = {
  provider: 'anthropic',
  model: 'claude-sonnet-4-5',
  apiKey: '',
  temperature: 0.7,
  topP: 1,
  maxTokens: 1024,
  systemPrompt: '',
};

/**
 * One-stop card composing every Models & Providers UI primitive into a
 * single configuration panel — the recommended starting point for any
 * AI-product settings page.
 */
export function AIConfigCard({
  defaultConfig,
  config,
  onConfigChange,
  validateApiKey,
  hideApiKey = false,
  hideSystemPrompt = false,
  className,
}: AIConfigCardProps) {
  const [internal, setInternal] = useState<AIConfig>({ ...DEFAULTS, ...defaultConfig });
  const value: AIConfig = { ...internal, ...config };

  const update = (patch: Partial<AIConfig>) => {
    const next = { ...value, ...patch };
    if (!config) setInternal(next);
    onConfigChange?.(next);
  };

  return (
    <div
      className={cn(
        'border-border bg-card shadow-soft flex flex-col gap-5 rounded-xl border p-5',
        className,
      )}
    >
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="text-foreground text-base font-semibold">AI configuration</h3>
        <span className="text-muted-foreground text-[11px] uppercase tracking-wider">
          Provider · Model · Sampling
        </span>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AIProviderSelector
          value={value.provider}
          onValueChange={(provider) => {
            // When the provider changes, the previous model id is rarely valid;
            // reset to the new provider's recommended default.
            const info = PROVIDERS[provider];
            const valid = info.models.some((m) => m.id === value.model);
            update({
              provider,
              ...(valid ? {} : { model: info.defaultModel }),
            });
          }}
        />
        <ModelPicker
          value={value.model}
          onValueChange={(model) => update({ model })}
          provider={value.provider}
        />
      </div>

      {!hideApiKey ? (
        <APIKeyInput
          provider={value.provider}
          value={value.apiKey}
          onValueChange={(apiKey) => update({ apiKey })}
          {...(validateApiKey ? { validate: validateApiKey } : {})}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TemperatureSlider
          value={value.temperature}
          onValueChange={(temperature) => update({ temperature })}
        />
        <TopPSlider value={value.topP} onValueChange={(topP) => update({ topP })} />
      </div>

      <MaxTokensInput
        value={value.maxTokens}
        onValueChange={(maxTokens) => update({ maxTokens })}
        modelId={value.model}
      />

      {!hideSystemPrompt ? (
        <SystemPromptEditor
          value={value.systemPrompt}
          onValueChange={(systemPrompt) => update({ systemPrompt })}
        />
      ) : null}
    </div>
  );
}

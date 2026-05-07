'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { AIContext, type AIContextValue } from './ai-context.js';
import { nyxisAIEvents } from './events.js';
import { PROVIDERS } from './adapters/registry.js';
import type { AIProviderId, AITool } from './types.js';

export interface AIProviderProps {
  /** Initial provider. Defaults to 'anthropic'. */
  defaultProvider?: AIProviderId;
  /** Initial model. Defaults to the provider's recommended default. */
  defaultModel?: string;
  /** Server endpoint for chat. Defaults to '/api/chat'. */
  api?: string;
  /** Server endpoint for single-shot completion. Defaults to '/api/completion'. */
  completionApi?: string;
  /** Tools registered up-front (additional tools can be registered at runtime). */
  tools?: readonly AITool[];
  /** Persist the user's provider/model choice in localStorage under this key. */
  persistKey?: string;
  children: ReactNode;
}

const DEFAULT_PERSIST_KEY = 'nyxis-ai-provider';

interface PersistedConfig {
  provider: AIProviderId;
  model: string;
}

function readPersisted(key: string | undefined): PersistedConfig | null {
  if (!key || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedConfig>;
    if (!parsed.provider || !parsed.model) return null;
    return { provider: parsed.provider, model: parsed.model };
  } catch {
    return null;
  }
}

function writePersisted(key: string | undefined, config: PersistedConfig): void {
  if (!key || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(config));
  } catch {
    // Storage may be unavailable; in-memory state still works.
  }
}

/**
 * Wraps the application so descendants can use `useAI`, `useChat`, etc.
 *
 * The provider only stores client-side configuration: the chosen provider,
 * the chosen model, the server endpoints, and the registered tools. The
 * actual API key, model construction, and streaming run server-side via
 * `createChatHandler` from `nyxis-ui/ai/server`.
 *
 * @example
 * ```tsx
 * <AIProvider defaultProvider="anthropic" defaultModel="claude-sonnet-4-5">
 *   <App />
 * </AIProvider>
 * ```
 */
export function AIProvider({
  defaultProvider = 'anthropic',
  defaultModel,
  api = '/api/chat',
  completionApi = '/api/completion',
  tools: initialTools = [],
  persistKey = DEFAULT_PERSIST_KEY,
  children,
}: AIProviderProps) {
  const persisted = useMemo(() => readPersisted(persistKey), [persistKey]);
  const initialProvider = persisted?.provider ?? defaultProvider;
  const initialModel = persisted?.model ?? defaultModel ?? PROVIDERS[initialProvider].defaultModel;

  const [provider, setProviderState] = useState<AIProviderId>(initialProvider);
  const [model, setModelState] = useState<string>(initialModel);
  const [tools, setTools] = useState<readonly AITool[]>(initialTools);

  useEffect(() => {
    writePersisted(persistKey, { provider, model });
    nyxisAIEvents.emit({ type: 'provider-switch', provider, model });
  }, [provider, model, persistKey]);

  const setProvider = useCallback(
    (next: AIProviderId) => {
      setProviderState(next);
      // When the provider changes the previous model id is rarely valid;
      // fall back to the new provider's recommended default.
      const info = PROVIDERS[next];
      if (info && !info.models.some((m) => m.id === model)) {
        setModelState(info.defaultModel);
      }
    },
    [model],
  );

  const setModel = useCallback((next: string) => {
    setModelState(next);
  }, []);

  const registerTool = useCallback((tool: AITool) => {
    setTools((current) => {
      if (current.some((t) => t.name === tool.name)) return current;
      return [...current, tool];
    });
    nyxisAIEvents.emit({
      type: 'tool-register',
      tool: { name: tool.name, description: tool.description },
    });
    return () => {
      setTools((current) => current.filter((t) => t.name !== tool.name));
      nyxisAIEvents.emit({ type: 'tool-unregister', name: tool.name });
    };
  }, []);

  const value = useMemo<AIContextValue>(
    () => ({
      provider,
      model,
      api,
      completionApi,
      tools,
      setProvider,
      setModel,
      registerTool,
    }),
    [provider, model, api, completionApi, tools, setProvider, setModel, registerTool],
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

'use client';

import { useCallback, useRef, useState } from 'react';

import { nyxisAIEvents } from '../events.js';

import { useAI } from './use-ai.js';

export interface UseCompletionOptions {
  /** API endpoint. Defaults to the value configured in `<AIProvider>`. */
  api?: string;
  /** Optional system prompt forwarded with every request. */
  systemPrompt?: string;
  /** Headers / credentials forwarded with each request. */
  fetchOptions?: Pick<RequestInit, 'headers' | 'credentials' | 'mode'>;
  /** Called once with the full text after the stream finishes. */
  onFinish?: (text: string) => void;
  /** Called when streaming errors. */
  onError?: (error: Error) => void;
}

export interface UseCompletionReturn {
  /** Streamed completion text (grows as tokens arrive). */
  completion: string;
  /** Run the completion. Resolves with the final text. */
  complete: (prompt: string) => Promise<string>;
  /** Abort the current run. */
  stop: () => void;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Single-shot streaming completion. Same wire format as `useChat` but
 * returns a flat string instead of a message list.
 */
export function useCompletion(options: UseCompletionOptions = {}): UseCompletionReturn {
  const ctx = useAI();
  const api = options.api ?? ctx.completionApi;

  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  }, []);

  const complete = useCallback(
    async (prompt: string): Promise<string> => {
      setCompletion('');
      setError(null);
      setIsLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;
      let acc = '';

      try {
        const response = await fetch(api, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...(options.fetchOptions?.headers ?? {}),
          },
          ...(options.fetchOptions?.credentials
            ? { credentials: options.fetchOptions.credentials }
            : {}),
          ...(options.fetchOptions?.mode ? { mode: options.fetchOptions.mode } : {}),
          body: JSON.stringify({
            prompt,
            provider: ctx.provider,
            model: ctx.model,
            system: options.systemPrompt,
          }),
        });
        if (!response.ok) {
          throw new Error(`Completion request failed (${response.status})`);
        }
        if (!response.body) throw new Error('Empty response body');

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += value;
          setCompletion(acc);
          nyxisAIEvents.emit({ type: 'delta', messageId: 'completion', text: value });
        }
        options.onFinish?.(acc);
        nyxisAIEvents.emit({ type: 'done' });
        return acc;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          const e = err as Error;
          setError(e);
          options.onError?.(e);
          nyxisAIEvents.emit({ type: 'error', error: { message: e.message, cause: e } });
        }
        return acc;
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [api, ctx.provider, ctx.model, options],
  );

  return { completion, complete, stop, isLoading, error };
}

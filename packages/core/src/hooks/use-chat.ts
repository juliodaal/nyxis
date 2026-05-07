'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useAI } from './use-ai.js';
import { nyxisAIEvents } from '../events.js';
import type {
  AIChatOptions,
  AIChatReturn,
  AICitation,
  AIMessage,
  AIToolCall,
  AIUsage,
} from '../types.js';

const id = () => Math.random().toString(36).slice(2, 11);

interface ServerStreamChunk {
  type: 'text-delta' | 'tool-call' | 'tool-result' | 'citation' | 'usage' | 'finish' | 'error';
  // Vercel AI SDK uses different shapes; we accept the union loosely.
  textDelta?: string;
  toolCallId?: string;
  toolName?: string;
  args?: Record<string, unknown>;
  result?: unknown;
  citation?: AICitation;
  usage?: AIUsage;
  finishReason?: string;
  error?: { message: string };
}

/**
 * Drop-in chat state for any UI built on `<ChatThread>` / `<ChatInput>`.
 *
 * Wraps the Vercel AI SDK protocol: posts to your `/api/chat` endpoint
 * (configured via `<AIProvider api="..." />`) and streams back
 * Server-Sent Events. Surfaces tool calls, citations, and usage so
 * companion UI components like `<TokenCounter>`, `<CitationList>`,
 * `<ToolCallList>` can hook in without prop-drilling.
 *
 * @example
 * ```tsx
 * function Chat() {
 *   const { messages, input, setInput, send, isLoading } = useChat({
 *     systemPrompt: 'You are a helpful assistant.',
 *   });
 *   return (
 *     <>
 *       <ChatThread messages={messages} />
 *       <ChatInput value={input} onValueChange={setInput} onSubmit={send} />
 *     </>
 *   );
 * }
 * ```
 */
export function useChat(options: AIChatOptions = {}): AIChatReturn {
  const ctx = useAI();
  const api = options.api ?? ctx.api;
  const fetchOptions = options.fetchOptions;
  const onFinish = options.onFinish;
  const onError = options.onError;
  const systemPrompt = options.systemPrompt;
  const callTools = options.tools ?? ctx.tools;

  const [messages, setMessages] = useState<AIMessage[]>(
    () => options.initialMessages?.slice() ?? [],
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [toolCalls, setToolCalls] = useState<readonly AIToolCall[]>([]);
  const [citations, setCitations] = useState<readonly AICitation[]>([]);
  const [usage, setUsage] = useState<AIUsage | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const lastUserMessageRef = useRef<AIMessage | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const runRequest = useCallback(
    async (history: AIMessage[]) => {
      setIsLoading(true);
      setError(null);
      setToolCalls([]);
      setCitations([]);

      const controller = new AbortController();
      abortRef.current = controller;

      const assistantId = id();
      const assistantMessage: AIMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
        toolCalls: [],
        citations: [],
      };
      nyxisAIEvents.emit({
        type: 'message-start',
        message: {
          id: assistantId,
          role: 'assistant',
          createdAt: assistantMessage.createdAt!,
        },
      });
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const response = await fetch(api, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...(fetchOptions?.headers ?? {}),
          },
          ...(fetchOptions?.credentials ? { credentials: fetchOptions.credentials } : {}),
          ...(fetchOptions?.mode ? { mode: fetchOptions.mode } : {}),
          body: JSON.stringify({
            messages: history,
            provider: ctx.provider,
            model: ctx.model,
            system: systemPrompt,
            tools: callTools.map((t) => ({
              name: t.name,
              description: t.description,
              inputSchema: t.inputSchema,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error(`Chat request failed (${response.status} ${response.statusText})`);
        }
        if (!response.body) {
          throw new Error('Chat response has no body');
        }

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

        let buffer = '';
        let assistantText = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += value;
          // The Vercel AI SDK protocol delimits chunks with `\n`. Each
          // line is `<digit>:<json>` where the digit identifies the type.
          // We accept both that wire format and an alternative SSE-flavoured
          // `data: {...}\n\n` for friendlier custom servers.
          let nlIndex = buffer.indexOf('\n');
          while (nlIndex >= 0) {
            const line = buffer.slice(0, nlIndex).trim();
            buffer = buffer.slice(nlIndex + 1);

            if (line && !line.startsWith(':')) {
              const chunk = parseChunk(line);
              if (chunk) {
                applyChunk(chunk);
              }
            }
            nlIndex = buffer.indexOf('\n');
          }
        }

        if (buffer.trim()) {
          const chunk = parseChunk(buffer.trim());
          if (chunk) applyChunk(chunk);
        }

        // Finalise message in state.
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: assistantText } : m)),
        );
        nyxisAIEvents.emit({ type: 'message-end', messageId: assistantId });
        nyxisAIEvents.emit({ type: 'done' });

        if (onFinish) {
          onFinish({
            ...assistantMessage,
            content: assistantText,
          });
        }

        function applyChunk(chunk: ServerStreamChunk) {
          switch (chunk.type) {
            case 'text-delta': {
              const delta = chunk.textDelta ?? '';
              assistantText += delta;
              nyxisAIEvents.emit({ type: 'delta', messageId: assistantId, text: delta });
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: assistantText } : m)),
              );
              break;
            }
            case 'tool-call': {
              if (!chunk.toolCallId || !chunk.toolName) break;
              const tc: AIToolCall = {
                id: chunk.toolCallId,
                name: chunk.toolName,
                args: chunk.args ?? {},
                status: 'pending',
              };
              setToolCalls((prev) => [...prev, tc]);
              nyxisAIEvents.emit({ type: 'tool-call', toolCall: tc });
              break;
            }
            case 'tool-result': {
              if (!chunk.toolCallId) break;
              setToolCalls((prev) =>
                prev.map((t) =>
                  t.id === chunk.toolCallId
                    ? { ...t, status: 'completed', result: chunk.result }
                    : t,
                ),
              );
              nyxisAIEvents.emit({
                type: 'tool-result',
                id: chunk.toolCallId,
                result: chunk.result,
              });
              break;
            }
            case 'citation': {
              if (!chunk.citation) break;
              setCitations((prev) => [...prev, chunk.citation!]);
              nyxisAIEvents.emit({ type: 'citation', citation: chunk.citation });
              break;
            }
            case 'usage': {
              if (!chunk.usage) break;
              setUsage(chunk.usage);
              nyxisAIEvents.emit({ type: 'usage', usage: chunk.usage });
              break;
            }
            case 'error': {
              const message = chunk.error?.message ?? 'Stream error';
              throw new Error(message);
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // user aborted — not an error
        } else {
          const e = err as Error;
          setError(e);
          nyxisAIEvents.emit({ type: 'error', error: { message: e.message, cause: e } });
          if (onError) onError(e);
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [api, ctx.provider, ctx.model, callTools, systemPrompt, fetchOptions, onFinish, onError],
  );

  const send = useCallback(
    async (override?: string) => {
      const text = (override ?? input).trim();
      if (!text || isLoading) return;
      const userMessage: AIMessage = {
        id: id(),
        role: 'user',
        content: text,
        createdAt: new Date().toISOString(),
      };
      lastUserMessageRef.current = userMessage;
      const next = [...messages, userMessage];
      setMessages(next);
      setInput('');
      await runRequest(next);
    },
    [input, isLoading, messages, runRequest],
  );

  const reload = useCallback(() => {
    if (!lastUserMessageRef.current) return;
    // Drop the last assistant message and re-run.
    const trimmed = messages.filter(
      (m, i) => !(i === messages.length - 1 && m.role === 'assistant'),
    );
    setMessages(trimmed);
    void runRequest(trimmed);
  }, [messages, runRequest]);

  return {
    messages,
    input,
    setInput,
    send,
    stop,
    reload,
    isLoading,
    error,
    toolCalls,
    citations,
    usage,
  };
}

function parseChunk(line: string): ServerStreamChunk | null {
  // Vercel AI SDK Stream Protocol: each line starts with a numeric tag.
  // 0:"<text>" → text delta
  // 9:{toolCallId,toolName,args} → tool-call
  // a:{toolCallId,result} → tool-result
  // d:{finishReason,usage} → finish
  // e:{message} → error
  // We also accept `data: {...}` SSE-style payloads.
  if (line.startsWith('data:')) {
    try {
      const payload = JSON.parse(line.slice(5).trim());
      return payload as ServerStreamChunk;
    } catch {
      return null;
    }
  }
  const colon = line.indexOf(':');
  if (colon <= 0) return null;
  const tag = line.slice(0, colon);
  const rest = line.slice(colon + 1);
  let parsed: unknown;
  try {
    parsed = JSON.parse(rest);
  } catch {
    return null;
  }
  switch (tag) {
    case '0':
      return { type: 'text-delta', textDelta: typeof parsed === 'string' ? parsed : '' };
    case '9': {
      const p = parsed as { toolCallId: string; toolName: string; args: Record<string, unknown> };
      return {
        type: 'tool-call',
        toolCallId: p.toolCallId,
        toolName: p.toolName,
        args: p.args ?? {},
      };
    }
    case 'a': {
      const p = parsed as { toolCallId: string; result: unknown };
      return { type: 'tool-result', toolCallId: p.toolCallId, result: p.result };
    }
    case 'd': {
      const p = parsed as { finishReason?: string; usage?: AIUsage };
      const usage = p.usage;
      if (usage) return { type: 'usage', usage };
      return p.finishReason ? { type: 'finish', finishReason: p.finishReason } : { type: 'finish' };
    }
    case '3': {
      const p = parsed as { message: string };
      return { type: 'error', error: { message: p.message } };
    }
    default:
      return null;
  }
}

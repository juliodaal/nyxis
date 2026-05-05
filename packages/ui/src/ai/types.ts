/**
 * Shared AI types used across hooks, components, and adapters.
 *
 * These are intentionally provider-agnostic and based on the Vercel AI
 * SDK's vocabulary so values flow without translation.
 */

export type AIProviderId = 'anthropic' | 'openai' | 'google' | 'mistral' | 'ollama' | 'custom';

export type AIRole = 'system' | 'user' | 'assistant' | 'tool';

export interface AIMessage {
  id: string;
  role: AIRole;
  content: string;
  /** Tool calls produced by an assistant message. */
  toolCalls?: AIToolCall[];
  /** Citations attached to an assistant message. */
  citations?: AICitation[];
  /** ISO timestamp. */
  createdAt?: string;
  /** Free-form metadata (model name, latency, ...). */
  metadata?: Record<string, unknown>;
}

export type AIToolCallStatus = 'pending' | 'running' | 'completed' | 'errored';

export interface AIToolCall {
  id: string;
  name: string;
  /** Arguments parsed from the model's response. */
  args: Record<string, unknown>;
  /** Result produced by the tool — may stream in. */
  result?: unknown;
  status: AIToolCallStatus;
  error?: string;
  /** ms elapsed between dispatch and completion. */
  durationMs?: number;
}

export interface AICitation {
  /** Source title shown to the user. */
  source: string;
  /** Locator: page, timestamp, section, etc. */
  locator?: string;
  /** Snippet that was cited. */
  snippet: string;
  /** External URL when available. */
  url?: string;
  /** Relevance score 0..1. */
  score?: number;
  /** Free-form id from the retriever. */
  id?: string;
}

export interface AIUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  /** Estimated cost in USD when the adapter knows the price. */
  costUsd?: number;
  provider: AIProviderId;
  model: string;
}

export type AIModelCapability =
  | 'chat'
  | 'tools'
  | 'vision'
  | 'audio-in'
  | 'audio-out'
  | 'embedding'
  | 'reasoning'
  | 'json-mode'
  | 'structured-output';

export interface AIModel {
  id: string;
  /** Human-readable label. */
  label: string;
  provider: AIProviderId;
  /** Maximum context window in tokens. */
  contextWindow: number;
  /** Maximum output tokens. */
  maxOutput?: number;
  capabilities: readonly AIModelCapability[];
  /** Pricing per 1M tokens, when known. */
  pricing?: {
    inputPerMTokens?: number;
    outputPerMTokens?: number;
  };
  /** Whether the model is generally available or in preview. */
  status?: 'stable' | 'preview' | 'deprecated';
}

/** Discriminated union of events that flow through the streaming pipeline. */
export type AIStreamEvent =
  | { type: 'delta'; messageId: string; text: string }
  | { type: 'message-start'; message: Pick<AIMessage, 'id' | 'role' | 'createdAt'> }
  | { type: 'message-end'; messageId: string }
  | { type: 'tool-call'; toolCall: AIToolCall }
  | { type: 'tool-result'; id: string; result: unknown }
  | { type: 'citation'; citation: AICitation }
  | { type: 'usage'; usage: AIUsage }
  | { type: 'error'; error: { message: string; cause?: unknown } }
  | { type: 'done' };

/** A tool definition the assistant can call. The `execute` is optional —
 *  if absent, the call surfaces in the UI for the user/server to handle. */
export interface AITool<TInput = Record<string, unknown>, TOutput = unknown> {
  name: string;
  description: string;
  /** JSON Schema describing the input arguments. */
  inputSchema: Record<string, unknown>;
  /** Optional client-side executor. Receives parsed args, returns result. */
  execute?: (args: TInput, context: { signal: AbortSignal }) => Promise<TOutput> | TOutput;
}

export interface AIChatOptions {
  /** API endpoint. Defaults to '/api/chat'. */
  api?: string;
  /** Initial conversation. */
  initialMessages?: AIMessage[];
  /** System prompt sent on every request (the server is the source of truth — this is just hint). */
  systemPrompt?: string;
  /** Tools available to the model. */
  tools?: readonly AITool[];
  /** Called when a complete assistant message has been received. */
  onFinish?: (message: AIMessage) => void;
  /** Called when an error occurs during streaming. */
  onError?: (error: Error) => void;
  /** Headers / credentials forwarded with each request. */
  fetchOptions?: Pick<RequestInit, 'headers' | 'credentials' | 'mode'>;
}

export interface AIChatReturn {
  messages: AIMessage[];
  input: string;
  setInput: (value: string) => void;
  /** Send the current input (or an explicit value) as a user message. */
  send: (override?: string) => Promise<void>;
  /** Abort the in-flight request. */
  stop: () => void;
  /** Re-run the last user turn. */
  reload: () => void;
  isLoading: boolean;
  error: Error | null;
  /** Tool calls collected from the latest assistant turn. */
  toolCalls: readonly AIToolCall[];
  /** Citations collected from the latest assistant turn. */
  citations: readonly AICitation[];
  /** Usage from the latest completed turn. */
  usage: AIUsage | null;
}

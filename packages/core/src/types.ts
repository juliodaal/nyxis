/**
 * Shared AI types used across hooks, components, and adapters.
 *
 * These are intentionally provider-agnostic and based on the Vercel AI
 * SDK's vocabulary so values flow without translation.
 */

/**
 * Built-in providers ship with adapters in `@nyxis/core` and can be
 * used out of the box. The string-union part keeps autocomplete for
 * those, while the `(string & {})` widens the type so consumers can
 * register custom providers via `registerProvider('cohere', { … })`
 * without TypeScript complaints.
 */
export type BuiltInAIProviderId = 'anthropic' | 'openai' | 'google' | 'mistral' | 'ollama';
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AIProviderId = BuiltInAIProviderId | (string & {});

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

// ── Model Context Protocol (Phase H) ───────────────────────────────────

/** Wire transport for an MCP server. */
export type MCPTransport = 'stdio' | 'sse' | 'websocket' | 'http';

/** Connection lifecycle for an MCP server. */
export type MCPConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

/** Capabilities an MCP server can expose. Mirrors the spec. */
export type MCPCapability = 'tools' | 'prompts' | 'resources' | 'sampling' | 'roots' | 'logging';

/** A configured MCP server. */
export interface MCPServer {
  id: string;
  /** Human-readable name. */
  name: string;
  /** Optional one-line description. */
  description?: string;
  transport: MCPTransport;
  /** Command + args for stdio, URL for sse/ws/http. */
  endpoint: string;
  state: MCPConnectionState;
  /** Capabilities advertised after the handshake. */
  capabilities?: readonly MCPCapability[];
  /** Server-reported version. */
  version?: string;
  /** Last-measured round-trip latency, ms. */
  latencyMs?: number;
  /** Error message when `state === 'error'`. */
  error?: string;
}

/** A resource exposed by an MCP server. */
export interface MCPResource {
  /** Stable URI (e.g. `file:///docs/intro.md`, `db://users/42`). */
  uri: string;
  /** Display name. */
  name: string;
  description?: string;
  /** MIME type, when known. */
  mimeType?: string;
  /** Server id this resource belongs to. */
  serverId?: string;
}

/** A prompt template exposed by an MCP server. */
export interface MCPPrompt {
  name: string;
  description?: string;
  /** Declared arguments. */
  arguments?: readonly {
    name: string;
    description?: string;
    required?: boolean;
  }[];
  /** Server id this prompt belongs to. */
  serverId?: string;
}

/** Direction of an MCP log entry. */
export type MCPLogDirection = 'in' | 'out' | 'event';

/** A single entry from an MCP server's log stream. */
export interface MCPLogEntry {
  id: string;
  /** Wall-clock when emitted. */
  timestamp: Date | string;
  direction: MCPLogDirection;
  /** Method / event name (e.g. `tools/call`, `notifications/message`). */
  method: string;
  /** Optional inline payload preview. */
  payload?: unknown;
  /** Severity for log-channel events. */
  level?: 'debug' | 'info' | 'warn' | 'error';
}

// ── Agents (Phase I) ───────────────────────────────────────────────────

/** Lifecycle of an agent. */
export type AgentStatus = 'idle' | 'thinking' | 'working' | 'blocked' | 'done' | 'errored';

/** A single agent in a multi-agent system. */
export interface Agent {
  id: string;
  /** Display name. */
  name: string;
  /** One-line role / persona summary. */
  role?: string;
  /** Model id powering this agent (must match a `nyxis-ui/ai` model). */
  modelId?: string;
  /** Optional avatar URL. Falls back to `initials`. */
  avatarUrl?: string;
  /** Two-letter fallback rendered when no `avatarUrl`. */
  initials?: string;
  /** Current lifecycle. */
  status: AgentStatus;
  /** Tools the agent has access to (names). */
  tools?: readonly string[];
  /** Last activity timestamp. */
  lastActiveAt?: Date | string;
  /** Free-form metadata (user-defined). */
  metadata?: Record<string, unknown>;
}

/** Kind of activity an agent emits — drives the icon in feeds. */
export type AgentActivityKind =
  | 'thought'
  | 'action'
  | 'tool-call'
  | 'message'
  | 'handoff'
  | 'error';

/** A single entry in an agent activity feed. */
export interface AgentActivity {
  id: string;
  /** Owning agent. */
  agentId: string;
  /** Resolved agent name for display (saves a lookup). */
  agentName?: string;
  kind: AgentActivityKind;
  /** Short summary line (one row). */
  summary: string;
  /** Optional longer detail / payload (collapsible). */
  detail?: string;
  /** Wall-clock. */
  timestamp: Date | string;
}

/** Event when one agent hands off work to another. */
export interface HandoffEvent {
  /** Source agent id. */
  fromAgentId: string;
  /** Target agent id. */
  toAgentId: string;
  /** Resolved names for display. */
  fromAgentName?: string;
  toAgentName?: string;
  /** Why the work is being handed off. */
  reason?: string;
  /** Lifecycle of the handoff. */
  state?: 'pending' | 'accepted' | 'rejected';
  /** Wall-clock. */
  timestamp?: Date | string;
}

/** Status of a delegated task. */
export type DelegatedTaskStatus = 'pending' | 'in-progress' | 'blocked' | 'done' | 'errored';

/** A task delegated to an agent, possibly with sub-tasks. */
export interface DelegatedTask {
  id: string;
  /** Headline. */
  title: string;
  /** Optional one-line description. */
  description?: string;
  /** Assigned agent. */
  agentId?: string;
  agentName?: string;
  /** Lifecycle. */
  status: DelegatedTaskStatus;
  /** Optional progress 0..1 (rendered as a tiny bar). */
  progress?: number;
  /** Sub-tasks — hierarchies render recursively. */
  children?: readonly DelegatedTask[];
}

// ── Multimodal (Phase J) ───────────────────────────────────────────────

/** Kind of media. */
export type MediaKind = 'image' | 'audio' | 'video';

/** Lifecycle of a media generation request. */
export type MediaGenerationStatus = 'pending' | 'generating' | 'ready' | 'errored';

/** A piece of media exchanged with the model — uploaded by the user
 *  or generated by the assistant. */
export interface MediaAttachment {
  id: string;
  kind: MediaKind;
  /** URL or data: URI. */
  url: string;
  /** Display name / caption. */
  name?: string;
  /** Alt text for accessibility. */
  alt?: string;
  /** MIME type, when known. */
  mimeType?: string;
  /** Size in bytes. */
  size?: number;
  /** For images: natural width/height. */
  width?: number;
  height?: number;
  /** For audio/video: duration in seconds. */
  durationSec?: number;
  /** When the model is still generating, surface progress. */
  status?: MediaGenerationStatus;
  /** Optional progress 0..1 while `status === 'generating'`. */
  progress?: number;
  /** Free-form metadata. */
  metadata?: Record<string, unknown>;
}

/** A segment of a transcript, anchored to a time range. */
export interface TranscriptSegment {
  id: string;
  /** Segment start in seconds. */
  start: number;
  /** Segment end in seconds. */
  end: number;
  /** Spoken text. */
  text: string;
  /** Speaker id / label, when diarisation is available. */
  speaker?: string;
  /** Confidence 0..1. */
  confidence?: number;
}

// ── Prompts / Eval (Phase K) ───────────────────────────────────────────

/** A saved prompt template. */
export interface Prompt {
  id: string;
  /** Display name. */
  name: string;
  /** One-line description. */
  description?: string;
  /** Prompt body — supports `{{variables}}`. */
  body: string;
  /** Semver-style or numeric version label (e.g. `2.1`, `v3`). */
  version?: string;
  /** Default model the prompt is tuned for. */
  modelId?: string;
  /** Detected variable names. Cached so consumers don't re-scan. */
  variables?: readonly string[];
  /** Free-form tags for filtering. */
  tags?: readonly string[];
  /** ISO timestamps. */
  createdAt?: string;
  updatedAt?: string;
  /** Optional folder / category. */
  folder?: string;
}

/** Lifecycle of a single evaluation run. */
export type EvalRunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

/** A single named metric on an eval run. */
export interface EvalMetric {
  name: string;
  /** Current value. */
  value: number;
  /** Unit suffix (e.g. `%`, `ms`, `$`). */
  unit?: string;
  /** Baseline value to compare against (renders a delta). */
  baseline?: number;
  /** Direction in which an increase is "good". Default `up`. */
  goodDirection?: 'up' | 'down';
  /** Optional historical sparkline values (oldest → newest). */
  sparkline?: readonly number[];
  /** How many decimals to render. */
  precision?: number;
}

/** Summary of a single eval run. */
export interface EvalRun {
  id: string;
  /** Display name (often the prompt name + version). */
  name: string;
  /** Lifecycle. */
  status: EvalRunStatus;
  /** Prompt under test. */
  promptId?: string;
  promptName?: string;
  /** Model being evaluated. */
  modelId?: string;
  /** Dataset id and label. */
  datasetId?: string;
  datasetName?: string;
  /** Number of rows in the dataset. */
  totalRows?: number;
  /** Rows processed so far. */
  processedRows?: number;
  /** Headline metrics (typically 3-6). */
  metrics?: readonly EvalMetric[];
  /** ISO timestamps. */
  startedAt?: string;
  completedAt?: string;
  /** Total duration in ms. */
  durationMs?: number;
  /** Error message when `status === 'failed'`. */
  error?: string;
}

/** A single row in an eval dataset / run. */
export interface EvalRow {
  id: string;
  /** Input passed to the model. */
  input: string;
  /** Expected (golden) output. */
  expected?: string;
  /** Actual output produced by the model. */
  actual?: string;
  /** Score 0..1 (or any float — colour bucketing handles ranges). */
  score?: number;
  /** Latency in ms. */
  latencyMs?: number;
  /** Cost in USD. */
  costUsd?: number;
  /** Per-row pass/fail when relevant. */
  status?: 'pass' | 'fail' | 'skipped';
  /** Free-form notes (graders, comments). */
  notes?: string;
}

// ── RAG (Phase L) ──────────────────────────────────────────────────────

/** A chunk returned by a retriever, optionally reranked. */
export interface RetrievedChunk {
  id: string;
  /** Source identifier (filename, URL, document id). */
  source: string;
  /** Optional locator within the source (page, section, line range, timestamp). */
  locator?: string;
  /** The chunk's text content. */
  text: string;
  /** Similarity score from the retriever (0..1). */
  score?: number;
  /** Score after a reranker stage, when present. */
  rerankScore?: number;
  /** Original rank from the retriever (1-based). */
  rank?: number;
  /** Free-form metadata (collection, document type, custom labels). */
  metadata?: Record<string, unknown>;
}

/** A point in a 2D embedding projection (UMAP / t-SNE / PCA). */
export interface EmbeddingPoint {
  id: string;
  /** Projection x. */
  x: number;
  /** Projection y. */
  y: number;
  /** Display label. */
  label?: string;
  /** Group / cluster label — drives colour. */
  group?: string;
}

/** Lifecycle of a single stage in a RAG pipeline. */
export type RAGStageStatus = 'pending' | 'running' | 'done' | 'errored';

/** A single stage in a RAG pipeline (e.g. embed, retrieve, rerank, generate). */
export interface RAGStage {
  id: string;
  /** Display name. */
  name: string;
  /** One-line description. */
  description?: string;
  /** Lifecycle. */
  status: RAGStageStatus;
  /** Stage duration in ms. */
  durationMs?: number;
  /** Optional count produced/consumed (e.g. `12` chunks). */
  count?: number;
  /** Free-form detail (renders inline). */
  detail?: string;
}

// ── Skills (Phase M) ───────────────────────────────────────────────────

/** Severity / direction of a permission scope. */
export type SkillScopeKind = 'read' | 'write' | 'admin';

/** A single permission scope a skill requires. */
export interface SkillScope {
  kind: SkillScopeKind;
  /** Free-form resource label (e.g. `files`, `calendar`, `email`). */
  resource: string;
  /** Human-friendly description shown on hover. */
  description?: string;
}

/** Lifecycle of a skill's auth / connection. */
export type SkillAuthState = 'connected' | 'expired' | 'needs-reauth' | 'never' | 'errored';

/** Whether the skill is enabled in the user's runtime. */
export type SkillStatus = 'enabled' | 'disabled' | 'errored';

/** A skill registered with (or available to) the agent runtime. */
export interface Skill {
  id: string;
  name: string;
  description?: string;
  version?: string;
  /** Author / publisher. */
  author?: string;
  /** Optional icon URL. Falls back to `initials`. */
  iconUrl?: string;
  /** Two-letter fallback when no `iconUrl`. */
  initials?: string;
  /** Permission scopes required. */
  scopes?: readonly SkillScope[];
  /** Connection / auth lifecycle. */
  authState?: SkillAuthState;
  /** Whether the skill is enabled in the runtime. */
  status?: SkillStatus;
  /** Last invocation timestamp (ISO string). */
  lastUsedAt?: string;
  /** Free-form tags. */
  tags?: readonly string[];
  /** Category for grouping (e.g. `productivity`, `data`, `dev`). */
  category?: string;
  /** Whether the skill is installed (drives marketplace UI). */
  installed?: boolean;
  /** Total install count (marketplace metric). */
  installs?: number;
  /** Average rating 0..5. */
  rating?: number;
  /** Number of ratings — drives the "(N reviews)" display. */
  ratingCount?: number;
}

/** Lifecycle of a single skill invocation. */
export type SkillInvocationStatus = 'queued' | 'running' | 'completed' | 'errored';

/** A single recorded skill invocation. */
export interface SkillInvocation {
  id: string;
  /** Owning skill. */
  skillId: string;
  /** Resolved skill name for display. */
  skillName?: string;
  /** Action / method called on the skill. */
  action: string;
  status: SkillInvocationStatus;
  /** Wall-clock when the invocation started. */
  startedAt: Date | string;
  /** Total run time in ms. */
  durationMs?: number;
  /** Error message when `status === 'errored'`. */
  error?: string;
  /** Optional input snapshot. */
  input?: unknown;
  /** Optional result snapshot. */
  result?: unknown;
}

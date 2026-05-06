/**
 * `nyxis-ui/ai` — provider-aware client-side AI primitives.
 *
 *   import { AIProvider, useChat, useCompletion } from 'nyxis-ui/ai';
 *
 * Server-side helpers live in `nyxis-ui/ai/server`.
 */

// Types
export type {
  AIProviderId,
  AIRole,
  AIMessage,
  AIToolCall,
  AIToolCallStatus,
  AICitation,
  AIUsage,
  AIModel,
  AIModelCapability,
  AIStreamEvent,
  AITool,
  AIChatOptions,
  AIChatReturn,
  // MCP (Phase H)
  MCPTransport,
  MCPConnectionState,
  MCPCapability,
  MCPServer,
  MCPResource,
  MCPPrompt,
  MCPLogDirection,
  MCPLogEntry,
  // Agents (Phase I)
  Agent,
  AgentStatus,
  AgentActivity,
  AgentActivityKind,
  HandoffEvent,
  DelegatedTask,
  DelegatedTaskStatus,
  // Multimodal (Phase J)
  MediaKind,
  MediaGenerationStatus,
  MediaAttachment,
  TranscriptSegment,
} from './types.js';

// Event bus
export { nyxisAIEvents, type NyxisAIEvent } from './events.js';

// Provider metadata (read-only catalog, safe to ship to the browser).
export {
  PROVIDERS,
  PROVIDER_ORDER,
  listAllModels,
  getProviderInfo,
  findModel,
  modelsByCapability,
  type ProviderInfo,
} from './adapters/registry.js';

// Provider component + context hook
export { AIProvider, type AIProviderProps } from './ai-provider.js';
export { useAI } from './hooks/use-ai.js';
export { type AIContextValue } from './ai-context.js';

// Hooks
export { useChat } from './hooks/use-chat.js';
export {
  useCompletion,
  type UseCompletionOptions,
  type UseCompletionReturn,
} from './hooks/use-completion.js';
export { useTokenCount, estimateTokens } from './hooks/use-token-count.js';
export { useToolExecutor } from './hooks/use-tool-executor.js';

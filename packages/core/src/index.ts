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
  BuiltInAIProviderId,
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
  // Prompts / Eval (Phase K)
  Prompt,
  EvalRunStatus,
  EvalMetric,
  EvalRun,
  EvalRow,
  // RAG (Phase L)
  RetrievedChunk,
  EmbeddingPoint,
  RAGStageStatus,
  RAGStage,
  // Skills (Phase M)
  SkillScopeKind,
  SkillScope,
  SkillAuthState,
  SkillStatus,
  Skill,
  SkillInvocationStatus,
  SkillInvocation,
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

// Custom-provider registry (Phase 3). Built-ins (anthropic, openai,
// google, mistral, ollama) self-register on import; consumers can
// register their own at runtime.
export {
  registerProvider,
  unregisterProvider,
  getRegisteredProvider,
  listProviders,
  resetProviderRegistry,
  BUILT_IN_PROVIDER_IDS,
  type ProviderRegistration,
} from './adapters/provider-registry.js';

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
export { useChatInput, type UseChatInputReturn } from './hooks/use-chat-input.js';
export { useTokenCounter } from './hooks/use-token-counter.js';
export {
  usePromptVariableForm,
  type UsePromptVariableFormReturn,
} from './hooks/use-prompt-variable-form.js';
export { useChatThread, type UseChatThreadReturn } from './hooks/use-chat-thread.js';

// Headless controllers — framework-agnostic state machines.
// Use these directly when porting Nyxis to Vue / Svelte / Web Components,
// or when you need the logic without React.
export {
  createChatInputController,
  type ChatInputController,
  type ChatInputDerived,
  type ChatInputOptions,
  type ChatInputState,
  type KeyboardLike,
} from './headless/chat-input.js';
export {
  computeTokenCounter,
  type TokenCounterDerived,
  type TokenCounterTone,
} from './headless/token-counter.js';
export {
  createPromptVariableFormController,
  type PromptVariableFormController,
  type PromptVariableFormDerived,
  type PromptVariableFormOptions,
  type PromptVariableFormState,
} from './headless/prompt-variable-form.js';
export {
  createChatThreadController,
  type ChatThreadController,
  type ChatThreadDerived,
  type ChatThreadOptions,
  type ChatThreadState,
  type ScrollMetrics,
} from './headless/chat-thread.js';

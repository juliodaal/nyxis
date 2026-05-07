/**
 * Aggregator over the registry source files for the docs site to consume.
 *
 * The shadcn registry items are designed to be installed individually into
 * a consumer's project. This barrel exists ONLY so the docs site (which
 * dogfoods its own registry for live previews) can pull every component
 * through a single import.
 *
 * It is not part of the public Nyxis API and is not served by the registry
 * endpoints. Consumers continue to use `npx shadcn add @nyxis/<name>` and
 * import the resulting files from `@/components/nyxis/<name>`.
 */

// ── Theme ──────────────────────────────────────────────────────────────
export { ThemeToggle } from '@/components/nyxis/theme-toggle';

// ── Domain ─────────────────────────────────────────────────────────────
export { ConfidenceBadge } from '@/components/nyxis/confidence-badge';
export { SentimentIndicator } from '@/components/nyxis/sentiment-indicator';
export { CitationCard } from '@/components/nyxis/citation-card';
export { KPICard } from '@/components/nyxis/kpi-card';
export { FileDropzone } from '@/components/nyxis/file-dropzone';
export { DataTable } from '@/components/nyxis/data-table';
export { ChatMessage } from '@/components/nyxis/chat-message';
export { ChatInput } from '@/components/nyxis/chat-input';
export { LeadCard } from '@/components/nyxis/lead-card';
export { AuditLogItem } from '@/components/nyxis/audit-log-item';
export { ActionItem } from '@/components/nyxis/action-item';
export { EmailTriageCard } from '@/components/nyxis/email-triage-card';

// ── AI Animations ──────────────────────────────────────────────────────
export { SparkleField } from '@/components/nyxis/sparkle-field';
export { AIHaloBorder } from '@/components/nyxis/ai-halo-border';
export { ThinkingOrb } from '@/components/nyxis/thinking-orb';
export { NeuralBackground } from '@/components/nyxis/neural-background';
export { TokenStream } from '@/components/nyxis/token-stream';
export { GradientAura } from '@/components/nyxis/gradient-aura';

// ── Reasoning ──────────────────────────────────────────────────────────
export { ReasoningTrace } from '@/components/nyxis/reasoning-trace';
export { ChainOfThought } from '@/components/nyxis/chain-of-thought';
export { ThinkingIndicator } from '@/components/nyxis/thinking-indicator';

// ── Agents ─────────────────────────────────────────────────────────────
export { AgentStatusBadge } from '@/components/nyxis/agent-status-badge';
export { AgentCard } from '@/components/nyxis/agent-card';
export { AgentRoster } from '@/components/nyxis/agent-roster';
export { AgentActivityFeed } from '@/components/nyxis/agent-activity-feed';
export { AgentHandoff } from '@/components/nyxis/agent-handoff';
export { TaskDelegation } from '@/components/nyxis/task-delegation';

// ── Chat ───────────────────────────────────────────────────────────────
export { StreamingText } from '@/components/nyxis/streaming-text';
export { StreamingCode } from '@/components/nyxis/streaming-code';
export { StreamingMarkdown } from '@/components/nyxis/streaming-markdown';
export { TypingIndicator } from '@/components/nyxis/typing-indicator';
export { ChatThread } from '@/components/nyxis/chat-thread';
export { MessageActions } from '@/components/nyxis/message-actions';
export { TokenCounter } from '@/components/nyxis/token-counter';
export { ConversationSidebar } from '@/components/nyxis/conversation-sidebar';
export { ConversationFork } from '@/components/nyxis/conversation-fork';

// ── Tools ──────────────────────────────────────────────────────────────
export { ToolCall } from '@/components/nyxis/tool-call';
export { ToolResult } from '@/components/nyxis/tool-result';
export { ParameterForm } from '@/components/nyxis/parameter-form';
export { ToolRegistry } from '@/components/nyxis/tool-registry';
export { ToolExecutionLog } from '@/components/nyxis/tool-execution-log';

// ── MCP ────────────────────────────────────────────────────────────────
export { MCPCapabilityBadge } from '@/components/nyxis/mcp-capability-badge';
export { MCPConnectionStatus } from '@/components/nyxis/mcp-connection-status';
export { MCPServerCard } from '@/components/nyxis/mcp-server-card';
export { MCPServerList } from '@/components/nyxis/mcp-server-list';
export { MCPResourceBrowser } from '@/components/nyxis/mcp-resource-browser';
export { MCPPromptLibrary } from '@/components/nyxis/mcp-prompt-library';
export { MCPLogStream } from '@/components/nyxis/mcp-log-stream';

// ── Multimodal ─────────────────────────────────────────────────────────
export { ImageMessage } from '@/components/nyxis/image-message';
export { ImageGallery } from '@/components/nyxis/image-gallery';
export { VoiceWaveform } from '@/components/nyxis/voice-waveform';
export { AudioPlayer } from '@/components/nyxis/audio-player';
export { TranscriptionView } from '@/components/nyxis/transcription-view';
export { VisionInput } from '@/components/nyxis/vision-input';

// ── RAG ────────────────────────────────────────────────────────────────
export { ChunkCard } from '@/components/nyxis/chunk-card';
export { RetrievalResults } from '@/components/nyxis/retrieval-results';
export { VectorSearchInput } from '@/components/nyxis/vector-search-input';
export { DocumentChunker } from '@/components/nyxis/document-chunker';
export { EmbeddingScatter } from '@/components/nyxis/embedding-scatter';
export { RAGPipeline } from '@/components/nyxis/rag-pipeline';

// ── Skills ─────────────────────────────────────────────────────────────
export { SkillPermissions } from '@/components/nyxis/skill-permissions';
export { SkillAuthStatus } from '@/components/nyxis/skill-auth-status';
export { SkillCard } from '@/components/nyxis/skill-card';
export { SkillRegistry } from '@/components/nyxis/skill-registry';
export { SkillInvocationLog } from '@/components/nyxis/skill-invocation-log';
export { SkillMarketplace } from '@/components/nyxis/skill-marketplace';

// ── Prompts / Eval ─────────────────────────────────────────────────────
export { PromptCard } from '@/components/nyxis/prompt-card';
export { PromptVariableForm } from '@/components/nyxis/prompt-variable-form';
export { MetricCard } from '@/components/nyxis/metric-card';
export { EvalRunCard } from '@/components/nyxis/eval-run-card';
export { DatasetTable } from '@/components/nyxis/dataset-table';
export { ABCompare } from '@/components/nyxis/ab-compare';

// ── AI Models ──────────────────────────────────────────────────────────
export { AIProviderSelector } from '@/components/nyxis/ai-provider-selector';
export { ModelPicker } from '@/components/nyxis/model-picker';
export { APIKeyInput } from '@/components/nyxis/api-key-input';
export { TemperatureSlider } from '@/components/nyxis/temperature-slider';
export { TopPSlider } from '@/components/nyxis/top-p-slider';
export { MaxTokensInput } from '@/components/nyxis/max-tokens-input';
export { SystemPromptEditor } from '@/components/nyxis/system-prompt-editor';
export { ContextWindowMeter } from '@/components/nyxis/context-window-meter';
export { CostMeter } from '@/components/nyxis/cost-meter';
export { ProviderHealthBadge } from '@/components/nyxis/provider-health-badge';
export { AIConfigCard } from '@/components/nyxis/ai-config-card';

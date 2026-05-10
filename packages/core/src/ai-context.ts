'use client';

import { createContext } from 'react';

import type { AIProviderId, AITool } from './types.js';

export interface AIContextValue {
  /** Current provider id (for UI components like ModelPicker). */
  provider: AIProviderId;
  /** Current model id (for UI components). */
  model: string;
  /** Server endpoint that handles chat. Default '/api/chat'. */
  api: string;
  /** Server endpoint that handles single-shot completion. Default '/api/completion'. */
  completionApi: string;
  /** Tools registered globally — each `useChat` may also pass per-call tools. */
  tools: readonly AITool[];
  /** Mutators kept on the context so any descendant can change config. */
  setProvider: (provider: AIProviderId) => void;
  setModel: (model: string) => void;
  registerTool: (tool: AITool) => () => void;
}

export const AIContext = createContext<AIContextValue | null>(null);

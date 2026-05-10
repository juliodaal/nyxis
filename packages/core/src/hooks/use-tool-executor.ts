'use client';

import { useEffect } from 'react';

import { useAI } from './use-ai.js';

import type { AITool } from '../types.js';

/**
 * Register one or more tools so the assistant can call them. Tools are
 * tracked in the `<AIProvider>` and forwarded with every chat request.
 *
 * @example
 * ```tsx
 * useToolExecutor({
 *   name: 'getCurrentLocation',
 *   description: "Returns the user's current latitude/longitude.",
 *   inputSchema: { type: 'object', properties: {} },
 *   execute: async () => {
 *     return new Promise((resolve, reject) => {
 *       navigator.geolocation.getCurrentPosition(
 *         (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
 *         (err) => reject(err),
 *       );
 *     });
 *   },
 * });
 * ```
 */
export function useToolExecutor(tools: AITool | readonly AITool[]): void {
  const ctx = useAI();
  const list = Array.isArray(tools) ? tools : [tools as AITool];

  useEffect(() => {
    const cleanups = list.map((tool) => ctx.registerTool(tool));
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
    // We intentionally re-register when the list of tool *names* changes,
    // not on every render. The user is expected to memoise the tools array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.registerTool, list.map((t) => t.name).join('|')]);
}

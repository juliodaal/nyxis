/**
 * Lightweight pub/sub event bus shared across `nyxis-ui/ai` consumers.
 *
 * Why an event bus? The same conversation can drive multiple disconnected
 * islands — a header `<TokenCounter>`, a sidebar `<CostMeter>`, a footer
 * `<ProviderHealthBadge>` — and they should all react to streaming state
 * without prop-drilling or sharing React state.
 *
 * Subscribers get every `AIStreamEvent` plus a few internal events
 * (provider switched, tool registered, etc.).
 */

import type { AIProviderId, AIStreamEvent, AITool, AIUsage } from './types.js';

export type NyxisAIEvent =
  | AIStreamEvent
  | { type: 'provider-switch'; provider: AIProviderId; model: string }
  | { type: 'tool-register'; tool: Pick<AITool, 'name' | 'description'> }
  | { type: 'tool-unregister'; name: string }
  | { type: 'usage-update'; usage: AIUsage; sessionTotal: AIUsage }
  | { type: 'session-reset' };

type Listener = (event: NyxisAIEvent) => void;

class EventBus {
  private listeners = new Set<Listener>();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(event: NyxisAIEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        // A misbehaving listener must not break the others.
        if (typeof console !== 'undefined') {
          console.error('[nyxis-ui/ai] listener threw on', event.type, err);
        }
      }
    }
  }

  /** Number of active subscribers. Useful for tests / devtools. */
  get listenerCount(): number {
    return this.listeners.size;
  }
}

/**
 * Singleton event bus. Importing this module from multiple bundles in the
 * same realm gives you the same instance — exactly what you want.
 */
export const nyxisAIEvents = new EventBus();

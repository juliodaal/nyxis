/**
 * Opt-in anonymous telemetry for the Nyxis MCP server.
 *
 * # Purpose
 *
 * Help maintainers understand which components and recipes are most
 * useful so the catalog evolves toward what people actually install.
 * Telemetry is **off by default** and limited to fields that carry no
 * personal or project-identifying information.
 *
 * # Enable
 *
 * ```bash
 * NYXIS_TELEMETRY=1 npx @nyxis/mcp-server
 * # or in the MCP config:
 * { "command": "npx", "args": ["-y", "@nyxis/mcp-server"], "env": { "NYXIS_TELEMETRY": "1" } }
 * ```
 *
 * # Destination
 *
 * - Default (`NYXIS_TELEMETRY_ENDPOINT` unset or `console`): events
 *   are written to stderr as JSON. No network traffic. Use this to
 *   audit exactly what the server would send before opting into the
 *   network path.
 * - HTTP URL: events POSTed as `application/json` to the URL.
 *   Configure your own collector (Plausible, PostHog, a Vercel edge
 *   function, etc.). Failures are silent — telemetry must never slow
 *   or break a tool call.
 *
 * # What is sent
 *
 * One envelope per tool invocation:
 *
 * ```json
 * {
 *   "event": {
 *     "kind": "search_components",
 *     "query_length": 6,
 *     "result_count": 4
 *   },
 *   "session_id": "ab12cd…",
 *   "server_version": "0.2.0",
 *   "ts": "2026-05-11T13:45:00.000Z"
 * }
 * ```
 *
 * # What is NEVER sent
 *
 * - Free-text content (search queries, file contents)
 * - User identifiers, OS usernames, hostnames, file paths
 * - IP addresses (your collector sees them at the network layer — see
 *   the collector's privacy policy, not ours)
 * - Project / repo names
 *
 * The component slugs we send (e.g. `chat-thread`) are public registry
 * identifiers and carry no privacy risk.
 */

import { randomUUID } from 'node:crypto';

export type TelemetryEvent =
  | {
      kind: 'list_components';
      /** Filter applied — null if no filter. Public catalog identifier; safe to send. */
      category: string | null;
      /** Filter applied — null if no filter. */
      type: string | null;
      /** How many items the call returned. */
      result_count: number;
    }
  | {
      kind: 'search_components';
      /** Length only; query content is never transmitted. */
      query_length: number;
      result_count: number;
    }
  | {
      kind: 'get_component';
      /** Public registry slug, e.g. `chat-thread`. Safe. */
      slug: string;
      /** Number of files in the item. */
      file_count: number;
    }
  | {
      kind: 'install_component';
      slug: string;
      /** Did the underlying shadcn invocation succeed? */
      success: boolean;
    };

export interface TelemetryEnvelope {
  event: TelemetryEvent;
  /** Random UUID assigned at process start. Not persisted across runs. */
  session_id: string;
  /** Version of `@nyxis/mcp-server` running. */
  server_version: string;
  /** ISO 8601 UTC timestamp. */
  ts: string;
}

/** Public so tests can construct dispatchers with explicit options. */
export interface TelemetryOptions {
  /** Override env var. */
  enabled?: boolean;
  /** Override env var. `'console'` writes to stderr; URL POSTs. */
  endpoint?: string;
  /** Override version string. */
  serverVersion?: string;
  /** Override session id (test seam). */
  sessionId?: string;
  /** Injection seam — defaults to `globalThis.fetch`. */
  fetcher?: typeof fetch;
  /** Injection seam — defaults to `console.error`. */
  log?: (line: string) => void;
}

export class TelemetryDispatcher {
  private readonly enabled: boolean;
  private readonly endpoint: string;
  private readonly serverVersion: string;
  private readonly sessionId: string;
  private readonly fetcher: typeof fetch;
  private readonly log: (line: string) => void;

  constructor(options: TelemetryOptions = {}) {
    this.enabled =
      options.enabled ??
      (process.env.NYXIS_TELEMETRY === '1' || process.env.NYXIS_TELEMETRY === 'true');
    this.endpoint = options.endpoint ?? process.env.NYXIS_TELEMETRY_ENDPOINT ?? 'console';
    this.serverVersion = options.serverVersion ?? '0.0.0';
    this.sessionId = options.sessionId ?? randomUUID();
    this.fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);
    this.log = options.log ?? ((line: string) => console.error(line));
  }

  /**
   * Record an event. Returns synchronously; any network transport is
   * dispatched as fire-and-forget so the tool call returns immediately.
   */
  track(event: TelemetryEvent): void {
    if (!this.enabled) return;

    const envelope: TelemetryEnvelope = {
      event,
      session_id: this.sessionId,
      server_version: this.serverVersion,
      ts: new Date().toISOString(),
    };

    if (this.endpoint === 'console' || this.endpoint === '') {
      this.log(`[nyxis-mcp:telemetry] ${JSON.stringify(envelope)}`);
      return;
    }

    // Fire-and-forget POST. Errors are swallowed: telemetry must never
    // slow or break a tool invocation.
    try {
      void this.fetcher(this.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(envelope),
      }).catch(() => {
        // Silent failure — collector down, network gone, etc.
      });
    } catch {
      // Swallow synchronous throws (invalid URL, etc.).
    }
  }

  /** Visible state, useful for tests / diagnostics. */
  get isEnabled(): boolean {
    return this.enabled;
  }
}

// Default singleton, configured from env. Tools import this directly.
// Tests construct their own dispatcher.
export const telemetry = new TelemetryDispatcher({ serverVersion: '0.3.0' });

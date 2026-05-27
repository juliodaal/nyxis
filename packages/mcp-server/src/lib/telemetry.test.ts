import { describe, expect, it, vi } from 'vitest';

import { TelemetryDispatcher } from './telemetry.js';

describe('TelemetryDispatcher', () => {
  // ── Opt-out is the default ──────────────────────────────────────

  it('is disabled when neither env var nor option enables it', () => {
    const log = vi.fn();
    const fetcher = vi.fn();
    const d = new TelemetryDispatcher({ enabled: false, log, fetcher });

    d.track({ kind: 'get_component', slug: 'chat-thread', file_count: 1 });

    expect(d.isEnabled).toBe(false);
    expect(log).not.toHaveBeenCalled();
    expect(fetcher).not.toHaveBeenCalled();
  });

  // ── Opt-in: console transport (default endpoint) ────────────────

  it('writes a single JSON envelope to the log when endpoint is "console"', () => {
    const log = vi.fn();
    const d = new TelemetryDispatcher({
      enabled: true,
      endpoint: 'console',
      serverVersion: '0.3.0',
      sessionId: 'test-session',
      log,
    });

    d.track({ kind: 'list_components', category: null, type: null, result_count: 5 });

    expect(log).toHaveBeenCalledTimes(1);
    const line = log.mock.calls[0]![0] as string;
    expect(line.startsWith('[nyxis-mcp:telemetry] ')).toBe(true);
    const envelope = JSON.parse(line.slice('[nyxis-mcp:telemetry] '.length)) as {
      event: { kind: string };
      session_id: string;
      server_version: string;
      ts: string;
    };
    expect(envelope.event.kind).toBe('list_components');
    expect(envelope.session_id).toBe('test-session');
    expect(envelope.server_version).toBe('0.3.0');
    expect(typeof envelope.ts).toBe('string');
  });

  // ── Opt-in: HTTP transport ──────────────────────────────────────

  it('POSTs to the endpoint URL when set to an HTTP URL', () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const d = new TelemetryDispatcher({
      enabled: true,
      endpoint: 'https://collector.example.com/in',
      fetcher: fetcher as unknown as typeof fetch,
    });

    d.track({ kind: 'search_components', query_length: 6, result_count: 4 });

    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, init] = fetcher.mock.calls[0]!;
    expect(url).toBe('https://collector.example.com/in');
    expect((init as RequestInit).method).toBe('POST');
    expect((init as RequestInit).headers).toEqual({ 'content-type': 'application/json' });
    const body = JSON.parse((init as RequestInit).body as string) as {
      event: { kind: string; query_length: number };
    };
    expect(body.event.kind).toBe('search_components');
    expect(body.event.query_length).toBe(6);
  });

  it('swallows fetch failures so they never propagate to the tool call', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('network down'));
    const d = new TelemetryDispatcher({
      enabled: true,
      endpoint: 'https://collector.example.com/in',
      fetcher: fetcher as unknown as typeof fetch,
    });

    // Should not throw, even though the underlying fetch rejects.
    expect(() => {
      d.track({ kind: 'install_component', slug: 'chat-thread', success: true });
    }).not.toThrow();

    // Allow the swallowed promise to resolve.
    await new Promise((r) => setTimeout(r, 0));
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  // ── Privacy: search queries are NEVER sent verbatim ─────────────

  it('search_components events only carry query_length, never the query string', () => {
    const log = vi.fn();
    const d = new TelemetryDispatcher({ enabled: true, endpoint: 'console', log });

    d.track({ kind: 'search_components', query_length: 42, result_count: 3 });

    const line = log.mock.calls[0]![0] as string;
    // The literal query never appears — only its length.
    expect(line).not.toMatch(/query[\s_-]*string|query[\s_-]*text|"query"\s*:/i);
    expect(line).toMatch(/"query_length"\s*:\s*42/);
  });
});

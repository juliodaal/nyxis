import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AIProvider } from '../ai-provider.js';

import { useAI } from './use-ai.js';
import { useToolExecutor } from './use-tool-executor.js';

import type { AITool } from '../types.js';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AIProvider persistKey="">{children}</AIProvider>
);

const sampleTool: AITool = {
  name: 'echo',
  description: 'Echoes input back',
  inputSchema: { type: 'object', properties: { msg: { type: 'string' } } },
  execute: ({ msg }) => `echo:${msg}`,
};

describe('useToolExecutor', () => {
  it('registers a tool into the AI context', () => {
    const { result } = renderHook(
      () => {
        useToolExecutor(sampleTool);
        return useAI();
      },
      { wrapper },
    );
    expect(result.current.tools.some((t) => t.name === 'echo')).toBe(true);
  });

  it('unregisters the tool on unmount', () => {
    const { result, unmount } = renderHook(
      () => {
        useToolExecutor(sampleTool);
        return useAI();
      },
      { wrapper },
    );
    expect(result.current.tools.some((t) => t.name === 'echo')).toBe(true);
    unmount();
    // Re-mount a fresh provider — it should start with no tools.
    const { result: fresh } = renderHook(() => useAI(), { wrapper });
    expect(fresh.current.tools.some((t) => t.name === 'echo')).toBe(false);
  });

  it('exposes execute() callable via the registered tool reference', async () => {
    const { result } = renderHook(
      () => {
        useToolExecutor(sampleTool);
        return useAI();
      },
      { wrapper },
    );
    const registered = result.current.tools.find((t) => t.name === 'echo');
    expect(registered).toBeDefined();
    const out = await registered!.execute!({ msg: 'hi' }, { signal: new AbortController().signal });
    expect(out).toBe('echo:hi');
  });

  it('accepts an array of tools', () => {
    const { result } = renderHook(
      () => {
        useToolExecutor([
          sampleTool,
          { ...sampleTool, name: 'reverse', description: 'Reverse string' },
        ]);
        return useAI();
      },
      { wrapper },
    );
    expect(result.current.tools.map((t) => t.name).sort()).toEqual(
      expect.arrayContaining(['echo', 'reverse']),
    );
  });

  it('allows manual registerTool from context to add and remove a tool', () => {
    const { result } = renderHook(() => useAI(), { wrapper });
    let cleanup: (() => void) | undefined;
    act(() => {
      cleanup = result.current.registerTool({ ...sampleTool, name: 'manual' });
    });
    expect(result.current.tools.some((t) => t.name === 'manual')).toBe(true);
    act(() => cleanup!());
    expect(result.current.tools.some((t) => t.name === 'manual')).toBe(false);
  });
});

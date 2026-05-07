import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom doesn't implement Element.scrollIntoView — components that auto-scroll
// (ChatThread, TranscriptionView, etc.) call it on refs, so polyfill it.
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = vi.fn();
}

// jsdom doesn't implement HTMLCanvasElement.getContext — return a no-op
// 2D context so canvas-driven components (NeuralBackground) mount cleanly.
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    save: () => undefined,
    restore: () => undefined,
    scale: () => undefined,
    translate: () => undefined,
    rotate: () => undefined,
    clearRect: () => undefined,
    fillRect: () => undefined,
    strokeRect: () => undefined,
    beginPath: () => undefined,
    closePath: () => undefined,
    moveTo: () => undefined,
    lineTo: () => undefined,
    arc: () => undefined,
    fill: () => undefined,
    stroke: () => undefined,
    setLineDash: () => undefined,
    measureText: () => ({ width: 0 }),
    fillText: () => undefined,
    strokeText: () => undefined,
    drawImage: () => undefined,
    createLinearGradient: () => ({ addColorStop: () => undefined }),
    canvas: { width: 0, height: 0 },
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

// jsdom doesn't ship ResizeObserver — supply a no-op.
if (typeof globalThis !== 'undefined' && !('ResizeObserver' in globalThis)) {
  (globalThis as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

afterEach(() => {
  cleanup();
});

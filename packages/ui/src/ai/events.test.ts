import { describe, expect, it, vi } from 'vitest';
import { nyxisAIEvents } from './events.js';

describe('nyxisAIEvents', () => {
  it('delivers events to all subscribers', () => {
    const listenerA = vi.fn();
    const listenerB = vi.fn();
    const offA = nyxisAIEvents.subscribe(listenerA);
    const offB = nyxisAIEvents.subscribe(listenerB);

    nyxisAIEvents.emit({ type: 'done' });

    expect(listenerA).toHaveBeenCalledWith({ type: 'done' });
    expect(listenerB).toHaveBeenCalledWith({ type: 'done' });

    offA();
    offB();
  });

  it('stops delivering after unsubscribe', () => {
    const listener = vi.fn();
    const off = nyxisAIEvents.subscribe(listener);
    off();
    nyxisAIEvents.emit({ type: 'done' });
    expect(listener).not.toHaveBeenCalled();
  });

  it("doesn't let one listener break others", () => {
    const broken = vi.fn(() => {
      throw new Error('boom');
    });
    const ok = vi.fn();
    const offBroken = nyxisAIEvents.subscribe(broken);
    const offOk = nyxisAIEvents.subscribe(ok);

    // Silence the console.error from the bus.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    nyxisAIEvents.emit({ type: 'done' });
    expect(broken).toHaveBeenCalled();
    expect(ok).toHaveBeenCalled();
    spy.mockRestore();

    offBroken();
    offOk();
  });
});

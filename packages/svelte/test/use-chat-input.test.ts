import { describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';

import { useChatInput } from '../src/use-chat-input.js';

/**
 * End-to-end validation: the React-free chat-input controller drives
 * a Svelte readable store. The readable's lazy-subscribe semantics
 * mean we activate it via `get()` (single-shot) or `subscribe()`
 * (long-lived) — both wire to the controller correctly.
 */
describe('useChatInput (svelte)', () => {
  it('exposes initial state and derived values', () => {
    const { state, derived } = useChatInput();
    expect(get(state)).toEqual({ value: '', disabled: false });
    expect(get(derived)).toEqual({ trimmed: '', canSubmit: false });
  });

  it('reflects initialValue + disabled options', () => {
    const { state, derived } = useChatInput({ initialValue: 'hi', disabled: true });
    expect(get(state).value).toBe('hi');
    expect(get(state).disabled).toBe(true);
    expect(get(derived).canSubmit).toBe(false);
  });

  it('setValue propagates through the store to a long-lived subscriber', () => {
    const onValueChange = vi.fn();
    const { state, derived, setValue } = useChatInput({ onValueChange });

    const seen: string[] = [];
    const unsubscribe = state.subscribe((s) => seen.push(s.value));

    setValue('hello');

    expect(seen).toEqual(['', 'hello']); // initial + after setValue
    expect(get(derived).canSubmit).toBe(true);
    expect(onValueChange).toHaveBeenCalledWith('hello');
    unsubscribe();
  });

  it('submit fires onSubmit with trimmed value and clears', () => {
    const onSubmit = vi.fn();
    const { state, setValue, submit } = useChatInput({ onSubmit });

    setValue('  hello  ');
    submit();

    expect(onSubmit).toHaveBeenCalledWith('hello');
    expect(get(state).value).toBe('');
  });

  it('handleKeyDown: Enter submits, Shift+Enter does not', () => {
    const onSubmit = vi.fn();
    const { setValue, handleKeyDown } = useChatInput({ onSubmit });
    setValue('hi');

    const preventDefault = vi.fn();
    handleKeyDown({ key: 'Enter', shiftKey: true, preventDefault });
    expect(onSubmit).not.toHaveBeenCalled();

    handleKeyDown({ key: 'Enter', shiftKey: false, preventDefault });
    expect(onSubmit).toHaveBeenCalledWith('hi');
    expect(preventDefault).toHaveBeenCalled();
  });

  it('store auto-unsubscribes when no listeners remain', () => {
    const { state, setValue } = useChatInput();

    // Subscribe and immediately unsubscribe; store goes idle.
    const unsub = state.subscribe(() => {});
    unsub();

    // setValue still updates controller internal state...
    setValue('after-idle');
    // ...and the next `get()` re-activates the readable, which re-subscribes
    // and pulls the latest snapshot.
    expect(get(state).value).toBe('after-idle');
  });
});

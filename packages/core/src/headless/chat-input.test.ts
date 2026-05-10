import { describe, expect, it, vi } from 'vitest';

import { createChatInputController } from './chat-input.js';

describe('createChatInputController', () => {
  it('initialises with defaults', () => {
    const c = createChatInputController();
    expect(c.getState()).toEqual({ value: '', disabled: false });
    expect(c.getDerived()).toEqual({ trimmed: '', canSubmit: false });
  });

  it('honours initialValue and disabled options', () => {
    const c = createChatInputController({ initialValue: 'hello', disabled: true });
    expect(c.getState()).toEqual({ value: 'hello', disabled: true });
    expect(c.getDerived()).toEqual({ trimmed: 'hello', canSubmit: false });
  });

  it('setValue notifies subscribers and fires onValueChange', () => {
    const onValueChange = vi.fn();
    const c = createChatInputController({ onValueChange });
    const listener = vi.fn();
    c.subscribe(listener);

    c.setValue('hi');

    expect(c.getState().value).toBe('hi');
    expect(onValueChange).toHaveBeenCalledWith('hi');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('skips notify when value is unchanged', () => {
    const c = createChatInputController({ initialValue: 'a' });
    const listener = vi.fn();
    c.subscribe(listener);

    c.setValue('a');
    expect(listener).not.toHaveBeenCalled();
  });

  it('canSubmit reflects trimmed-non-empty AND not-disabled', () => {
    const c = createChatInputController();
    expect(c.getDerived().canSubmit).toBe(false);

    c.setValue('  ');
    expect(c.getDerived().canSubmit).toBe(false);

    c.setValue('hello');
    expect(c.getDerived().canSubmit).toBe(true);

    c.setDisabled(true);
    expect(c.getDerived().canSubmit).toBe(false);
  });

  it('submit fires onSubmit with trimmed value, then clears', () => {
    const onSubmit = vi.fn();
    const c = createChatInputController({ onSubmit, initialValue: '  hi  ' });

    c.submit();

    expect(onSubmit).toHaveBeenCalledWith('hi');
    expect(c.getState().value).toBe('');
  });

  it('submit is a no-op when disabled', () => {
    const onSubmit = vi.fn();
    const c = createChatInputController({ onSubmit, initialValue: 'hi', disabled: true });

    c.submit();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(c.getState().value).toBe('hi');
  });

  it('submit is a no-op for whitespace-only value', () => {
    const onSubmit = vi.fn();
    const c = createChatInputController({ onSubmit, initialValue: '   ' });

    c.submit();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('handleKeyDown: Enter submits, Shift+Enter does not', () => {
    const onSubmit = vi.fn();
    const c = createChatInputController({ onSubmit, initialValue: 'hi' });
    const preventDefault = vi.fn();

    c.handleKeyDown({ key: 'Enter', shiftKey: true, preventDefault });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();

    c.handleKeyDown({ key: 'Enter', shiftKey: false, preventDefault });
    expect(onSubmit).toHaveBeenCalledWith('hi');
    expect(preventDefault).toHaveBeenCalled();
  });

  it('subscribe returns an unsubscribe that stops further notifications', () => {
    const c = createChatInputController();
    const listener = vi.fn();
    const unsubscribe = c.subscribe(listener);

    c.setValue('a');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    c.setValue('b');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

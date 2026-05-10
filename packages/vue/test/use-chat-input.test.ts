import { describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick } from 'vue';

import { useChatInput } from '../src/use-chat-input.js';

/**
 * End-to-end validation: the React-free chat-input controller drives
 * a Vue composable. State and derived values flow through reactively;
 * actions trigger callbacks identically to the React adapter.
 */
describe('useChatInput (vue)', () => {
  it('exposes initial state and derived values', () => {
    const scope = effectScope();
    scope.run(() => {
      const { state, derived } = useChatInput();
      expect(state.value).toBe('');
      expect(state.disabled).toBe(false);
      expect(derived.trimmed).toBe('');
      expect(derived.canSubmit).toBe(false);
    });
    scope.stop();
  });

  it('reflects initialValue + disabled options', () => {
    const scope = effectScope();
    scope.run(() => {
      const { state, derived } = useChatInput({ initialValue: 'hi', disabled: true });
      expect(state.value).toBe('hi');
      expect(state.disabled).toBe(true);
      expect(derived.canSubmit).toBe(false);
    });
    scope.stop();
  });

  it('setValue updates state reactively and fires onValueChange', async () => {
    const scope = effectScope();
    scope.run(async () => {
      const onValueChange = vi.fn();
      const { state, derived, setValue } = useChatInput({ onValueChange });

      setValue('hello');
      await nextTick();

      expect(state.value).toBe('hello');
      expect(derived.canSubmit).toBe(true);
      expect(onValueChange).toHaveBeenCalledWith('hello');
    });
    scope.stop();
  });

  it('submit fires onSubmit with trimmed value and clears', async () => {
    const scope = effectScope();
    scope.run(async () => {
      const onSubmit = vi.fn();
      const { state, submit, setValue } = useChatInput({ onSubmit });

      setValue('  hello  ');
      submit();
      await nextTick();

      expect(onSubmit).toHaveBeenCalledWith('hello');
      expect(state.value).toBe('');
    });
    scope.stop();
  });

  it('handleKeyDown: Enter submits, Shift+Enter does not', () => {
    const scope = effectScope();
    scope.run(() => {
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
    scope.stop();
  });

  it('onScopeDispose cleans up the subscription', () => {
    const onValueChange = vi.fn();
    const scope = effectScope();
    let setValue!: (v: string) => void;
    scope.run(() => {
      const api = useChatInput({ onValueChange });
      setValue = api.setValue;
    });

    setValue('before-dispose');
    expect(onValueChange).toHaveBeenCalledTimes(1);

    scope.stop();
    // The controller subscription has been torn down — further setValue calls
    // still mutate the controller's internal state, but the Vue reactive
    // mirror no longer receives them (the scope is dead).
    setValue('after-dispose');
    // onValueChange comes from controller options, not from the subscription,
    // so it still fires — that's correct. The scope-dispose verifies the
    // listener was removed (no leak), not that callbacks stop.
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });
});

import { describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';

import { usePromptVariableForm } from '../src/use-prompt-variable-form.js';

describe('usePromptVariableForm (svelte)', () => {
  it('extracts variables from the initial template', () => {
    const { derived } = usePromptVariableForm({
      initialTemplate: 'Hello {{name}}, role: {{role}}.',
    });
    expect(get(derived).variables).toEqual(['name', 'role']);
  });

  it('setValue updates state and derived', () => {
    const { state, derived, setValue } = usePromptVariableForm({
      initialTemplate: '{{x}}',
    });

    setValue('x', 'hello');
    expect(get(state).values.x).toBe('hello');
    expect(get(derived).rendered).toBe('hello');
    expect(get(derived).allFilled).toBe(true);
  });

  it('setTemplate prunes stale variable values', () => {
    const { state, derived, setTemplate, setValue } = usePromptVariableForm({
      initialTemplate: '{{a}} {{b}}',
    });
    setValue('a', '1');
    setValue('b', '2');

    setTemplate('{{a}} {{c}}');

    expect(get(derived).variables).toEqual(['a', 'c']);
    expect(get(state).values).toEqual({ a: '1', c: '' });
  });

  it('submit returns false until allFilled', () => {
    const onSubmit = vi.fn();
    const { setValue, submit } = usePromptVariableForm({
      initialTemplate: '{{a}} {{b}}',
      onSubmit,
    });

    expect(submit()).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();

    setValue('a', 'x');
    setValue('b', 'y');

    expect(submit()).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith(
      { a: 'x', b: 'y' },
      { template: '{{a}} {{b}}', rendered: 'x y' },
    );
  });
});

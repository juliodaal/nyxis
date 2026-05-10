import { describe, expect, it, vi } from 'vitest';

import { createPromptVariableFormController } from './prompt-variable-form.js';

describe('createPromptVariableFormController', () => {
  it('extracts variables from the initial template', () => {
    const c = createPromptVariableFormController({
      initialTemplate: 'Hello {{name}}, you are {{role}}.',
    });
    expect(c.getDerived().variables).toEqual(['name', 'role']);
  });

  it('deduplicates repeated variables', () => {
    const c = createPromptVariableFormController({
      initialTemplate: '{{a}} and {{a}} and {{b}}',
    });
    expect(c.getDerived().variables).toEqual(['a', 'b']);
  });

  it('renders the template, leaving missing variables as placeholders', () => {
    const c = createPromptVariableFormController({
      initialTemplate: 'Hi {{name}}, {{greeting}}!',
      initialValues: { name: 'Julio' },
    });
    expect(c.getDerived().rendered).toBe('Hi Julio, {{greeting}}!');
  });

  it('setValue updates one variable and notifies subscribers', () => {
    const onValueChange = vi.fn();
    const c = createPromptVariableFormController({
      initialTemplate: '{{x}}',
      onValueChange,
    });
    const listener = vi.fn();
    c.subscribe(listener);

    c.setValue('x', 'hello');

    expect(c.getState().values.x).toBe('hello');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith({ x: 'hello' });
  });

  it('setValue skips notify when the value is unchanged', () => {
    const c = createPromptVariableFormController({
      initialTemplate: '{{x}}',
      initialValues: { x: 'same' },
    });
    const listener = vi.fn();
    c.subscribe(listener);

    c.setValue('x', 'same');
    expect(listener).not.toHaveBeenCalled();
  });

  it('setTemplate trims stale variable keys', () => {
    const c = createPromptVariableFormController({
      initialTemplate: '{{a}} {{b}}',
      initialValues: { a: '1', b: '2' },
    });

    c.setTemplate('{{a}} {{c}}');

    expect(c.getState().values).toEqual({ a: '1', c: '' });
  });

  it('filledCount reflects only non-empty trimmed values', () => {
    const c = createPromptVariableFormController({
      initialTemplate: '{{a}} {{b}} {{c}}',
      initialValues: { a: 'one', b: '  ', c: '' },
    });

    expect(c.getDerived().filledCount).toBe(1);
    expect(c.getDerived().allFilled).toBe(false);
  });

  it('allFilled becomes true once every variable has a value', () => {
    const c = createPromptVariableFormController({
      initialTemplate: '{{a}} {{b}}',
    });

    c.setValue('a', 'x');
    expect(c.getDerived().allFilled).toBe(false);

    c.setValue('b', 'y');
    expect(c.getDerived().allFilled).toBe(true);
  });

  it('submit fires onSubmit when all filled and returns true', () => {
    const onSubmit = vi.fn();
    const c = createPromptVariableFormController({
      initialTemplate: '{{name}}',
      initialValues: { name: 'Julio' },
      onSubmit,
    });

    const ok = c.submit();

    expect(ok).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith(
      { name: 'Julio' },
      { template: '{{name}}', rendered: 'Julio' },
    );
  });

  it('submit returns false and does not fire onSubmit when partially filled', () => {
    const onSubmit = vi.fn();
    const c = createPromptVariableFormController({
      initialTemplate: '{{a}} {{b}}',
      initialValues: { a: 'one' },
      onSubmit,
    });

    const ok = c.submit();
    expect(ok).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('handles an empty template — allFilled is false (no variables)', () => {
    const c = createPromptVariableFormController({ initialTemplate: 'plain text' });
    const d = c.getDerived();
    expect(d.variables).toEqual([]);
    expect(d.allFilled).toBe(false);
    expect(d.rendered).toBe('plain text');
  });
});

import { describe, expect, it, vi } from 'vitest';
import { effectScope } from 'vue';

import { usePromptVariableForm } from '../src/use-prompt-variable-form.js';

describe('usePromptVariableForm (vue)', () => {
  it('extracts variables from the initial template', () => {
    const scope = effectScope();
    scope.run(() => {
      const { derived } = usePromptVariableForm({
        initialTemplate: 'Hello {{name}}, role: {{role}}.',
      });
      expect(derived.variables).toEqual(['name', 'role']);
    });
    scope.stop();
  });

  it('setValue updates values map reactively', () => {
    const scope = effectScope();
    scope.run(() => {
      const { state, derived, setValue } = usePromptVariableForm({
        initialTemplate: '{{x}}',
      });

      setValue('x', 'hello');
      expect(state.values.x).toBe('hello');
      expect(derived.rendered).toBe('hello');
      expect(derived.allFilled).toBe(true);
    });
    scope.stop();
  });

  it('setTemplate prunes stale variable values', () => {
    const scope = effectScope();
    scope.run(() => {
      const { state, derived, setTemplate, setValue } = usePromptVariableForm({
        initialTemplate: '{{a}} {{b}}',
      });
      setValue('a', '1');
      setValue('b', '2');

      setTemplate('{{a}} {{c}}');

      expect(derived.variables).toEqual(['a', 'c']);
      expect(state.values).toEqual({ a: '1', c: '' });
    });
    scope.stop();
  });

  it('submit returns false until allFilled', () => {
    const scope = effectScope();
    scope.run(() => {
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
    scope.stop();
  });
});

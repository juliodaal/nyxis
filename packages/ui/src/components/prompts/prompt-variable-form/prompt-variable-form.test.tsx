import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { PromptVariableForm } from './prompt-variable-form.js';

describe('PromptVariableForm', () => {
  it('auto-extracts {{variables}} and renders one input per name', () => {
    render(<PromptVariableForm template="Hello {{name}}, you owe {{amount}}." />);

    expect(screen.getByPlaceholderText(/Enter name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter amount/i)).toBeInTheDocument();
  });

  it('shows the no-variables placeholder when the template has none', () => {
    render(<PromptVariableForm template="Plain template, no variables." />);

    expect(screen.getByText(/no variables/i)).toBeInTheDocument();
  });

  it('fires onValueChange when a field changes', () => {
    const onValueChange = vi.fn();
    render(<PromptVariableForm template="Hi {{name}}." onValueChange={onValueChange} />);

    fireEvent.change(screen.getByPlaceholderText(/Enter name/i), {
      target: { value: 'Ada' },
    });

    expect(onValueChange).toHaveBeenCalledWith({ name: 'Ada' });
  });

  it('renders a preview with bound values when preview=true', () => {
    render(<PromptVariableForm template="Hi {{name}}." defaultValue={{ name: 'Ada' }} preview />);

    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Hi Ada.')).toBeInTheDocument();
  });

  it('fires onSubmit with bound values + rendered template', () => {
    const onSubmit = vi.fn();
    render(
      <PromptVariableForm
        template="Hi {{name}}."
        defaultValue={{ name: 'Ada' }}
        submitLabel="Run"
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Run/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      { name: 'Ada' },
      expect.objectContaining({ rendered: 'Hi Ada.' }),
    );
  });
});

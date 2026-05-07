import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { ParameterForm, type ParameterField } from './parameter-form.js';

const FIELDS: readonly ParameterField[] = [
  { name: 'query', type: 'string', placeholder: 'search...', required: true },
  { name: 'limit', type: 'number', defaultValue: 10 },
  { name: 'safe', type: 'boolean' },
];

describe('ParameterForm', () => {
  it('renders one input per field with prettified labels', () => {
    render(<ParameterForm fields={FIELDS} />);

    expect(screen.getByText('Query')).toBeInTheDocument();
    expect(screen.getByText('Limit')).toBeInTheDocument();
    expect(screen.getByText('Safe')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('search...')).toBeInTheDocument();
    // boolean renders as a switch
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('fires onValueChange when a field changes', () => {
    const onValueChange = vi.fn();
    render(<ParameterForm fields={FIELDS} onValueChange={onValueChange} />);

    fireEvent.change(screen.getByPlaceholderText('search...'), {
      target: { value: 'cats' },
    });

    expect(onValueChange).toHaveBeenCalled();
    const last = onValueChange.mock.calls.at(-1)?.[0];
    expect(last).toMatchObject({ query: 'cats', limit: 10 });
  });

  it('renders a submit button only when submitLabel is provided', () => {
    const { rerender } = render(<ParameterForm fields={FIELDS} />);
    expect(screen.queryByRole('button', { name: /run/i })).not.toBeInTheDocument();

    rerender(<ParameterForm fields={FIELDS} submitLabel="Run tool" />);
    expect(screen.getByRole('button', { name: 'Run tool' })).toBeInTheDocument();
  });

  it('calls onSubmit with the current values', () => {
    const onSubmit = vi.fn();
    render(
      <ParameterForm
        fields={FIELDS}
        defaultValue={{ query: 'cats', limit: 10, safe: true }}
        submitLabel="Run"
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Run' }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith({
      query: 'cats',
      limit: 10,
      safe: true,
    });
  });

  it('propagates disabled to inputs and the submit button', () => {
    render(<ParameterForm fields={FIELDS} submitLabel="Go" disabled />);

    expect(screen.getByPlaceholderText('search...')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go' })).toBeDisabled();
    expect(screen.getByRole('switch')).toBeDisabled();
  });
});

import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { MCPPrompt } from '@nyxis/core';
import { MCPPromptLibrary } from './mcp-prompt-library.js';

const PROMPTS: readonly MCPPrompt[] = [
  {
    name: 'summarize',
    description: 'Produce a short summary of a document.',
    arguments: [
      { name: 'text', required: true, description: 'Source text' },
      { name: 'length', description: 'Target length' },
    ],
  },
  {
    name: 'translate',
    description: 'Translate text to a target language.',
    arguments: [{ name: 'target_lang', required: true }],
  },
  {
    name: 'explain',
    description: 'Explain a concept simply.',
  },
];

describe('MCPPromptLibrary', () => {
  it('renders all prompts with names and descriptions', () => {
    render(<MCPPromptLibrary prompts={PROMPTS} />);

    expect(screen.getByText('summarize')).toBeInTheDocument();
    expect(screen.getByText('translate')).toBeInTheDocument();
    expect(screen.getByText('explain')).toBeInTheDocument();
    expect(screen.getByText('Produce a short summary of a document.')).toBeInTheDocument();
  });

  it('fires onSelect with the prompt when its name button is clicked', () => {
    const onSelect = vi.fn();
    render(<MCPPromptLibrary prompts={PROMPTS} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /translate/ }));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(PROMPTS[1]);
  });

  it('expands the chevron to reveal arguments', () => {
    render(<MCPPromptLibrary prompts={PROMPTS} />);

    const expander = screen.getAllByRole('button', { name: /expand arguments/i })[0]!;
    expect(screen.queryByText('Source text', { exact: false })).not.toBeInTheDocument();

    fireEvent.click(expander);

    expect(screen.getByText('text')).toBeInTheDocument();
    expect(screen.getByText('length')).toBeInTheDocument();
  });

  it('disables the chevron for prompts with no arguments', () => {
    render(<MCPPromptLibrary prompts={PROMPTS} />);

    // The third prompt (`explain`) has 0 args — its expander button is disabled.
    const expanders = screen.getAllByRole('button', { name: /expand arguments/i });
    // Only summarize + translate render an enabled "expand" button (2 entries).
    const enabled = expanders.filter((b) => !(b as HTMLButtonElement).disabled);
    const disabled = expanders.filter((b) => (b as HTMLButtonElement).disabled);
    expect(enabled.length).toBe(2);
    expect(disabled.length).toBe(1);
  });

  it('filters prompts by name or description', () => {
    render(<MCPPromptLibrary prompts={PROMPTS} />);

    fireEvent.change(screen.getByPlaceholderText(/search prompts/i), {
      target: { value: 'translate' },
    });

    expect(screen.getByText('translate')).toBeInTheDocument();
    expect(screen.queryByText('summarize')).not.toBeInTheDocument();
    expect(screen.queryByText('explain')).not.toBeInTheDocument();
  });
});

import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { Prompt } from '../../../ai/types.js';
import { PromptCard } from './prompt-card.js';

const BASE: Prompt = {
  id: 'p1',
  name: 'Summarise article',
  description: 'Concisely summarise an article in 3 bullet points.',
  body: 'Summarise {{article}} in {{count}} bullets.',
  version: '1.2',
  modelId: 'claude-3-7-sonnet',
  tags: ['summarisation', 'utility'],
};

describe('PromptCard', () => {
  it('renders name, description, version chip, and variable count', () => {
    render(<PromptCard prompt={BASE} />);

    expect(screen.getByText('Summarise article')).toBeInTheDocument();
    expect(screen.getByText(/Concisely summarise/i)).toBeInTheDocument();
    expect(screen.getByText('v1.2')).toBeInTheDocument();
    // body has 2 {{vars}} → "2 vars"
    expect(screen.getByText(/2 vars/i)).toBeInTheDocument();
  });

  it('renders tags row when tags are provided', () => {
    render(<PromptCard prompt={BASE} />);

    expect(screen.getByText('summarisation')).toBeInTheDocument();
    expect(screen.getByText('utility')).toBeInTheDocument();
  });

  it('fires onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<PromptCard prompt={BASE} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /Summarise article/i }));

    expect(onSelect).toHaveBeenCalledWith('p1');
  });

  it('fires onSelect on Enter keypress', () => {
    const onSelect = vi.fn();
    render(<PromptCard prompt={BASE} onSelect={onSelect} />);

    fireEvent.keyDown(screen.getByRole('button', { name: /Summarise article/i }), {
      key: 'Enter',
    });

    expect(onSelect).toHaveBeenCalledWith('p1');
  });

  it('uses prompt.variables when supplied instead of regex extraction', () => {
    render(<PromptCard prompt={{ ...BASE, body: 'No vars here', variables: ['a', 'b', 'c'] }} />);

    expect(screen.getByText(/3 vars/i)).toBeInTheDocument();
  });
});

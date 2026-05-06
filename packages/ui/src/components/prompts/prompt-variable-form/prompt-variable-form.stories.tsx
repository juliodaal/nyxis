import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PromptVariableForm } from './prompt-variable-form.js';

const meta = {
  title: 'AI · Prompts/PromptVariableForm',
  component: PromptVariableForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof PromptVariableForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const TEMPLATE = `Summarise the following pull request in {{tone}} bullets:

Repo: {{repo}}
Number: {{number}}
Diff:
{{diff}}`;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState<Record<string, string>>({
      tone: '3',
      repo: 'juliodaal/nyxis',
      number: '42',
      diff: '',
    });
    return (
      <div className="border-border bg-card w-[460px] rounded-lg border p-4">
        <PromptVariableForm
          template={TEMPLATE}
          value={v}
          onValueChange={setV}
          submitLabel="Run"
          preview
          onSubmit={(_, { rendered }) => alert(rendered)}
        />
      </div>
    );
  },
};

export const NoVariables: Story = {
  render: () => (
    <div className="border-border bg-card w-[460px] rounded-lg border p-4">
      <PromptVariableForm template="Return all open incidents." />
    </div>
  ),
};

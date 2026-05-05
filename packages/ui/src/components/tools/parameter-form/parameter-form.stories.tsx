import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ParameterForm, type ParameterField } from './parameter-form.js';

const meta = {
  title: 'AI · Tools/ParameterForm',
  component: ParameterForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ParameterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const FIELDS: ParameterField[] = [
  {
    name: 'query',
    type: 'string',
    description: 'Free-text search.',
    placeholder: 'streaming chat protocol',
    required: true,
  },
  {
    name: 'limit',
    type: 'number',
    description: 'Max number of hits to return.',
    defaultValue: 5,
  },
  {
    name: 'language',
    type: 'enum',
    options: ['en', 'es', 'de', 'fr'],
    defaultValue: 'en',
  },
  {
    name: 'tags',
    type: 'string[]',
    description: 'Filter by tag.',
    placeholder: 'add a tag',
  },
  {
    name: 'fuzzy',
    type: 'boolean',
    description: 'Allow approximate matches.',
    defaultValue: true,
  },
  {
    name: 'metadata',
    type: 'json',
    description: 'Extra parameters passed verbatim to the tool.',
  },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Record<string, unknown>>({});
    return (
      <div className="border-border bg-card w-[420px] rounded-lg border p-5">
        <ParameterForm
          fields={FIELDS}
          value={value}
          onValueChange={setValue}
          submitLabel="Run tool"
          onSubmit={(v) => alert(JSON.stringify(v, null, 2))}
        />
      </div>
    );
  },
};

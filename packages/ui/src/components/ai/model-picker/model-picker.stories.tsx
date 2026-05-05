import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ModelPicker } from './model-picker.js';

const meta = {
  title: 'AI · Models & Providers/ModelPicker',
  component: ModelPicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ModelPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => {
    const [v, setV] = useState('claude-sonnet-4-5');
    return (
      <div className="w-[420px]">
        <ModelPicker value={v} onValueChange={(id) => setV(id)} />
      </div>
    );
  },
};

export const VisionOnly: Story = {
  render: () => {
    const [v, setV] = useState('claude-sonnet-4-5');
    return (
      <div className="w-[420px]">
        <ModelPicker value={v} onValueChange={(id) => setV(id)} requireCapabilities={['vision']} />
      </div>
    );
  },
};

export const SingleProvider: Story = {
  render: () => {
    const [v, setV] = useState('gpt-4o');
    return (
      <div className="w-[420px]">
        <ModelPicker value={v} onValueChange={(id) => setV(id)} provider="openai" />
      </div>
    );
  },
};

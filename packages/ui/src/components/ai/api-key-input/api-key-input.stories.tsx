import type { Meta, StoryObj } from '@storybook/react';
import { APIKeyInput } from './api-key-input.js';

const meta = {
  title: 'AI · Models & Providers/APIKeyInput',
  component: APIKeyInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof APIKeyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Anthropic: Story = {
  render: () => (
    <div className="w-[360px]">
      <APIKeyInput provider="anthropic" />
    </div>
  ),
};

export const Validating: Story = {
  render: () => (
    <div className="w-[360px]">
      <APIKeyInput provider="openai" defaultValue="sk-test-key" status="validating" />
    </div>
  ),
};

export const Valid: Story = {
  render: () => (
    <div className="w-[360px]">
      <APIKeyInput provider="openai" defaultValue="sk-real-key" status="valid" />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="w-[360px]">
      <APIKeyInput provider="anthropic" defaultValue="bad-key" status="invalid" />
    </div>
  ),
};

export const RateLimited: Story = {
  render: () => (
    <div className="w-[360px]">
      <APIKeyInput provider="openai" defaultValue="sk-..." status="rate-limited" />
    </div>
  ),
};

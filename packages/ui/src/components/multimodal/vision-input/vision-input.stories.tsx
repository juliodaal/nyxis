import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { VisionInput } from './vision-input.js';

const meta = {
  title: 'AI · Multimodal/VisionInput',
  component: VisionInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof VisionInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [file, setFile] = useState<File | null>(null);
    return (
      <div className="w-[420px]">
        <VisionInput value={file} onChange={setFile} />
        {file && (
          <p className="text-muted-foreground mt-2 text-[11px]">Ready to send: {file.name}</p>
        )}
      </div>
    );
  },
};

export const NoCamera: Story = {
  render: () => (
    <div className="w-[420px]">
      <VisionInput acceptCamera={false} />
    </div>
  ),
};

export const SizeLimited: Story = {
  render: () => (
    <div className="w-[420px]">
      <VisionInput maxBytes={2 * 1024 * 1024} placeholder="Image (max 2MB)" />
    </div>
  ),
};

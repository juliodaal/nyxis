import type { Meta, StoryObj } from '@storybook/react';
import { FileDropzone } from './file-dropzone.js';

const meta = {
  title: 'Domain Patterns/FileDropzone',
  component: FileDropzone,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof FileDropzone>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[480px]">
      <FileDropzone />
    </div>
  ),
};

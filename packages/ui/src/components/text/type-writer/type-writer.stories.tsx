import type { Meta, StoryObj } from '@storybook/react';
import { TypeWriter } from './type-writer.js';

const meta = {
  title: 'Text Animations/TypeWriter',
  component: TypeWriter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TypeWriter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    text: 'The fiscal year ends on March 31.',
    as: 'span',
    className: 'text-base text-foreground',
  },
};

export const Cycling: Story = {
  args: {
    text: [
      'document intelligence',
      'meeting summaries',
      'lead qualification',
      'support deflection',
    ],
    as: 'span',
    className: 'text-3xl font-bold text-primary',
  },
};

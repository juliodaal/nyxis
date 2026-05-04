import type { Meta, StoryObj } from '@storybook/react';
import { SplitText } from './split-text.js';

const meta = {
  title: 'Text Animations/SplitText',
  component: SplitText,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SplitText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Chars: Story = {
  args: {
    as: 'h1',
    splitBy: 'chars',
    children: 'Document intelligence, automated.',
    className: 'text-4xl font-bold text-foreground',
  },
};

export const Words: Story = {
  args: {
    as: 'h1',
    splitBy: 'words',
    children: 'Document intelligence, automated.',
    className: 'text-4xl font-bold text-foreground',
  },
};

export const Lines: Story = {
  args: {
    as: 'p',
    splitBy: 'lines',
    children:
      'Built for AI-powered SaaS products. Every animation respects prefers-reduced-motion. Every component is themeable, accessible, and tree-shakeable.',
    className: 'max-w-md text-base text-muted-foreground',
  },
};

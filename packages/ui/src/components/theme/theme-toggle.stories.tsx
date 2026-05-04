import type { Meta, StoryObj } from '@storybook/react';

import { ThemeToggle } from './theme-toggle.js';

const meta = {
  title: 'Theme/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Drop-in theme switcher exposing all five Nyxis themes (light, dark, dim, high contrast, system). Uses the `useTheme` hook under the hood and works with or without a `ThemeProvider`. Theme changes use the View Transitions API where supported and respect `prefers-reduced-motion`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'compact'],
    },
    hideLabel: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
  },
};

export const HiddenLabel: Story = {
  args: {
    variant: 'default',
    hideLabel: true,
  },
};

export const InContext: Story = {
  render: (args) => (
    <div className="border-border bg-card flex w-[320px] items-center justify-between gap-3 rounded-lg border p-4">
      <div className="flex flex-col">
        <span className="text-foreground text-sm font-medium">Appearance</span>
        <span className="text-muted-foreground text-xs">Choose how Nyxis looks.</span>
      </div>
      <ThemeToggle {...args} />
    </div>
  ),
};

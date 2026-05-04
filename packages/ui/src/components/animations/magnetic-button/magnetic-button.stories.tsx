import type { Meta, StoryObj } from '@storybook/react';
import { MagneticButton } from './magnetic-button.js';

const meta = {
  title: 'Animations/MagneticButton',
  component: MagneticButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MagneticButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Get started', strength: 0.45, distance: 140 },
};

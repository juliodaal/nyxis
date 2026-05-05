import type { Meta, StoryObj } from '@storybook/react';
import { MarqueeText } from './marquee-text.js';

const meta = {
  title: 'Text Animations/MarqueeText',
  component: MarqueeText,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof MarqueeText>;
export default meta;
type Story = StoryObj<typeof meta>;

const logos = [
  'Document AI',
  'AI Assistant',
  'Lead Intelligence',
  'Support Copilot',
  'Meeting Intelligence',
  'Operations Dashboard',
  'Email Triage',
];

export const Default: Story = {
  render: () => (
    <div className="py-8">
      <MarqueeText speed={28}>
        {logos.map((l) => (
          <span key={l} className="text-muted-foreground text-2xl font-medium">
            {l}
          </span>
        ))}
      </MarqueeText>
    </div>
  ),
};

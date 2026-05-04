import type { Meta, StoryObj } from '@storybook/react';
import { StaggerReveal } from './stagger-reveal.js';

const meta = {
  title: 'Animations/StaggerReveal',
  component: StaggerReveal,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof StaggerReveal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StaggerReveal trigger="mount" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {['DocuMind', 'AskCompany', 'LeadSift', 'SupportDeflect', 'MeetingMind', 'PulseReport'].map(
        (name) => (
          <div
            key={name}
            className="border-border bg-card text-foreground shadow-soft rounded-lg border p-6"
          >
            {name}
          </div>
        ),
      )}
    </StaggerReveal>
  ),
};

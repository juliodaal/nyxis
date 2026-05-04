import type { Meta, StoryObj } from '@storybook/react';
import { EmailTriageCard } from './email-triage-card.js';

const meta = {
  title: 'Domain Patterns/EmailTriageCard',
  component: EmailTriageCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof EmailTriageCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    from: 'lukas.muller@acme.de',
    subject: 'Pricing for the enterprise plan',
    category: 'sales',
    preview:
      "Hi — we're evaluating Nyxis for our internal tooling. Could you share enterprise pricing and SAML support details?",
    draft:
      'Hi Lukas, thanks for reaching out. Enterprise pricing starts at €2k/month and includes SSO via SAML, custom retention, and a dedicated SLA. I can hop on a call this week to walk you through it — does Thursday at 4pm CET work?',
  },
};

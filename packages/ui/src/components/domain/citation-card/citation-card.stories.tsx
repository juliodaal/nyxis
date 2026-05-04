import type { Meta, StoryObj } from '@storybook/react';
import { CitationCard } from './citation-card.js';

const meta = {
  title: 'Domain Patterns/CitationCard',
  component: CitationCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CitationCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rank: 1,
    source: 'Employee handbook',
    locator: '§4.2',
    href: 'https://example.com',
    snippet:
      'The fiscal year ends on March 31. All quarterly reports must be submitted no later than ten business days after each quarter close.',
  },
};

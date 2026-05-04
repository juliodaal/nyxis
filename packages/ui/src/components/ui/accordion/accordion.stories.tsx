import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.js';

const meta = {
  title: 'Components/Accordion',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[420px]">
      <AccordionItem value="a">
        <AccordionTrigger>What is Nyxis?</AccordionTrigger>
        <AccordionContent>A React component library for AI products.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Is it free?</AccordionTrigger>
        <AccordionContent>Yes — MIT licensed.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

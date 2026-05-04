import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card.js';
import { Button } from '../button/button.js';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Confidence: 92%</CardTitle>
        <CardDescription>Extracted invoice total · €4,830.00 · Reviewed by Maria.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        All required fields were located on page 1 and validated against the purchase order.
      </CardContent>
      <CardFooter>
        <Button size="sm">Approve</Button>
        <Button size="sm" variant="outline">
          Review
        </Button>
      </CardFooter>
    </Card>
  ),
};

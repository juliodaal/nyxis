import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.js';

const meta = {
  title: 'Components/Tabs',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="preview" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="props">Props</TabsTrigger>
      </TabsList>
      <TabsContent
        value="preview"
        className="border-border text-muted-foreground rounded-md border p-4 text-sm"
      >
        Live preview of the component.
      </TabsContent>
      <TabsContent value="code" className="border-border rounded-md border p-4 text-sm">
        <pre className="font-mono text-xs">{`<Button>Hello</Button>`}</pre>
      </TabsContent>
      <TabsContent
        value="props"
        className="border-border text-muted-foreground rounded-md border p-4 text-sm"
      >
        Auto-generated props table.
      </TabsContent>
    </Tabs>
  ),
};

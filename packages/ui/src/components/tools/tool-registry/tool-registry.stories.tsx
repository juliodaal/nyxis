import type { Meta, StoryObj } from '@storybook/react';
import { Code2, Globe, Image as ImageIcon, Search, Wrench } from 'lucide-react';

import { ToolRegistry, type RegisteredTool } from './tool-registry.js';

const meta = {
  title: 'AI · Tools/ToolRegistry',
  component: ToolRegistry,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ToolRegistry>;

export default meta;
type Story = StoryObj<typeof meta>;

const TOOLS: RegisteredTool[] = [
  {
    id: 'search',
    name: 'search_documents',
    description: 'Vector search over the indexed document corpus.',
    icon: <Search className="size-3.5" />,
    group: 'Retrieval',
  },
  {
    id: 'fetch',
    name: 'fetch_url',
    description: 'Fetch a URL and return cleaned readable text.',
    icon: <Globe className="size-3.5" />,
    group: 'Retrieval',
  },
  {
    id: 'execute',
    name: 'execute_code',
    description: 'Run JavaScript in a sandboxed environment.',
    icon: <Code2 className="size-3.5" />,
    group: 'Compute',
  },
  {
    id: 'image',
    name: 'generate_image',
    description: 'Produce an image from a text prompt.',
    icon: <ImageIcon className="size-3.5" />,
    group: 'Compute',
    enabled: false,
  },
  {
    id: 'custom',
    name: 'custom_workflow',
    description: 'Trigger an arbitrary internal workflow by id.',
    icon: <Wrench className="size-3.5" />,
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-[440px]">
      <ToolRegistry tools={TOOLS} onChange={(ids) => console.log('active:', ids)} />
    </div>
  ),
};

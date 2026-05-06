import type { Meta, StoryObj } from '@storybook/react';
import { MCPPromptLibrary } from './mcp-prompt-library.js';
import type { MCPPrompt } from '../../../ai/types.js';

const meta = {
  title: 'AI · MCP/MCPPromptLibrary',
  component: MCPPromptLibrary,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MCPPromptLibrary>;

export default meta;
type Story = StoryObj<typeof meta>;

const PROMPTS: MCPPrompt[] = [
  {
    name: 'summarise_pr',
    description: 'Summarise a pull request given its diff and recent activity.',
    arguments: [
      { name: 'repo', description: 'owner/name', required: true },
      { name: 'number', description: 'PR number', required: true },
      { name: 'tone', description: 'concise | detailed | bullet' },
    ],
  },
  {
    name: 'extract_entities',
    description: 'Pull named entities from a passage of text.',
    arguments: [
      { name: 'text', required: true },
      { name: 'types', description: 'Comma-separated list (PERSON, ORG, LOC...)' },
    ],
  },
  {
    name: 'list_open_incidents',
    description: 'No-arg prompt that returns the current incident list.',
  },
  {
    name: 'translate',
    description: 'Translate a passage between languages.',
    arguments: [
      { name: 'text', required: true },
      { name: 'target', required: true, description: 'BCP-47 language tag' },
      { name: 'register', description: 'formal | casual' },
    ],
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-[440px]">
      <MCPPromptLibrary prompts={PROMPTS} onSelect={(p) => alert(`pick ${p.name}`)} />
    </div>
  ),
};

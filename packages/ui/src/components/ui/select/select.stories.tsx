import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select.js';

const meta = {
  title: 'Components/Select',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Select a destination" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>ERP</SelectLabel>
          <SelectItem value="datev">DATEV</SelectItem>
          <SelectItem value="netsuite">NetSuite</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Spreadsheets</SelectLabel>
          <SelectItem value="airtable">Airtable</SelectItem>
          <SelectItem value="sheets">Google Sheets</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

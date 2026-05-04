import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from './combobox.js';

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Pick an ERP',
    options: [
      { value: 'datev', label: 'DATEV' },
      { value: 'netsuite', label: 'NetSuite' },
      { value: 'sap', label: 'SAP S/4HANA' },
      { value: 'xero', label: 'Xero' },
      { value: 'quickbooks', label: 'QuickBooks Online' },
    ],
  },
};

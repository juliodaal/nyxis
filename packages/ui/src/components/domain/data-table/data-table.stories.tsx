import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './data-table.js';
import { ConfidenceBadge } from '../confidence-badge/confidence-badge.js';

interface Row {
  id: string;
  vendor: string;
  total: string;
  confidence: number;
  status: 'pending' | 'approved' | 'rejected';
}

const data: Row[] = [
  {
    id: 'INV-04812',
    vendor: 'Acme GmbH',
    total: '€4,830.00',
    confidence: 0.97,
    status: 'approved',
  },
  { id: 'INV-04811', vendor: 'Globex AG', total: '€1,210.00', confidence: 0.74, status: 'pending' },
  { id: 'INV-04810', vendor: 'Initech KG', total: '€612.50', confidence: 0.41, status: 'rejected' },
  {
    id: 'INV-04809',
    vendor: 'Umbrella SE',
    total: '€9,210.00',
    confidence: 0.91,
    status: 'approved',
  },
  { id: 'INV-04808', vendor: 'Pied Piper', total: '€312.00', confidence: 0.69, status: 'pending' },
];

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'vendor', header: 'Vendor' },
  { accessorKey: 'total', header: 'Total' },
  {
    accessorKey: 'confidence',
    header: 'Confidence',
    cell: ({ getValue }) => <ConfidenceBadge score={getValue<number>()} />,
  },
  { accessorKey: 'status', header: 'Status' },
];

const meta = {
  title: 'Domain Patterns/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[720px]">
      <DataTable<Row> columns={columns} data={data} pageSize={5} />
    </div>
  ),
};

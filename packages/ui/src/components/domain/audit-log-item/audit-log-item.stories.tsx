import type { Meta, StoryObj } from '@storybook/react';
import { AuditLogItem } from './audit-log-item.js';

const meta = {
  title: 'Domain Patterns/AuditLogItem',
  component: AuditLogItem,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AuditLogItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Timeline: Story = {
  render: () => (
    <div className="flex w-[520px] flex-col gap-6">
      <AuditLogItem
        timestamp="2026-05-03 14:21"
        actor="Maria Schmidt"
        action="approved extraction for"
        target="INV-04812"
      />
      <AuditLogItem
        timestamp="2026-05-03 14:18"
        actor="DocuMind"
        action="edited fields on"
        target="INV-04812"
        diff={[
          { field: 'total_eur', before: 4720, after: 4830 },
          { field: 'vat_rate', before: 0.18, after: 0.19 },
        ]}
      />
      <AuditLogItem
        timestamp="2026-05-03 14:02"
        actor="DocuMind"
        action="extracted"
        target="INV-04812"
      />
    </div>
  ),
};

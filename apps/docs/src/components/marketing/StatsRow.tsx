'use client';

import { CountUp } from 'nyxis-ui';

const stats: { label: string; value: number; format?: 'number' | 'percent' | 'compact' }[] = [
  { label: 'Components', value: 65 },
  { label: 'AI providers', value: 5 },
  { label: 'Themes', value: 5 },
  { label: 'Test coverage', value: 0.92, format: 'percent' },
];

export default function StatsRow() {
  return (
    <section className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 py-12 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="border-border bg-card flex flex-col gap-1 rounded-lg border p-5 text-left"
        >
          <CountUp
            to={s.value}
            format={s.format ?? 'number'}
            decimals={s.format === 'percent' ? 0 : 0}
            duration={1.6}
            className="text-foreground text-3xl font-bold"
          />
          <span className="text-muted-foreground text-xs uppercase tracking-wider">{s.label}</span>
        </div>
      ))}
    </section>
  );
}

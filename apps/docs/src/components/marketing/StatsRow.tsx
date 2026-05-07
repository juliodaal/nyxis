/**
 * Stats row. Pure SSR — no hydration needed. Static numbers so the page
 * renders complete on first paint regardless of Astro island timing.
 */

interface Stat {
  label: string;
  value: string;
  hint: string;
}

const stats: Stat[] = [
  { label: 'AI components', value: '80+', hint: 'chat, agents, RAG, MCP, tools' },
  { label: 'Providers', value: '5+', hint: 'extensible — add your own' },
  { label: 'Themes', value: '5', hint: 'light, dark, dim, hi-contrast, system' },
  { label: 'License', value: 'MIT', hint: 'free for commercial use' },
];

export default function StatsRow() {
  return (
    <section className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-6 py-12 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="border-border bg-card flex flex-col gap-1 rounded-lg border p-5 text-left"
        >
          <span className="text-foreground text-2xl font-semibold tracking-tight">{s.value}</span>
          <span className="text-foreground text-xs font-medium uppercase tracking-wider">
            {s.label}
          </span>
          <span className="text-muted-foreground text-xs">{s.hint}</span>
        </div>
      ))}
    </section>
  );
}

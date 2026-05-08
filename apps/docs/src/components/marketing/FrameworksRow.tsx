/**
 * Compatibility row. Surfaces every framework Nyxis works with —
 * frontend host (React + Astro/Next/SvelteKit/Vite islands) plus
 * backend recipes (Hono / Express).
 *
 * Pure SSR, no logos: type-only treatment keeps the row from feeling
 * busy and dodges the SVG-licensing rabbit hole.
 */

const FRAMEWORKS = ['Next.js', 'Astro', 'SvelteKit', 'Hono', 'Express', 'Vite'] as const;

export default function FrameworksRow() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-12">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
          Works with your stack
        </span>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {FRAMEWORKS.map((name) => (
            <li
              key={name}
              className="text-foreground/70 hover:text-foreground text-sm font-medium tracking-tight transition-colors"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

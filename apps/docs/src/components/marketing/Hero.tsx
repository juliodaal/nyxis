import { ArrowRight, Github } from 'lucide-react';
// eslint-disable-next-line import/no-relative-packages
import nyxisPkg from '../../../../../packages/ui/package.json';
import { DotWave } from './DotWave';

const version = nyxisPkg.version;

/**
 * Marketing hero. Vercel-serious tone, shadcn/linear-aesthetic.
 *
 * Layered structure:
 * - DotWave canvas background, masked top/bottom into the page background.
 * - Static markup on top so the page is fully usable without JS hydration.
 *
 * The brand color is reserved for the focus ring on the install command and
 * the chevron in the primary CTA — never a primary surface.
 */
export default function Hero() {
  return (
    <section className="border-border/40 relative overflow-hidden border-b">
      <DotWave className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-background) 0%, transparent 28%, transparent 72%, var(--color-background) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-7 px-6 py-24 text-center sm:py-36">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="border-border bg-card/80 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur">
            <span className="bg-brand inline-block size-1.5 rounded-full" aria-hidden="true" />v
            {version}
          </span>
          <span className="border-border bg-card/80 text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium backdrop-blur">
            MIT licensed
          </span>
          <a
            href="https://github.com/juliodaal/nyxis"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-card/80 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur transition-colors"
          >
            <Github className="size-3" aria-hidden="true" />
            Star on GitHub
          </a>
        </div>

        <h1 className="text-foreground max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          The component toolkit for AI products.
        </h1>

        <p className="text-muted-foreground max-w-2xl text-pretty text-base sm:text-lg">
          105+ copy-paste components for chat, agents, RAG, MCP, tools and multimodal. Backend
          recipes for Next.js, Astro, SvelteKit, Hono and Express. Built on shadcn/ui.
          Provider-agnostic. Source you own and edit.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/docs/installation"
            className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center gap-1.5 rounded-md px-5 text-sm font-medium shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Get started
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="https://github.com/juliodaal/nyxis"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-background/80 text-foreground hover:bg-muted focus-visible:ring-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border px-5 text-sm font-medium backdrop-blur transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Github className="size-4" aria-hidden="true" />
            View on GitHub
          </a>
        </div>

        <div className="border-border bg-card/80 text-muted-foreground mt-2 inline-flex items-center gap-3 rounded-md border px-4 py-2 font-mono text-xs backdrop-blur sm:text-sm">
          <span className="text-brand select-none" aria-hidden="true">
            $
          </span>
          <span className="text-foreground">
            npx shadcn@latest add https://nyxisai.vercel.app/r/chat-message.json
          </span>
        </div>
      </div>
    </section>
  );
}

import { Github } from 'lucide-react';
// eslint-disable-next-line import/no-relative-packages
import nyxisPkg from '../../../../../packages/ui/package.json';

const version = nyxisPkg.version;

/**
 * Marketing hero. Deliberately minimal — shadcn-style. Static markup so the
 * page is fully usable without JS hydration. Visual identity (colors,
 * typography, brand polish) is reserved for the final pass.
 */
export default function Hero() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-24 text-center sm:py-32">
        <span className="border-border bg-card text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium">
          v{version} · MIT licensed · Built for AI products
        </span>

        <h1 className="text-foreground max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
          The component toolkit for AI products.
        </h1>

        <p className="text-muted-foreground max-w-2xl text-pretty text-base sm:text-lg">
          Copy-paste components for chat, agents, RAG, MCP, tools and multimodal — built on top of
          shadcn/ui. Frontend and backend recipes you own and edit. Provider-agnostic.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/docs/installation"
            className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Get started
          </a>
          <a
            href="https://github.com/juliodaal/nyxis"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-background text-foreground hover:bg-muted focus-visible:ring-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Github className="size-4" aria-hidden="true" />
            GitHub
          </a>
        </div>

        <code className="border-border bg-muted/50 text-muted-foreground rounded-md border px-3 py-1.5 font-mono text-xs">
          npx shadcn add @nyxis/chat
        </code>
      </div>
    </section>
  );
}

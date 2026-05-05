'use client';

import { Github } from 'lucide-react';
import { AuroraBackground, RotatingText, SplitText } from 'nyxis-ui';
// eslint-disable-next-line import/no-relative-packages
import nyxisPkg from '../../../../../packages/ui/package.json';

const version = nyxisPkg.version;

export default function Hero() {
  return (
    <AuroraBackground className="relative">
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-28 text-center sm:py-36">
        <span className="border-border bg-card/60 text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium backdrop-blur">
          v{version} · MIT licensed · Tailwind CSS v4
        </span>

        <SplitText
          as="h1"
          splitBy="words"
          stagger={0.04}
          duration={0.7}
          className="text-foreground text-balance text-5xl font-bold tracking-tight sm:text-7xl"
        >
          A modern component library for AI products.
        </SplitText>

        <p className="text-muted-foreground max-w-2xl text-pretty text-lg sm:text-xl">
          Built for{' '}
          <RotatingText
            words={[
              'chat assistants',
              'AI agents',
              'RAG pipelines',
              'MCP integrations',
              'multimodal apps',
              'voice interfaces',
            ]}
            interval={2200}
            className="text-primary font-semibold"
          />
          . Five themes, GSAP animations, accessible Radix primitives, server-component friendly.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/docs/installation"
            className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex h-12 items-center justify-center rounded-md px-6 text-base font-medium transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Get started
          </a>
          <a
            href="https://github.com/juliodaal/nyxis"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-background text-foreground hover:bg-muted focus-visible:ring-ring inline-flex h-12 items-center justify-center gap-2 rounded-md border px-6 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Github className="size-4" aria-hidden="true" />
            View on GitHub
          </a>
        </div>

        <code className="border-border bg-card/60 text-muted-foreground rounded-md border px-3 py-1.5 font-mono text-xs backdrop-blur">
          pnpm add nyxis-ui
        </code>
      </section>
    </AuroraBackground>
  );
}

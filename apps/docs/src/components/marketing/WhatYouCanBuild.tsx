/**
 * "What you can build" grid. Four cards covering the major AI product
 * surfaces Nyxis ships components for. Each card links to the
 * representative component so a curious visitor can land directly on
 * a live demo.
 *
 * Static SSR — pure presentation, no client JS.
 */

import { Bot, Database, MessageSquare, Plug } from 'lucide-react';

interface BuildCard {
  icon: typeof MessageSquare;
  title: string;
  description: string;
  components: readonly string[];
  href: string;
}

const CARDS: readonly BuildCard[] = [
  {
    icon: MessageSquare,
    title: 'Chat experiences',
    description:
      'Stream tokens, render rich content, handle attachments. From customer support widgets to ChatGPT-style apps.',
    components: ['chat-thread', 'chat-message', 'chat-input', 'tool-call'],
    href: '/components/chat-thread',
  },
  {
    icon: Bot,
    title: 'Agent dashboards',
    description:
      'Show what your agents are doing, mid-task. Activity feeds, handoffs, cost meters, tool execution logs.',
    components: ['agent-roster', 'agent-card', 'tool-execution-log', 'task-delegation'],
    href: '/components/agent-roster',
  },
  {
    icon: Database,
    title: 'RAG products',
    description:
      'Ingestion pipelines, retrieval visualisers, embedding scatter plots, citation cards. The full retrieval surface.',
    components: ['rag-pipeline', 'retrieval-results', 'chunk-card', 'embedding-scatter'],
    href: '/components/rag-pipeline',
  },
  {
    icon: Plug,
    title: 'MCP integrations',
    description:
      'Browse, connect, and observe Model Context Protocol servers. Resources, prompts, capability badges.',
    components: [
      'mcp-server-card',
      'mcp-log-stream',
      'mcp-resource-browser',
      'mcp-capability-badge',
    ],
    href: '/components/mcp-server-card',
  },
];

export default function WhatYouCanBuild() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-28">
        <header className="flex flex-col items-center gap-3 text-center">
          <span className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
            What you can build
          </span>
          <h2 className="text-foreground max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Every surface of an AI product, with the same registry.
          </h2>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CARDS.map(({ icon: Icon, title, description, components, href }) => (
            <a
              key={title}
              href={href}
              className="border-border bg-card/60 hover:border-border hover:bg-card group relative flex flex-col gap-3 rounded-xl border p-6 backdrop-blur transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="border-border bg-background flex size-9 items-center justify-center rounded-lg border">
                  <Icon className="text-foreground size-4" aria-hidden="true" />
                </span>
                <h3 className="text-foreground text-base font-semibold tracking-tight">{title}</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {components.map((c) => (
                  <li
                    key={c}
                    className="border-border bg-background text-muted-foreground rounded-md border px-2 py-0.5 font-mono text-[11px]"
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <span
                aria-hidden="true"
                className="text-muted-foreground group-hover:text-brand absolute right-5 top-5 text-xs font-medium transition-colors"
              >
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

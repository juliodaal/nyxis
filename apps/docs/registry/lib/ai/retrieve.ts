/**
 * Retrieval helper for the `/api/rag` endpoint. Replace the in-memory
 * stub with your real vector store (pgvector, Pinecone, Weaviate, Qdrant,
 * Chroma, Turbopuffer, etc.).
 *
 * The shape returned here matches the `RetrievedChunk` type in
 * `@nyxis/core` so the response can drop straight into the registry's
 * `<RetrievalResults>` and `<ChunkCard>` components.
 */

import type { RetrievedChunk } from '@nyxis/core';

export interface RetrieveOptions {
  topK?: number;
  minScore?: number;
}

const STUB_CORPUS: ReadonlyArray<{ id: string; source: string; text: string }> = [
  {
    id: 'doc-1',
    source: 'README.md',
    text: 'Nyxis is a toolkit for building AI products. It distributes components and backend recipes through a shadcn-compatible registry.',
  },
  {
    id: 'doc-2',
    source: 'README.md#install',
    text: 'Install components with `npx shadcn@latest add https://nyxis.vercel.app/r/<name>.json`. Each item declares its npm and registry dependencies.',
  },
  {
    id: 'doc-3',
    source: 'docs/registry.mdx',
    text: 'The shadcn CLI fetches the JSON, resolves cascading registry dependencies, installs the npm packages, and writes the source files into your project.',
  },
];

/**
 * Retrieve relevant chunks for a query. The stub does naive substring
 * scoring — replace `score()` and `STUB_CORPUS` with calls to your real
 * vector store and reranker.
 */
export async function retrieve(
  query: string,
  options: RetrieveOptions = {},
): Promise<RetrievedChunk[]> {
  const topK = options.topK ?? 5;
  const minScore = options.minScore ?? 0;

  const ranked = STUB_CORPUS.map((doc, i) => ({
    rank: i + 1,
    id: doc.id,
    source: doc.source,
    snippet: doc.text,
    score: score(query, doc.text),
  }))
    .filter((chunk) => chunk.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((chunk, i) => ({ ...chunk, rank: i + 1 }));

  return ranked;
}

function score(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q.length) return 0;
  // Tiny BM25-like score: term coverage + length penalty.
  const terms = q.split(/\s+/).filter(Boolean);
  const hits = terms.filter((term) => t.includes(term)).length;
  return terms.length === 0 ? 0 : hits / terms.length;
}

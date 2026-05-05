#!/usr/bin/env node
/**
 * One-shot scrubber: replace every reference to the user's seven SaaS
 * names (or their interim placeholders) with neutral, AI-product-generic
 * vocabulary. Idempotent — running it again is a no-op.
 *
 *   node scripts/scrub-saas-refs.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Replacement map. Order matters — longer/more specific matches first.
const REPLACEMENTS = [
  // Phrasing in JSDoc and prose: "Used in **<Product>**" → generic.
  [/Used in \*\*DocuMind, ([A-Z][A-Za-z]+)\*\*/g, 'Used in document-AI workflows'],
  [/\*\*DocuMind\*\*, \*\*([A-Z][A-Za-z]+)\*\*/g, 'document-AI and lead-AI workflows'],
  [/Used in \*\*DocuMind\*\*/g, 'Used in document-AI workflows'],
  [/Used in \*\*AskCompany\*\*, \*\*SupportDeflect\*\*/g, 'Used in chat and assistant interfaces'],
  [/Used in \*\*AskCompany\*\*, \*\*MeetingMind\*\*/g, 'Used in RAG and reasoning workflows'],
  [/Used in \*\*AskCompany\*\*/g, 'Used in chat assistants'],
  [/Used in \*\*SupportDeflect\*\*, \*\*MeetingMind\*\*/g, 'Used in sentiment-aware experiences'],
  [/Used in \*\*SupportDeflect\*\*/g, 'Used in support copilots'],
  [/Used in \*\*MeetingMind\*\*/g, 'Used in agent task lists'],
  [/Used in \*\*PulseReport\*\*/g, 'Used in AI dashboards'],
  [/Used in \*\*LeadSift\*\*/g, 'Used in lead-scoring interfaces'],
  [/Used in \*\*InboxZero\*\*/g, 'Used in email-triage interfaces'],

  // Same patterns but for our interim placeholder names from the previous
  // scrub run. We collapse them to the neutral form.
  [/Used in \*\*DocAI\*\*/g, 'Used in document-AI workflows'],
  [/Used in \*\*KnowledgeBot\*\*, \*\*SupportCopilot\*\*/g, 'Used in chat and assistant interfaces'],
  [/Used in \*\*KnowledgeBot\*\*, \*\*MeetingAI\*\*/g, 'Used in RAG and reasoning workflows'],
  [/Used in \*\*KnowledgeBot\*\*/g, 'Used in chat assistants'],
  [/Used in \*\*SupportCopilot\*\*, \*\*MeetingAI\*\*/g, 'Used in sentiment-aware experiences'],
  [/Used in \*\*SupportCopilot\*\*/g, 'Used in support copilots'],
  [/Used in \*\*MeetingAI\*\*/g, 'Used in agent task lists'],
  [/Used in \*\*AIDashboard\*\*/g, 'Used in AI dashboards'],
  [/Used in \*\*LeadScorer\*\*/g, 'Used in lead-scoring interfaces'],
  [/Used in \*\*TriageAI\*\*/g, 'Used in email-triage interfaces'],

  // "Built on **TanStack Table**. Used in document-AI workflows (extraction queue) and **LeadScorer** (lead pipeline)."
  [
    /(\(extraction queue\))\s*\n?\s*and\s*\*\*LeadScorer\*\*\s*\(lead pipeline\)/g,
    '$1 and lead-scoring pipelines',
  ],
  [
    /document AI workflows \(extraction queue\)\s*\n?\s*and \*\*LeadScorer\*\* \(lead pipeline\)/g,
    'document-AI and lead-scoring pipelines',
  ],

  // Multi-line "Used in\n * **Name**" jsdoc blocks.
  [/Used in\s*\n\s*\*\s*\*\*[A-Z][A-Za-z]+\*\*\s*\n\s*\*/g, 'Used in AI workflows.\n *'],

  // Free-form name references in copy / comments / data — collapse to
  // truly neutral placeholders the user is happy to ship publicly.
  [/\bDocuMind\b/g, 'Document AI'],
  [/\bAskCompany\b/g, 'AI Assistant'],
  [/\bLeadSift\b/g, 'Lead Intelligence'],
  [/\bSupportDeflect\b/g, 'Support Copilot'],
  [/\bMeetingMind\b/g, 'Meeting Intelligence'],
  [/\bPulseReport\b/g, 'Operations Dashboard'],
  [/\bInboxZero\b/g, 'Email Triage'],

  // Collapse first-pass placeholders.
  [/\bDocAI\b/g, 'Document AI'],
  [/\bKnowledgeBot\b/g, 'AI Assistant'],
  [/\bLeadScorer\b/g, 'Lead Intelligence'],
  [/\bSupportCopilot\b/g, 'Support Copilot'],
  [/\bMeetingAI\b/g, 'Meeting Intelligence'],
  [/\bAIDashboard\b/g, 'Operations Dashboard'],
  [/\bTriageAI\b/g, 'Email Triage'],
];

const TARGET_DIRS = ['apps/docs/src', 'packages/ui/src'];

const TARGET_EXTENSIONS = new Set(['.ts', '.tsx', '.astro', '.mdx', '.md', '.css']);

const IGNORED_DIRS = new Set([
  'node_modules',
  '.astro',
  'dist',
  'storybook-static',
  'coverage',
]);

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.git')) continue;
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      const ext = entry.name.slice(entry.name.lastIndexOf('.'));
      if (!TARGET_EXTENSIONS.has(ext)) continue;
      yield full;
    }
  }
}

async function main() {
  let changedCount = 0;
  let scannedCount = 0;

  for (const target of TARGET_DIRS) {
    const root = join(ROOT, target);
    for await (const file of walk(root)) {
      scannedCount += 1;
      const before = await readFile(file, 'utf8');
      let after = before;
      for (const [pattern, replacement] of REPLACEMENTS) {
        after = after.replace(pattern, replacement);
      }
      if (after !== before) {
        await writeFile(file, after);
        changedCount += 1;
      }
    }
  }

  console.log(
    `[scrub-saas-refs] scanned ${scannedCount} file(s), rewrote ${changedCount} with generic AI vocabulary`,
  );
}

main().catch((err) => {
  console.error('[scrub-saas-refs] failed:', err);
  process.exit(1);
});

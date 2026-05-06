/**
 * Phase K — Prompts / Eval primitives.
 *
 * Visual surface for prompt engineering and offline evaluation:
 * cards for saved prompts, auto-forms for `{{variables}}`, eval
 * runs with their headline metrics, dataset tables with score
 * buckets, and side-by-side A/B comparisons.
 */

export * from './prompt-card/index.js';
export * from './prompt-variable-form/index.js';
export * from './metric-card/index.js';
export * from './eval-run-card/index.js';
export * from './dataset-table/index.js';
export * from './ab-compare/index.js';

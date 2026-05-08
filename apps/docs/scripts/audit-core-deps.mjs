/**
 * Audit which registry components import `@nyxis/core` in source but
 * don't declare it under `dependencies` in items.ts. Run from repo root:
 *
 *   node apps/docs/scripts/audit-core-deps.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const componentsDir = 'apps/docs/registry/components';
const itemsFile = 'apps/docs/registry/items.ts';

const sourceImporters = fs
  .readdirSync(componentsDir)
  .filter((f) => f.endsWith('.tsx'))
  .filter((f) => fs.readFileSync(path.join(componentsDir, f), 'utf8').includes("from '@nyxis/core'"));

const items = fs.readFileSync(itemsFile, 'utf8');

const missing = [];
for (const file of sourceImporters) {
  const name = file.replace('.tsx', '');
  // Find the block { name: 'X', ... }, capture its deps array (or note if absent)
  const blockRegex = new RegExp(
    String.raw`\{\s*name:\s*'` + name + String.raw`'[\s\S]*?\n\s*\},`,
    'm'
  );
  const block = items.match(blockRegex)?.[0];
  if (!block) {
    missing.push({ name, reason: 'no-block' });
    continue;
  }
  const depsMatch = block.match(/dependencies:\s*\[([^\]]*)\]/);
  if (!depsMatch) {
    missing.push({ name, reason: 'no-deps-array' });
    continue;
  }
  if (!depsMatch[1].includes('@nyxis/core')) {
    missing.push({ name, reason: 'core-not-listed' });
  }
}

console.log(`Components importing @nyxis/core in source: ${sourceImporters.length}`);
console.log(`Missing declaration in items.ts: ${missing.length}`);
if (missing.length) {
  console.log('---');
  for (const m of missing) console.log(`${m.name.padEnd(32)} ${m.reason}`);
}

#!/usr/bin/env node
/**
 * Copy `src/styles/globals.css` to `dist/styles.css` verbatim.
 *
 * We intentionally do NOT pre-compile the CSS through Tailwind, because
 * the file relies on consumer-side Tailwind v4 to process the `@theme`
 * block and generate utilities (`bg-background`, `text-foreground`, ...).
 * Pre-compiling would freeze the utility list to whatever was used inside
 * nyxis-ui at build time, breaking arbitrary class usage in consumer code.
 */
import { copyFile, mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src/styles/globals.css');
const OUT_DIR = join(ROOT, 'dist');
const OUT = join(OUT_DIR, 'styles.css');

async function main() {
  let exists = true;
  try {
    await stat(OUT_DIR);
  } catch {
    exists = false;
  }
  if (!exists) {
    await mkdir(OUT_DIR, { recursive: true });
  }
  await copyFile(SRC, OUT);
  console.log(`[copy-styles] wrote ${OUT}`);
}

main().catch((err) => {
  console.error('[copy-styles] failed:', err);
  process.exit(1);
});

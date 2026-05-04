#!/usr/bin/env node
/**
 * Post-build: re-attach "use client" / "use server" directives that esbuild
 * stripped during bundling. Without this, Next.js App Router consumers get
 * "Functions cannot be passed directly to Client Components" errors when
 * importing interactive Nyxis components from a Server Component.
 *
 * Strategy: scan src/ for files whose first non-blank line is a directive,
 * then for every dist/*.js file whose source-of-record lives in that
 * directory, prepend the matching directive(s).
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, relative, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const KNOWN_DIRECTIVES = ['use client', 'use server'];

async function walk(dir, predicate) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && predicate(full)) {
        out.push(full);
      }
    }
  }
  return out;
}

function detectDirective(text) {
  for (const line of text.split('\n', 5)) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;
    for (const directive of KNOWN_DIRECTIVES) {
      if (
        trimmed === `"${directive}";` ||
        trimmed === `'${directive}';` ||
        trimmed === `"${directive}"` ||
        trimmed === `'${directive}'`
      ) {
        return directive;
      }
    }
    return null;
  }
  return null;
}

async function main() {
  let distExists = true;
  try {
    await stat(DIST);
  } catch {
    distExists = false;
  }
  if (!distExists) {
    console.warn('[preserve-directives] dist/ not found, skipping');
    return;
  }

  // 1. Scan src/ for files that carry a directive.
  const sourceFiles = await walk(SRC, (p) => /\.(ts|tsx|js|jsx)$/.test(p));
  /** @type {Map<string, string>} dir-relative-to-src → directive */
  const directiveByDir = new Map();
  for (const file of sourceFiles) {
    const text = await readFile(file, 'utf8');
    const directive = detectDirective(text);
    if (!directive) continue;
    const rel = relative(SRC, file);
    const dir = dirname(rel).split(sep).join('/');
    if (!directiveByDir.has(dir)) {
      directiveByDir.set(dir, directive);
    }
  }

  if (directiveByDir.size === 0) {
    console.log('[preserve-directives] no directives found in src/');
    return;
  }

  // 2. For every dist/*.js whose corresponding source dir has a directive,
  //    prepend the directive (idempotent).
  const distFiles = await walk(DIST, (p) => p.endsWith('.js'));
  let touched = 0;
  for (const file of distFiles) {
    const rel = relative(DIST, file);
    const dir = dirname(rel).split(sep).join('/');
    const directive = directiveByDir.get(dir);
    if (!directive) continue;
    const text = await readFile(file, 'utf8');
    if (detectDirective(text) === directive) continue;
    await writeFile(file, `'${directive}';\n${text}`);
    touched += 1;
  }

  console.log(`[preserve-directives] prepended directive to ${touched} file(s)`);
}

main().catch((err) => {
  console.error('[preserve-directives] failed:', err);
  process.exit(1);
});

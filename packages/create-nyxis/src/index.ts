/**
 * `create-nyxis` — scaffold a Nyxis project in one command.
 *
 * Flow:
 *   1. Prompt for the framework, project name, and optional first
 *      registry component.
 *   2. Call the framework's official starter (`create-next-app`,
 *      `create-astro`, `create-svelte`, `create-vite`).
 *   3. `cd` into the project, run `shadcn@latest init` to bootstrap
 *      the design tokens and `lib/utils.ts`.
 *   4. (Astro only) patch `tsconfig.json` with `compilerOptions.paths`
 *      since Astro's default doesn't include them and shadcn requires
 *      `@/*`.
 *   5. (Optional) install the chosen registry component, which cascades
 *      `@nyxis/core` automatically.
 *
 * Idempotency: every command is opt-in via a prompt so a user can
 * cancel any time. We never overwrite an existing directory without
 * confirmation.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { cancel, intro, isCancel, log, multiselect, outro, select, text } from '@clack/prompts';
import { execa } from 'execa';
import pc from 'picocolors';

interface FrameworkChoice {
  id: 'next' | 'astro' | 'sveltekit' | 'vite';
  label: string;
  hint: string;
  /** The npm-create command, with placeholders consumers fill at runtime. */
  createCmd: (name: string) => { cmd: string; args: readonly string[] };
}

const FRAMEWORKS: readonly FrameworkChoice[] = [
  {
    id: 'next',
    label: 'Next.js',
    hint: 'App Router, RSC-ready. Ships React + Tailwind.',
    createCmd: (name) => ({
      cmd: 'npx',
      args: [
        '--yes',
        'create-next-app@latest',
        name,
        '--typescript',
        '--tailwind',
        '--app',
        '--no-eslint',
        '--src-dir',
        '--import-alias',
        '@/*',
        '--use-pnpm',
        '--no-turbopack',
      ],
    }),
  },
  {
    id: 'astro',
    label: 'Astro',
    hint: 'Static-first; React added as an island integration.',
    createCmd: (name) => ({
      cmd: 'npm',
      args: [
        'create',
        'astro@latest',
        name,
        '--',
        '--template',
        'minimal',
        '--typescript',
        'strict',
        '--no-git',
        '--skip-houston',
        '--install',
      ],
    }),
  },
  {
    id: 'sveltekit',
    label: 'SvelteKit',
    hint: 'Svelte-native; React components run via the @astrojs/react adapter pattern.',
    createCmd: (name) => ({
      cmd: 'npx',
      args: [
        '--yes',
        'sv',
        'create',
        name,
        '--template',
        'minimal',
        '--types',
        'ts',
        '--no-add-ons',
        '--install',
        'pnpm',
      ],
    }),
  },
  {
    id: 'vite',
    label: 'Vite',
    hint: 'React + TS template. Ships React, no Tailwind by default.',
    createCmd: (name) => ({
      cmd: 'npm',
      args: ['create', 'vite@latest', name, '--', '--template', 'react-ts'],
    }),
  },
];

interface RegistryStarter {
  slug: string;
  label: string;
  hint: string;
}

const STARTERS: readonly RegistryStarter[] = [
  {
    slug: 'chat-thread',
    label: 'chat-thread',
    hint: 'Streaming chat surface (cascades chat-message)',
  },
  { slug: 'agent-roster', label: 'agent-roster', hint: 'Agent dashboard with status + activity' },
  { slug: 'rag-pipeline', label: 'rag-pipeline', hint: 'Retrieve → rerank → generate visualizer' },
  { slug: 'mcp-server-card', label: 'mcp-server-card', hint: 'MCP server card with capabilities' },
];

const REGISTRY_BASE = 'https://nyxisai.vercel.app/r';

async function main(): Promise<void> {
  // Clear the terminal as part of the CLI welcome experience.
  // eslint-disable-next-line no-console
  console.clear();

  intro(`${pc.bgMagenta(pc.black(' Nyxis '))} ${pc.dim('— scaffold an AI product')}`);

  const argName = process.argv[2];
  const projectName =
    argName ??
    (await text({
      message: 'Project name',
      placeholder: 'my-nyxis-app',
      validate(value) {
        if (!value) return 'Please enter a project name';
        if (!/^[a-z0-9-]+$/i.test(value)) return 'Use letters, numbers, and dashes only';
        return undefined;
      },
    }));
  ensureNotCancelled(projectName, 'Cancelled before project name was set.');

  const targetDir = path.resolve(process.cwd(), projectName);
  if (existsSync(targetDir)) {
    cancel(`Directory ${pc.red(projectName)} already exists. Pick a different name.`);
    process.exit(1);
  }

  const frameworkId = await select({
    message: 'Which framework?',
    options: FRAMEWORKS.map((f) => ({ value: f.id, label: f.label, hint: f.hint })),
    initialValue: 'next',
  });
  ensureNotCancelled(frameworkId, 'Cancelled before a framework was chosen.');
  const framework = FRAMEWORKS.find((f) => f.id === frameworkId)!;

  const installNyxisUI = await select({
    message: 'Install nyxis-ui? (theme runtime + brand color tokens)',
    options: [
      { value: 'yes', label: 'Yes', hint: 'Five-mode theme + brand color' },
      { value: 'no', label: 'No', hint: 'shadcn defaults are fine' },
    ],
    initialValue: 'yes',
  });
  ensureNotCancelled(installNyxisUI, 'Cancelled.');

  const componentSlugs = await multiselect({
    message: 'Add starter components? (Space to select, Enter to confirm)',
    options: STARTERS.map((s) => ({ value: s.slug, label: s.label, hint: s.hint })),
    required: false,
  });
  ensureNotCancelled(componentSlugs, 'Cancelled.');

  // ── Run the chosen framework's starter ───────────────────────────
  log.step(`Creating ${pc.cyan(framework.label)} project in ${pc.dim(targetDir)}…`);
  const { cmd, args } = framework.createCmd(projectName);
  await run(cmd, args, { cwd: process.cwd() });

  // ── Astro path-alias gotcha: shadcn-init refuses without `@/*`. ─
  if (framework.id === 'astro') {
    patchAstroTsconfig(targetDir);
    log.step('Patched Astro tsconfig with `compilerOptions.paths`');
  }

  // ── shadcn init ──────────────────────────────────────────────────
  log.step('Running shadcn init…');
  await run('npx', ['--yes', 'shadcn@latest', 'init', '--yes'], { cwd: targetDir });

  // ── Optional: install nyxis-ui (theme runtime) ───────────────────
  if (installNyxisUI === 'yes') {
    log.step('Installing nyxis-ui…');
    await run('pnpm', ['add', 'nyxis-ui'], { cwd: targetDir });
  }

  // ── Optional: install starter components ─────────────────────────
  if (Array.isArray(componentSlugs) && componentSlugs.length > 0) {
    for (const slug of componentSlugs) {
      log.step(`Installing ${pc.cyan(slug)}…`);
      await run(
        'npx',
        ['--yes', 'shadcn@latest', 'add', `${REGISTRY_BASE}/${slug}.json`, '--yes'],
        {
          cwd: targetDir,
        },
      );
    }
  }

  // ── Done ─────────────────────────────────────────────────────────
  outro(
    [
      pc.green('Project ready.'),
      '',
      `  ${pc.dim('cd')} ${pc.cyan(projectName)}`,
      `  ${pc.dim('pnpm dev')}`,
      '',
      pc.dim('Next: install more components from'),
      pc.dim('  https://nyxisai.vercel.app/components'),
    ].join('\n'),
  );
}

function ensureNotCancelled<T>(value: T | symbol, message: string): asserts value is T {
  if (isCancel(value)) {
    cancel(message);
    process.exit(0);
  }
}

/**
 * Patch Astro's default tsconfig to add `@/*` path aliases. Without
 * this, `npx shadcn@latest init` fails with `Could not find valid path
 * aliases`. We merge non-destructively so users who pre-configured
 * paths don't lose their settings.
 */
function patchAstroTsconfig(dir: string): void {
  const tsconfigPath = path.join(dir, 'tsconfig.json');
  if (!existsSync(tsconfigPath)) return;
  const raw = readFileSync(tsconfigPath, 'utf8');
  const json = JSON.parse(raw) as {
    compilerOptions?: { baseUrl?: string; paths?: Record<string, string[]> };
    [k: string]: unknown;
  };
  json.compilerOptions ??= {};
  json.compilerOptions.baseUrl ??= '.';
  json.compilerOptions.paths ??= {};
  json.compilerOptions.paths['@/*'] ??= ['./src/*'];
  writeFileSync(tsconfigPath, JSON.stringify(json, null, 2) + '\n', 'utf8');
}

async function run(cmd: string, args: readonly string[], opts: { cwd: string }): Promise<void> {
  await execa(cmd, args, {
    cwd: opts.cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  log.error(message);
  process.exit(1);
});

// Silence unused-fileURLToPath import in some bundlers.
void fileURLToPath;

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, resolve as resolvePath } from 'node:path';

import { z } from 'zod';

import type { RegistryClient } from '../lib/registry-fetch.js';

export const installComponentSchema = {
  name: z
    .string()
    .min(1)
    .describe(
      'Slug of the registry item to install (e.g. "chat-message", "agent-roster", "api-chat"). Use `list_components` or `search_components` first to find the right slug.',
    ),
  cwd: z
    .string()
    .optional()
    .describe(
      "Absolute path to the project root where the component should be installed. Defaults to the MCP server's current working directory, which is normally the assistant's active workspace.",
    ),
  yes: z
    .boolean()
    .default(true)
    .describe(
      'Pass `--yes` to the shadcn CLI to skip interactive prompts. Default true. Set to false only if you intend to surface prompts back to the user (rare in MCP).',
    ),
};

export function installComponentHandler(client: RegistryClient) {
  return async (args: { name: string; cwd?: string; yes?: boolean }) => {
    const cwd = args.cwd ? resolvePath(args.cwd) : process.cwd();

    // Pre-flight: shadcn requires a components.json at the project root.
    // If it isn't there, no point spawning anything — return an actionable
    // error the assistant can surface to the user.
    const componentsJson = join(cwd, 'components.json');
    if (!existsSync(componentsJson)) {
      return {
        isError: true,
        content: [
          {
            type: 'text' as const,
            text:
              `Cannot install \`${args.name}\` — no \`components.json\` found at \`${cwd}\`.\n\n` +
              `The user needs to bootstrap shadcn in this project first:\n\n` +
              `\`\`\`bash\n` +
              `cd ${cwd}\n` +
              `npx shadcn@latest init\n` +
              `\`\`\`\n\n` +
              `That writes \`components.json\` plus \`lib/utils.ts\`, sets up the \`@/\` ` +
              `alias, and adds the design-token CSS imports. Re-run this tool afterwards.`,
          },
        ],
      };
    }

    const url = client.itemUrl(args.name);
    const cliArgs = ['-y', 'shadcn@latest', 'add', url];
    if (args.yes ?? true) cliArgs.push('--yes');

    return new Promise<{
      isError?: boolean;
      content: { type: 'text'; text: string }[];
    }>((resolve) => {
      // `shell: true` so npx resolves on Windows (`npx.cmd`) and POSIX alike.
      const proc = spawn('npx', cliArgs, { cwd, shell: true });

      let stdout = '';
      let stderr = '';
      proc.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString('utf8');
      });
      proc.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString('utf8');
      });

      proc.on('error', (err) => {
        resolve({
          isError: true,
          content: [
            {
              type: 'text' as const,
              text:
                `Could not spawn \`npx\`: ${err.message}\n\n` +
                `Make sure Node.js (which provides \`npx\`) is installed and on PATH ` +
                `in the environment that hosts the MCP server.`,
            },
          ],
        });
      });

      proc.on('close', (code) => {
        const combined = `${stdout}${stderr}`.trim();
        if (code === 0) {
          resolve({
            content: [
              {
                type: 'text' as const,
                text:
                  `Installed \`${args.name}\` into \`${cwd}\`.\n\n` +
                  `**shadcn CLI output**\n\n\`\`\`\n${combined || '(no output)'}\n\`\`\`\n\n` +
                  `Typical next steps:\n` +
                  `- Open the new files under \`components/nyxis/\` (or the path your ` +
                  `\`components.json\` configures) to confirm they look right.\n` +
                  `- Wire the component into your UI.`,
              },
            ],
          });
        } else {
          resolve({
            isError: true,
            content: [
              {
                type: 'text' as const,
                text:
                  `Install of \`${args.name}\` failed (exit code ${code}).\n\n` +
                  `Command: \`npx ${cliArgs.join(' ')}\`\n` +
                  `Working directory: \`${cwd}\`\n\n` +
                  `**Output**\n\n\`\`\`\n${combined || '(no output)'}\n\`\`\``,
              },
            ],
          });
        }
      });
    });
  };
}

# create-nyxis

[![License: MIT](https://img.shields.io/badge/License-MIT-A855F7.svg)](https://github.com/juliodaal/nyxis/blob/main/LICENSE)

One-command scaffolder for [Nyxis](https://nyxisai.vercel.app) — pick a
framework, get a working project with shadcn + Nyxis ready to go.

## Usage

```bash
npm create nyxis@latest my-app
# or
pnpm create nyxis my-app
# or
yarn create nyxis my-app
```

You'll be prompted for:

1. **Framework** — Next.js · Astro · SvelteKit · Vite
2. **`nyxis-ui`** — install the theme runtime (yes by default)
3. **Starter components** — pick zero or more from the registry

The CLI then:

- Runs the framework's official starter (`create-next-app`, `create-astro`,
  `sv create`, `create-vite`).
- Patches Astro's `tsconfig.json` to add `@/*` aliases (shadcn requirement,
  missing from the default Astro template).
- Runs `npx shadcn@latest init` to bootstrap design tokens and `lib/utils.ts`.
- Installs `nyxis-ui` if you opted in.
- Installs the registry components you picked. The CLI's cascade pulls
  `@nyxis/core` automatically when needed.

After it finishes:

```bash
cd my-app
pnpm dev
```

Browse the full catalog at
[nyxisai.vercel.app/components](https://nyxisai.vercel.app/components).

## License

[MIT](https://github.com/juliodaal/nyxis/blob/main/LICENSE) © Julio César Daal

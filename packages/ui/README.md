# nyxis-ui

[![License: MIT](https://img.shields.io/badge/License-MIT-A855F7.svg)](https://github.com/juliodaal/nyxis/blob/main/LICENSE)

The theme system for [Nyxis](https://nyxis.vercel.app) — a toolkit for building
AI products. This package is intentionally tiny: design tokens, a five-mode
theme runtime, and the `cn()` helper. Every component lives in the shadcn
registry.

→ [Documentation](https://nyxis.vercel.app)

## Install

```bash
pnpm add nyxis-ui
```

## Setup

Pull the stylesheet once at the root of your app and run the FOUC-safe inline
script before anything else in `<head>`:

```tsx
// app/layout.tsx (Next.js example)
import 'nyxis-ui/styles.css';
import { getThemeScript } from 'nyxis-ui/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: getThemeScript() }}
          suppressHydrationWarning
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Toggle the theme

```tsx
import { ThemeToggle } from 'nyxis-ui/theme';

<header>
  <ThemeToggle />
</header>;
```

`ThemeToggle` reads/writes `data-theme` on `<html>` and stays in sync across
tabs via `localStorage`. Five modes: `light`, `dark`, `dim`, `high-contrast`,
`system`.

## The `cn()` helper

Identical to the one shipped through the registry; safe to use anywhere that
already depends on `nyxis-ui`:

```ts
import { cn } from 'nyxis-ui/utils';
```

## Components live elsewhere

Every Nyxis component is a registry item, installed by the shadcn CLI:

```bash
# AI-first
npx shadcn@latest add https://nyxis.vercel.app/r/chat-message.json

# Base UI primitives — install from shadcn/ui's standard registry
npx shadcn@latest add button card input
```

See the [Registry guide](https://nyxis.vercel.app/docs/registry) for the full
catalog and how to wire it up.

## License

[MIT](https://github.com/juliodaal/nyxis/blob/main/LICENSE) © Julio César Daal

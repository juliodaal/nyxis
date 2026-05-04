# nyxis-ui

[![npm version](https://img.shields.io/npm/v/nyxis-ui?color=A855F7)](https://www.npmjs.com/package/nyxis-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-A855F7.svg)](https://github.com/juliodaal/nyxis/blob/main/LICENSE)

A modern React component library for AI-powered products. Built with Tailwind
CSS v4, Radix UI, and GSAP.

→ [Documentation](https://nyxis.vercel.app) ·
[Storybook](https://nyxis-storybook.vercel.app)

## Installation

```bash
pnpm add nyxis-ui
# or: npm install nyxis-ui
```

You also need `react`, `react-dom`, and (for any animation component) `gsap`:

```bash
pnpm add react react-dom gsap
```

## Setup

Import the stylesheet **once** at the root of your app (e.g. `app/layout.tsx`
for Next.js or `src/main.tsx` for Vite):

```tsx
import 'nyxis-ui/styles.css';
```

Then use components anywhere:

```tsx
import { Button } from 'nyxis-ui';

export function Hero() {
  return <Button variant="default">Get started</Button>;
}
```

For stricter tree-shaking, import from the subpath:

```tsx
import { Button } from 'nyxis-ui/button';
```

## Theming

Nyxis ships five themes: `light`, `dark`, `dim`, `high-contrast`, and `system`.
Set the active theme by adding `data-theme` to your `<html>`:

```html
<html data-theme="dark">
  ...
</html>
```

A FOUC-free initialization script and `<ThemeToggle>` component are documented
in the [theming guide](https://nyxis.vercel.app/docs/theming).

## License

[MIT](https://github.com/juliodaal/nyxis/blob/main/LICENSE) © Julio César Daal

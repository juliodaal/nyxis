<div align="center">

# Nyxis

**A modern React component library for AI-powered products.**

Built with TypeScript, Tailwind CSS v4, Radix UI, and GSAP. Distributed as a
proper installable npm package — no copy-paste.

[![npm version](https://img.shields.io/npm/v/nyxis-ui?color=A855F7)](https://www.npmjs.com/package/nyxis-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-A855F7.svg)](./LICENSE)
[![CI](https://github.com/juliodaal/nyxis/actions/workflows/ci.yml/badge.svg)](https://github.com/juliodaal/nyxis/actions/workflows/ci.yml)

[Documentation](https://nyxis.vercel.app) ·
[Storybook](https://nyxis-storybook.vercel.app) · [Changelog](./CHANGELOG.md)

</div>

---

## Features

- **52+ components** across four categories: text animations, base UI, effect
  animations, and AI-product domain patterns.
- **Production-grade GSAP animations** with `prefers-reduced-motion` support.
- **Five-mode theming**: light, dark, dim, high-contrast, and system,
  synchronized across docs and Storybook.
- **Full accessibility** via Radix UI primitives and `axe-core` enforcement.
- **Tree-shakeable** with per-component subpath exports.
- **Server-component friendly** — `"use client"` directives preserved through
  the build.
- **Strict TypeScript** with full `.d.ts` output.
- **MIT licensed**, public source, public roadmap.

## Installation

```bash
pnpm add nyxis-ui
```

```tsx
// Once at your app root
import 'nyxis-ui/styles.css';

// Anywhere
import { Button, SplitText, KPICard } from 'nyxis-ui';

export function Hero() {
  return (
    <section>
      <SplitText as="h1">Document intelligence, automated</SplitText>
      <Button variant="default">Get started</Button>
    </section>
  );
}
```

## Component Categories

| Category        | Count | Highlights                                            |
| --------------- | ----- | ----------------------------------------------------- |
| Text Animations | 10    | SplitText, TypeWriter, ScrambleText, CountUp, ...     |
| Components      | 22    | Button, Dialog, Form, DataTable, Command palette, ... |
| Animations      | 8     | MagneticButton, Parallax, TiltCard, Aurora, ...       |
| Domain Patterns | 12    | ChatMessage, CitationCard, ConfidenceBadge, ...       |

## Built For

Nyxis is the shared UI layer behind a portfolio of AI-powered SaaS products:
document intelligence, internal RAG assistants, lead qualification, support
deflection, meeting intelligence, automated reporting, and email triage.

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup, conventions, and the
component authoring checklist.

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability disclosure and our hardening
baseline.

## Acknowledgements

Inspired by the work of [shadcn/ui](https://ui.shadcn.com),
[Radix UI](https://www.radix-ui.com), [Tailwind CSS](https://tailwindcss.com),
[GSAP](https://gsap.com), and [reactbits.dev](https://reactbits.dev).

## License

[MIT](./LICENSE) © Julio César Daal

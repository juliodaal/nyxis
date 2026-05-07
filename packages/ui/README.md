# nyxis-ui

[![License: MIT](https://img.shields.io/badge/License-MIT-A855F7.svg)](https://github.com/juliodaal/nyxis/blob/main/LICENSE)

The component layer of [Nyxis](https://nyxis.vercel.app) — a toolkit for
building AI products. Tailwind CSS v4, Radix UI, framer-motion.

→ [Documentation](https://nyxis.vercel.app) ·
[Storybook](https://nyxis-storybook.vercel.app)

> **Note.** Starting in `0.16.0`, the AI runtime (provider adapter, hooks,
> types, server helpers) lives in
> [`@nyxis/core`](https://www.npmjs.com/package/@nyxis/core). Components in this
> package import from there. The next major (`0.17.0`) will further migrate the
> catalog to a shadcn-style registry — components will be copy-paste via
> `npx shadcn add` rather than imported from this barrel.

## Install

```bash
pnpm add nyxis-ui @nyxis/core react react-dom tailwindcss
```

Pull the stylesheet once at the root of your app:

```tsx
import 'nyxis-ui/styles.css';
```

## Use

```tsx
import { ChatMessage } from 'nyxis-ui';
import { useChat } from '@nyxis/core';

export function Chat() {
  const { messages } = useChat({ api: '/api/chat' });
  return messages.map((m) => (
    <ChatMessage key={m.id} role={m.role}>
      {m.content}
    </ChatMessage>
  ));
}
```

## License

[MIT](https://github.com/juliodaal/nyxis/blob/main/LICENSE) © Julio César Daal

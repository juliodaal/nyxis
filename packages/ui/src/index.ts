/**
 * Public surface of nyxis-ui.
 *
 * As of 0.18.0, this package is the **theme system** for the Nyxis
 * ecosystem. Components — both base UI primitives (Button, Card, Form,
 * etc.) and AI-first components (ChatMessage, AgentCard, etc.) — are
 * distributed via the shadcn registry and copy-paste installed:
 *
 *   npx shadcn@latest add https://nyxisai.vercel.app/r/<name>.json
 *
 * What this package gives you:
 *   - The five-mode theme runtime (`<ThemeToggle>`, `getThemeScript`).
 *   - The shared design tokens stylesheet (`nyxis-ui/styles.css`).
 *   - The `cn()` Tailwind helper (`nyxis-ui/utils`) — same one shipped
 *     by the registry so every Nyxis component speaks the same language.
 */

// Utilities
export { cn } from './lib/utils.js';

// Theme system
export * from './components/theme/index.js';

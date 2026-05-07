/**
 * Public surface of nyxis-ui. Each component re-exports from its folder so
 * consumers can either pull from the barrel (`from 'nyxis-ui'`) or from a
 * subpath (`from 'nyxis-ui/button'`) for stricter tree-shaking.
 *
 * Starting in 0.17.0, every AI-first component is distributed via the
 * shadcn registry (`npx shadcn@latest add @nyxis/<name>`). This package
 * keeps only the theme system and the base UI primitives that the AI
 * components compose on top of.
 */

// Utilities
export { cn } from './lib/utils.js';

// Theme system
export * from './components/theme/index.js';

// UI primitives
export * from './components/ui/button/index.js';
export * from './components/ui/input/index.js';
export * from './components/ui/textarea/index.js';
export * from './components/ui/label/index.js';
export * from './components/ui/card/index.js';
export * from './components/ui/badge/index.js';
export * from './components/ui/avatar/index.js';
export * from './components/ui/separator/index.js';
export * from './components/ui/skeleton/index.js';

// Overlays
export * from './components/ui/dialog/index.js';
export * from './components/ui/sheet/index.js';
export * from './components/ui/drawer/index.js';
export * from './components/ui/popover/index.js';
export * from './components/ui/tooltip/index.js';

// Form controls
export * from './components/ui/select/index.js';
export * from './components/ui/checkbox/index.js';
export * from './components/ui/switch/index.js';
export * from './components/ui/radio-group/index.js';
export * from './components/ui/form/index.js';

// Navigation
export * from './components/ui/tabs/index.js';
export * from './components/ui/accordion/index.js';

// Composed
export * from './components/ui/command/index.js';
export * from './components/ui/combobox/index.js';
export * from './components/ui/toast/index.js';

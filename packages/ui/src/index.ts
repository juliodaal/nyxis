/**
 * Public surface of nyxis-ui. Each component re-exports from its folder so
 * consumers can either pull from the barrel (`from 'nyxis-ui'`) or from a
 * subpath (`from 'nyxis-ui/button'`) for stricter tree-shaking.
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

// Text animations
export * from './components/text/index.js';

// Effect animations
export * from './components/animations/index.js';

// Domain patterns
export * from './components/domain/index.js';

// AI · Models & Providers UI (Phase D)
export * from './components/ai/index.js';

// AI · Chat 2.0 (Phase E)
export * from './components/chat/index.js';

// AI · Reasoning (Phase F)
export * from './components/reasoning/index.js';

// AI · Tools / Function Calling (Phase G)
export * from './components/tools/index.js';

// AI · MCP — Model Context Protocol (Phase H)
export * from './components/mcp/index.js';

// AI · Agents (Phase I)
export * from './components/agents/index.js';

// AI · Multimodal (Phase J)
export * from './components/multimodal/index.js';

// AI · Prompts / Eval (Phase K)
export * from './components/prompts/index.js';

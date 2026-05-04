/**
 * Single source of truth for the Nyxis component catalog.
 *
 * This drives the sidebar, the command palette, the dynamic page routes,
 * and the search index. Adding a new component to Nyxis means adding an
 * entry here and an MDX file under `src/content/<category>/<slug>.mdx`.
 */

export type Category =
  | 'getting-started'
  | 'text-animations'
  | 'components'
  | 'animations'
  | 'domain';

export type Status = 'stable' | 'beta' | 'planned' | 'in-progress';

export interface RegistryEntry {
  slug: string;
  name: string;
  category: Category;
  description: string;
  status: Status;
  importPath?: string;
  dependencies?: readonly string[];
  saasContext?: readonly string[];
}

export interface CategoryGroup {
  id: Category;
  label: string;
  description: string;
  href: string;
}

export const CATEGORIES: readonly CategoryGroup[] = [
  {
    id: 'getting-started',
    label: 'Getting started',
    description: 'Install Nyxis, configure theming, security guidance.',
    href: '/docs',
  },
  {
    id: 'text-animations',
    label: 'Text animations',
    description: 'GSAP-powered text effects with reduced-motion support.',
    href: '/text-animations',
  },
  {
    id: 'components',
    label: 'Components',
    description: 'Accessible UI primitives built on Radix UI.',
    href: '/components',
  },
  {
    id: 'animations',
    label: 'Animations',
    description: 'Effect components and animated backgrounds.',
    href: '/animations',
  },
  {
    id: 'domain',
    label: 'Domain patterns',
    description: 'Components designed for AI-product workflows.',
    href: '/domain',
  },
] as const;

export const REGISTRY: readonly RegistryEntry[] = [
  // ── Getting started ─────────────────────────────────────────────────
  {
    slug: 'introduction',
    name: 'Introduction',
    category: 'getting-started',
    description: 'What is Nyxis and how the docs are organized.',
    status: 'stable',
  },
  {
    slug: 'installation',
    name: 'Installation',
    category: 'getting-started',
    description: 'Install nyxis-ui in any React project.',
    status: 'stable',
  },
  {
    slug: 'theming',
    name: 'Theming',
    category: 'getting-started',
    description: 'Five-mode theming, design tokens, and FOUC prevention.',
    status: 'stable',
  },
  {
    slug: 'security',
    name: 'Security',
    category: 'getting-started',
    description: 'Hardening practices and vulnerability disclosure.',
    status: 'stable',
  },

  // ── Text animations (Phase 5) ───────────────────────────────────────
  {
    slug: 'split-text',
    name: 'SplitText',
    category: 'text-animations',
    description: 'Animate entry of characters, words, or lines.',
    status: 'stable',
    importPath: 'nyxis-ui',
    dependencies: ['gsap'],
  },
  {
    slug: 'type-writer',
    name: 'TypeWriter',
    category: 'text-animations',
    description: 'Typewriter effect with multi-string support.',
    status: 'stable',
    importPath: 'nyxis-ui',
    saasContext: ['AskCompany', 'MeetingMind'],
  },
  {
    slug: 'scramble-text',
    name: 'ScrambleText',
    category: 'text-animations',
    description: 'Scrambled cipher resolves into the final text.',
    status: 'stable',
    saasContext: ['DocuMind'],
  },
  {
    slug: 'decrypt-text',
    name: 'DecryptText',
    category: 'text-animations',
    description: 'Matrix-style decryption animation.',
    status: 'stable',
    saasContext: ['InboxZero'],
  },
  {
    slug: 'gradient-text',
    name: 'GradientText',
    category: 'text-animations',
    description: 'Pure-CSS animated gradient text.',
    status: 'stable',
  },
  {
    slug: 'shiny-text',
    name: 'ShinyText',
    category: 'text-animations',
    description: 'Light sweep across a text label.',
    status: 'stable',
  },
  {
    slug: 'count-up',
    name: 'CountUp',
    category: 'text-animations',
    description: 'Animate a number with locale-aware formatting.',
    status: 'stable',
    saasContext: ['PulseReport'],
  },
  {
    slug: 'reveal-text',
    name: 'RevealText',
    category: 'text-animations',
    description: 'Reveal text on scroll via ScrollTrigger.',
    status: 'stable',
  },
  {
    slug: 'marquee-text',
    name: 'MarqueeText',
    category: 'text-animations',
    description: 'Infinite horizontal scrolling text.',
    status: 'stable',
  },
  {
    slug: 'rotating-text',
    name: 'RotatingText',
    category: 'text-animations',
    description: 'Cycle through words with slide, fade or scramble transitions.',
    status: 'stable',
  },

  // ── Base UI components (Phase 4) ────────────────────────────────────
  {
    slug: 'button',
    name: 'Button',
    category: 'components',
    description: 'Polymorphic button with six variants and four sizes.',
    status: 'stable',
    importPath: 'nyxis-ui',
  },
  {
    slug: 'input',
    name: 'Input',
    category: 'components',
    description: 'Single-line text input with prefix/suffix slots.',
    status: 'stable',
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    category: 'components',
    description: 'Multi-line input with optional autosize.',
    status: 'stable',
  },
  {
    slug: 'card',
    name: 'Card',
    category: 'components',
    description: 'Surface with header, content, and footer slots.',
    status: 'stable',
  },
  {
    slug: 'badge',
    name: 'Badge',
    category: 'components',
    description: 'Small status indicator.',
    status: 'stable',
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    category: 'components',
    description: 'Circular avatar with fallback initials and status dot.',
    status: 'stable',
  },
  {
    slug: 'separator',
    name: 'Separator',
    category: 'components',
    description: 'Horizontal or vertical divider.',
    status: 'stable',
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    category: 'components',
    description: 'Accessible modal dialog built on Radix.',
    status: 'stable',
  },
  {
    slug: 'sheet',
    name: 'Sheet',
    category: 'components',
    description: 'Side-anchored panel (top/right/bottom/left).',
    status: 'stable',
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    category: 'components',
    description: 'Mobile-first bottom sheet with drag-to-dismiss.',
    status: 'stable',
  },
  {
    slug: 'popover',
    name: 'Popover',
    category: 'components',
    description: 'Floating element anchored to a trigger.',
    status: 'stable',
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    category: 'components',
    description: 'Contextual hint with delay control.',
    status: 'stable',
  },
  {
    slug: 'toast',
    name: 'Toast',
    category: 'components',
    description: 'Transient notification (Sonner).',
    status: 'stable',
  },
  {
    slug: 'select',
    name: 'Select',
    category: 'components',
    description: 'Custom select control built on Radix.',
    status: 'stable',
  },
  {
    slug: 'combobox',
    name: 'Combobox',
    category: 'components',
    description: 'Searchable select using cmdk.',
    status: 'stable',
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    category: 'components',
    description: 'Boolean input with indeterminate state.',
    status: 'stable',
  },
  {
    slug: 'switch',
    name: 'Switch',
    category: 'components',
    description: 'Toggle switch.',
    status: 'stable',
  },
  {
    slug: 'radio-group',
    name: 'RadioGroup',
    category: 'components',
    description: 'Grouped exclusive choice.',
    status: 'stable',
  },
  {
    slug: 'dropdown-menu',
    name: 'DropdownMenu',
    category: 'components',
    description: 'Multi-item menu with submenus and shortcuts.',
    status: 'stable',
    importPath: 'nyxis-ui',
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    category: 'components',
    description: 'Switch between equivalent views.',
    status: 'stable',
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    category: 'components',
    description: 'Collapsible disclosure rows.',
    status: 'stable',
  },
  {
    slug: 'command',
    name: 'Command',
    category: 'components',
    description: 'Cmd+K-style command palette (cmdk).',
    status: 'stable',
    saasContext: ['AskCompany'],
  },
  {
    slug: 'form',
    name: 'Form',
    category: 'components',
    description: 'react-hook-form + zod wrapper with FormField, FormItem, FormMessage.',
    status: 'stable',
  },

  // ── Effect animations (Phase 6) ─────────────────────────────────────
  {
    slug: 'magnetic-button',
    name: 'MagneticButton',
    category: 'animations',
    description: 'Button that pulls toward the cursor.',
    status: 'stable',
    dependencies: ['gsap'],
  },
  {
    slug: 'spotlight-cursor',
    name: 'SpotlightCursor',
    category: 'animations',
    description: 'Radial gradient that follows the cursor.',
    status: 'stable',
  },
  {
    slug: 'parallax-container',
    name: 'ParallaxContainer',
    category: 'animations',
    description: 'Scroll-triggered layered parallax.',
    status: 'stable',
    dependencies: ['gsap'],
  },
  {
    slug: 'stagger-reveal',
    name: 'StaggerReveal',
    category: 'animations',
    description: 'Animate children into view in sequence.',
    status: 'stable',
    dependencies: ['gsap'],
  },
  {
    slug: 'tilt-card',
    name: 'TiltCard',
    category: 'animations',
    description: 'Cursor-tracked 3D tilt with optional glare.',
    status: 'stable',
  },
  {
    slug: 'aurora-background',
    name: 'AuroraBackground',
    category: 'animations',
    description: 'Soft animated aurora backdrop.',
    status: 'stable',
  },
  {
    slug: 'dot-grid-background',
    name: 'DotGridBackground',
    category: 'animations',
    description: 'Canvas dot grid that reacts to hover.',
    status: 'stable',
  },
  {
    slug: 'mesh-gradient-background',
    name: 'MeshGradientBackground',
    category: 'animations',
    description: 'Animated SVG mesh gradient.',
    status: 'stable',
    dependencies: ['gsap'],
  },

  // ── Domain patterns (Phase 7) ───────────────────────────────────────
  {
    slug: 'file-dropzone',
    name: 'FileDropzone',
    category: 'domain',
    description: 'Drag-and-drop multi-file uploader with previews.',
    status: 'stable',
    saasContext: ['DocuMind'],
  },
  {
    slug: 'data-table',
    name: 'DataTable',
    category: 'domain',
    description: 'TanStack table with sort, filter, pagination, selection.',
    status: 'stable',
    saasContext: ['DocuMind', 'LeadSift'],
  },
  {
    slug: 'chat-message',
    name: 'ChatMessage',
    category: 'domain',
    description: 'User / assistant / system bubble with streaming cursor.',
    status: 'stable',
    saasContext: ['AskCompany', 'SupportDeflect'],
  },
  {
    slug: 'chat-input',
    name: 'ChatInput',
    category: 'domain',
    description: 'Auto-resizing chat input with attachment slot.',
    status: 'stable',
    saasContext: ['AskCompany', 'SupportDeflect'],
  },
  {
    slug: 'citation-card',
    name: 'CitationCard',
    category: 'domain',
    description: 'Source snippet with title, page, and link.',
    status: 'stable',
    saasContext: ['AskCompany', 'MeetingMind'],
  },
  {
    slug: 'confidence-badge',
    name: 'ConfidenceBadge',
    category: 'domain',
    description: 'Color-coded extraction confidence indicator.',
    status: 'stable',
    saasContext: ['DocuMind'],
  },
  {
    slug: 'kpi-card',
    name: 'KPICard',
    category: 'domain',
    description: 'Number, delta, and sparkline at a glance.',
    status: 'stable',
    saasContext: ['PulseReport'],
  },
  {
    slug: 'lead-card',
    name: 'LeadCard',
    category: 'domain',
    description: 'Lead summary with score ring and quick actions.',
    status: 'stable',
    saasContext: ['LeadSift'],
  },
  {
    slug: 'sentiment-indicator',
    name: 'SentimentIndicator',
    category: 'domain',
    description: 'Positive / neutral / negative sentiment readout.',
    status: 'stable',
    saasContext: ['SupportDeflect', 'MeetingMind'],
  },
  {
    slug: 'audit-log-item',
    name: 'AuditLogItem',
    category: 'domain',
    description: 'Timeline entry with actor, action, and diff.',
    status: 'stable',
    saasContext: ['DocuMind'],
  },
  {
    slug: 'action-item',
    name: 'ActionItem',
    category: 'domain',
    description: 'Checkbox row with assignee, due date, and status.',
    status: 'stable',
    saasContext: ['MeetingMind'],
  },
  {
    slug: 'email-triage-card',
    name: 'EmailTriageCard',
    category: 'domain',
    description: 'Email category, preview, and draft response.',
    status: 'stable',
    saasContext: ['InboxZero'],
  },
] as const;

export function entriesByCategory(category: Category): readonly RegistryEntry[] {
  return REGISTRY.filter((entry) => entry.category === category);
}

export function findEntry(category: Category, slug: string): RegistryEntry | undefined {
  return REGISTRY.find((entry) => entry.category === category && entry.slug === slug);
}

export function findEntryBySlug(slug: string): RegistryEntry | undefined {
  return REGISTRY.find((entry) => entry.slug === slug);
}

export function pathFor(entry: RegistryEntry): string {
  if (entry.category === 'getting-started') return `/docs/${entry.slug}`;
  return `/${entry.category}/${entry.slug}`;
}

---
'nyxis-ui': minor
---

Initial public release of `nyxis-ui` (v0.1.0).

**54 components** across four categories, all distributed as a real installable
npm package with per-component subpath exports, ESM-only output, preserved
`"use client"` directives, and full TypeScript declarations.

### Foundations

- Five-mode theming: `light`, `dark`, `dim`, `high-contrast`, `system`, all
  driven by a single `data-theme` attribute and OKLCH-based design tokens.
- FOUC-free initialisation script (`getThemeScript()`).
- View Transitions API for smooth theme cross-fade, with
  `prefers-reduced-motion` respected.
- `useTheme` hook works with or without a `ThemeProvider` (uses
  `useSyncExternalStore` to coordinate between Astro islands or other detached
  React trees).
- `<ThemeToggle>` dropdown with all five themes.

### Base UI components (24)

`Button`, `Input`, `Textarea`, `Label`, `Card`, `Badge`, `Avatar`, `Separator`,
`Skeleton`, `Dialog`, `Sheet`, `Drawer`, `Popover`, `Tooltip`, `Select`,
`Checkbox`, `Switch`, `RadioGroup`, `Form` (RHF + zod), `Tabs`, `Accordion`,
`Command`, `Combobox`, `Toast` (Sonner).

### Text animations (10)

`SplitText`, `TypeWriter`, `ScrambleText`, `DecryptText`, `GradientText`,
`ShinyText`, `CountUp`, `RevealText`, `MarqueeText`, `RotatingText`. All GSAP-
or CSS-powered, all honouring `prefers-reduced-motion`.

### Effect animations (8)

`MagneticButton`, `SpotlightCursor`, `ParallaxContainer`, `StaggerReveal`,
`TiltCard`, `AuroraBackground`, `DotGridBackground`, `MeshGradientBackground`.

### Domain patterns (12)

`ConfidenceBadge`, `SentimentIndicator`, `KPICard`, `CitationCard`,
`ChatMessage`, `ChatInput`, `ActionItem`, `AuditLogItem`, `LeadCard`,
`EmailTriageCard`, `FileDropzone`, `DataTable`. Designed for AI-product
workflows (RAG assistants, document intelligence, lead qualification, support
deflection, meeting intelligence, automated reporting, email triage).

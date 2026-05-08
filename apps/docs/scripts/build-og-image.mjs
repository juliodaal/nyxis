/**
 * Build the static OG image consumed by social cards.
 *
 * Renders an in-script SVG (1200×630) to PNG via @resvg/resvg-js and
 * writes it to `public/og-image.png`. Hooked into prebuild so the file
 * is fresh on every deploy and never goes stale relative to the design
 * tokens.
 *
 * If you want per-page OG images later, swap this for satori +
 * resvg and run it inside a registry walker.
 */
import { Resvg } from '@resvg/resvg-js';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { writeFileSync, readFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'public/og-image.png');

const pkg = JSON.parse(readFileSync(resolve(ROOT, '../../packages/ui/package.json'), 'utf8'));
const VERSION = pkg.version;

// Brand color: oklch(0.55 0.16 277) ≈ srgb(94, 106, 210) ≈ #5e6ad2
// Dark background:   oklch(0.14 0.012 275) ≈ #1c1d24
// Foreground:        oklch(0.96 0.005 275) ≈ #f3f3f5
// Muted-foreground:  oklch(0.65 0.015 275) ≈ #a1a1aa

const W = 1200;
const H = 630;

/** Generate a sparse dot grid as the background texture (DotWave-feel, static). */
function dotGrid() {
  const spacing = 28;
  const rows = Math.ceil(H / spacing) + 2;
  const cols = Math.ceil(W / spacing) + 2;
  const midRow = (rows - 1) / 2;
  const dots = [];
  for (let r = 0; r < rows; r += 1) {
    const dist = Math.abs(r - midRow) / midRow;
    const fade = Math.max(0, 1 - dist * 1.2);
    if (fade <= 0.05) continue;
    const alpha = (0.05 + fade * 0.18).toFixed(3);
    for (let c = 0; c < cols; c += 1) {
      const x = c * spacing - spacing;
      const y = r * spacing - spacing;
      dots.push(
        `<circle cx="${x}" cy="${y}" r="1.4" fill="#5e6ad2" fill-opacity="${alpha}"/>`,
      );
    }
  }
  return dots.join('\n');
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1c1d24"/>
      <stop offset="100%" stop-color="#15161c"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="55%" r="42%">
      <stop offset="0%" stop-color="#5e6ad2" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#5e6ad2" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Backplate -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Dot grid texture -->
  <g>${dotGrid()}</g>

  <!-- Soft brand glow -->
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Logo chip + wordmark, top-left -->
  <g transform="translate(80, 80)">
    <rect width="56" height="56" rx="12" fill="#5e6ad2"/>
    <text x="28" y="38" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
          font-size="32" font-weight="700" fill="#ffffff" text-anchor="middle">N</text>
    <text x="76" y="38" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
          font-size="28" font-weight="600" fill="#f3f3f5" letter-spacing="-0.5">Nyxis</text>
  </g>

  <!-- Version pill, top-right -->
  <g transform="translate(${W - 80}, 80)">
    <rect x="-128" y="0" width="128" height="40" rx="20"
          fill="#27272f" stroke="#3a3a45" stroke-width="1"/>
    <circle cx="-104" cy="20" r="3" fill="#5e6ad2"/>
    <text x="-90" y="26" font-family="ui-monospace, 'Geist Mono', monospace"
          font-size="14" font-weight="500" fill="#f3f3f5">v${VERSION}</text>
  </g>

  <!-- Centered headline + tagline -->
  <g transform="translate(80, 245)">
    <text x="0" y="0"
          font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
          font-size="92" font-weight="700" fill="#f3f3f5" letter-spacing="-2.4">
      The component toolkit
    </text>
    <text x="0" y="100"
          font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
          font-size="92" font-weight="700" fill="#5e6ad2" letter-spacing="-2.4">
      for AI products.
    </text>
    <text x="0" y="170"
          font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
          font-size="28" font-weight="400" fill="#a1a1aa" letter-spacing="-0.3">
      105+ copy-paste components. 5 frameworks. 5+ providers.
    </text>
  </g>

  <!-- Footer row: install command -->
  <g transform="translate(80, ${H - 80})">
    <rect x="0" y="-28" width="780" height="48" rx="8"
          fill="#27272f" stroke="#3a3a45" stroke-width="1"/>
    <text x="20" y="3" font-family="ui-monospace, 'Geist Mono', monospace"
          font-size="18" font-weight="500" fill="#5e6ad2">$</text>
    <text x="42" y="3" font-family="ui-monospace, 'Geist Mono', monospace"
          font-size="18" font-weight="500" fill="#f3f3f5">npx shadcn@latest add nyxisai.vercel.app/r/chat-thread.json</text>
  </g>

  <!-- Footer right: MIT badge -->
  <g transform="translate(${W - 80}, ${H - 80})">
    <rect x="-92" y="-28" width="92" height="48" rx="8"
          fill="transparent" stroke="#3a3a45" stroke-width="1"/>
    <text x="-46" y="3" font-family="system-ui, -apple-system, sans-serif"
          font-size="14" font-weight="600" fill="#a1a1aa" text-anchor="middle"
          letter-spacing="2">MIT · OSS</text>
  </g>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: W },
  font: {
    loadSystemFonts: true,
    defaultFontFamily: 'Arial',
  },
});
const pngBuffer = resvg.render().asPng();
writeFileSync(OUT, pngBuffer);
console.log(`✓ Wrote ${OUT} (${(pngBuffer.length / 1024).toFixed(1)} KB)`);

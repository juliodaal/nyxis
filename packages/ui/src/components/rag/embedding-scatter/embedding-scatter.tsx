'use client';

import { useMemo, useState, type HTMLAttributes, type MouseEvent as ReactMouseEvent } from 'react';

import { cn } from '../../../lib/utils.js';
import type { EmbeddingPoint } from '../../../ai/types.js';

export interface EmbeddingScatterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Pre-projected points (UMAP / t-SNE / PCA — anything 2D). */
  points: readonly EmbeddingPoint[];
  /** Currently active point id. */
  activeId?: string;
  /** Click handler. */
  onSelect?: (point: EmbeddingPoint) => void;
  /** SVG width in px. */
  width?: number;
  /** SVG height in px. */
  height?: number;
  /** Override the legend label rendered under the chart. */
  legendLabel?: string;
}

const PALETTE: readonly string[] = [
  '#6366f1', // indigo
  '#22c55e', // green
  '#f97316', // orange
  '#ec4899', // pink
  '#0ea5e9', // sky
  '#a855f7', // violet
  '#eab308', // yellow
  '#14b8a6', // teal
];

/**
 * 2D scatter of embedding projections — UMAP / t-SNE / PCA. Points
 * are coloured by `group`; the active one gets a ring; hover shows a
 * tooltip with label and group. Pure SVG, no canvas, no deps.
 */
export function EmbeddingScatter({
  points,
  activeId,
  onSelect,
  width = 480,
  height = 320,
  legendLabel,
  className,
  ...props
}: EmbeddingScatterProps) {
  const [hovered, setHovered] = useState<EmbeddingPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const { groups, color } = useMemo(() => {
    const set = Array.from(new Set(points.map((p) => p.group ?? '—')));
    const map = new Map<string, string>();
    set.forEach((g, i) => map.set(g, PALETTE[i % PALETTE.length]!));
    return { groups: set, color: map };
  }, [points]);

  const bounds = useMemo(() => {
    if (points.length === 0) {
      return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
    }
    return {
      minX: Math.min(...points.map((p) => p.x)),
      maxX: Math.max(...points.map((p) => p.x)),
      minY: Math.min(...points.map((p) => p.y)),
      maxY: Math.max(...points.map((p) => p.y)),
    };
  }, [points]);

  const padding = 16;
  const rangeX = bounds.maxX - bounds.minX || 1;
  const rangeY = bounds.maxY - bounds.minY || 1;

  const project = (p: EmbeddingPoint) => ({
    x: padding + ((p.x - bounds.minX) / rangeX) * (width - padding * 2),
    y: padding + (1 - (p.y - bounds.minY) / rangeY) * (height - padding * 2),
  });

  const handleEnter = (event: ReactMouseEvent<SVGCircleElement>, point: EmbeddingPoint) => {
    setHovered(point);
    const rect = (event.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
    setTooltipPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <div
      className={cn(
        'border-border bg-card relative overflow-hidden rounded-lg border p-3',
        className,
      )}
      {...props}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="bg-muted/20 block w-full rounded-md"
        role="img"
        aria-label={legendLabel ?? 'Embedding scatter'}
      >
        {points.map((p) => {
          const { x, y } = project(p);
          const isActive = p.id === activeId;
          const isHovered = hovered?.id === p.id;
          const fill = color.get(p.group ?? '—') ?? PALETTE[0]!;
          return (
            <circle
              key={p.id}
              cx={x}
              cy={y}
              r={isActive ? 6 : isHovered ? 5 : 3.5}
              fill={fill}
              fillOpacity={isHovered || isActive ? 1 : 0.75}
              stroke={isActive ? 'currentColor' : 'transparent'}
              strokeWidth={2}
              className="text-foreground cursor-pointer transition-all"
              onMouseEnter={(e) => handleEnter(e, p)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect?.(p)}
            />
          );
        })}
      </svg>

      {hovered && tooltipPos && (
        <div
          className="border-border bg-card text-foreground pointer-events-none absolute z-10 max-w-[16rem] rounded-md border px-2 py-1 text-[11px] shadow-md"
          style={{
            left: Math.min(tooltipPos.x + 12, width - 200),
            top: Math.max(tooltipPos.y - 32, 0),
          }}
        >
          <p className="truncate font-medium">{hovered.label ?? hovered.id}</p>
          {hovered.group && (
            <p className="text-muted-foreground inline-flex items-center gap-1 font-mono text-[10px]">
              <span
                className="inline-block size-2 rounded-full"
                style={{ background: color.get(hovered.group) }}
                aria-hidden
              />
              {hovered.group}
            </p>
          )}
        </div>
      )}

      {groups.length > 0 && (
        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
          {groups.map((g) => (
            <span key={g} className="inline-flex items-center gap-1">
              <span
                aria-hidden
                className="inline-block size-2 rounded-full"
                style={{ background: color.get(g) }}
              />
              <span className="font-mono">{g}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

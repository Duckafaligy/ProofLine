import { useRef, useState } from 'react';
import type { ClaimMilestone, ClaimStatus } from '../data/claims';
import { getStatusHex } from './StatusBadge';

interface ScrubberChartProps {
  milestones: ClaimMilestone[];
  status: ClaimStatus;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

const SVG_WIDTH = 720;
const SVG_HEIGHT = 240;
const PAD_LEFT = 46;
const PAD_RIGHT = 28;
const PAD_TOP = 24;
const PAD_BOTTOM = 34;

export function ScrubberChart({
  milestones,
  status,
  activeIndex,
  onSelectIndex,
}: ScrubberChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const accentHex = getStatusHex(status);
  const safeIndex = Math.max(0, Math.min(milestones.length - 1, activeIndex));
  const active = milestones[safeIndex];

  const maxEffect = Math.max(1.0, ...milestones.map((m) => m.effectSize * 1.18));
  const minEffect = 0;

  const plotW = SVG_WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = SVG_HEIGHT - PAD_TOP - PAD_BOTTOM;

  const points = milestones.map((m, i) => {
    const x =
      milestones.length === 1
        ? PAD_LEFT + plotW / 2
        : PAD_LEFT + (i / (milestones.length - 1)) * plotW;
    const ratio = (m.effectSize - minEffect) / (maxEffect - minEffect || 1);
    const y = PAD_TOP + plotH - ratio * plotH;
    return { x, y, milestone: m, index: i };
  });

  const linePath = points
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  const baselineY = PAD_TOP + plotH;
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baselineY} L ${points[0].x.toFixed(1)} ${baselineY} Z`
      : '';

  const activePoint = points[safeIndex];

  const scrubFromClientX = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg || points.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * SVG_WIDTH;

    let closestIdx = 0;
    let minDist = Infinity;
    for (const pt of points) {
      const dist = Math.abs(pt.x - relX);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = pt.index;
      }
    }
    onSelectIndex(closestIdx);
  };

  const yTicks = [0, maxEffect * 0.5, maxEffect];

  return (
    <div className="hairline-card rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-100 pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="text-xs font-medium text-zinc-500">
            Effect Size Trajectory · Hover or drag to scrub
          </div>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-3">
            <span
              className="font-mono-tabular text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: accentHex }}
            >
              {active.effectDisplay}
            </span>
            <span className="font-mono-tabular text-sm text-zinc-500">
              {active.year} · {active.label}
            </span>
          </div>
        </div>

        {/* Exact Milestone Telemetry */}
        <div className="flex gap-6 font-mono-tabular">
          <div>
            <div className="text-[11px] text-zinc-400">Sample (N)</div>
            <div className="text-sm font-semibold text-zinc-950">
              {active.sampleSize.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-zinc-400">Significance</div>
            <div className="text-sm font-semibold text-zinc-950">
              {active.pValueLabel}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-zinc-400">Std. Effect</div>
            <div className="text-sm font-semibold text-zinc-950">
              {active.effectSize.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* SVG Scrubber */}
      <div className="relative select-none rounded-xl bg-zinc-50/70 p-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="h-56 w-full cursor-crosshair touch-none overflow-visible sm:h-64"
          role="img"
          aria-label="Replication timeline effect size scrubber chart"
          onPointerDown={(e) => {
            setIsDragging(true);
            (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
            scrubFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (isDragging || e.pointerType === 'mouse') {
              scrubFromClientX(e.clientX);
            }
          }}
          onPointerUp={() => setIsDragging(false)}
          onPointerLeave={() => setIsDragging(false)}
        >
          <defs>
            <linearGradient id={`proofline-grad-${status}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentHex} stopOpacity="0.14" />
              <stop offset="100%" stopColor={accentHex} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {yTicks.map((val, idx) => {
            const ratio = (val - minEffect) / (maxEffect - minEffect || 1);
            const y = PAD_TOP + plotH - ratio * plotH;
            const isZero = idx === 0;
            return (
              <g key={idx}>
                <line
                  x1={PAD_LEFT}
                  y1={y}
                  x2={SVG_WIDTH - PAD_RIGHT}
                  y2={y}
                  stroke={isZero ? '#D4D4D8' : '#E4E4E7'}
                  strokeDasharray={isZero ? '4 4' : undefined}
                  strokeWidth={1}
                />
                <text
                  x={PAD_LEFT - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-zinc-400 font-mono-tabular text-[10px]"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          <text
            x={SVG_WIDTH - PAD_RIGHT}
            y={baselineY - 6}
            textAnchor="end"
            className="fill-zinc-400 font-mono-tabular text-[10px]"
          >
            Null Threshold (d = 0.00)
          </text>

          {areaPath && <path d={areaPath} fill={`url(#proofline-grad-${status})`} />}

          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={accentHex}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {activePoint && (
            <line
              x1={activePoint.x}
              y1={PAD_TOP}
              x2={activePoint.x}
              y2={baselineY}
              stroke="#71717A"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}

          {points.map((pt) => {
            const isActive = pt.index === safeIndex;
            return (
              <g key={pt.milestone.year}>
                {isActive && (
                  <circle cx={pt.x} cy={pt.y} r={10} fill={accentHex} fillOpacity={0.16} />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 5 : 3.5}
                  fill={isActive ? '#FFFFFF' : '#FAFAFA'}
                  stroke={accentHex}
                  strokeWidth={isActive ? 3 : 2}
                />
                <text
                  x={pt.x}
                  y={SVG_HEIGHT - 8}
                  textAnchor="middle"
                  className={`font-mono-tabular text-[11px] ${
                    isActive ? 'fill-zinc-950 font-semibold' : 'fill-zinc-400'
                  }`}
                >
                  {pt.milestone.year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Why the line moved */}
      <div className="mt-5 rounded-xl bg-zinc-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-900">
            Why the line moved · {active.study} ({active.year})
          </span>
          <span className="font-mono-tabular">
            Milestone {safeIndex + 1} of {milestones.length}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">
          {active.whyMoved}
        </p>
      </div>

      {/* Milestone Pills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {milestones.map((m, i) => {
          const isActive = i === safeIndex;
          return (
            <button
              key={m.year}
              type="button"
              onClick={() => onSelectIndex(i)}
              aria-pressed={isActive}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                isActive
                  ? 'border-zinc-950 bg-zinc-950 text-white'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950'
              }`}
            >
              <span className="font-mono-tabular font-semibold">{m.year}</span>{' '}
              <span className="opacity-80">· {m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

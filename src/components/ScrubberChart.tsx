import { useRef, useState, type KeyboardEvent } from 'react';
import type { ClaimMilestone, ClaimStatus } from '../data/claims';
import { formatSampleSize } from '../utils/stats';
import { getStatusHex } from '../utils/status';

interface ScrubberChartProps {
  milestones: ClaimMilestone[];
  status: ClaimStatus;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

const SVG_WIDTH = 720;
const SVG_HEIGHT = 244;
const PAD_LEFT = 48;
const PAD_RIGHT = 36;
const PAD_TOP = 24;
const PAD_BOTTOM = 36;

export function ScrubberChart({
  milestones,
  status,
  activeIndex,
  onSelectIndex,
}: ScrubberChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (milestones.length === 0) {
    return (
      <section
        aria-label="Effect size trajectory"
        className="hairline-card rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
      >
        <p className="text-sm text-zinc-600">
          No historical milestones recorded for this claim yet.
        </p>
      </section>
    );
  }

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
    if (rect.width <= 0) return;
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
    if (closestIdx !== safeIndex) {
      onSelectIndex(closestIdx);
    }
  };

  const handleSliderKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (milestones.length <= 1) return;
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        nextIndex = Math.max(0, safeIndex - 1);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        nextIndex = Math.min(milestones.length - 1, safeIndex + 1);
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = milestones.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    if (nextIndex !== safeIndex) {
      onSelectIndex(nextIndex);
    }
  };

  const yTicks = [0, maxEffect * 0.5, maxEffect];

  return (
    <section
      aria-label="Effect size trajectory scrubber"
      className="hairline-card rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-5 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <div className="text-xs font-medium text-zinc-600">
            Effect Size Trajectory (hover, drag, or use arrow keys to scrub)
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              className="font-mono-tabular text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: accentHex }}
            >
              {active.effectDisplay}
            </span>
            <span className="font-mono-tabular text-sm text-zinc-600">
              {active.year} &mdash; {active.label}
            </span>
          </div>
        </div>

        {/* Exact Milestone Telemetry */}
        <div className="flex flex-wrap gap-6 font-mono-tabular sm:gap-8">
          <div>
            <div className="text-xs font-medium text-zinc-500">Sample (N)</div>
            <div className="mt-0.5 text-sm font-semibold text-zinc-950">
              {formatSampleSize(active.sampleSize)}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-500">Significance</div>
            <div className="mt-0.5 text-sm font-semibold text-zinc-950">
              {active.pValueLabel}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-500">Std. Effect</div>
            <div className="mt-0.5 text-sm font-semibold text-zinc-950">
              {active.effectSize.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* SVG Scrubber */}
      <div className="relative select-none rounded-xl border border-zinc-100 bg-zinc-50/70 p-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          tabIndex={0}
          role="slider"
          aria-label="Replication timeline milestone scrubber"
          aria-valuemin={1}
          aria-valuemax={milestones.length}
          aria-valuenow={safeIndex + 1}
          aria-valuetext={`${active.year} ${active.label}, ${active.effectDisplay}, sample size ${formatSampleSize(active.sampleSize)}, ${active.pValueLabel}`}
          onKeyDown={handleSliderKeyDown}
          className="h-56 w-full cursor-crosshair touch-none overflow-visible rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 sm:h-64"
          onPointerDown={(e) => {
            setIsDragging(true);
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {
              // Ignore if pointer capture is unsupported in synthetic events
            }
            scrubFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (isDragging || e.pointerType === 'mouse') {
              scrubFromClientX(e.clientX);
            }
          }}
          onPointerUp={() => setIsDragging(false)}
          onPointerCancel={() => setIsDragging(false)}
          onLostPointerCapture={() => setIsDragging(false)}
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
                  x={PAD_LEFT - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-zinc-500 font-mono-tabular text-[11px]"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          <text
            x={SVG_WIDTH - PAD_RIGHT}
            y={baselineY - 8}
            textAnchor="end"
            className="fill-zinc-500 font-mono-tabular text-[11px]"
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
            <g
              aria-hidden="true"
              style={{
                transform: `translateX(${activePoint.x}px)`,
                transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <line
                x1={0}
                y1={PAD_TOP}
                x2={0}
                y2={baselineY}
                stroke="#71717A"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            </g>
          )}

          {points.map((pt) => {
            const isActive = pt.index === safeIndex;
            return (
              <g key={`${pt.milestone.year}-${pt.milestone.label}-${pt.index}`}>
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
                    isActive ? 'fill-zinc-950 font-semibold' : 'fill-zinc-500'
                  }`}
                >
                  {pt.milestone.year}
                </text>
              </g>
            );
          })}

          {activePoint && (
            <g
              aria-hidden="true"
              style={{
                transform: `translate(${activePoint.x}px, ${activePoint.y}px)`,
                transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <circle cx={0} cy={0} r={11} fill={accentHex} fillOpacity={0.16} />
              <circle
                cx={0}
                cy={0}
                r={5.5}
                fill="#FFFFFF"
                stroke={accentHex}
                strokeWidth={3}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Why the line moved */}
      <div className="mt-6 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
          <span className="font-semibold text-zinc-950">
            Why the line moved: {active.study} ({active.year})
          </span>
          <span className="font-mono-tabular font-medium text-zinc-600">
            Milestone {safeIndex + 1} of {milestones.length}
          </span>
        </div>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-zinc-700">
          {active.whyMoved}
        </p>
      </div>

      {/* Milestone Pills */}
      <div
        role="group"
        aria-label="Select historical milestone"
        className="mt-5 flex flex-wrap gap-2.5"
      >
        {milestones.map((m, i) => {
          const isActive = i === safeIndex;
          return (
            <button
              key={`${m.year}-${m.label}-${i}`}
              type="button"
              onClick={() => onSelectIndex(i)}
              aria-pressed={isActive}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 ${
                isActive
                  ? 'border-zinc-950 bg-zinc-950 text-white'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
              }`}
            >
              <span className="font-mono-tabular font-semibold">{m.year}</span>{' '}
              <span className={isActive ? 'text-zinc-200' : 'text-zinc-600'}>
                &mdash; {m.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

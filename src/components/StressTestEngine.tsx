import { RotateCcw, Sliders } from 'lucide-react';
import {
  computeStressTest,
  formatPValue,
  type ConfidenceLevel,
  type SignificanceVerdict,
} from '../utils/stats';

interface StressTestEngineProps {
  baselineEffect: number;
  sampleSize: number;
  biasTrimPercent: number;
  confidenceLevel: ConfidenceLevel;
  onChangeSampleSize: (n: number) => void;
  onChangeBiasTrim: (trim: number) => void;
  onChangeConfidence: (level: ConfidenceLevel) => void;
  onReset: () => void;
}

const VERDICT_STYLES: Record<
  SignificanceVerdict,
  { label: string; className: string; barHex: string }
> = {
  significant: {
    label: 'Statistically Significant',
    className: 'border-[#10B981]/30 bg-[#10B981]/15 text-[#10B981]',
    barHex: '#10B981',
  },
  borderline: {
    label: 'Borderline / Fragile',
    className: 'border-[#F59E0B]/30 bg-[#F59E0B]/15 text-[#F59E0B]',
    barHex: '#F59E0B',
  },
  null: {
    label: 'Null / Non-Significant',
    className: 'border-[#F43F5E]/30 bg-[#F43F5E]/15 text-[#F43F5E]',
    barHex: '#F43F5E',
  },
};

export function StressTestEngine({
  baselineEffect,
  sampleSize,
  biasTrimPercent,
  confidenceLevel,
  onChangeSampleSize,
  onChangeBiasTrim,
  onChangeConfidence,
  onReset,
}: StressTestEngineProps) {
  const result = computeStressTest({
    baselineEffect,
    sampleSize,
    biasTrimPercent,
    confidenceLevel,
  });

  const verdictStyle = VERDICT_STYLES[result.verdict];

  // Dynamic domain for the CI visualization bar so both small and large effects fit cleanly
  const domainMin = Math.min(-0.4, result.ciLower - 0.15);
  const domainMax = Math.max(1.5, result.ciUpper + 0.15);
  const span = domainMax - domainMin || 1;
  const toPercent = (val: number) =>
    Math.max(0, Math.min(100, ((val - domainMin) / span) * 100));

  const zeroPct = toPercent(0);
  const lowerPct = toPercent(result.ciLower);
  const upperPct = toPercent(result.ciUpper);
  const pointPct = toPercent(result.adjustedEffect);

  return (
    <section
      aria-label="Live Statistical Stress-Test Engine"
      className="hairline-card rounded-xl border border-white/[0.08] bg-[#13151A] p-4 sm:p-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2563EB]/15 text-[#2563EB]">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#F8FAFC]">
              Live Statistical Stress-Test Engine
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Stress-test effect survival under sample size &amp; publication bias
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${verdictStyle.className}`}
          >
            {verdictStyle.label}
          </span>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#1C1F26] px-2.5 py-1 text-xs font-medium text-[#94A3B8] transition-colors hover:border-white/20 hover:text-[#F8FAFC]"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      {/* 3 Interactive Controls */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {/* Slider 1: Sample Size N */}
        <div className="rounded-lg border border-white/[0.06] bg-[#1C1F26] p-3">
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="slider-sample-size"
              className="text-xs font-medium text-[#94A3B8]"
            >
              Sample Size (N)
            </label>
            <span className="font-mono-tabular text-sm font-bold text-[#F8FAFC]">
              {sampleSize.toLocaleString()}
            </span>
          </div>
          <input
            id="slider-sample-size"
            type="range"
            min={20}
            max={5000}
            step={10}
            value={sampleSize}
            onChange={(e) => onChangeSampleSize(Number(e.target.value))}
            className="proof-slider"
          />
          <div className="mt-1.5 flex justify-between font-mono-tabular text-[10px] text-[#94A3B8]">
            <span>20</span>
            <span>2,500</span>
            <span>5,000</span>
          </div>
        </div>

        {/* Slider 2: Publication Bias / Outlier Trim */}
        <div className="rounded-lg border border-white/[0.06] bg-[#1C1F26] p-3">
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="slider-bias-trim"
              className="text-xs font-medium text-[#94A3B8]"
            >
              Bias / Outlier Trim
            </label>
            <span className="font-mono-tabular text-sm font-bold text-[#F8FAFC]">
              {biasTrimPercent}%
            </span>
          </div>
          <input
            id="slider-bias-trim"
            type="range"
            min={0}
            max={30}
            step={1}
            value={biasTrimPercent}
            onChange={(e) => onChangeBiasTrim(Number(e.target.value))}
            className="proof-slider"
          />
          <div className="mt-1.5 flex justify-between font-mono-tabular text-[10px] text-[#94A3B8]">
            <span>0% (Raw)</span>
            <span>15%</span>
            <span>30% (Strict)</span>
          </div>
        </div>

        {/* Control 3: Confidence Level */}
        <div className="rounded-lg border border-white/[0.06] bg-[#1C1F26] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">
              Confidence Level
            </span>
            <span className="font-mono-tabular text-xs text-[#94A3B8]">
              z* = {result.zCritical.toFixed(2)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {([90, 95, 99] as ConfidenceLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onChangeConfidence(lvl)}
                aria-pressed={confidenceLevel === lvl}
                className={`rounded-md border py-1.5 font-mono-tabular text-xs font-semibold transition-colors ${
                  confidenceLevel === lvl
                    ? 'border-[#2563EB] bg-[#2563EB] text-white'
                    : 'border-white/[0.08] bg-[#13151A] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {lvl}%
              </button>
            ))}
          </div>
          <div className="mt-1.5 font-mono-tabular text-[10px] text-[#94A3B8]">
            α = {(1 - confidenceLevel / 100).toFixed(2)} two-tailed
          </div>
        </div>
      </div>

      {/* Live Confidence Interval Bar */}
      <div className="mt-4 rounded-lg border border-white/[0.06] bg-[#0B0C0E] p-3.5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-[#94A3B8]">
            {confidenceLevel}% Confidence Interval vs. Null Threshold (d = 0)
          </span>
          <span className="font-mono-tabular font-semibold text-[#F8FAFC]">
            [{result.ciLower.toFixed(3)}, {result.ciUpper.toFixed(3)}]
          </span>
        </div>

        <div className="relative h-8 w-full rounded-md bg-[#13151A] px-2">
          {/* Null 0.00 vertical marker */}
          <div
            className="absolute top-0 bottom-0 w-px border-l border-dashed border-white/40"
            style={{ left: `${zeroPct}%` }}
            title="Null Effect (0.00)"
          />
          <span
            className="absolute -bottom-0.5 -translate-x-1/2 font-mono-tabular text-[9px] text-[#94A3B8]"
            style={{ left: `${zeroPct}%` }}
          >
            0.00
          </span>

          {/* CI Whisker Span */}
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full transition-all duration-150"
            style={{
              left: `${lowerPct}%`,
              width: `${Math.max(1, upperPct - lowerPct)}%`,
              backgroundColor: verdictStyle.barHex,
              opacity: 0.45,
            }}
          />

          {/* CI Lower & Upper Caps */}
          <div
            className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full transition-all duration-150"
            style={{ left: `${lowerPct}%`, backgroundColor: verdictStyle.barHex }}
          />
          <div
            className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full transition-all duration-150"
            style={{ left: `${upperPct}%`, backgroundColor: verdictStyle.barHex }}
          />

          {/* Point Estimate Dot */}
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0B0C0E] shadow transition-all duration-150"
            style={{ left: `${pointPct}%`, backgroundColor: verdictStyle.barHex }}
          />
        </div>
      </div>

      {/* Computed Metrics Readout */}
      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div className="rounded-lg border border-white/[0.06] bg-[#1C1F26] px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-[#94A3B8]">
            Adj. Effect (d)
          </div>
          <div className="font-mono-tabular text-sm font-bold text-[#F8FAFC]">
            {result.adjustedEffect.toFixed(3)}
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-[#1C1F26] px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-[#94A3B8]">
            Standard Error
          </div>
          <div className="font-mono-tabular text-sm font-bold text-[#F8FAFC]">
            {result.standardError.toFixed(4)}
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-[#1C1F26] px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-[#94A3B8]">
            Z-Score
          </div>
          <div className="font-mono-tabular text-sm font-bold text-[#F8FAFC]">
            {result.zScore.toFixed(2)}
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-[#1C1F26] px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-[#94A3B8]">
            Two-Tailed P
          </div>
          <div
            className="font-mono-tabular text-sm font-bold"
            style={{ color: verdictStyle.barHex }}
          >
            {formatPValue(result.pValue)}
          </div>
        </div>
      </div>
    </section>
  );
}

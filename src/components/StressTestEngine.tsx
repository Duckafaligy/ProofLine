import { RotateCcw } from 'lucide-react';
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
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    barHex: '#16A34A',
  },
  borderline: {
    label: 'Borderline / Fragile',
    className: 'border-amber-200 bg-amber-50 text-amber-800',
    barHex: '#D97706',
  },
  null: {
    label: 'Null / Non-Significant',
    className: 'border-rose-200 bg-rose-50 text-rose-800',
    barHex: '#DC2626',
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
      className="hairline-card rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-5">
        <div>
          <h2 className="text-lg font-bold tracking-[-0.02em] text-zinc-950">
            Live Statistical Stress-Test Engine
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            Test whether an effect survives larger sample sizes and publication-bias trimming
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${verdictStyle.className}`}
          >
            {verdictStyle.label}
          </span>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-950"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      {/* 3 Interactive Controls */}
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <label htmlFor="slider-sample-size" className="text-xs font-semibold text-zinc-700">
              Sample Size (N)
            </label>
            <span className="font-mono-tabular text-sm font-bold text-zinc-950">
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
          <div className="mt-2 flex justify-between font-mono-tabular text-[11px] text-zinc-400">
            <span>20</span>
            <span>2,500</span>
            <span>5,000</span>
          </div>
        </div>

        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <label htmlFor="slider-bias-trim" className="text-xs font-semibold text-zinc-700">
              Bias / Outlier Trim
            </label>
            <span className="font-mono-tabular text-sm font-bold text-zinc-950">
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
          <div className="mt-2 flex justify-between font-mono-tabular text-[11px] text-zinc-400">
            <span>0% (Raw)</span>
            <span>15%</span>
            <span>30% (Strict)</span>
          </div>
        </div>

        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-700">Confidence Level</span>
            <span className="font-mono-tabular text-xs text-zinc-500">
              z* = {result.zCritical.toFixed(2)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {([90, 95, 99] as ConfidenceLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onChangeConfidence(lvl)}
                aria-pressed={confidenceLevel === lvl}
                className={`rounded-lg border py-1.5 font-mono-tabular text-xs font-semibold transition-colors ${
                  confidenceLevel === lvl
                    ? 'border-zinc-950 bg-zinc-950 text-white'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950'
                }`}
              >
                {lvl}%
              </button>
            ))}
          </div>
          <div className="mt-2 font-mono-tabular text-[11px] text-zinc-400">
            α = {(1 - confidenceLevel / 100).toFixed(2)} two-tailed
          </div>
        </div>
      </div>

      {/* Live Confidence Interval Bar */}
      <div className="mt-6 rounded-xl bg-zinc-50 p-4">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-600">
            {confidenceLevel}% Confidence Interval vs. Null Threshold (d = 0)
          </span>
          <span className="font-mono-tabular font-semibold text-zinc-950">
            [{result.ciLower.toFixed(3)}, {result.ciUpper.toFixed(3)}]
          </span>
        </div>

        <div className="relative h-8 w-full rounded-lg border border-zinc-200 bg-white px-2">
          <div
            className="absolute top-0 bottom-0 w-px border-l border-dashed border-zinc-400"
            style={{ left: `${zeroPct}%` }}
            title="Null Effect (0.00)"
          />
          <span
            className="absolute -bottom-0.5 -translate-x-1/2 font-mono-tabular text-[9px] text-zinc-400"
            style={{ left: `${zeroPct}%` }}
          >
            0.00
          </span>

          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full transition-all duration-150"
            style={{
              left: `${lowerPct}%`,
              width: `${Math.max(1, upperPct - lowerPct)}%`,
              backgroundColor: verdictStyle.barHex,
              opacity: 0.35,
            }}
          />

          <div
            className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full transition-all duration-150"
            style={{ left: `${lowerPct}%`, backgroundColor: verdictStyle.barHex }}
          />
          <div
            className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full transition-all duration-150"
            style={{ left: `${upperPct}%`, backgroundColor: verdictStyle.barHex }}
          />

          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-xs transition-all duration-150"
            style={{ left: `${pointPct}%`, backgroundColor: verdictStyle.barHex }}
          />
        </div>
      </div>

      {/* Computed Metrics */}
      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-100 pt-5 sm:grid-cols-4">
        <div>
          <div className="text-xs text-zinc-500">Adj. Effect (d)</div>
          <div className="mt-0.5 font-mono-tabular text-lg font-bold text-zinc-950">
            {result.adjustedEffect.toFixed(3)}
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">Standard Error</div>
          <div className="mt-0.5 font-mono-tabular text-lg font-bold text-zinc-950">
            {result.standardError.toFixed(4)}
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">Z-Score</div>
          <div className="mt-0.5 font-mono-tabular text-lg font-bold text-zinc-950">
            {result.zScore.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">Two-Tailed P</div>
          <div
            className="mt-0.5 font-mono-tabular text-lg font-bold"
            style={{ color: verdictStyle.barHex }}
          >
            {formatPValue(result.pValue)}
          </div>
        </div>
      </div>
    </section>
  );
}

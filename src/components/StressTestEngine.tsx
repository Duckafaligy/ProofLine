import { RotateCcw } from 'lucide-react';
import {
  computeStressTest,
  formatPValue,
  formatSampleSize,
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
    className: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    barHex: '#15803D',
  },
  borderline: {
    label: 'Borderline / Fragile',
    className: 'border-amber-200 bg-amber-50 text-amber-900',
    barHex: '#B45309',
  },
  null: {
    label: 'Null / Non-Significant',
    className: 'border-rose-200 bg-rose-50 text-rose-900',
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
      aria-labelledby="stress-test-heading"
      className="hairline-card rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="min-w-0">
          <h2
            id="stress-test-heading"
            className="text-balance text-lg font-bold tracking-[-0.02em] text-zinc-950"
          >
            Live Statistical Stress-Test Engine
          </h2>
          <p className="mt-1 text-pretty text-sm text-zinc-600">
            Test whether an effect survives larger sample sizes and publication-bias trimming
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span
            role="status"
            aria-live="polite"
            className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${verdictStyle.className}`}
          >
            {verdictStyle.label}
          </span>
          <button
            type="button"
            onClick={onReset}
            aria-label="Reset stress-test parameters to claim defaults"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1 text-xs font-medium text-zinc-700 transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-400 hover:text-zinc-950 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {/* 3 Interactive Controls */}
      <div className="mt-7 grid gap-7 sm:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <label
              htmlFor="slider-sample-size"
              className="text-xs font-semibold text-zinc-700"
            >
              Sample Size (N)
            </label>
            <span className="font-mono-tabular text-sm font-bold text-zinc-950">
              {formatSampleSize(sampleSize)}
            </span>
          </div>
          <input
            id="slider-sample-size"
            type="range"
            min={20}
            max={5000}
            step={10}
            value={sampleSize}
            aria-valuetext={`${formatSampleSize(sampleSize)} participants`}
            onChange={(e) => onChangeSampleSize(Number(e.target.value))}
            className="proof-slider"
          />
          <div className="mt-2.5 flex justify-between font-mono-tabular text-xs text-zinc-500">
            <span>20</span>
            <span>2,500</span>
            <span>5,000</span>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <label
              htmlFor="slider-bias-trim"
              className="text-xs font-semibold text-zinc-700"
            >
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
            aria-valuetext={`${biasTrimPercent} percent publication-bias trim`}
            onChange={(e) => onChangeBiasTrim(Number(e.target.value))}
            className="proof-slider"
          />
          <div className="mt-2.5 flex justify-between font-mono-tabular text-xs text-zinc-500">
            <span>0% Raw</span>
            <span>15%</span>
            <span>30% Strict</span>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <span
              id="confidence-level-label"
              className="text-xs font-semibold text-zinc-700"
            >
              Confidence Level
            </span>
            <span className="font-mono-tabular text-xs font-medium text-zinc-600">
              z* = {result.zCritical.toFixed(2)}
            </span>
          </div>
          <div
            role="group"
            aria-labelledby="confidence-level-label"
            className="grid grid-cols-3 gap-2"
          >
            {([90, 95, 99] as ConfidenceLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onChangeConfidence(lvl)}
                aria-pressed={confidenceLevel === lvl}
                className={`rounded-lg border py-1.5 font-mono-tabular text-xs font-semibold transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 ${
                  confidenceLevel === lvl
                    ? 'border-zinc-950 bg-zinc-950 text-white'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
                }`}
              >
                {lvl}%
              </button>
            ))}
          </div>
          <div className="mt-2.5 font-mono-tabular text-xs text-zinc-500">
            &alpha; = {(1 - confidenceLevel / 100).toFixed(2)} two-tailed
          </div>
        </div>
      </div>

      {/* Live Confidence Interval Bar */}
      <div className="mt-7 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-5">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-medium text-zinc-700">
            {confidenceLevel}% Confidence Interval vs. Null Threshold (d = 0)
          </span>
          <span className="font-mono-tabular font-semibold text-zinc-950">
            [{result.ciLower.toFixed(3)}, {result.ciUpper.toFixed(3)}]
          </span>
        </div>

        <div
          role="img"
          aria-label={`${confidenceLevel} percent confidence interval spans ${result.ciLower.toFixed(3)} to ${result.ciUpper.toFixed(3)}, point estimate ${result.adjustedEffect.toFixed(3)}, ${verdictStyle.label}`}
        >
          <div className="relative h-9 w-full rounded-lg border border-zinc-200 bg-white px-2">
            <div
              className="absolute bottom-0 top-0 w-px border-l border-dashed border-zinc-400"
              style={{ left: `${zeroPct}%` }}
              title="Null Effect (0.00)"
            />

            <div
              className="ease-editorial absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full transition-[left,width,background-color,opacity] duration-200"
              style={{
                left: `${lowerPct}%`,
                width: `${Math.max(1, upperPct - lowerPct)}%`,
                backgroundColor: verdictStyle.barHex,
                opacity: 0.35,
              }}
            />

            <div
              className="ease-editorial absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full transition-[left,background-color] duration-200"
              style={{ left: `${lowerPct}%`, backgroundColor: verdictStyle.barHex }}
            />
            <div
              className="ease-editorial absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full transition-[left,background-color] duration-200"
              style={{ left: `${upperPct}%`, backgroundColor: verdictStyle.barHex }}
            />

            <div
              className="ease-editorial absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-xs transition-[left,background-color] duration-200"
              style={{ left: `${pointPct}%`, backgroundColor: verdictStyle.barHex }}
            />
          </div>

          <div className="relative mt-2 h-4 w-full">
            <span
              className="absolute -translate-x-1/2 font-mono-tabular text-[11px] font-medium text-zinc-500"
              style={{ left: `${zeroPct}%` }}
            >
              0.00 null
            </span>
          </div>
        </div>
      </div>

      {/* Computed Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-6 border-t border-zinc-100 pt-6 sm:grid-cols-4">
        <div>
          <div className="text-xs font-medium text-zinc-600">Adj. Effect (d)</div>
          <div className="mt-1 font-mono-tabular text-lg font-bold text-zinc-950">
            {result.adjustedEffect.toFixed(3)}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-600">Standard Error</div>
          <div className="mt-1 font-mono-tabular text-lg font-bold text-zinc-950">
            {result.standardError.toFixed(4)}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-600">Z-Score</div>
          <div className="mt-1 font-mono-tabular text-lg font-bold text-zinc-950">
            {result.zScore.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-600">Two-Tailed P</div>
          <div
            className="mt-1 font-mono-tabular text-lg font-bold"
            style={{ color: verdictStyle.barHex }}
          >
            {formatPValue(result.pValue)}
          </div>
        </div>
      </div>
    </section>
  );
}

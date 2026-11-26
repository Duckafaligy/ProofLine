export type ConfidenceLevel = 90 | 95 | 99;

export type SignificanceVerdict = 'significant' | 'borderline' | 'null';

export interface StressTestInput {
  /** Baseline standardized effect size (e.g., Cohen's d) */
  baselineEffect: number;
  /** Total sample size N (20 to 5,000) */
  sampleSize: number;
  /** Publication bias / outlier trim percentage (0 to 30) */
  biasTrimPercent: number;
  /** Confidence level (90, 95, or 99) */
  confidenceLevel: ConfidenceLevel;
}

export interface StressTestResult {
  adjustedEffect: number;
  standardError: number;
  ciLower: number;
  ciUpper: number;
  zScore: number;
  pValue: number;
  alpha: number;
  zCritical: number;
  verdict: SignificanceVerdict;
}

/**
 * Error function approximation (Abramowitz & Stegun 7.1.26, max error < 1.5e-7).
 */
export function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * absX);
  const y =
    1.0 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
      Math.exp(-absX * absX);

  return sign * y;
}

/**
 * Standard normal cumulative distribution function Phi(z).
 */
export function normalCdf(z: number): number {
  return 0.5 * (1.0 + erf(z / Math.SQRT2));
}

/**
 * Two-tailed p-value from a Z-score using the standard normal distribution.
 */
export function twoTailedPValue(z: number): number {
  const p = 2.0 * (1.0 - normalCdf(Math.abs(z)));
  return Math.max(0, Math.min(1, p));
}

/**
 * Exact two-tailed critical Z-value for 90%, 95%, and 99% confidence levels.
 */
export function zCriticalForConfidence(level: ConfidenceLevel): number {
  switch (level) {
    case 90:
      return 1.6448536;
    case 95:
      return 1.959964;
    case 99:
      return 2.5758293;
  }
}

/**
 * Computes real-time Standard Error, Confidence Interval, Z-score,
 * two-tailed p-value, and Significance Verdict for a given effect & N.
 */
export function computeStressTest(input: StressTestInput): StressTestResult {
  const n = Math.max(20, Math.min(5000, input.sampleSize));
  const trimFraction = Math.max(0, Math.min(0.3, input.biasTrimPercent / 100));

  // Attenuate effect size by publication bias / outlier trim
  const adjustedEffect = input.baselineEffect * (1 - trimFraction);

  // Effective sample size decreases slightly when outliers are trimmed
  const effectiveN = Math.max(10, n * (1 - trimFraction * 0.5));

  // Two-group standardized mean difference SE: sqrt(4/N + d^2 / (2N))
  const standardError = Math.sqrt(
    4 / effectiveN + (adjustedEffect * adjustedEffect) / (2 * effectiveN)
  );

  const zCritical = zCriticalForConfidence(input.confidenceLevel);
  const alpha = 1 - input.confidenceLevel / 100;

  const zScore = standardError > 0 ? adjustedEffect / standardError : 0;
  const pValue = twoTailedPValue(zScore);

  const margin = zCritical * standardError;
  const ciLower = adjustedEffect - margin;
  const ciUpper = adjustedEffect + margin;

  let verdict: SignificanceVerdict = 'null';
  if (pValue < alpha && ciLower > 0) {
    verdict = 'significant';
  } else if (pValue < 0.1) {
    verdict = 'borderline';
  }

  return {
    adjustedEffect,
    standardError,
    ciLower,
    ciUpper,
    zScore,
    pValue,
    alpha,
    zCritical,
    verdict,
  };
}

/**
 * Formats a p-value cleanly for scientific display.
 */
export function formatPValue(p: number): string {
  if (p < 0.0001) return 'p < 0.0001';
  if (p < 0.001) return `p = ${p.toFixed(4)}`;
  return `p = ${p.toFixed(3)}`;
}

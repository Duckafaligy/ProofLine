import { ArrowRight } from 'lucide-react';
import { CLAIMS_DATA, type ClaimCaseStudy } from '../data/claims';
import { formatSampleSize } from '../utils/stats';
import { getStatusHex } from '../utils/status';
import { StatusBadge } from './StatusBadge';

interface OverviewPageProps {
  onOpenLab: (claimId?: string) => void;
}

export function OverviewPage({ onOpenLab }: OverviewPageProps) {
  const featured = CLAIMS_DATA[0];

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 pb-24 pt-16 sm:pt-24">
      {/* Editorial Hero */}
      <section className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-mono-tabular text-xs font-medium tracking-wide text-zinc-500">
            STEM Innovation Challenge 2026 · Open Science Verification
          </p>

          <h1 className="mt-4 text-balance text-4xl font-bold tracking-[-0.04em] text-zinc-950 sm:text-6xl sm:leading-[1.04]">
            They published the headline. We check the math.
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-zinc-600">
            Viral science claims shift as sample sizes grow. Scrub across decades
            of replications, stress-test p-values and confidence intervals live,
            and audit every study before you cite it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="?view=lab"
              onClick={(e) => {
                e.preventDefault();
                onOpenLab();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
            >
              Open Stress-Test Lab
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <a
              href="?view=lab&claim=smoking-lung-cancer"
              onClick={(e) => {
                e.preventDefault();
                onOpenLab('smoking-lung-cancer');
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-zinc-700 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
            >
              Inspect Verified Control
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Hero Specimen Preview Card */}
        <div className="lg:col-span-5">
          <button
            type="button"
            onClick={() => onOpenLab(featured.id)}
            className="hairline-card group w-full rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6 text-left transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
                {featured.ticker} · Live Specimen
              </span>
              <StatusBadge status={featured.status} label={featured.statusLabel} />
            </div>

            <div className="mt-4 font-mono-tabular text-3xl font-bold tracking-tight text-zinc-950">
              0.72 → 0.04
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {featured.shortTitle} · 2010 (N=42) to 2018 (N=1,204)
            </p>

            {/* Mini Decay Curve SVG */}
            <div className="mt-5 rounded-xl border border-zinc-200/80 bg-white p-4">
              <svg viewBox="0 0 280 90" className="h-20 w-full" aria-hidden="true">
                <line
                  x1="8"
                  y1="74"
                  x2="272"
                  y2="74"
                  stroke="#E4E4E7"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <path
                  d="M12 16 C 72 18, 108 66, 152 70 C 196 73, 232 72, 268 72"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="16" r="4" fill="#16A34A" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="152" cy="70" r="4" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="268" cy="72" r="4" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" />
              </svg>
              <div className="mt-1 flex justify-between font-mono-tabular text-[11px] text-zinc-500">
                <span>2010 · p=0.045</span>
                <span>2015 · p=0.68</span>
                <span>2018 · Null</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-zinc-900">
              <span>Scrub this claim in the Lab</span>
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </button>
        </div>
      </section>

      {/* The Problem & Provenance Labels */}
      <section className="mt-24 border-t border-zinc-200 pt-16">
        <div className="max-w-2xl">
          <p className="font-mono-tabular text-xs font-medium uppercase tracking-wider text-zinc-500">
            The Problem
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-zinc-950 sm:text-3xl">
            Most viral science numbers are never checked again.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            A 42-person study sparks a viral headline, gets cited in textbooks,
            and stays there—even after pre-registered replications fail. Every
            claim in ProofLine wears a clear verification label, sample size, and
            source date.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-6">
            <StatusBadge status="verified" label="Verified" size="md" />
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Confirmed across decades of independent cohorts, dose-response
              curves, and large-scale meta-analyses (e.g., Smoking &amp; Lung Cancer).
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-6">
            <StatusBadge status="failed-replication" label="Failed Replication" size="md" />
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Original small-N finding collapsed when tested in high-powered,
              pre-registered replications (e.g., Power Posing, Mozart Effect).
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-6">
            <StatusBadge status="sources-differ" label="Sources Differ" size="md" />
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Published estimates diverge sharply due to measurement scope or
              subgroup effects (e.g., AI Prompt Water Scope 1 vs. Scope 2).
            </p>
          </div>
        </div>
      </section>

      {/* Clean Editorial Index List */}
      <section className="mt-24">
        <div className="flex items-baseline justify-between border-b border-zinc-200 pb-4">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-zinc-950">
            Tracked STEM Case Studies
          </h2>
          <span className="font-mono-tabular text-xs text-zinc-500">
            6 claims across 23 milestones
          </span>
        </div>

        <div className="divide-y divide-zinc-200">
          {CLAIMS_DATA.map((claim: ClaimCaseStudy) => {
            const first = claim.milestones[0];
            const last = claim.milestones[claim.milestones.length - 1];
            const hex = getStatusHex(claim.status);

            return (
              <a
                key={claim.id}
                href={`?view=lab&claim=${claim.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenLab(claim.id);
                }}
                className="group flex w-full flex-col justify-between gap-4 py-7 text-left transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-950 sm:flex-row sm:items-center sm:px-3"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
                      {claim.ticker}
                    </span>
                    <span className="text-xs text-zinc-300" aria-hidden="true">·</span>
                    <span className="text-xs font-medium text-zinc-600">
                      {claim.field}
                    </span>
                    <StatusBadge status={claim.status} label={claim.statusLabel} />
                  </div>

                  <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-zinc-950 group-hover:underline">
                    {claim.shortTitle}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-600">
                    {claim.summary}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-6">
                  <div className="text-right font-mono-tabular text-xs">
                    <div className="text-zinc-500">
                      {first.year} → {last.year} · N={formatSampleSize(last.sampleSize)}
                    </div>
                    <div className="mt-0.5 text-sm font-semibold">
                      <span className="text-zinc-600">{first.effectSize.toFixed(2)}</span>
                      <span className="mx-1.5 text-zinc-300" aria-hidden="true">→</span>
                      <span style={{ color: hex }}>{last.effectSize.toFixed(2)}</span>
                    </div>
                  </div>

                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="mt-20 grid gap-10 border-t border-zinc-200 pt-14 md:grid-cols-3">
        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-500">01</span>
          <h3 className="mt-2 text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Scrub the Evidence Timeline
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Drag across historical replications to see exact sample sizes, p-values,
            and why the scientific consensus moved.
          </p>
        </div>

        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-500">02</span>
          <h3 className="mt-2 text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Stress-Test N &amp; Bias Live
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Adjust Sample Size (20–5,000), Bias Trim (0%–30%), and Confidence Level
            to watch Normal CDF intervals update in real time.
          </p>
        </div>

        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-500">03</span>
          <h3 className="mt-2 text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Audit &amp; Listen Anywhere
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Use the 3-question citation checklist, Atkinson Hyperlegible mode, and
            Web Speech API audio summaries.
          </p>
        </div>
      </section>

      {/* Closing CTA Band */}
      <section className="mt-20 flex flex-col items-start justify-between gap-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-8 sm:flex-row sm:items-center sm:p-10">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-zinc-950">
            Don&apos;t just read the headline. Stress-test the proof.
          </h2>
          <p className="mt-1.5 text-sm text-zinc-600">
            100% client-side, zero API keys, built for classrooms and researchers.
          </p>
        </div>
        <a
          href="?view=lab"
          onClick={(e) => {
            e.preventDefault();
            onOpenLab();
          }}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
        >
          Launch Lab
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}

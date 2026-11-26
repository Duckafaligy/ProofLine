import { ArrowRight } from 'lucide-react';
import { CLAIMS_DATA, type ClaimCaseStudy } from '../data/claims';
import { StatusBadge, getStatusHex } from './StatusBadge';

interface OverviewPageProps {
  onOpenLab: (claimId?: string) => void;
}

export function OverviewPage({ onOpenLab }: OverviewPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-14 sm:pt-20">
      {/* Clean Editorial Hero */}
      <section className="max-w-3xl">
        <p className="font-mono-tabular text-xs font-medium uppercase tracking-widest text-zinc-500">
          STEM Innovation Challenge 2026 · Evidence &amp; Replication Lab
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-zinc-950 sm:text-6xl sm:leading-[1.06]">
          They published the headline. We check the math.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
          Scientific claims shift as sample sizes grow. Scrub across decades of
          replications, stress-test p-values and confidence intervals live, and
          audit every study before you cite it.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onOpenLab()}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
          >
            Open Stress-Test Lab
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onOpenLab('smoking-lung-cancer')}
            className="inline-flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-950"
          >
            Inspect Verified Control
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Clean Editorial Index List (Generous Spacing, Zero Clutter) */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between border-b border-zinc-200 pb-4">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-zinc-950">
            Tracked STEM Case Studies
          </h2>
          <span className="font-mono-tabular text-xs text-zinc-500">
            6 CLAIMS · 23 MILESTONES
          </span>
        </div>

        <div className="divide-y divide-zinc-200">
          {CLAIMS_DATA.map((claim: ClaimCaseStudy) => {
            const first = claim.milestones[0];
            const last = claim.milestones[claim.milestones.length - 1];
            const hex = getStatusHex(claim.status);

            return (
              <button
                key={claim.id}
                type="button"
                onClick={() => onOpenLab(claim.id)}
                className="group flex w-full flex-col justify-between gap-4 py-6 text-left transition-colors hover:bg-zinc-50/80 sm:flex-row sm:items-center sm:px-3"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono-tabular text-xs font-semibold text-zinc-400">
                      {claim.ticker}
                    </span>
                    <span className="text-xs text-zinc-400">·</span>
                    <span className="text-xs font-medium text-zinc-500">
                      {claim.field}
                    </span>
                    <StatusBadge status={claim.status} label={claim.statusLabel} />
                  </div>

                  <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-zinc-950 group-hover:underline">
                    {claim.shortTitle}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-sm text-zinc-600">
                    {claim.summary}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-6">
                  <div className="text-right font-mono-tabular text-xs">
                    <div className="text-zinc-400">
                      {first.year} → {last.year}
                    </div>
                    <div className="mt-0.5 text-sm font-semibold">
                      <span className="text-zinc-500">{first.effectSize.toFixed(2)}</span>
                      <span className="mx-1.5 text-zinc-300">→</span>
                      <span style={{ color: hex }}>{last.effectSize.toFixed(2)}</span>
                    </div>
                  </div>

                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Simple 3-Column How It Works (Direct on Surface, No Boxes) */}
      <section className="mt-20 grid gap-10 border-t border-zinc-200 pt-12 md:grid-cols-3">
        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-400">01</span>
          <h3 className="mt-2 text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Scrub the Evidence Timeline
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Drag across historical replications to see exact sample sizes, p-values,
            and why the scientific consensus moved.
          </p>
        </div>

        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-400">02</span>
          <h3 className="mt-2 text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Stress-Test N &amp; Bias Live
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Adjust Sample Size (20–5,000), Bias Trim (0%–30%), and Confidence Level
            to watch Normal CDF intervals update in real time.
          </p>
        </div>

        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-400">03</span>
          <h3 className="mt-2 text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Audit &amp; Listen Anywhere
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Use the 3-question citation checklist, Atkinson Hyperlegible mode, and
            Web Speech API audio summaries.
          </p>
        </div>
      </section>
    </main>
  );
}

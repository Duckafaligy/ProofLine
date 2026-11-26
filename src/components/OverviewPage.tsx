import type { MouseEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { CLAIMS_DATA, type ClaimCaseStudy } from '../data/claims';
import { getStatusHex } from '../utils/status';
import { StatusBadge } from './StatusBadge';

interface OverviewPageProps {
  onOpenLab: (claimId?: string) => void;
}

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export function OverviewPage({ onOpenLab }: OverviewPageProps) {
  const totalMilestones = CLAIMS_DATA.reduce(
    (sum, claim) => sum + claim.milestones.length,
    0
  );

  const handleOpenLabLink =
    (claimId?: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isPlainLeftClick(event)) return;
      event.preventDefault();
      onOpenLab(claimId);
    };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-5xl px-6 pb-28 pt-16 focus:outline-none sm:pt-24"
    >
      {/* Swiss Editorial Hero */}
      <section aria-labelledby="hero-heading" className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-zinc-500">
          <span>2026 STEM Innovation Challenge</span>
          <span aria-hidden="true" className="h-3.5 w-px bg-zinc-300" />
          <span>Evidence &amp; Replication Lab</span>
        </div>

        <h1
          id="hero-heading"
          className="mt-5 text-balance text-4xl font-bold tracking-[-0.04em] text-zinc-950 sm:text-6xl sm:leading-[1.06]"
        >
          They published the headline. We check the math.
        </h1>

        <p className="mt-6 max-w-[60ch] text-pretty text-lg leading-relaxed text-zinc-600">
          Scientific claims shift as sample sizes grow. Scrub across decades of
          replications, stress-test p-values and confidence intervals live, and
          audit every study before you cite it.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-5">
          <a
            href="?view=lab"
            onClick={handleOpenLabLink()}
            className="group inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          >
            Open Stress-Test Lab
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
            />
          </a>

          <a
            href="?view=lab&claim=smoking-lung-cancer"
            onClick={handleOpenLabLink('smoking-lung-cancer')}
            className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-zinc-700 transition-[color,background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          >
            Inspect Verified Control
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </section>

      {/* Clean Editorial Index List */}
      <section aria-labelledby="case-studies-heading" className="mt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-200 pb-4">
          <h2
            id="case-studies-heading"
            className="text-balance text-xl font-bold tracking-[-0.02em] text-zinc-950"
          >
            Tracked STEM Case Studies
          </h2>
          <span className="font-mono-tabular text-xs font-medium text-zinc-500">
            {CLAIMS_DATA.length} claims across {totalMilestones} milestones
          </span>
        </div>

        <ul className="divide-y divide-zinc-200">
          {CLAIMS_DATA.map((claim: ClaimCaseStudy) => {
            const first = claim.milestones[0];
            const last = claim.milestones[claim.milestones.length - 1];
            const hex = getStatusHex(claim.status);

            return (
              <li key={claim.id}>
                <a
                  href={`?view=lab&claim=${encodeURIComponent(claim.id)}`}
                  onClick={handleOpenLabLink(claim.id)}
                  aria-label={`Inspect ${claim.shortTitle} (${claim.statusLabel}): effect size shifted from ${first.effectSize.toFixed(2)} in ${first.year} to ${last.effectSize.toFixed(2)} in ${last.year}`}
                  className="group flex w-full flex-col justify-between gap-5 rounded-xl py-7 text-left transition-[background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-50/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:px-4"
                >
                  <div className="min-w-0 flex-1 sm:pr-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        translate="no"
                        className="font-mono-tabular text-xs font-semibold text-zinc-500"
                      >
                        {claim.ticker}
                      </span>
                      <span className="text-xs font-medium text-zinc-600">
                        {claim.field}
                      </span>
                      <StatusBadge
                        status={claim.status}
                        label={claim.statusLabel}
                      />
                    </div>

                    <h3 className="mt-2.5 text-lg font-semibold tracking-[-0.02em] text-zinc-950 group-hover:underline group-hover:underline-offset-4">
                      {claim.shortTitle}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 max-w-[65ch] text-pretty text-sm leading-relaxed text-zinc-600">
                      {claim.summary}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-6 sm:justify-end">
                    <div className="text-left font-mono-tabular text-xs sm:text-right">
                      <div className="text-zinc-500">
                        {first.year}&ndash;{last.year}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold sm:justify-end">
                        <span className="text-zinc-600">
                          {first.effectSize.toFixed(2)}
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className="h-3 w-3 text-zinc-400"
                        />
                        <span style={{ color: hex }}>
                          {last.effectSize.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 3-Step Sequential Method */}
      <section
        aria-label="How ProofLine works"
        className="mt-24 grid gap-10 border-t border-zinc-200 pt-14 md:grid-cols-3 md:gap-12"
      >
        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
            01
          </span>
          <h3 className="mt-2.5 text-balance text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Scrub the Evidence Timeline
          </h3>
          <p className="mt-2.5 text-pretty text-sm leading-relaxed text-zinc-600">
            Drag across historical replications to see exact sample sizes,
            p-values, and why the scientific consensus moved.
          </p>
        </div>

        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
            02
          </span>
          <h3 className="mt-2.5 text-balance text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Stress-Test N &amp; Bias Live
          </h3>
          <p className="mt-2.5 text-pretty text-sm leading-relaxed text-zinc-600">
            Adjust Sample Size (20&ndash;5,000), Bias Trim (0%&ndash;30%), and
            Confidence Level to watch Normal CDF intervals update in real time.
          </p>
        </div>

        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
            03
          </span>
          <h3 className="mt-2.5 text-balance text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Audit &amp; Listen Anywhere
          </h3>
          <p className="mt-2.5 text-pretty text-sm leading-relaxed text-zinc-600">
            Use the 3-question citation checklist, Atkinson Hyperlegible mode,
            and Web Speech API audio summaries.
          </p>
        </div>
      </section>
    </main>
  );
}

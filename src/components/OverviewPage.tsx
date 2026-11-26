import { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { CLAIMS_DATA, type ClaimCaseStudy, type ClaimStatus } from '../data/claims';
import { formatSampleSize } from '../utils/stats';
import { getStatusHex } from '../utils/status';
import { StatusBadge } from './StatusBadge';

interface OverviewPageProps {
  onOpenLab: (claimId?: string) => void;
}

type FilterStatus = 'all' | ClaimStatus;

const FAQ_ITEMS = [
  {
    q: 'How does the Live Stress-Test Engine calculate p-values and confidence intervals?',
    a: 'It runs a zero-dependency two-group standardized effect-size model (Cohen’s d) using the Abramowitz & Stegun Normal CDF approximation (error < 1.5e-7). Adjusting Sample Size (N), Publication Bias Trim (0–30%), and Confidence Level (90%/95%/99%) updates Standard Error, Z-score, and CI bounds in real time.',
  },
  {
    q: 'Are all six case studies based on real peer-reviewed papers?',
    a: 'Yes. Every study year, sample size (N), effect size, and replication verdict is sourced from published journals including Nature, Psychological Science, Psychological Bulletin, BMJ, CMAJ, and the Cochrane Library.',
  },
  {
    q: 'How does ProofLine improve STEM accessibility?',
    a: 'One click activates Atkinson Hyperlegible typography, wider line height and letter spacing, and high-contrast borders. Every claim also includes studio-grade neural audio summaries so visually impaired or auditory learners can review the evidence hands-free.',
  },
];

export function OverviewPage({ onOpenLab }: OverviewPageProps) {
  const featured = CLAIMS_DATA[0];
  const [heroStep, setHeroStep] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const heroMilestone = featured.milestones[heroStep] ?? featured.milestones[0];
  const filteredClaims =
    statusFilter === 'all'
      ? CLAIMS_DATA
      : CLAIMS_DATA.filter((c) => c.status === statusFilter);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 pb-24 pt-14 sm:pt-20">
      {/* 1. Split Hero + Interactive Specimen */}
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
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-400 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
            >
              Inspect Verified Control
            </a>
          </div>
        </div>

        {/* Interactive Hero Specimen Card */}
        <div className="lg:col-span-5">
          <div className="hairline-card rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
                {featured.ticker} · Interactive Preview
              </span>
              <StatusBadge status={featured.status} label={featured.statusLabel} />
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="font-mono-tabular text-3xl font-bold tracking-tight text-zinc-950">
                {heroMilestone.effectDisplay}
              </div>
              <div className="font-mono-tabular text-xs text-zinc-500">
                N = {formatSampleSize(heroMilestone.sampleSize)} · {heroMilestone.pValueLabel}
              </div>
            </div>
            <p className="mt-1.5 text-xs text-zinc-600">
              {heroMilestone.study} ({heroMilestone.year})
            </p>

            {/* Mini Decay Curve */}
            <div className="mt-5 rounded-xl border border-zinc-200/80 bg-white p-4">
              <svg viewBox="0 0 280 86" className="h-20 w-full" aria-hidden="true">
                <line
                  x1="8"
                  y1="72"
                  x2="272"
                  y2="72"
                  stroke="#E4E4E7"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <path
                  d="M14 14 C 72 18, 108 64, 152 68 C 196 71, 232 70, 266 70"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {[
                  { x: 14, y: 14 },
                  { x: 102, y: 66 },
                  { x: 184, y: 69 },
                  { x: 266, y: 70 },
                ].map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={heroStep === idx ? 5.5 : 3.5}
                    fill={heroStep === idx ? '#09090B' : '#FFFFFF'}
                    stroke="#DC2626"
                    strokeWidth={2}
                  />
                ))}
              </svg>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {featured.milestones.map((m, idx) => (
                  <button
                    key={m.year}
                    type="button"
                    onClick={() => setHeroStep(idx)}
                    className={`rounded-md py-1 font-mono-tabular text-[11px] font-semibold transition-colors ${
                      heroStep === idx
                        ? 'bg-zinc-950 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {m.year}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenLab(featured.id)}
              className="mt-4 flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 transition-colors hover:border-zinc-400"
            >
              <span>Open full stress-test in Lab</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Peer-Reviewed Sources Strip */}
      <section className="mt-20 border-y border-zinc-200 py-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <span className="font-mono-tabular text-xs font-medium uppercase tracking-wider text-zinc-400">
            Data Sourced From
          </span>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold tracking-tight text-zinc-500">
            <span>Nature</span>
            <span>Psychological Science</span>
            <span>Cochrane Library</span>
            <span>BMJ</span>
            <span>Psychological Bulletin</span>
            <span>IEA · UC Riverside</span>
          </div>
        </div>
      </section>

      {/* 3. Open-Source Visual Story: Why Viral Science Breaks */}
      <section className="mt-24 grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="grid grid-cols-2 gap-4">
            <figure className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
              <img
                src="/images/lab-research.jpg"
                alt="Researchers collaborating in a scientific laboratory"
                className="h-56 w-full object-cover"
                loading="lazy"
              />
              <figcaption className="border-t border-zinc-200 bg-white px-3.5 py-2.5 font-mono-tabular text-[11px] text-zinc-500">
                Primary Lab Trials (CC BY-SA)
              </figcaption>
            </figure>
            <figure className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
              <img
                src="/images/microscope-audit.jpg"
                alt="Scientist inspecting a specimen through a laboratory microscope"
                className="h-56 w-full object-cover"
                loading="lazy"
              />
              <figcaption className="border-t border-zinc-200 bg-white px-3.5 py-2.5 font-mono-tabular text-[11px] text-zinc-500">
                Replication Audit (CC BY-SA)
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="lg:col-span-6">
          <p className="font-mono-tabular text-xs font-medium uppercase tracking-wider text-zinc-500">
            The Replication Gap
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-zinc-950 sm:text-4xl">
            A 42-person study shouldn&apos;t define a decade of textbooks.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Small-sample studies produce noisy, inflated effects that look
            dramatic in headlines. When independent labs rerun the same protocol
            at 5x to 50x the sample size, the effect often vanishes—or splits
            across measurement boundaries.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-zinc-200 pt-6">
            <div>
              <div className="font-mono-tabular text-2xl font-bold text-zinc-950">6</div>
              <div className="mt-1 text-xs text-zinc-500">Curated STEM Claims</div>
            </div>
            <div>
              <div className="font-mono-tabular text-2xl font-bold text-zinc-950">23</div>
              <div className="mt-1 text-xs text-zinc-500">Peer-Reviewed Stops</div>
            </div>
            <div>
              <div className="font-mono-tabular text-2xl font-bold text-zinc-950">165k+</div>
              <div className="mt-1 text-xs text-zinc-500">Subjects Pooled</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Provenance Label System */}
      <section className="mt-24 border-t border-zinc-200 pt-16">
        <div className="max-w-2xl">
          <p className="font-mono-tabular text-xs font-medium uppercase tracking-wider text-zinc-500">
            Provenance Labels
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-zinc-950 sm:text-3xl">
            Every number wears a source, a sample size, and a verdict.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6">
            <StatusBadge status="verified" label="Verified" size="md" />
            <h3 className="mt-4 text-base font-semibold text-zinc-950">
              Consistent Across Scale
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Confirmed across independent cohorts, dose-response curves, and
              large-scale meta-analyses (e.g., Smoking &amp; Lung Cancer).
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6">
            <StatusBadge status="failed-replication" label="Failed Replication" size="md" />
            <h3 className="mt-4 text-base font-semibold text-zinc-950">
              Collapsed at High N
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Original small-N finding disappeared when tested in high-powered,
              pre-registered replications (e.g., Power Posing, Mozart Effect).
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6">
            <StatusBadge status="sources-differ" label="Sources Differ" size="md" />
            <h3 className="mt-4 text-base font-semibold text-zinc-950">
              Scope or Subgroup Split
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Published estimates diverge sharply due to measurement scope or
              subgroup effects (e.g., AI Prompt Water Scope 1 vs. Scope 2).
            </p>
          </div>
        </div>
      </section>

      {/* 5. Filterable Editorial Index Table */}
      <section className="mt-24">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em] text-zinc-950">
              Tracked STEM Case Studies
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Click any claim to scrub its timeline and run a live stress test.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'all', label: 'All (6)' },
                { id: 'verified', label: 'Verified' },
                { id: 'failed-replication', label: 'Failed Replication' },
                { id: 'sources-differ', label: 'Sources Differ' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === f.id
                    ? 'border-zinc-950 bg-zinc-950 text-white'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-zinc-200">
          {filteredClaims.map((claim: ClaimCaseStudy) => {
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

      {/* 6. How It Works */}
      <section className="mt-20 grid gap-10 border-t border-zinc-200 pt-14 md:grid-cols-4">
        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-500">01</span>
          <h3 className="mt-2 text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Trace Provenance
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Follow any viral number back to its primary study, sample cohort, and
            later meta-analyses.
          </p>
        </div>

        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-500">02</span>
          <h3 className="mt-2 text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Scrub the Timeline
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Drag across publication years to inspect exact sample sizes, p-values,
            and why the consensus moved.
          </p>
        </div>

        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-500">03</span>
          <h3 className="mt-2 text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Stress-Test N &amp; Bias
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Adjust Sample Size (20–5,000) and Bias Trim (0%–30%) to watch Normal
            CDF intervals update live.
          </p>
        </div>

        <div>
          <span className="font-mono-tabular text-xs font-semibold text-zinc-500">04</span>
          <h3 className="mt-2 text-base font-semibold tracking-[-0.01em] text-zinc-950">
            Audit &amp; Listen
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Complete the 3-question citation checklist, toggle Hyperlegible mode,
            or play Neural Audio Summaries.
          </p>
        </div>
      </section>

      {/* 7. Methodology FAQ */}
      <section className="mt-24 border-t border-zinc-200 pt-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono-tabular text-xs font-medium uppercase tracking-wider text-zinc-500">
              Methodology &amp; FAQ
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-zinc-950">
              Built for transparent STEM literacy.
            </h2>
          </div>

          <div className="divide-y divide-zinc-200 border-t border-zinc-200 lg:col-span-8 lg:border-t-0">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className="py-5 first:pt-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 text-left text-base font-semibold text-zinc-950"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-zinc-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Closing CTA Band */}
      <section className="mt-20 flex flex-col items-start justify-between gap-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-8 sm:flex-row sm:items-center sm:p-10">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-zinc-950">
            Don&apos;t just read the headline. Stress-test the proof.
          </h2>
          <p className="mt-1.5 text-sm text-zinc-600">
            100% client-side, zero API keys, ready for any classroom or research lab.
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
          Launch Stress-Test Lab
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}

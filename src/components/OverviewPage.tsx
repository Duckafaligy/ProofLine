import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { CLAIMS_DATA, type ClaimCaseStudy, type ClaimStatus } from '../data/claims';
import { formatSampleSize } from '../utils/stats';
import { getStatusHex } from '../utils/status';
import { ScrubberChart } from './ScrubberChart';
import { StatusBadge } from './StatusBadge';

interface OverviewPageProps {
  onOpenLab: (claimId?: string) => void;
}

type FilterStatus = 'all' | ClaimStatus;

const STUDENT_STEPS = [
  {
    id: 'step-1',
    title: 'Check the sample size (N) against the latest replication',
    detail: 'Studies under N = 50 frequently overestimate effect sizes by 2x to 5x.',
  },
  {
    id: 'step-2',
    title: 'Look for a pre-registered or multi-lab follow-up study',
    detail: 'Pre-registration prevents researchers from cherry-picking p-values near 0.05.',
  },
  {
    id: 'step-3',
    title: 'Verify whether the confidence interval crosses zero under bias trim',
    detail: 'If a 15% publication-bias trim pushes the 95% CI across 0.00, treat the claim with caution.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'How does the Live Stress-Test Engine calculate p-values and confidence intervals?',
    a: 'It runs a zero-dependency two-group standardized effect-size model (Cohen’s d) using the Abramowitz & Stegun 7.1.26 Normal CDF approximation (max error < 1.5e-7). Adjusting Sample Size (N), Publication Bias Trim (0–30%), and Confidence Level (90%/95%/99%) recalculates Standard Error, Z-score, and CI bounds at 60fps.',
  },
  {
    q: 'Are all six case studies based on real peer-reviewed papers?',
    a: 'Yes. Every study year, sample size (N), effect size, and replication verdict is sourced directly from published journals including Nature, Psychological Science, Psychological Bulletin, BMJ, CMAJ, and the Cochrane Library.',
  },
  {
    q: 'How does ProofLine improve STEM accessibility?',
    a: 'One click activates Atkinson Hyperlegible typography, wider line height and letter spacing, and high-contrast borders. Every claim also includes studio-grade neural audio summaries so visually impaired or auditory learners can review the evidence hands-free.',
  },
];

export function OverviewPage({ onOpenLab }: OverviewPageProps) {
  const featured = CLAIMS_DATA[0];
  const [heroIndex, setHeroIndex] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [tickedSteps, setTickedSteps] = useState<Record<string, boolean>>({
    'step-1': true,
  });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredClaims =
    statusFilter === 'all'
      ? CLAIMS_DATA
      : CLAIMS_DATA.filter((c) => c.status === statusFilter);

  return (
    <main id="main-content" className="mx-auto max-w-7xl px-6 pb-28 pt-14 sm:pt-20">
      {/* 1. LaunchVault-Style Centered Editorial Hero */}
      <section className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1 font-mono-tabular text-xs font-medium text-zinc-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          6 peer-reviewed STEM controversies · Every number sourced
        </div>

        <h1 className="mt-6 text-balance text-5xl font-extrabold tracking-[-0.045em] text-zinc-950 sm:text-7xl sm:leading-[1.02]">
          They published the headline.{' '}
          <span className="text-zinc-500">We check the math.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-600 sm:text-xl">
          How viral scientific claims actually hold up over time—checked study
          by study, plotted on an interactive scrubber, and stress-tested live.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="?view=dashboard"
            onClick={(e) => {
              e.preventDefault();
              onOpenLab();
            }}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          >
            Check out Dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <a
            href="#case-studies"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-400 hover:text-zinc-950"
          >
            Browse All 6 Case Studies
          </a>
        </div>
      </section>

      {/* 2. Full Interactive Keynote Scrubber Specimen right below Hero */}
      <section id="live-preview" className="mx-auto mt-16 max-w-5xl scroll-mt-24">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5">
            <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
              LIVE SPECIMEN · {featured.ticker}
            </span>
            <StatusBadge status={featured.status} label={featured.statusLabel} />
          </div>
          <button
            type="button"
            onClick={() => onOpenLab(featured.id)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline"
          >
            Open {featured.shortTitle} in Dashboard
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <ScrubberChart
          milestones={featured.milestones}
          status={featured.status}
          activeIndex={heroIndex}
          onSelectIndex={setHeroIndex}
        />
      </section>

      {/* 3. How We Label Every Number (Provenance System) */}
      <section id="provenance" className="mt-28 scroll-mt-24 border-t border-zinc-200 pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Provenance Standard
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-[-0.035em] text-zinc-950 sm:text-4xl">
              Most viral science numbers are never checked again.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600">
              Videos, social posts, and old textbooks repeat the splashy first
              study, even when larger trials disagree. Every number in ProofLine
              wears a provenance badge, a sample size, and a dated citation.
            </p>

            {/* Open-Source Lab Image Card */}
            <figure className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
              <img
                src="/images/microscope-audit.jpg"
                alt="Scientist performing a laboratory replication audit at a microscope"
                className="h-52 w-full object-cover"
                loading="lazy"
              />
              <figcaption className="flex items-center justify-between border-t border-zinc-200 bg-white px-4 py-2.5 font-mono-tabular text-xs text-zinc-500">
                <span>Replication Audit Protocol</span>
                <span>Wikimedia Commons · CC BY 2.0</span>
              </figcaption>
            </figure>
          </div>

          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge status="verified" label="Verified" size="md" />
                <span className="font-mono-tabular text-xs text-zinc-500">
                  Example: Smoking &amp; Lung Cancer (N = 34,439 · p &lt; 0.0001)
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-zinc-950">
                Replicated across independent cohorts &amp; meta-analyses
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                The effect survives 10x–100x larger sample sizes, prospective
                cohort tracking, and strict publication-bias trimming without
                crossing the null threshold.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge status="failed-replication" label="Failed Replication" size="md" />
                <span className="font-mono-tabular text-xs text-zinc-500">
                  Example: Power Posing (N = 42 → N = 9,779 · g = 0.0)
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-zinc-950">
                Original small-sample effect collapsed in high-powered trials
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                An early study with a small sample reported p &lt; 0.05, but
                double-blind replications and p-curve audits showed the true
                effect size is indistinguishable from zero.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge status="sources-differ" label="Sources Differ" size="md" />
                <span className="font-mono-tabular text-xs text-zinc-500">
                  Example: AI Water Footprint (25 mL vs. 0.26 mL / prompt)
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-zinc-950">
                Studies disagree due to scope boundaries or subgroup splits
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                Two credible sources report wildly different numbers because one
                measures full-grid lifecycle (Scope 1 + 2) or targeted subgroups
                while another measures on-site averages only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Six Case Studies Index Table */}
      <section id="case-studies" className="mt-28 scroll-mt-24 border-t border-zinc-200 pt-20">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Evidence Ledger
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-zinc-950">
              Six STEM case studies. Watch them shift.
            </h2>
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
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
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

        {/* Structured Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="hidden grid-cols-12 border-b border-zinc-200 bg-zinc-50/80 px-6 py-3.5 font-mono-tabular text-[11px] font-semibold uppercase tracking-wider text-zinc-500 md:grid">
            <div className="col-span-5">Case Study &amp; Headline Claim</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Original Study</div>
            <div className="col-span-2">Latest Consensus</div>
            <div className="col-span-1 text-right">Open</div>
          </div>

          <div className="divide-y divide-zinc-200">
            {filteredClaims.map((claim: ClaimCaseStudy) => {
              const first = claim.milestones[0];
              const last = claim.milestones[claim.milestones.length - 1];
              const hex = getStatusHex(claim.status);

              return (
                <a
                  key={claim.id}
                  href={`?view=dashboard&claim=${claim.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenLab(claim.id);
                  }}
                  className="group grid grid-cols-1 items-center gap-4 px-6 py-5 transition-colors hover:bg-zinc-50/90 md:grid-cols-12"
                >
                  <div className="min-w-0 pr-4 md:col-span-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
                        {claim.ticker}
                      </span>
                      <span className="text-zinc-300">·</span>
                      <span className="text-xs font-medium text-zinc-500">
                        {claim.field}
                      </span>
                    </div>
                    <h3 className="mt-1 text-base font-bold tracking-[-0.02em] text-zinc-950 group-hover:underline">
                      {claim.shortTitle}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-zinc-600">
                      {claim.headline}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <StatusBadge status={claim.status} label={claim.statusLabel} />
                  </div>

                  <div className="font-mono-tabular text-xs md:col-span-2">
                    <div className="font-semibold text-zinc-900">
                      {first.year} · d = {first.effectSize.toFixed(2)}
                    </div>
                    <div className="text-zinc-500">
                      N = {formatSampleSize(first.sampleSize)}
                    </div>
                  </div>

                  <div className="font-mono-tabular text-xs md:col-span-2">
                    <div className="font-bold" style={{ color: hex }}>
                      {last.year} · d = {last.effectSize.toFixed(2)}
                    </div>
                    <div className="text-zinc-500">
                      N = {formatSampleSize(last.sampleSize)}
                    </div>
                  </div>

                  <div className="flex justify-end md:col-span-1">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-all group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Interactive Student Citation Checklist + Open-Source Lab Photo */}
      <section className="mt-28 border-t border-zinc-200 pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-zinc-500">
              For Students &amp; Classrooms
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-zinc-950">
              Three things to check before you cite a paper.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-600">
              Tick these off before dropping a statistic into a lab report or
              literature review.
            </p>

            <div className="mt-6 space-y-3">
              {STUDENT_STEPS.map((step, i) => {
                const checked = Boolean(tickedSteps[step.id]);
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() =>
                      setTickedSteps((prev) => ({ ...prev, [step.id]: !prev[step.id] }))
                    }
                    className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors ${
                      checked
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${
                        checked
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-zinc-300 bg-white'
                      }`}
                    >
                      {checked && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-zinc-950">
                        <span className="mr-2 font-mono-tabular text-xs text-zinc-400">
                          0{i + 1}
                        </span>
                        {step.title}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                        {step.detail}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <figure className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
              <img
                src="/images/lab-research.jpg"
                alt="Researchers collaborating in a wet laboratory"
                className="h-72 w-full object-cover"
                loading="lazy"
              />
              <figcaption className="border-t border-zinc-200 bg-white p-4">
                <div className="text-sm font-bold text-zinc-950">
                  Built for Open STEM Education
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                  Includes Atkinson Hyperlegible dyslexia-friendly typography
                  and studio neural audio summaries for hands-free learning.
                </p>
                <div className="mt-2 font-mono-tabular text-[11px] text-zinc-400">
                  Photo: Wiki Science Competition (CC BY-SA 4.0)
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 6. Methodology & FAQ */}
      <section id="methodology" className="mt-28 scroll-mt-24 border-t border-zinc-200 pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Methodology &amp; FAQ
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-zinc-950">
              Transparent math. Zero black boxes.
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

      {/* 7. Closing CTA Band */}
      <section className="mt-24 flex flex-col items-start justify-between gap-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-8 sm:flex-row sm:items-center sm:p-12">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-zinc-950 sm:text-3xl">
            Don&apos;t just read the headline. Stress-test the proof.
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            100% client-side, zero API keys, ready for any classroom or research lab.
          </p>
        </div>
        <a
          href="?view=dashboard"
          onClick={(e) => {
            e.preventDefault();
            onOpenLab();
          }}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
        >
          Check out Dashboard
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}

import { ArrowRight, BarChart3, CheckSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { CLAIMS_DATA, type ClaimCaseStudy } from '../data/claims';
import { StatusBadge, getStatusHex } from './StatusBadge';

interface OverviewPageProps {
  onOpenLab: (claimId?: string) => void;
}

export function OverviewPage({ onOpenLab }: OverviewPageProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:pt-14">
      {/* Editorial Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#13151A] p-6 sm:p-10 lg:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-0 h-80 w-80 rounded-full bg-[#2563EB]/15 blur-3xl"
        />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold text-[#60A5FA]">
            <Sparkles className="h-3.5 w-3.5" />
            STEM Innovation Challenge 2026 · Open Science Telemetry
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl lg:leading-[1.1]">
            Track the Half-Life of Scientific Claims in Real Time.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
            ProofLine treats scientific findings like live market trajectories.
            Scrub across decades of replications, stress-test p-values and
            confidence intervals under publication bias, and audit any claim
            before you cite it.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenLab()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8]"
            >
              Open Statistical Lab
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onOpenLab('smoking-lung-cancer')}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-[#1C1F26] px-4 py-2.5 text-sm font-medium text-[#F8FAFC] transition-colors hover:border-white/25"
            >
              <ShieldCheck className="h-4 w-4 text-[#10B981]" />
              Inspect Verified Control
            </button>
          </div>
        </div>
      </section>

      {/* 6 Built-in Case Studies Grid */}
      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#F8FAFC]">
              6 Tracked STEM Case Studies
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Select any claim to inspect its replication trajectory and run a live stress test.
            </p>
          </div>
          <span className="font-mono-tabular text-xs text-[#94A3B8]">
            6 CLAIMS · 23 MILESTONES
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CLAIMS_DATA.map((claim: ClaimCaseStudy) => {
            const first = claim.milestones[0];
            const last = claim.milestones[claim.milestones.length - 1];
            const hex = getStatusHex(claim.status);

            return (
              <button
                key={claim.id}
                type="button"
                onClick={() => onOpenLab(claim.id)}
                className="hairline-card group flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#13151A] p-5 text-left transition-all hover:border-white/20 hover:bg-[#1C1F26]/70"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-tabular text-xs font-semibold tracking-wider text-[#94A3B8]">
                      {claim.ticker} · {claim.field}
                    </span>
                    <StatusBadge status={claim.status} label={claim.statusLabel} />
                  </div>

                  <h3 className="mt-3 text-base font-bold text-[#F8FAFC] group-hover:text-white">
                    {claim.shortTitle}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#94A3B8]">
                    {claim.summary}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <div className="font-mono-tabular text-xs">
                    <span className="text-[#94A3B8]">{first.year}: </span>
                    <span className="text-[#F8FAFC]">{first.effectSize.toFixed(2)}</span>
                    <span className="mx-1.5 text-[#94A3B8]">→</span>
                    <span className="text-[#94A3B8]">{last.year}: </span>
                    <span className="font-semibold" style={{ color: hex }}>
                      {last.effectSize.toFixed(2)}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
                    Inspect
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3-Pillar Architecture */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="hairline-card rounded-xl border border-white/[0.08] bg-[#13151A] p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#2563EB]">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="mt-3.5 text-sm font-bold text-[#F8FAFC]">
            Robinhood-Style Scrubber Chart
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
            Drag or hover across historical milestones to inspect exact sample
            sizes (N), effect sizes, p-values, and why the consensus line moved.
          </p>
        </div>

        <div className="hairline-card rounded-xl border border-white/[0.08] bg-[#13151A] p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F59E0B]/15 text-[#F59E0B]">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="mt-3.5 text-sm font-bold text-[#F8FAFC]">
            Normal CDF Stress-Test Engine
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
            Adjust Sample Size (20–5,000), Publication Bias Trim (0%–30%), and
            Confidence Level (90%/95%/99%) to watch SE, Z-score, CI, and p-value
            recalculate live.
          </p>
        </div>

        <div className="hairline-card rounded-xl border border-white/[0.08] bg-[#13151A] p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10B981]/15 text-[#10B981]">
            <CheckSquare className="h-5 w-5" />
          </div>
          <h3 className="mt-3.5 text-sm font-bold text-[#F8FAFC]">
            Citation Audit &amp; Accessible Design
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
            Interactive &ldquo;3 Questions Before You Cite This&rdquo; checklist per claim,
            Atkinson Hyperlegible high-contrast mode, and Web Speech API Audio
            Summaries.
          </p>
        </div>
      </section>
    </main>
  );
}

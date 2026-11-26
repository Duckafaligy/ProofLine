import { useState } from 'react';
import { BookOpen, Volume2, VolumeX } from 'lucide-react';
import { CLAIMS_DATA, type ClaimCaseStudy, type ClaimStatus } from '../data/claims';
import type { ConfidenceLevel } from '../utils/stats';
import { CitationChecklist } from './CitationChecklist';
import { ScrubberChart } from './ScrubberChart';
import { StatusBadge } from './StatusBadge';
import { StressTestEngine } from './StressTestEngine';

interface LabPageProps {
  selectedClaimId: string;
  onSelectClaim: (claimId: string) => void;
  isSpeaking: boolean;
  speechSupported: boolean;
  onToggleSpeech: () => void;
}

type StatusFilter = 'all' | ClaimStatus;

export function LabPage({
  selectedClaimId,
  onSelectClaim,
  isSpeaking,
  speechSupported,
  onToggleSpeech,
}: LabPageProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [milestoneIndex, setMilestoneIndex] = useState<number>(0);

  const selectedClaim: ClaimCaseStudy =
    CLAIMS_DATA.find((c) => c.id === selectedClaimId) ?? CLAIMS_DATA[0];

  // Stress-test state keyed by claim ID or reset on claim switch
  const [sampleSize, setSampleSize] = useState<number>(
    selectedClaim.stressDefaults.sampleSize
  );
  const [biasTrimPercent, setBiasTrimPercent] = useState<number>(
    selectedClaim.stressDefaults.biasTrimPercent
  );
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>(95);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleSelectClaim = (claim: ClaimCaseStudy) => {
    onSelectClaim(claim.id);
    setMilestoneIndex(claim.milestones.length - 1);
    setSampleSize(claim.stressDefaults.sampleSize);
    setBiasTrimPercent(claim.stressDefaults.biasTrimPercent);
    setConfidenceLevel(95);
  };

  const handleResetStressTest = () => {
    setSampleSize(selectedClaim.stressDefaults.sampleSize);
    setBiasTrimPercent(selectedClaim.stressDefaults.biasTrimPercent);
    setConfidenceLevel(95);
  };

  const handleToggleChecklistItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const filteredClaims =
    statusFilter === 'all'
      ? CLAIMS_DATA
      : CLAIMS_DATA.filter((c) => c.status === statusFilter);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Sidebar: Case Study Selector */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="hairline-card sticky top-20 rounded-xl border border-white/[0.08] bg-[#13151A] p-3.5">
            <div className="flex items-center justify-between pb-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Case Studies ({filteredClaims.length})
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'verified', label: 'Verified' },
                  { id: 'failed-replication', label: 'Failed' },
                  { id: 'sources-differ', label: 'Differ' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
                    statusFilter === f.id
                      ? 'border-[#2563EB] bg-[#2563EB]/20 text-[#F8FAFC]'
                      : 'border-white/[0.08] bg-[#1C1F26] text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Claim List */}
            <div className="space-y-2">
              {filteredClaims.map((claim) => {
                const isSelected = claim.id === selectedClaim.id;
                const latest = claim.milestones[claim.milestones.length - 1];

                return (
                  <button
                    key={claim.id}
                    type="button"
                    onClick={() => handleSelectClaim(claim)}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-[#2563EB] bg-[#2563EB]/10'
                        : 'border-white/[0.06] bg-[#1C1F26]/60 hover:border-white/20 hover:bg-[#1C1F26]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-tabular text-[10px] font-semibold tracking-wider text-[#94A3B8]">
                        {claim.ticker}
                      </span>
                      <StatusBadge
                        status={claim.status}
                        label={claim.statusLabel}
                      />
                    </div>
                    <div className="mt-1.5 text-sm font-semibold text-[#F8FAFC]">
                      {claim.shortTitle}
                    </div>
                    <div className="mt-1 flex items-center justify-between font-mono-tabular text-[11px] text-[#94A3B8]">
                      <span>{claim.field}</span>
                      <span>{latest.effectDisplay}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Lab Workspace */}
        <div className="space-y-5 lg:col-span-8 xl:col-span-9">
          {/* Claim Header Card */}
          <section className="hairline-card rounded-xl border border-white/[0.08] bg-[#13151A] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-white/[0.1] bg-[#1C1F26] px-2 py-0.5 font-mono-tabular text-xs font-semibold text-[#94A3B8]">
                  {selectedClaim.ticker}
                </span>
                <span className="text-xs font-medium text-[#94A3B8]">
                  {selectedClaim.field}
                </span>
                <StatusBadge
                  status={selectedClaim.status}
                  label={selectedClaim.statusLabel}
                  size="md"
                />
              </div>

              <button
                type="button"
                onClick={onToggleSpeech}
                disabled={!speechSupported}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                  isSpeaking
                    ? 'border-[#10B981] bg-[#10B981]/15 text-[#10B981]'
                    : 'border-white/[0.1] bg-[#1C1F26] text-[#F8FAFC] hover:border-[#2563EB]'
                }`}
              >
                {isSpeaking ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 text-[#2563EB]" />
                )}
                {isSpeaking ? 'Stop Audio Readout' : 'Audio Summary'}
              </button>
            </div>

            <h1 className="mt-3 text-xl font-bold tracking-tight text-[#F8FAFC] sm:text-2xl">
              &ldquo;{selectedClaim.headline}&rdquo;
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
              {selectedClaim.summary}
            </p>

            <div className="mt-4 grid gap-2.5 border-t border-white/[0.06] pt-3.5 text-xs sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
                <div>
                  <span className="font-semibold text-[#94A3B8]">
                    Original Claim:{' '}
                  </span>
                  <span className="text-[#F8FAFC]">
                    {selectedClaim.originalCitation}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10B981]" />
                <div>
                  <span className="font-semibold text-[#94A3B8]">
                    Latest Consensus:{' '}
                  </span>
                  <span className="text-[#F8FAFC]">
                    {selectedClaim.latestCitation}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Robinhood-Style SVG Scrubber Chart */}
          <ScrubberChart
            milestones={selectedClaim.milestones}
            status={selectedClaim.status}
            activeIndex={Math.min(
              milestoneIndex,
              selectedClaim.milestones.length - 1
            )}
            onSelectIndex={setMilestoneIndex}
          />

          {/* Live Statistical Stress-Test Engine */}
          <StressTestEngine
            baselineEffect={selectedClaim.stressDefaults.baselineEffect}
            sampleSize={sampleSize}
            biasTrimPercent={biasTrimPercent}
            confidenceLevel={confidenceLevel}
            onChangeSampleSize={setSampleSize}
            onChangeBiasTrim={setBiasTrimPercent}
            onChangeConfidence={setConfidenceLevel}
            onReset={handleResetStressTest}
          />

          {/* Student 3 Questions Before You Cite This */}
          <CitationChecklist
            claimId={selectedClaim.id}
            items={selectedClaim.checklist}
            checkedIds={checkedItems}
            onToggleItem={handleToggleChecklistItem}
          />
        </div>
      </div>
    </main>
  );
}

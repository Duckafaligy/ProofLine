import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
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
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-24">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Case Studies ({filteredClaims.length})
            </h2>

            {/* Filter Pills */}
            <div className="mt-3 flex flex-wrap gap-1.5">
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
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    statusFilter === f.id
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Clean Claim List */}
            <div className="mt-4 divide-y divide-zinc-200 border-t border-zinc-200">
              {filteredClaims.map((claim) => {
                const isSelected = claim.id === selectedClaim.id;
                const latest = claim.milestones[claim.milestones.length - 1];

                return (
                  <button
                    key={claim.id}
                    type="button"
                    onClick={() => handleSelectClaim(claim)}
                    className={`w-full px-3 py-3.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-zinc-100/90'
                        : 'bg-white hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-tabular text-[11px] font-semibold text-zinc-400">
                        {claim.ticker}
                      </span>
                      <StatusBadge status={claim.status} label={claim.statusLabel} />
                    </div>
                    <div className="mt-1.5 text-sm font-semibold text-zinc-950">
                      {claim.shortTitle}
                    </div>
                    <div className="mt-1 flex items-center justify-between font-mono-tabular text-xs text-zinc-500">
                      <span>{claim.field}</span>
                      <span>{latest.effectDisplay}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <div className="space-y-8 lg:col-span-8 xl:col-span-9">
          {/* Claim Header */}
          <section className="border-b border-zinc-200 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
                  {selectedClaim.ticker}
                </span>
                <span className="text-zinc-300">/</span>
                <span className="text-xs font-medium text-zinc-500">
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
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  isSpeaking
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400'
                }`}
              >
                {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                {isSpeaking ? 'Stop Audio' : 'Audio Summary'}
              </button>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-zinc-950 sm:text-3xl">
              &ldquo;{selectedClaim.headline}&rdquo;
            </h1>

            <p className="mt-3 text-base leading-relaxed text-zinc-600">
              {selectedClaim.summary}
            </p>

            <div className="mt-5 grid gap-4 text-xs sm:grid-cols-2">
              <div className="rounded-lg bg-zinc-50 p-3.5">
                <span className="font-semibold text-zinc-500">Original Claim: </span>
                <span className="text-zinc-900">{selectedClaim.originalCitation}</span>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3.5">
                <span className="font-semibold text-zinc-500">Latest Consensus: </span>
                <span className="text-zinc-900">{selectedClaim.latestCitation}</span>
              </div>
            </div>
          </section>

          <ScrubberChart
            milestones={selectedClaim.milestones}
            status={selectedClaim.status}
            activeIndex={Math.min(milestoneIndex, selectedClaim.milestones.length - 1)}
            onSelectIndex={setMilestoneIndex}
          />

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

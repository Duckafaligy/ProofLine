import { useState, type MouseEvent } from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { CLAIMS_DATA, type ClaimCaseStudy } from '../data/claims';
import type { ConfidenceLevel } from '../utils/stats';
import { CitationChecklist } from './CitationChecklist';
import { ScrubberChart } from './ScrubberChart';
import { StatusBadge } from './StatusBadge';
import { StressTestEngine } from './StressTestEngine';

interface LabPageProps {
  selectedClaimId: string;
  onSelectClaim: (claimId: string) => void;
  onBackToOverview?: () => void;
  isSpeaking: boolean;
  speechSupported: boolean;
  onToggleSpeech: () => void;
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

interface LabWorkspaceProps {
  claim: ClaimCaseStudy;
  isSpeaking: boolean;
  speechSupported: boolean;
  onToggleSpeech: () => void;
  checkedItems: Record<string, boolean>;
  onToggleChecklistItem: (itemId: string) => void;
}

function LabWorkspace({
  claim,
  isSpeaking,
  speechSupported,
  onToggleSpeech,
  checkedItems,
  onToggleChecklistItem,
}: LabWorkspaceProps) {
  const [milestoneIndex, setMilestoneIndex] = useState<number>(0);
  const [sampleSize, setSampleSize] = useState<number>(
    claim.stressDefaults.sampleSize
  );
  const [biasTrimPercent, setBiasTrimPercent] = useState<number>(
    claim.stressDefaults.biasTrimPercent
  );
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>(95);

  const handleResetStressTest = () => {
    setSampleSize(claim.stressDefaults.sampleSize);
    setBiasTrimPercent(claim.stressDefaults.biasTrimPercent);
    setConfidenceLevel(95);
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Claim Header Banner */}
      <section
        aria-labelledby="claim-headline"
        className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              translate="no"
              className="rounded-md bg-zinc-100 px-2.5 py-1 font-mono-tabular text-xs font-bold text-zinc-800"
            >
              {claim.ticker}
            </span>
            <span className="text-xs font-medium text-zinc-500">
              {claim.field}
            </span>
            <StatusBadge
              status={claim.status}
              label={claim.statusLabel}
              size="md"
            />
          </div>

          <button
            type="button"
            onClick={onToggleSpeech}
            disabled={!speechSupported}
            aria-pressed={isSpeaking}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              isSpeaking
                ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                : 'border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-400'
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {isSpeaking ? 'Stop Neural Audio' : 'Listen to Neural Audio Brief'}
          </button>
        </div>

        <h1
          id="claim-headline"
          className="mt-4 text-balance text-2xl font-bold tracking-[-0.03em] text-zinc-950 sm:text-4xl"
        >
          &ldquo;{claim.headline}&rdquo;
        </h1>

        <p className="mt-3 max-w-4xl text-base leading-relaxed text-zinc-600">
          {claim.summary}
        </p>

        <div className="mt-6 grid gap-4 border-t border-zinc-100 pt-5 sm:grid-cols-2">
          <div className="rounded-xl bg-zinc-50/90 p-4">
            <div className="font-mono-tabular text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Original Claim Citation
            </div>
            <div className="mt-1 text-sm font-medium text-zinc-900">
              {claim.originalCitation}
            </div>
          </div>
          <div className="rounded-xl bg-zinc-50/90 p-4">
            <div className="font-mono-tabular text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Latest Replication Consensus
            </div>
            <div className="mt-1 text-sm font-medium text-zinc-900">
              {claim.latestCitation}
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Workbench: Scrubber Chart (7 cols) + Live Stress-Test Engine (5 cols) */}
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <ScrubberChart
            milestones={claim.milestones}
            status={claim.status}
            activeIndex={Math.min(milestoneIndex, claim.milestones.length - 1)}
            onSelectIndex={setMilestoneIndex}
          />

          <CitationChecklist
            key={claim.id}
            claimId={claim.id}
            items={claim.checklist}
            checkedIds={checkedItems}
            onToggleItem={onToggleChecklistItem}
          />
        </div>

        <div className="lg:sticky lg:top-24 lg:col-span-5">
          <StressTestEngine
            baselineEffect={claim.stressDefaults.baselineEffect}
            sampleSize={sampleSize}
            biasTrimPercent={biasTrimPercent}
            confidenceLevel={confidenceLevel}
            onChangeSampleSize={setSampleSize}
            onChangeBiasTrim={setBiasTrimPercent}
            onChangeConfidence={setConfidenceLevel}
            onReset={handleResetStressTest}
          />
        </div>
      </div>
    </div>
  );
}

export function LabPage({
  selectedClaimId,
  onSelectClaim,
  onBackToOverview,
  isSpeaking,
  speechSupported,
  onToggleSpeech,
}: LabPageProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const selectedClaim: ClaimCaseStudy =
    CLAIMS_DATA.find((c) => c.id === selectedClaimId) ?? CLAIMS_DATA[0];

  const handleToggleChecklistItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-7xl px-6 pb-28 pt-8 focus:outline-none"
    >
      {/* Top Sub-Navbar: Breadcrumb + Horizontal Case Study Switcher */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            {onBackToOverview && (
              <button
                type="button"
                onClick={onBackToOverview}
                className="inline-flex items-center gap-1 font-semibold text-zinc-700 hover:text-zinc-950"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Landing
              </button>
            )}
            <span>/</span>
            <span>Stress-Test Lab</span>
            <span>/</span>
            <span className="font-mono-tabular font-semibold text-zinc-950">
              {selectedClaim.ticker}
            </span>
          </div>

          <span className="font-mono-tabular text-xs text-zinc-500">
            Select any case study below to switch workbench
          </span>
        </div>

        {/* Clean Horizontal Case Study Tabs */}
        <nav
          aria-label="Case study workbench tabs"
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
        >
          {CLAIMS_DATA.map((claim) => {
            const isSelected = claim.id === selectedClaim.id;
            const latest = claim.milestones[claim.milestones.length - 1];

            return (
              <a
                key={claim.id}
                href={`?view=lab&claim=${encodeURIComponent(claim.id)}`}
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) return;
                  event.preventDefault();
                  onSelectClaim(claim.id);
                }}
                aria-current={isSelected ? 'page' : undefined}
                className={`flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                    : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    translate="no"
                    className={`font-mono-tabular text-[11px] font-bold ${
                      isSelected ? 'text-zinc-300' : 'text-zinc-500'
                    }`}
                  >
                    {claim.ticker}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      claim.status === 'verified'
                        ? 'bg-emerald-500'
                        : claim.status === 'failed-replication'
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                  />
                </div>
                <div className="mt-1.5 line-clamp-1 text-xs font-bold">
                  {claim.shortTitle}
                </div>
                <div
                  className={`mt-1 font-mono-tabular text-[11px] ${
                    isSelected ? 'text-zinc-300' : 'text-zinc-500'
                  }`}
                >
                  {latest.effectDisplay}
                </div>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Main Workbench */}
      <LabWorkspace
        key={selectedClaim.id}
        claim={selectedClaim}
        isSpeaking={isSpeaking}
        speechSupported={speechSupported}
        onToggleSpeech={onToggleSpeech}
        checkedItems={checkedItems}
        onToggleChecklistItem={handleToggleChecklistItem}
      />
    </main>
  );
}

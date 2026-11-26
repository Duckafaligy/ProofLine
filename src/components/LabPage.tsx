import { useEffect, useState, type MouseEvent } from 'react';
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

const VALID_STATUS_FILTERS: readonly StatusFilter[] = [
  'all',
  'verified',
  'failed-replication',
  'sources-differ',
];

function readInitialStatusFilter(): StatusFilter {
  if (typeof window === 'undefined') return 'all';
  const param = new URLSearchParams(window.location.search).get('status');
  return VALID_STATUS_FILTERS.includes(param as StatusFilter)
    ? (param as StatusFilter)
    : 'all';
}

function writeStatusFilterUrl(filter: StatusFilter) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (filter === 'all') {
    url.searchParams.delete('status');
  } else {
    url.searchParams.set('status', filter);
  }
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    window.history.replaceState(null, '', nextUrl);
  }
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
    <div className="min-w-0 space-y-8 lg:col-span-8 xl:col-span-9">
      {/* Claim Header */}
      <section aria-labelledby="claim-headline" className="border-b border-zinc-200 pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              translate="no"
              className="font-mono-tabular text-xs font-semibold text-zinc-600"
            >
              {claim.ticker}
            </span>
            <span aria-hidden="true" className="text-zinc-300">
              /
            </span>
            <span className="text-xs font-medium text-zinc-600">
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
            aria-label={
              speechSupported
                ? isSpeaking
                  ? `Stop audio summary for ${claim.shortTitle}`
                  : `Listen to audio summary for ${claim.shortTitle}`
                : 'Audio summary unavailable in this browser'
            }
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
              isSpeaking
                ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 hover:text-zinc-950'
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            {isSpeaking ? 'Stop Audio' : 'Audio Summary'}
          </button>
        </div>

        <h1
          id="claim-headline"
          className="mt-5 text-balance text-2xl font-bold tracking-[-0.03em] text-zinc-950 sm:text-3xl sm:leading-[1.2]"
        >
          &ldquo;{claim.headline}&rdquo;
        </h1>

        <p className="mt-4 max-w-[68ch] text-pretty text-base leading-relaxed text-zinc-600">
          {claim.summary}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4">
            <div className="text-xs font-semibold text-zinc-500">
              Original Claim
            </div>
            <div className="mt-1 text-sm leading-relaxed text-zinc-900">
              {claim.originalCitation}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4">
            <div className="text-xs font-semibold text-zinc-500">
              Latest Consensus
            </div>
            <div className="mt-1 text-sm leading-relaxed text-zinc-900">
              {claim.latestCitation}
            </div>
          </div>
        </div>
      </section>

      <ScrubberChart
        milestones={claim.milestones}
        status={claim.status}
        activeIndex={Math.min(milestoneIndex, claim.milestones.length - 1)}
        onSelectIndex={setMilestoneIndex}
      />

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

      <CitationChecklist
        key={claim.id}
        claimId={claim.id}
        items={claim.checklist}
        checkedIds={checkedItems}
        onToggleItem={onToggleChecklistItem}
      />
    </div>
  );
}

export function LabPage({
  selectedClaimId,
  onSelectClaim,
  isSpeaking,
  speechSupported,
  onToggleSpeech,
}: LabPageProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    readInitialStatusFilter
  );
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const syncFilter = () => setStatusFilter(readInitialStatusFilter());
    window.addEventListener('popstate', syncFilter);
    return () => window.removeEventListener('popstate', syncFilter);
  }, []);

  const selectedClaim: ClaimCaseStudy =
    CLAIMS_DATA.find((c) => c.id === selectedClaimId) ?? CLAIMS_DATA[0];

  const handleChangeFilter = (nextFilter: StatusFilter) => {
    setStatusFilter(nextFilter);
    writeStatusFilterUrl(nextFilter);
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

  const filterSuffix =
    statusFilter === 'all' ? '' : `&status=${encodeURIComponent(statusFilter)}`;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-6xl px-6 pb-28 pt-10 focus:outline-none sm:pt-12"
    >
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left Sidebar */}
        <aside aria-label="Case study selector" className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold text-zinc-950">
                Case Studies
              </h2>
              <span className="font-mono-tabular text-xs font-medium text-zinc-500">
                {filteredClaims.length} of {CLAIMS_DATA.length}
              </span>
            </div>

            {/* Filter Pills */}
            <div
              role="group"
              aria-label="Filter case studies by verification status"
              className="mt-3.5 flex flex-wrap gap-2"
            >
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
                  onClick={() => handleChangeFilter(f.id)}
                  aria-pressed={statusFilter === f.id}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 ${
                    statusFilter === f.id
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Clean Claim List */}
            {filteredClaims.length === 0 ? (
              <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600">
                <p>No case studies match this filter.</p>
                <button
                  type="button"
                  onClick={() => handleChangeFilter('all')}
                  className="mt-2 font-semibold text-zinc-950 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                >
                  Show all case studies
                </button>
              </div>
            ) : (
              <ul className="mt-5 divide-y divide-zinc-200 border-b border-t border-zinc-200">
                {filteredClaims.map((claim) => {
                  const isSelected = claim.id === selectedClaim.id;
                  const latest = claim.milestones[claim.milestones.length - 1];

                  return (
                    <li key={claim.id}>
                      <a
                        href={`?view=lab&claim=${encodeURIComponent(claim.id)}${filterSuffix}`}
                        onClick={(event) => {
                          if (!isPlainLeftClick(event)) return;
                          event.preventDefault();
                          onSelectClaim(claim.id);
                        }}
                        aria-current={isSelected ? 'page' : undefined}
                        className={`block w-full px-3.5 py-4 text-left transition-[background-color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-950 ${
                          isSelected
                            ? 'bg-zinc-100/90 shadow-[inset_2px_0_0_#09090B]'
                            : 'bg-white hover:bg-zinc-50/90'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            translate="no"
                            className="font-mono-tabular text-xs font-semibold text-zinc-500"
                          >
                            {claim.ticker}
                          </span>
                          <StatusBadge
                            status={claim.status}
                            label={claim.statusLabel}
                          />
                        </div>
                        <div className="mt-2 text-sm font-semibold leading-snug text-zinc-950">
                          {claim.shortTitle}
                        </div>
                        <div className="mt-1.5 flex items-center justify-between gap-3 font-mono-tabular text-xs text-zinc-600">
                          <span className="truncate">{claim.field}</span>
                          <span className="shrink-0 text-zinc-700">
                            {latest.effectDisplay}
                          </span>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Main Workspace */}
        <LabWorkspace
          key={selectedClaim.id}
          claim={selectedClaim}
          isSpeaking={isSpeaking}
          speechSupported={speechSupported}
          onToggleSpeech={onToggleSpeech}
          checkedItems={checkedItems}
          onToggleChecklistItem={handleToggleChecklistItem}
        />
      </div>
    </main>
  );
}

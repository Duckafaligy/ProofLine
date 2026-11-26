import { Eye, Volume2, VolumeX, Activity, Compass } from 'lucide-react';

export type AppView = 'overview' | 'lab';

interface TopNavProps {
  activeView: AppView;
  onChangeView: (view: AppView) => void;
  hyperlegible: boolean;
  onToggleHyperlegible: () => void;
  isSpeaking: boolean;
  speechSupported: boolean;
  onToggleSpeech: () => void;
}

export function TopNav({
  activeView,
  onChangeView,
  hyperlegible,
  onToggleHyperlegible,
  isSpeaking,
  speechSupported,
  onToggleSpeech,
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0B0C0E]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onChangeView('overview')}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-[#13151A] shadow-sm transition-colors group-hover:border-[#2563EB]/60">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 14.5L7.5 8.5L12 13L16.5 6L21 12"
                stroke="#2563EB"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="16.5" cy="6" r="2" fill="#10B981" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-[#F8FAFC]">
                ProofLine
              </span>
              <span className="rounded border border-white/[0.1] bg-[#1C1F26] px-1.5 py-0.5 font-mono-tabular text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                STEM 2026
              </span>
            </div>
            <p className="hidden text-[11px] text-[#94A3B8] sm:block">
              Scientific Claim Replication &amp; Stress-Test Lab
            </p>
          </div>
        </button>

        {/* Center View Switcher */}
        <nav
          aria-label="Primary View"
          className="flex items-center rounded-lg border border-white/[0.08] bg-[#13151A] p-1"
        >
          <button
            type="button"
            onClick={() => onChangeView('overview')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'overview'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            Overview
          </button>
          <button
            type="button"
            onClick={() => onChangeView('lab')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'lab'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Lab
          </button>
        </nav>

        {/* Right Accessibility & Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleHyperlegible}
            aria-pressed={hyperlegible}
            title="Toggle Atkinson Hyperlegible High-Contrast Accessibility Mode"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              hyperlegible
                ? 'border-[#2563EB] bg-[#2563EB]/15 text-[#F8FAFC]'
                : 'border-white/[0.08] bg-[#13151A] text-[#94A3B8] hover:border-white/20 hover:text-[#F8FAFC]'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden md:inline">
              {hyperlegible ? 'Hyperlegible: ON' : 'Hyperlegible'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleSpeech}
            disabled={!speechSupported}
            aria-pressed={isSpeaking}
            title={
              speechSupported
                ? 'Read aloud an accessible audio summary using Web Speech API'
                : 'Web Speech API not supported in this browser'
            }
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
              isSpeaking
                ? 'border-[#10B981] bg-[#10B981]/15 text-[#10B981]'
                : 'border-white/[0.08] bg-[#13151A] text-[#94A3B8] hover:border-white/20 hover:text-[#F8FAFC]'
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">
              {isSpeaking ? 'Stop Audio' : 'Audio Summary'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

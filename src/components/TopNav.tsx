import { Eye, Volume2, VolumeX } from 'lucide-react';

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
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onChangeView('overview')}
          className="flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M3 15L8 9L12.5 13.5L17.5 6.5L21 11"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-base font-bold tracking-[-0.03em] text-zinc-950">
            ProofLine
          </span>
        </button>

        {/* Center Nav */}
        <nav aria-label="Primary View" className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100/80 p-1">
          <button
            type="button"
            onClick={() => onChangeView('overview')}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'overview'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => onChangeView('lab')}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'lab'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Stress-Test Lab
          </button>
        </nav>

        {/* Accessibility & Audio */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleHyperlegible}
            aria-pressed={hyperlegible}
            title="Toggle Atkinson Hyperlegible High-Contrast Mode"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              hyperlegible
                ? 'border-zinc-950 bg-zinc-950 text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
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
                ? 'Read aloud an accessible audio summary'
                : 'Web Speech API not supported in this browser'
            }
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              isSpeaking
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
            }`}
          >
            {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">
              {isSpeaking ? 'Stop Audio' : 'Audio Summary'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

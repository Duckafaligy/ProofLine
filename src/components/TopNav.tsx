import type { MouseEvent } from 'react';
import { Eye, Volume2, VolumeX } from 'lucide-react';

export type AppView = 'overview' | 'lab';

interface TopNavProps {
  activeView: AppView;
  selectedClaimId?: string;
  onChangeView: (view: AppView) => void;
  hyperlegible: boolean;
  onToggleHyperlegible: () => void;
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

export function TopNav({
  activeView,
  selectedClaimId,
  onChangeView,
  hyperlegible,
  onToggleHyperlegible,
  isSpeaking,
  speechSupported,
  onToggleSpeech,
}: TopNavProps) {
  const labHref = selectedClaimId
    ? `?view=lab&claim=${encodeURIComponent(selectedClaimId)}`
    : '?view=lab';

  const handleViewLinkClick =
    (view: AppView) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isPlainLeftClick(event)) return;
      event.preventDefault();
      onChangeView(view);
    };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        {/* Brand */}
        <a
          href="?view=overview"
          onClick={handleViewLinkClick('overview')}
          aria-label="ProofLine home — Overview"
          className="group flex items-center gap-2.5 rounded-xl px-1 py-1 text-left transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
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
          <span
            translate="no"
            className="text-base font-bold tracking-[-0.03em] text-zinc-950"
          >
            ProofLine
          </span>
        </a>

        {/* Center Nav */}
        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100/80 p-1"
        >
          <a
            href="?view=overview"
            onClick={handleViewLinkClick('overview')}
            aria-current={activeView === 'overview' ? 'page' : undefined}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-[background-color,color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-1 ${
              activeView === 'overview'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Overview
          </a>
          <a
            href={labHref}
            onClick={handleViewLinkClick('lab')}
            aria-current={activeView === 'lab' ? 'page' : undefined}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-[background-color,color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-1 ${
              activeView === 'lab'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Stress-Test Lab
          </a>
        </nav>

        {/* Accessibility & Audio */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleHyperlegible}
            aria-pressed={hyperlegible}
            aria-label={
              hyperlegible
                ? 'Disable Atkinson Hyperlegible mode'
                : 'Enable Atkinson Hyperlegible mode'
            }
            title="Toggle Atkinson Hyperlegible High-Contrast Mode"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 ${
              hyperlegible
                ? 'border-zinc-950 bg-zinc-950 text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
            }`}
          >
            <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden md:inline">
              {hyperlegible ? 'Hyperlegible: ON' : 'Hyperlegible'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleSpeech}
            disabled={!speechSupported}
            aria-pressed={isSpeaking}
            aria-label={
              speechSupported
                ? isSpeaking
                  ? 'Stop audio summary'
                  : 'Play audio summary'
                : 'Audio summary unavailable in this browser'
            }
            title={
              speechSupported
                ? 'Read aloud an accessible audio summary'
                : 'Web Speech API not supported in this browser'
            }
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
              isSpeaking
                ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
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

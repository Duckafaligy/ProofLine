import type { MouseEvent } from 'react';
import { ArrowRight, Eye, FlaskConical, Volume2, VolumeX } from 'lucide-react';

export type AppView = 'overview' | 'lab';

interface TopNavProps {
  activeView: AppView;
  selectedClaimId?: string;
  onChangeView: (view: AppView) => void;
  onJumpToSection?: (sectionId: string) => void;
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
  onJumpToSection,
  hyperlegible,
  onToggleHyperlegible,
  isSpeaking,
  speechSupported,
  onToggleSpeech,
}: TopNavProps) {
  const labHref = selectedClaimId
    ? `?view=lab&claim=${encodeURIComponent(selectedClaimId)}`
    : '?view=lab';

  const handleViewClick =
    (view: AppView) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isPlainLeftClick(event)) return;
      event.preventDefault();
      onChangeView(view);
    };

  const handleSectionClick =
    (sectionId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isPlainLeftClick(event)) return;
      event.preventDefault();
      if (onJumpToSection) {
        onJumpToSection(sectionId);
      } else {
        onChangeView('overview');
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 40);
      }
    };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/90 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        {/* Left: Brand + Primary Section Links */}
        <div className="flex items-center gap-8">
          <a
            href="?view=overview"
            onClick={handleViewClick('overview')}
            aria-label="ProofLine home"
            className="group flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white transition-transform duration-200 group-hover:scale-[1.03]">
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
            <div className="flex items-baseline gap-2">
              <span
                translate="no"
                className="text-base font-bold tracking-[-0.04em] text-zinc-950"
              >
                ProofLine
              </span>
              <span className="hidden font-mono-tabular text-[11px] font-medium text-zinc-400 sm:inline">
                v2.6
              </span>
            </div>
          </a>

          {/* Editorial Navigation Links */}
          <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
            <a
              href="#live-preview"
              onClick={handleSectionClick('live-preview')}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
            >
              Why Claims Shift
            </a>
            <a
              href="#provenance"
              onClick={handleSectionClick('provenance')}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
            >
              How We Label
            </a>
            <a
              href="#case-studies"
              onClick={handleSectionClick('case-studies')}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
            >
              6 Case Studies
            </a>
            <a
              href="#methodology"
              onClick={handleSectionClick('methodology')}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
            >
              Methodology
            </a>
          </nav>
        </div>

        {/* Right: View Switcher + A11y Utilities + Primary CTA */}
        <div className="flex items-center gap-2.5">
          {/* Segmented View Pill */}
          <div
            role="group"
            aria-label="Switch view"
            className="flex items-center rounded-full border border-zinc-200 bg-zinc-100/90 p-0.5"
          >
            <a
              href="?view=overview"
              onClick={handleViewClick('overview')}
              aria-current={activeView === 'overview' ? 'page' : undefined}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                activeView === 'overview'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Landing
            </a>
            <a
              href={labHref}
              onClick={handleViewClick('lab')}
              aria-current={activeView === 'lab' ? 'page' : undefined}
              className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                activeView === 'lab'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <FlaskConical className="h-3 w-3" aria-hidden="true" />
              Lab
            </a>
          </div>

          <div className="hidden h-4 w-px bg-zinc-200 sm:block" aria-hidden="true" />

          {/* Hyperlegible Toggle */}
          <button
            type="button"
            onClick={onToggleHyperlegible}
            aria-pressed={hyperlegible}
            title="Toggle Atkinson Hyperlegible High-Contrast Mode"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 ${
              hyperlegible
                ? 'border-zinc-950 bg-zinc-950 text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
            }`}
          >
            <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden xl:inline">
              {hyperlegible ? 'Hyperlegible: ON' : 'Aa Hyperlegible'}
            </span>
          </button>

          {/* Neural Audio Readout */}
          <button
            type="button"
            onClick={onToggleSpeech}
            disabled={!speechSupported}
            aria-pressed={isSpeaking}
            title="Play Studio Neural Audio Summary"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:opacity-40 ${
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
              {isSpeaking ? 'Stop Audio' : 'Audio Brief'}
            </span>
          </button>

          {/* Primary Action Button */}
          {activeView === 'overview' && (
            <a
              href={labHref}
              onClick={handleViewClick('lab')}
              className="hidden items-center gap-1.5 rounded-full bg-zinc-950 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 md:inline-flex"
            >
              Open Lab
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

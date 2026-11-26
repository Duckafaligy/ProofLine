import { useEffect, useState, type MouseEvent } from 'react';
import { ArrowLeft, ArrowRight, Menu, Type, Volume2, VolumeX, X } from 'lucide-react';

export type AppView = 'overview' | 'lab';

interface TopNavProps {
  activeView: AppView;
  selectedClaimId?: string;
  onChangeView: (view: AppView) => void;
  onJumpToSection: (sectionId: string) => void;
  hyperlegible: boolean;
  onToggleHyperlegible: () => void;
  isSpeaking: boolean;
  speechSupported: boolean;
  onToggleSpeech: () => void;
}

const SECTION_LINKS = [
  { id: 'live-preview', label: 'Why Claims Shift' },
  { id: 'provenance', label: 'How We Label' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'methodology', label: 'Methodology' },
];

const GITHUB_URL = 'https://github.com/Duckafaligy/ProofLine';

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

const ICON_BTN =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:opacity-40';

function Logo() {
  return (
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDashboard = activeView === 'lab';

  const dashboardHref = selectedClaimId
    ? `?view=dashboard&claim=${encodeURIComponent(selectedClaimId)}`
    : '?view=dashboard';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const goView = (view: AppView) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainLeftClick(event)) return;
    event.preventDefault();
    setMenuOpen(false);
    onChangeView(view);
  };

  const goSection = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainLeftClick(event)) return;
    event.preventDefault();
    setMenuOpen(false);
    onJumpToSection(id);
  };

  const utilityButtons = (
    <>
      <button
        type="button"
        onClick={onToggleHyperlegible}
        aria-pressed={hyperlegible}
        aria-label={hyperlegible ? 'Turn off Hyperlegible mode' : 'Turn on Hyperlegible mode'}
        title="Hyperlegible reading mode"
        className={`${ICON_BTN} ${
          hyperlegible
            ? 'border-zinc-950 bg-zinc-950 text-white'
            : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
        }`}
      >
        <Type className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onToggleSpeech}
        disabled={!speechSupported}
        aria-pressed={isSpeaking}
        aria-label={isSpeaking ? 'Stop audio brief' : 'Play audio brief'}
        title={isSpeaking ? 'Stop audio brief' : 'Play audio brief'}
        className={`${ICON_BTN} ${
          isSpeaking
            ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
            : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
        }`}
      >
        {isSpeaking ? (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </>
  );

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md transition-[border-color,box-shadow] duration-200 ${
        scrolled ? 'border-zinc-200 shadow-[0_1px_0_rgba(9,9,11,0.02)]' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        {/* Brand */}
        <a
          href="?"
          onClick={goView('overview')}
          aria-label="ProofLine home"
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
        >
          <Logo />
          <span translate="no" className="text-base font-bold tracking-[-0.04em] text-zinc-950">
            ProofLine
          </span>
          {isDashboard && (
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
              Dashboard
            </span>
          )}
        </a>

        {/* Center: marketing links (landing only) */}
        {!isDashboard && (
          <nav aria-label="Main" className="hidden flex-1 items-center justify-center gap-7 lg:flex">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={goSection(link.id)}
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
              >
                {link.label}
              </a>
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
            >
              GitHub
            </a>
          </nav>
        )}

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">{utilityButtons}</div>

          {isDashboard ? (
            <a
              href="?"
              onClick={goView('overview')}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-400 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to site
            </a>
          ) : (
            <a
              href={dashboardHref}
              onClick={goView('lab')}
              className="hidden items-center gap-1.5 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 sm:inline-flex"
            >
              Check out Dashboard
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          )}

          {!isDashboard && (
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={`${ICON_BTN} border-zinc-200 bg-white text-zinc-800 lg:hidden`}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {!isDashboard && menuOpen && (
        <div id="mobile-menu" className="border-t border-zinc-200 bg-white lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={goSection(link.id)}
                className="border-b border-zinc-100 py-3 text-base font-medium text-zinc-800"
              >
                {link.label}
              </a>
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="border-b border-zinc-100 py-3 text-base font-medium text-zinc-800"
            >
              GitHub
            </a>
            <div className="mt-4 flex items-center gap-2">{utilityButtons}</div>
            <a
              href={dashboardHref}
              onClick={goView('lab')}
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Check out Dashboard
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

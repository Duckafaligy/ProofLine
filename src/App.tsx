import { useCallback, useEffect, useRef, useState } from 'react';
import { LabPage } from './components/LabPage';
import { OverviewPage } from './components/OverviewPage';
import { TopNav, type AppView } from './components/TopNav';
import { CLAIMS_DATA } from './data/claims';

function readUrlState(): { view: AppView; claimId: string } {
  if (typeof window === 'undefined') {
    return { view: 'overview', claimId: CLAIMS_DATA[0].id };
  }
  const params = new URLSearchParams(window.location.search);
  const view: AppView = params.get('view') === 'lab' ? 'lab' : 'overview';
  const claimParam = params.get('claim');
  const matched = CLAIMS_DATA.find((c) => c.id === claimParam);
  return {
    view,
    claimId: matched ? matched.id : CLAIMS_DATA[0].id,
  };
}

export function App() {
  const initial = readUrlState();
  const [activeView, setActiveView] = useState<AppView>(initial.view);
  const [selectedClaimId, setSelectedClaimId] = useState<string>(initial.claimId);
  const [hyperlegible, setHyperlegible] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSupported = true;

  const stopSpeech = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  useEffect(() => {
    const onPopState = () => {
      const next = readUrlState();
      stopSpeech();
      setActiveView(next.view);
      setSelectedClaimId(next.claimId);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [stopSpeech]);

  const syncUrl = (view: AppView, claimId: string) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (view === 'overview') {
      url.searchParams.delete('view');
      url.searchParams.delete('claim');
    } else {
      url.searchParams.set('view', 'lab');
      url.searchParams.set('claim', claimId);
    }
    window.history.pushState({}, '', url);
  };

  const fallbackSpeechSynthesis = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find((v) => v.lang.startsWith('en') && /natural|neural|google|samantha|daniel/i.test(v.name)) ??
      voices.find((v) => v.lang.startsWith('en'));
    if (naturalVoice) utterance.voice = naturalVoice;
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      return;
    }

    const claim =
      CLAIMS_DATA.find((c) => c.id === selectedClaimId) ?? CLAIMS_DATA[0];

    const audioSrc =
      activeView === 'overview'
        ? '/audio/overview.mp3'
        : `/audio/${claim.id}.mp3`;

    const textToSpeak =
      activeView === 'overview'
        ? 'Welcome to ProofLine, the scientific claim replication and statistical stress-test lab.'
        : claim.audioSummary;

    stopSpeech();
    setIsSpeaking(true);

    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    audio.onended = () => {
      audioRef.current = null;
      setIsSpeaking(false);
    };
    audio.onerror = () => {
      audioRef.current = null;
      fallbackSpeechSynthesis(textToSpeak);
    };
    audio.play().catch(() => {
      audioRef.current = null;
      fallbackSpeechSynthesis(textToSpeak);
    });
  };

  const scrollToTop = () => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  const handleOpenLab = (claimId?: string) => {
    stopSpeech();
    const nextClaim = claimId ?? selectedClaimId;
    if (claimId) {
      setSelectedClaimId(claimId);
    }
    setActiveView('lab');
    syncUrl('lab', nextClaim);
    scrollToTop();
  };

  const handleChangeView = (view: AppView) => {
    stopSpeech();
    setActiveView(view);
    syncUrl(view, selectedClaimId);
    scrollToTop();
  };

  const handleSelectClaim = (claimId: string) => {
    stopSpeech();
    setSelectedClaimId(claimId);
    syncUrl('lab', claimId);
  };

  return (
    <div
      className={`min-h-screen bg-white text-zinc-950 ${
        hyperlegible ? 'a11y-hyperlegible' : ''
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <TopNav
        activeView={activeView}
        onChangeView={handleChangeView}
        hyperlegible={hyperlegible}
        onToggleHyperlegible={() => setHyperlegible((v) => !v)}
        isSpeaking={isSpeaking}
        speechSupported={speechSupported}
        onToggleSpeech={handleToggleSpeech}
      />

      {activeView === 'overview' ? (
        <OverviewPage onOpenLab={handleOpenLab} />
      ) : (
        <LabPage
          selectedClaimId={selectedClaimId}
          onSelectClaim={handleSelectClaim}
          isSpeaking={isSpeaking}
          speechSupported={speechSupported}
          onToggleSpeech={handleToggleSpeech}
        />
      )}

      {/* Full Multi-Column Editorial Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50/70">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 md:grid-cols-12">
            {/* Brand & Mission */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-white">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                    <path
                      d="M3 15L8 9L12.5 13.5L17.5 6.5L21 11"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span translate="no" className="text-base font-bold tracking-[-0.03em] text-zinc-950">
                  ProofLine
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-600">
                An open-science claim verification tracker and statistical
                stress-test lab built for students, educators, and journalists.
              </p>
              <p className="mt-4 font-mono-tabular text-xs text-zinc-500">
                100% client-side · Normal CDF Engine · WCAG Accessible
              </p>
            </div>

            {/* Explore */}
            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-950">
                Explore
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
                <li>
                  <button
                    type="button"
                    onClick={() => handleChangeView('overview')}
                    className="hover:text-zinc-950"
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenLab()}
                    className="hover:text-zinc-950"
                  >
                    Stress-Test Lab
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setHyperlegible((v) => !v)}
                    className="hover:text-zinc-950"
                  >
                    Hyperlegible Mode
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleToggleSpeech}
                    className="hover:text-zinc-950"
                  >
                    Neural Audio Summary
                  </button>
                </li>
              </ul>
            </div>

            {/* Case Studies */}
            <div className="md:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-950">
                Case Studies
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
                {CLAIMS_DATA.slice(0, 4).map((claim) => (
                  <li key={claim.id}>
                    <button
                      type="button"
                      onClick={() => handleOpenLab(claim.id)}
                      className="text-left hover:text-zinc-950"
                    >
                      {claim.shortTitle}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Open Source */}
            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-950">
                Open Source
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
                <li>
                  <a
                    href="https://github.com/Duckafaligy/ProofLine"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-zinc-950"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Duckafaligy/ProofLine/blob/master/research/claims-dataset.md"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-zinc-950"
                  >
                    Verified Dataset
                  </a>
                </li>
                <li>
                  <a
                    href="https://commons.wikimedia.org"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-zinc-950"
                  >
                    Wikimedia CC Assets
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-zinc-200 pt-8 text-xs text-zinc-500 sm:flex-row sm:items-center">
            <span>
              © 2026 ProofLine · Built for the STEM Innovation Challenge 2026
            </span>
            <span>
              Lab photography via Wikimedia Commons (CC BY-SA 4.0) · Neural TTS Audio
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

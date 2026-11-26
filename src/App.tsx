import { useCallback, useEffect, useState } from 'react';
import { LabPage } from './components/LabPage';
import { OverviewPage } from './components/OverviewPage';
import { TopNav, type AppView } from './components/TopNav';
import { CLAIMS_DATA } from './data/claims';

function readInitialRoute(): { view: AppView; claimId: string } {
  if (typeof window === 'undefined') {
    return { view: 'overview', claimId: CLAIMS_DATA[0].id };
  }
  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get('view');
  const claimParam = params.get('claim');

  const validClaim = CLAIMS_DATA.find((c) => c.id === claimParam);
  const view: AppView = viewParam === 'lab' || validClaim ? 'lab' : 'overview';

  return {
    view,
    claimId: validClaim ? validClaim.id : CLAIMS_DATA[0].id,
  };
}

function writeUrlState(view: AppView, claimId: string) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (view === 'lab') {
    url.searchParams.set('view', 'lab');
    url.searchParams.set('claim', claimId);
  } else {
    url.searchParams.delete('view');
    url.searchParams.delete('claim');
    url.searchParams.delete('status');
  }
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    window.history.pushState(null, '', nextUrl);
  }
}

export function App() {
  const initial = readInitialRoute();
  const [activeView, setActiveView] = useState<AppView>(initial.view);
  const [selectedClaimId, setSelectedClaimId] = useState<string>(initial.claimId);
  const [hyperlegible, setHyperlegible] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const speechSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stopSpeech = useCallback(() => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [speechSupported]);

  useEffect(() => {
    return () => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  useEffect(() => {
    const handlePopState = () => {
      stopSpeech();
      const next = readInitialRoute();
      setActiveView(next.view);
      setSelectedClaimId(next.claimId);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [stopSpeech]);

  const handleToggleSpeech = () => {
    if (!speechSupported) return;

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    const claim =
      CLAIMS_DATA.find((c) => c.id === selectedClaimId) ?? CLAIMS_DATA[0];

    const textToSpeak =
      activeView === 'overview'
        ? 'Welcome to ProofLine, the scientific claim replication and statistical stress-test lab. Select any of the six case studies to scrub across historical milestones, stress-test p-values and confidence intervals, and complete the three-question citation audit.'
        : claim.audioSummary;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleOpenLab = (claimId?: string) => {
    stopSpeech();
    const nextClaimId = claimId ?? selectedClaimId;
    if (claimId) {
      setSelectedClaimId(claimId);
    }
    setActiveView('lab');
    writeUrlState('lab', nextClaimId);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const handleChangeView = (view: AppView) => {
    stopSpeech();
    setActiveView(view);
    writeUrlState(view, selectedClaimId);
  };

  const handleSelectClaim = (claimId: string) => {
    stopSpeech();
    setSelectedClaimId(claimId);
    writeUrlState('lab', claimId);
  };

  return (
    <div
      className={`min-h-screen bg-white text-zinc-950 ${
        hyperlegible ? 'a11y-hyperlegible' : ''
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-white focus:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <TopNav
        activeView={activeView}
        selectedClaimId={selectedClaimId}
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

      <footer className="border-t border-zinc-200 bg-white py-10 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 sm:flex-row">
          <span translate="no" className="font-semibold text-zinc-700">
            ProofLine
          </span>
          <span>Built for the 2026 STEM Innovation Challenge</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

import { useCallback, useEffect, useState } from 'react';
import { LabPage } from './components/LabPage';
import { OverviewPage } from './components/OverviewPage';
import { TopNav, type AppView } from './components/TopNav';
import { CLAIMS_DATA } from './data/claims';

export function App() {
  const [activeView, setActiveView] = useState<AppView>('overview');
  const [selectedClaimId, setSelectedClaimId] = useState<string>(
    CLAIMS_DATA[0].id
  );
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
    if (claimId) {
      setSelectedClaimId(claimId);
    }
    setActiveView('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeView = (view: AppView) => {
    stopSpeech();
    setActiveView(view);
  };

  const handleSelectClaim = (claimId: string) => {
    stopSpeech();
    setSelectedClaimId(claimId);
  };

  return (
    <div
      className={`min-h-screen bg-[#0B0C0E] text-[#F8FAFC] ${
        hyperlegible ? 'a11y-hyperlegible' : ''
      }`}
    >
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

      <footer className="border-t border-white/[0.06] bg-[#0B0C0E] py-6 text-center text-xs text-[#94A3B8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          ProofLine · Built for the 2026 STEM Innovation Challenge · Paper Theme UI
        </div>
      </footer>
    </div>
  );
}

export default App;

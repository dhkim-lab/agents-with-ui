import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { useDemoEngine } from './hooks/useDemoEngine';
import { buildScenarioFromBrief } from './engine/scenarioData';
import { generateScenarioFromBrief } from './engine/claudeApi';
import { TopBar } from './components/TopBar';
import { OfficeScene } from './components/OfficeScene';
import { ChatLog } from './components/ChatLog';
import { StatusPanel } from './components/StatusPanel';
import { ResultPanel } from './components/ResultPanel';
import { FinalSnsPopup } from './components/FinalSnsPopup';
import ArtifactGallery from './components/ArtifactGallery';
import BottomBar from './components/BottomBar';
import DecisionPopup from './components/DecisionPopup';
import CampaignBriefForm from './components/CampaignBriefForm';
import type { CampaignBrief } from './types/brief';
import type { CampaignResult } from './types/result';
import { DEFAULT_BRIEF } from './types/brief';

function App() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeScenario, setActiveScenario] = useState(() => buildScenarioFromBrief(DEFAULT_BRIEF));
  const [currentBrief, setCurrentBrief] = useState<CampaignBrief | null>(null);

  const engine = useDemoEngine(activeScenario);

  // Start routine on mount
  useEffect(() => {
    engine.startRoutine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBriefSubmit = async (brief: CampaignBrief) => {
    setCurrentBrief(brief);
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (apiKey && apiKey !== 'your_api_key_here') {
      setIsGenerating(true);
      try {
        const newScenario = await generateScenarioFromBrief(brief);
        if (newScenario) {
          setActiveScenario(newScenario);
          setIsGenerating(false);
          engine.startDemo();
          return;
        }
      } catch (e) {
        console.error("Failed to generate, using mock");
      }
      setIsGenerating(false);
    }
    // Fallback: build scenario from brief with template substitution
    const scenario = buildScenarioFromBrief(brief);
    setActiveScenario(scenario);
    engine.startDemo();
  };

  const handlePublishToBoard = useCallback(async () => {
    if (!currentBrief) return;

    const result: CampaignResult = {
      id: crypto.randomUUID(),
      brief: currentBrief,
      artifacts: engine.artifacts,
      decisions: [], // TODO: collect from engine
      metrics: {
        totalTimeMs: engine.totalElapsedTimeMs,
        tokenCost: engine.usedTokens * 0.000007,
        usedTokens: engine.usedTokens,
      },
      createdAt: new Date().toISOString(),
    };

    const apiBase = import.meta.env.VITE_API_BASE || '';
    try {
      await fetch(`${apiBase}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
    } catch (err) {
      console.warn('Failed to publish result (API may not be configured):', err);
    }

    navigate('/board');
  }, [currentBrief, engine.artifacts, engine.totalElapsedTimeMs, engine.usedTokens, navigate]);

  const showIntroOverlay = engine.isRoutinePhase;

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">

      {/* TopBar — 40px */}
      <TopBar
        phaseName={engine.phaseName}
        totalElapsedTimeMs={engine.totalElapsedTimeMs}
        usedTokens={engine.usedTokens}
      />

      {/* Main Content — fills remaining space between TopBar and BottomBar */}
      <main className="flex-1 grid min-h-0 gap-2 p-2"
        style={{
          gridTemplateColumns: '1fr 27%',
          gridTemplateRows: '55% 1fr',
        }}
      >
        {/* Left-Top: OfficeScene */}
        <div className="relative border border-slate-700 bg-slate-800 rounded-lg overflow-hidden shadow-md">
          <OfficeScene
            agents={engine.agents}
            activeTransfers={engine.activeTransfers}
          />

          {/* Campaign Brief Form Overlay (Phase -1) */}
          {showIntroOverlay && (
            <CampaignBriefForm
              onSubmit={handleBriefSubmit}
              isGenerating={isGenerating}
            />
          )}
        </div>

        {/* Right-Top: ChatLog (spans 2 rows → 65% height, handled by row-span) */}
        <div className="row-span-2 min-h-0 flex flex-col gap-2">
          <div className="flex-[65] min-h-0">
            <ChatLog
              chatLogs={engine.chatLogs}
              agents={engine.agents}
            />
          </div>
          <div className="flex-[35] min-h-0">
            <StatusPanel agents={engine.agents} />
          </div>
        </div>

        {/* Left-Bottom: ArtifactGallery */}
        <div className="min-h-0">
          <ArtifactGallery artifacts={engine.artifacts} />
        </div>
      </main>

      {/* BottomBar — 48px */}
      <BottomBar agents={engine.agents} />

      {/* Overlays */}
      <ResultPanel isReady={engine.isResultReady && engine.currentPhaseId < 6} />

      {engine.isPublishDone && (
        <FinalSnsPopup
          onClose={() => {
            engine.reset();
            setTimeout(() => engine.startRoutine(), 100);
          }}
          onNewMission={() => {
            setCurrentBrief(null);
            engine.reset();
            setTimeout(() => engine.startRoutine(), 100);
          }}
          onRepeat={() => {
            if (currentBrief) {
              engine.reset();
              const scenario = buildScenarioFromBrief(currentBrief);
              setActiveScenario(scenario);
              setTimeout(() => {
                engine.startRoutine();
                setTimeout(() => engine.startDemo(), 200);
              }, 100);
            }
          }}
          onPublishToBoard={handlePublishToBoard}
        />
      )}

      {/* Decision Popup */}
      {engine.activeDecision && engine.isDecisionPending && (
        <DecisionPopup
          decision={engine.activeDecision}
          onSelect={(index, reason) => engine.resolveDecision(index, reason)}
        />
      )}
    </div>
  );
}

export default App;

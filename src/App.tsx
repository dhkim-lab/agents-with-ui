import { useState, useEffect } from 'react';
import './App.css';
import { useDemoEngine } from './hooks/useDemoEngine';
import { demoScenario } from './engine/scenarioData';
import { generateScenarioFromTopic } from './engine/claudeApi';
import { TopBar } from './components/TopBar';
import { OfficeScene } from './components/OfficeScene';
import { ChatLog } from './components/ChatLog';
import { StatusPanel } from './components/StatusPanel';
import { ResultPanel } from './components/ResultPanel';
import { FinalSnsPopup } from './components/FinalSnsPopup';
import ArtifactGallery from './components/ArtifactGallery';
import BottomBar from './components/BottomBar';
import DecisionPopup from './components/DecisionPopup';

function App() {
  const [topic, setTopic] = useState('신규 AI 교육 서비스 런치, 20-30대 직장인 타겟');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeScenario, setActiveScenario] = useState(demoScenario);

  const engine = useDemoEngine(activeScenario);

  // Start routine on mount
  useEffect(() => {
    engine.startRoutine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = async () => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (apiKey && apiKey !== 'your_api_key_here') {
      setIsGenerating(true);
      try {
        const newScenario = await generateScenarioFromTopic(topic);
        if (newScenario) {
          setActiveScenario(newScenario);
        }
      } catch (e) {
        console.error("Failed to generate, using mock");
      } finally {
        setIsGenerating(false);
        engine.startDemo();
      }
    } else {
      setActiveScenario(demoScenario);
      engine.startDemo();
    }
  };

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

          {/* Intro Overlay (Phase -1) */}
          {showIntroOverlay && (
            <div className="absolute inset-0 z-40 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
              <div className="max-w-md w-full bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
                  🧢
                </div>
                <h2 className="text-lg font-bold mb-1">Alex (Team Leader)</h2>
                <p className="text-slate-300 mb-5 italic text-sm">
                  "안녕하세요. 새 프로젝트를 시작할까요?"
                </p>

                <div className="bg-slate-900 rounded-lg p-3 text-left mb-4 border border-slate-700">
                  <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Mission Input</div>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-transparent border-none text-emerald-400 font-mono text-sm outline-none placeholder-emerald-900"
                    placeholder="마케팅 과제를 입력하세요..."
                  />
                </div>

                <button
                  id="start-btn"
                  onClick={handleStart}
                  disabled={isGenerating}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:scale-100 flex justify-center items-center gap-2 text-sm"
                >
                  {isGenerating ? (
                    <><span className="animate-spin text-lg">⏳</span> 시나리오 생성 중...</>
                  ) : (
                    '프로젝트 시작 🚀'
                  )}
                </button>
                {!import.meta.env.VITE_ANTHROPIC_API_KEY && (
                  <p className="text-[10px] text-slate-500 mt-2">.env 에 API 키를 넣으면 실시간 생성됩니다.</p>
                )}
              </div>
            </div>
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
            setTopic('');
            engine.reset();
            setTimeout(() => engine.startRoutine(), 100);
          }}
          onRepeat={() => {
            engine.reset();
            setTimeout(() => {
              engine.startRoutine();
              setTimeout(() => {
                document.getElementById('start-btn')?.click();
              }, 200);
            }, 100);
          }}
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

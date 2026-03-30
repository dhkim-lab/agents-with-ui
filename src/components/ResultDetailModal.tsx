import type { CampaignResult } from '../types/result';
import { OBJECTIVE_LABELS, BUDGET_LABELS } from '../types/brief';
import CardNewsViewer from './CardNewsViewer';
import type { CardNewsSlide } from './CardNewsViewer';
import { useState, useMemo } from 'react';

interface ResultDetailModalProps {
  result: CampaignResult;
  onClose: () => void;
}

const ARTIFACT_TABS = ['all', 'table', 'copy', 'diagram', 'chart', 'cardnews'] as const;
const TAB_LABELS: Record<string, string> = {
  all: '전체',
  table: '📊 분석표',
  copy: '✍️ 카피',
  diagram: '🔀 퍼널',
  chart: '📈 예산',
  cardnews: '🖼️ 카드뉴스',
};

export default function ResultDetailModal({ result, onClose }: ResultDetailModalProps) {
  const { brief, artifacts, decisions, metrics } = result;
  const [artTab, setArtTab] = useState<string>('all');

  const filteredArtifacts = artTab === 'all'
    ? artifacts
    : artifacts.filter(a => a.artifactType === artTab);

  const availableTabs = ARTIFACT_TABS.filter(
    t => t === 'all' || artifacts.some(a => a.artifactType === t)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">{brief.productName}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                🎯 {OBJECTIVE_LABELS[brief.objective]} · {brief.target.role}/{brief.target.industry}/{brief.target.region} · 💰 {BUDGET_LABELS[brief.budget]}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">

          {/* Metrics summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 rounded-lg p-3 text-center border border-slate-700">
              <div className="text-lg font-bold text-blue-400">{(metrics.totalTimeMs / 1000).toFixed(0)}초</div>
              <div className="text-[10px] text-slate-500">AI 팀 소요 시간</div>
            </div>
            <div className="bg-slate-900 rounded-lg p-3 text-center border border-slate-700">
              <div className="text-lg font-bold text-emerald-400">{metrics.usedTokens.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500">토큰 사용량</div>
            </div>
            <div className="bg-slate-900 rounded-lg p-3 text-center border border-slate-700">
              <div className="text-lg font-bold text-amber-400">{artifacts.length}건</div>
              <div className="text-[10px] text-slate-500">산출물</div>
            </div>
          </div>

          {/* Decisions */}
          {decisions.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-300 mb-2">👤 의사결정 기록</h3>
              <div className="space-y-1.5">
                {decisions.map((d, i) => (
                  <div key={i} className="bg-slate-900 rounded-lg p-2.5 border border-slate-700 text-xs">
                    <div className="text-slate-400 mb-0.5">{d.question}</div>
                    <div className="text-blue-300 font-medium">→ {d.chosen}{d.reason ? ` — ${d.reason}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artifacts */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 mb-2">📦 산출물</h3>
            <div className="flex gap-1 mb-3 overflow-x-auto">
              {availableTabs.map(t => (
                <button
                  key={t}
                  onClick={() => setArtTab(t)}
                  className={`text-[11px] px-2 py-1 rounded whitespace-nowrap transition-colors ${
                    artTab === t
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                      : 'text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  {TAB_LABELS[t] ?? t}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredArtifacts.map(artifact => (
                <div key={artifact.id} className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-slate-700/50 flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-300">{artifact.title}</span>
                    <span className="text-[10px] text-slate-500 ml-auto">{artifact.agent}</span>
                  </div>
                  {artifact.artifactType === 'cardnews' ? (
                    <CardNewsContentInModal content={artifact.content} />
                  ) : (
                    <div
                      className="p-3 text-xs text-slate-300 artifact-content"
                      dangerouslySetInnerHTML={{ __html: artifact.content }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardNewsContentInModal({ content }: { content: string }) {
  const slides = useMemo<CardNewsSlide[]>(() => {
    try { return JSON.parse(content); } catch { return []; }
  }, [content]);

  if (slides.length === 0) return null;

  return (
    <div className="p-4 max-w-[280px] mx-auto">
      <CardNewsViewer slides={slides} />
    </div>
  );
}

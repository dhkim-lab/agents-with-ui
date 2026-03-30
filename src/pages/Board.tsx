import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CampaignResult } from '../types/result';
import ResultCard from '../components/ResultCard';
import ResultDetailModal from '../components/ResultDetailModal';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function Board() {
  const navigate = useNavigate();
  const [results, setResults] = useState<CampaignResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<CampaignResult | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchResults();
  }, []);

  async function fetchResults() {
    try {
      const res = await fetch(`${API_BASE}/api/results`);
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch results:', err);
      // Load demo data for offline/no-backend
      setResults(getDemoResults());
    } finally {
      setLoading(false);
    }
  }

  const objectives = [...new Set(results.map(r => r.brief.objective))];

  const filtered = filter === 'all'
    ? results
    : results.filter(r => r.brief.objective === filter);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              📋 AI Marketing Team — Campaign Gallery
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">AI 에이전트가 만든 마케팅 캠페인 모아보기</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
          >
            새 캠페인 시작 →
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            전체 ({results.length})
          </button>
          {objectives.map(obj => (
            <button
              key={obj}
              onClick={() => setFilter(obj)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                filter === obj
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {obj}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="text-3xl mb-3 animate-pulse">📡</div>
            <div>결과 불러오는 중...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <div className="text-3xl mb-3">📭</div>
            <div>아직 공유된 캠페인이 없습니다</div>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-xs px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
            >
              첫 번째 캠페인 만들기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(result => (
              <ResultCard
                key={result.id}
                result={result}
                onClick={() => setSelectedResult(result)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedResult && (
        <ResultDetailModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
}

// Demo data for when API is not available
function getDemoResults(): CampaignResult[] {
  return [
    {
      id: 'demo-1',
      brief: {
        productName: 'AI 마케팅 자동화 플랫폼',
        objective: 'lead_generation',
        target: { role: 'C레벨', industry: 'IT/SaaS', region: '국내' },
        budget: 'over_30m',
        channels: ['linkedin', 'google_ads', 'webinar'],
        language: 'ko',
      },
      artifacts: [
        { id: 'a1', agent: 'Kai', artifactType: 'table', title: '경쟁사 비교 분석표', content: '<table><tr><td>데모 데이터</td></tr></table>', timestamp: Date.now() },
        { id: 'a2', agent: 'Mia', artifactType: 'copy', title: '광고 카피 A안/B안', content: '<div>검증된 ROI 342% 달성 기업의 선택</div>', timestamp: Date.now() },
      ],
      decisions: [
        { question: '타겟 범위 선택', chosen: 'C레벨 집중' },
        { question: '카피 톤 선택', chosen: '데이터 신뢰 톤' },
      ],
      metrics: { totalTimeMs: 185000, tokenCost: 0.03, usedTokens: 4520 },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'demo-2',
      brief: {
        productName: '스마트 헬스케어 앱',
        objective: 'brand_awareness',
        target: { role: 'MZ세대', industry: '헬스케어', region: '글로벌' },
        budget: '5m_to_30m',
        channels: ['instagram', 'youtube', 'kakao'],
        language: 'multi',
      },
      artifacts: [
        { id: 'a3', agent: 'Kai', artifactType: 'table', title: '경쟁사 분석', content: '<table><tr><td>헬스케어 데모</td></tr></table>', timestamp: Date.now() },
      ],
      decisions: [
        { question: '타겟 범위', chosen: 'MZ세대 집중' },
      ],
      metrics: { totalTimeMs: 210000, tokenCost: 0.04, usedTokens: 5200 },
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
}

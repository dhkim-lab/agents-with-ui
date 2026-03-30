import { useState } from 'react';
import type { CampaignBrief, CampaignObjective } from '../types/brief';
import {
  DEFAULT_BRIEF,
  OBJECTIVE_LABELS,
  TARGET_ROLES,
  INDUSTRIES,
  REGIONS,
} from '../types/brief';

interface CampaignBriefFormProps {
  onSubmit: (brief: CampaignBrief) => void;
  isGenerating: boolean;
}

export default function CampaignBriefForm({ onSubmit, isGenerating }: CampaignBriefFormProps) {
  const [brief, setBrief] = useState<CampaignBrief>(DEFAULT_BRIEF);

  const update = <K extends keyof CampaignBrief>(key: K, value: CampaignBrief[K]) => {
    setBrief(prev => ({ ...prev, [key]: value }));
  };

  const updateTarget = (key: keyof CampaignBrief['target'], value: string) => {
    setBrief(prev => ({ ...prev, target: { ...prev.target, [key]: value } }));
  };

  const canSubmit = brief.productName.trim().length > 0;

  return (
    <div className="absolute inset-0 z-40 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-lg">🧢</div>
            <div>
              <h2 className="text-base font-bold text-white">Alex (Team Leader)</h2>
              <p className="text-xs text-slate-400">"캠페인 브리프를 작성해주세요. 팀이 바로 착수합니다."</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">

          {/* 1. 제품/서비스명 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ① 제품/서비스명 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={brief.productName}
              onChange={e => update('productName', e.target.value)}
              placeholder="예: AI 기반 마케팅 자동화 플랫폼"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono outline-none focus:border-blue-500 placeholder-slate-600"
            />
          </div>

          {/* 2. 캠페인 목표 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">② 캠페인 목표</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.entries(OBJECTIVE_LABELS) as [CampaignObjective, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => update('objective', key)}
                  className={`text-[11px] py-1.5 px-2 rounded-lg border transition-colors ${
                    brief.objective === key
                      ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                      : 'border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. 타겟 오디언스 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">③ 타겟 오디언스</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 mb-0.5 block">직군</span>
                <select
                  value={brief.target.role}
                  onChange={e => updateTarget('role', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-300 outline-none"
                >
                  {TARGET_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 mb-0.5 block">산업</span>
                <select
                  value={brief.target.industry}
                  onChange={e => updateTarget('industry', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-300 outline-none"
                >
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 mb-0.5 block">지역</span>
                <select
                  value={brief.target.region}
                  onChange={e => updateTarget('region', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-300 outline-none"
                >
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 4. 추가 요청사항 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ④ 추가 요청사항 <span className="text-slate-500 font-normal">(선택)</span>
            </label>
            <textarea
              value={brief.additionalNotes || ''}
              onChange={e => update('additionalNotes', e.target.value)}
              placeholder="경쟁사 정보, 기존 캠페인 성과, 특이사항 등..."
              rows={2}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500 placeholder-slate-600 resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/50">
          <button
            onClick={() => canSubmit && onSubmit(brief)}
            disabled={!canSubmit || isGenerating}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 flex justify-center items-center gap-2 text-sm"
          >
            {isGenerating ? (
              <><span className="animate-spin text-lg">⏳</span> 시나리오 생성 중...</>
            ) : (
              '프로젝트 시작 🚀'
            )}
          </button>
          {!canSubmit && (
            <p className="text-[10px] text-red-400/60 text-center mt-1">제품명을 입력해주세요</p>
          )}
        </div>
      </div>
    </div>
  );
}

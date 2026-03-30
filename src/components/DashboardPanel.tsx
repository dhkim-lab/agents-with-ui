import React from 'react';

export const DashboardPanel: React.FC = () => {
  return (
    <div className="flex-1 min-h-0 bg-slate-800 rounded-xl border border-slate-700 flex flex-col p-4 shadow-md mt-0">
      <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2 shrink-0">
        <h2 className="text-sm uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
          <span>📈</span> 현재 마케팅 지표
        </h2>
        <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-1 rounded border border-slate-700">
          Updated: Today 09:00 AM
        </span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 min-h-0 overflow-y-auto pr-1">
        
        {/* Metric 1: Yesterday Views */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-3 flex flex-col justify-center relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50" />
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">어제 총 뷰 수 (Views)</div>
          <div className="text-xl font-black text-slate-100 font-mono">
            45,240
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            ↑ 12% vs 지난주
          </div>
        </div>

        {/* Metric 2: Subscribers */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-3 flex flex-col justify-center relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-500/50" />
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">총 구독자 수 (Subs)</div>
          <div className="text-xl font-black text-slate-100 font-mono">
            128,400
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            +342 명 추가됨
          </div>
        </div>

        {/* Metric 3: Active Campaigns */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-3 flex flex-col justify-center relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50" />
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">진행중 캠페인</div>
          <div className="text-xl font-black text-slate-100 font-mono">
            4 <span className="text-xs text-slate-500 font-normal">Active</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            안정적 운영 중
          </div>
        </div>

      </div>
    </div>
  );
};

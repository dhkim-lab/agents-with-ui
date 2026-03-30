import React from 'react';
import { formatTime } from '../utils/format';

interface TopBarProps {
  phaseName: string;
  totalElapsedTimeMs: number;
  usedTokens: number;
}

export const TopBar: React.FC<TopBarProps> = ({ phaseName, totalElapsedTimeMs, usedTokens }) => {
  const cost = (usedTokens * 0.000003).toFixed(4);
  // Human team cost estimate: PM 1 + Marketer 2 + Designer 1 = 4 people × 4 days
  const humanCost = '₩12,000,000';
  const humanTime = '4일 (32시간)';

  return (
    <header className="flex justify-between items-center bg-slate-800 px-4 py-2.5 border-b border-slate-700 shadow-md shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold flex items-center gap-2">
          🏢 AI Marketing Team
        </h1>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
          {phaseName}
        </span>
        <span className="text-xs font-mono text-slate-500">
          ⏱ {formatTime(totalElapsedTimeMs)}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs">
        {/* Cost comparison banner */}
        <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-1.5 border border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">👤 사람팀</span>
            <span className="text-red-400 font-mono line-through">{humanCost}</span>
            <span className="text-slate-600">/ {humanTime}</span>
          </div>
          <span className="text-slate-600">vs</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">🤖 AI팀</span>
            <span className="text-emerald-400 font-bold font-mono">${cost}</span>
            <span className="text-emerald-600">/ {formatTime(totalElapsedTimeMs)}</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono">
          🪙 {usedTokens.toLocaleString()} tokens
        </div>
      </div>
    </header>
  );
};

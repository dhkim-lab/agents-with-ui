import React from 'react';
import { formatTime } from '../utils/format';

interface TopBarProps {
  phaseName: string;
  totalElapsedTimeMs: number;
  usedTokens: number;
}

export const TopBar: React.FC<TopBarProps> = ({ phaseName, totalElapsedTimeMs, usedTokens }) => {
  // Calculate cost based on Claude 3.5 Sonnet pricing (~$3 per million tokens)
  const cost = (usedTokens * 0.000003).toFixed(4);

  return (
    <header className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md mb-4 shrink-0">
      <h1 className="text-xl font-bold flex items-center gap-2">
        🏢 AI Marketing Team Office 
        <span className="text-sm font-normal text-slate-400 ml-2">{phaseName} ⏱ {formatTime(totalElapsedTimeMs)}</span>
      </h1>
      <div className="text-sm text-slate-400 flex flex-col items-end">
        <div className="text-emerald-400 font-medium whitespace-nowrap">
          ⚡ 사람 팀: 4일 → AI 팀: {formatTime(totalElapsedTimeMs)}
        </div>
        <div className="text-xs">[토큰: {usedTokens.toLocaleString()} / ${cost}]</div>
      </div>
    </header>
  );
};

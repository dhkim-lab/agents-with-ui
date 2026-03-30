import React from 'react';
import type { AgentInfo, AgentName } from '../types';

interface StatusPanelProps {
  agents: Record<AgentName, AgentInfo>;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ agents }) => {
  return (
    <div className="h-full bg-slate-800 rounded-lg border border-slate-700 flex flex-col shadow-md overflow-hidden">
      <div className="text-xs uppercase tracking-wider text-slate-400 font-bold px-3 py-1.5 border-b border-slate-700 shrink-0">
        📊 실시간 태스크 모니터
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 p-1.5 custom-scrollbar">
        {(Object.entries(agents) as [AgentName, AgentInfo][]).map(([name, info]) => {
          let borderColor = 'border-slate-700';
          let textColor = 'text-slate-300';
          let stateLabel = 'IDLE';

          switch (info.state) {
            case 'working':
              borderColor = 'border-blue-500/50';
              textColor = 'text-blue-400';
              stateLabel = 'WORKING';
              break;
            case 'waiting':
              borderColor = 'border-yellow-500/50';
              textColor = 'text-yellow-400';
              stateLabel = 'WAITING';
              break;
            case 'done':
              borderColor = 'border-emerald-500/50';
              textColor = 'text-emerald-400';
              stateLabel = 'DONE';
              break;
          }

          return (
            <div
              key={name}
              className={`px-2 py-1.5 rounded border bg-slate-800/50 ${borderColor} transition-colors`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-bold ${textColor}`}>{name}</span>
                  {info.taskType && (
                    <span className={`text-[8px] px-1 py-0.5 rounded font-mono ${
                      info.taskType === 'routine'
                        ? 'bg-slate-700/50 text-slate-500'
                        : 'bg-blue-900/30 text-blue-400'
                    }`}>
                      {info.taskType === 'routine' ? 'ROUTINE' : 'PROJECT'}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] uppercase font-mono bg-slate-900 px-1 py-0.5 rounded text-slate-400 border ${borderColor}`}>
                  {stateLabel}
                </span>
              </div>

              {info.state === 'working' && (
                <div className="flex gap-2 items-center mt-1">
                  <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${info.color} transition-all duration-500 ease-out`}
                      style={{ width: `${info.progress}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 w-6 text-right">{info.progress}%</span>
                </div>
              )}

              {info.statusText && (
                <div className="text-[9px] text-emerald-300/80 mt-0.5 font-mono tracking-tight leading-snug truncate">
                  <span className="text-emerald-500/60 select-none">$ </span>
                  {info.statusText}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

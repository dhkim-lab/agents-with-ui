import React from 'react';
import type { AgentInfo } from '../types';

interface AgentAvatarProps {
  agent: AgentInfo;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({ agent }) => {
  // Simple mapping for colors, in real app might use lucide icons
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600',
    yellow: 'bg-yellow-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    red: 'bg-red-600',
  };

  const isWorking = agent.state === 'working';
  const isDone = agent.state === 'done';
  const isWaiting = agent.state === 'waiting';

  const roleEmojis: Record<string, string> = {
    Orchestrator: '🧢',
    Researcher: '🔍',
    Writer: '✍️',
    Planner: '💡',
    Analyst: '📊'
  };

  const roleDescriptions: Record<string, string> = {
    Orchestrator: '전체 캠페인 총괄 및 의사결정',
    Researcher: '경쟁사 및 타겟 데이터 수집/분석',
    Writer: '광고 카피 및 블로그 콘텐츠 작성',
    Planner: '프로모션 기획 및 전략 수립',
    Analyst: '성과 예측 및 인사이트 도출'
  };

  return (
    <div className="relative group flex flex-col items-center">
      {/* Tooltip */}
      <div className="absolute font-sans bottom-full mb-2 w-48 bg-slate-800 text-slate-200 text-xs p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-600 shadow-xl">
        <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
          <span>{roleEmojis[agent.role]}</span> {agent.name}
        </div>
        <div className="text-slate-400 mb-2 italic">Role: {agent.role}</div>
        <div className="leading-relaxed">{roleDescriptions[agent.role]}</div>
      </div>

      <div 
        className={`w-14 h-14 text-3xl rounded-full flex items-center justify-center text-white font-bold transition-all relative
          ${isWorking ? `animate-bounce` : ''}
          ${isDone ? '' : ''}
          ${isWaiting ? 'opacity-70' : ''}
        `}
      >
        {/* Simple body shape for the avatar to make it look 2D instead of just a circle */}
        <div className={`absolute bottom-0 w-10 h-6 ${colorMap[agent.avatarColor]} rounded-t-xl opacity-80`} />
        
        {/* Head inside the circle space */}
        <div className={`relative z-10 ${isDone ? 'animate-pulse scale-110' : ''}`}>
          {roleEmojis[agent.role] || '🤖'}
        </div>

        {/* Status Indicators (Only one rendering based on priority) */}
        {isDone ? (
          <div className="absolute -top-3 -right-3 text-2xl z-20" title="완료">🎉</div>
        ) : isWorking ? (
          <div className="absolute -top-3 -right-3 text-sm bg-slate-700 border border-slate-500 rounded p-1 shadow-lg animate-pulse z-20" title="작업 중">⚙️</div>
        ) : isWaiting ? (
          <div className="absolute -top-3 -right-3 text-lg animate-spin z-20" title="대기 중">⏳</div>
        ) : null}
      </div>
      
      {/* Speech Bubble (Agent's current status text) */}
      {agent.statusText && !isDone && (
        <div className="absolute bottom-[110%] mb-2 opacity-100 z-40 bg-white border border-slate-200 text-slate-800 text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-in slide-in-from-bottom-2 whitespace-nowrap pointer-events-none">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-slate-200 transform rotate-45" />
          {agent.statusText.slice(0, 15)}{agent.statusText.length > 15 ? '...' : ''}
        </div>
      )}

      <div className="mt-2 text-xs font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded">
        {agent.name}
      </div>
      {isDone && <div className="absolute -top-2 -right-2 text-xl">🎉</div>}
      {isWaiting && <div className="absolute -top-2 -right-2 text-sm animate-bounce">⏳</div>}
      {isWorking && <div className="absolute -top-2 -right-4 text-xs bg-slate-700 rounded px-1 animate-pulse">⚙️</div>}
    </div>
  );
};

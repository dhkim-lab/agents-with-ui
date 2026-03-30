import React, { useEffect, useRef } from 'react';
import type { AgentInfo, AgentName, ChatMessage } from '../types';

interface ChatLogProps {
  chatLogs: ChatMessage[];
  agents: Record<AgentName, AgentInfo>;
}

const roleEmojis: Record<string, string> = {
  Orchestrator: '🧢',
  Researcher: '🔍',
  Writer: '✍️',
  Planner: '💡',
  Analyst: '📊'
};

function getMessageStyle(log: ChatMessage) {
  // Tag-based coloring first
  if (log.tag === 'error') return { text: 'text-red-400', bg: 'bg-red-900/20 border-red-500/30' };
  if (log.tag === 'success') return { text: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-500/30' };
  if (log.tag === 'insight') return { text: 'text-amber-400', bg: 'bg-amber-900/15 border-amber-500/30' };

  // Routine alert
  if (log.isRoutineAlert) return { text: 'text-slate-500', bg: 'bg-slate-800/30 border-slate-700/50' };

  // Fallback: keyword detection
  const t = log.text;
  if (t.includes('⚠️') || t.includes('[ERROR]') || t.includes('차단') || t.includes('실패'))
    return { text: 'text-red-400', bg: 'bg-red-900/20 border-red-500/30' };
  if (t.includes('✅') || t.includes('[SUCCESS]') || t.includes('완료'))
    return { text: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-500/30' };

  return { text: 'text-slate-300', bg: 'bg-slate-800/80 border-slate-700' };
}

export const ChatLog: React.FC<ChatLogProps> = ({ chatLogs, agents }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatLogs]);

  return (
    <div className="h-full bg-slate-800 rounded-lg border border-slate-700 flex flex-col shadow-md overflow-hidden">
      <div className="text-xs uppercase tracking-wider text-slate-400 font-bold px-3 py-2 border-b border-slate-700 flex justify-between items-center shrink-0">
        <span>💬 팀 채팅 / 회의 로그</span>
        <span className="text-[10px] font-normal text-slate-500">{chatLogs.length} messages</span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto flex flex-col gap-1.5 text-[13px] p-2 scroll-smooth custom-scrollbar"
      >
        {chatLogs.map(log => {
          const agent = agents[log.agent];
          const style = getMessageStyle(log);
          const nameColor = agent?.color.replace('bg-', 'text-') || 'text-slate-400';

          return (
            <div
              key={log.id}
              className={`${style.bg} border px-3 py-2 rounded-lg animate-in slide-in-from-right-4 fade-in duration-300 shadow-sm ${
                log.isRoutineAlert ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-0.5">
                <span className={`text-[11px] font-bold tracking-wider ${log.isRoutineAlert ? 'text-slate-500' : nameColor}`}>
                  {agent ? roleEmojis[agent.role] : '🤖'} {log.agent}
                  {log.isRoutineAlert && <span className="ml-1 text-[9px] font-normal text-slate-600">[ROUTINE]</span>}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <div className={`${style.text} leading-relaxed ${log.isRoutineAlert ? 'text-[12px]' : ''}`}>
                {log.text}
              </div>
            </div>
          );
        })}
        {chatLogs.length === 0 && (
          <div className="text-center text-slate-500 italic mt-10 text-xs">채팅 대기 중...</div>
        )}
      </div>
    </div>
  );
};

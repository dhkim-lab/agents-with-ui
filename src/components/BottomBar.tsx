import type { AgentInfo, AgentName } from '../types';

interface BottomBarProps {
  agents: Record<AgentName, AgentInfo>;
}

const AGENT_EMOJIS: Record<AgentName, string> = {
  Alex: '🧢',
  Kai: '🔍',
  Mia: '✍️',
  Nova: '💡',
  Rex: '📊',
};

const AGENT_COLORS: Record<AgentName, string> = {
  Alex: 'border-blue-500',
  Kai: 'border-yellow-500',
  Mia: 'border-green-500',
  Nova: 'border-purple-500',
  Rex: 'border-red-500',
};

const STATE_DOTS: Record<string, string> = {
  idle: 'bg-slate-500',
  working: 'bg-blue-400 animate-pulse',
  waiting: 'bg-yellow-400',
  done: 'bg-emerald-400',
};

export default function BottomBar({ agents }: BottomBarProps) {
  const agentList = Object.values(agents);

  return (
    <div className="h-12 bg-slate-800/80 border-t border-slate-700/50 flex items-center px-4 gap-3">
      {agentList.map(agent => (
        <div
          key={agent.name}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/40 border ${AGENT_COLORS[agent.name]} border-opacity-30 flex-1 min-w-0`}
        >
          {/* Mini Avatar */}
          <span className="text-sm flex-shrink-0">{AGENT_EMOJIS[agent.name]}</span>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-200">{agent.name}</span>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATE_DOTS[agent.state]}`} />
              {agent.taskType && (
                <span className={`text-[9px] px-1 rounded ${
                  agent.taskType === 'routine'
                    ? 'bg-slate-600/50 text-slate-400'
                    : 'bg-blue-600/30 text-blue-300'
                }`}>
                  {agent.taskType === 'routine' ? 'ROUTINE' : 'PROJECT'}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {agent.statusText || (agent.state === 'idle' ? '대기 중' : agent.state)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

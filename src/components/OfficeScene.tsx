import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AgentInfo, AgentName, FileTransferEvent } from '../types';
import PixelAvatar from './PixelAvatar';
import OfficeMap from './OfficeMap';

interface OfficeSceneProps {
  agents: Record<AgentName, AgentInfo>;
  activeTransfers: (FileTransferEvent & { id: string })[];
}

// Position coordinates for agents (percentage-based)
const positions: Record<string, Record<AgentName, { top: string; left: string }>> = {
  desk: {
    Alex: { top: '18%', left: '14%' },
    Kai:  { top: '40%', left: '14%' },
    Mia:  { top: '18%', left: '62%' },
    Nova: { top: '62%', left: '14%' },
    Rex:  { top: '62%', left: '62%' },
  },
  meeting_room: {
    Alex: { top: '72%', left: '52%' },
    Kai:  { top: '72%', left: '58%' },
    Mia:  { top: '72%', left: '64%' },
    Nova: { top: '72%', left: '70%' },
    Rex:  { top: '78%', left: '61%' },
  },
  Alex_desk: {
    Alex: { top: '18%', left: '14%' },
    Kai:  { top: '28%', left: '22%' },
    Mia:  { top: '28%', left: '32%' },
    Nova: { top: '28%', left: '42%' },
    Rex:  { top: '28%', left: '52%' },
  },
};

// Track previous locations for movement direction
const prevLocations: Record<AgentName, string> = {
  Alex: 'desk', Kai: 'desk', Mia: 'desk', Nova: 'desk', Rex: 'desk'
};

function getDirection(
  agent: AgentName,
  currentLocation: string
): 'down' | 'up' | 'left' | 'right' {
  const prev = prevLocations[agent];
  if (prev === currentLocation) return 'down';

  const prevPos = positions[prev]?.[agent];
  const currPos = positions[currentLocation]?.[agent];
  if (!prevPos || !currPos) return 'down';

  const dy = parseFloat(currPos.top) - parseFloat(prevPos.top);
  const dx = parseFloat(currPos.left) - parseFloat(prevPos.left);

  if (Math.abs(dy) > Math.abs(dx)) {
    return dy > 0 ? 'down' : 'up';
  }
  return dx > 0 ? 'right' : 'left';
}

export const OfficeScene: React.FC<OfficeSceneProps> = ({ agents, activeTransfers }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 640, height: 384 });
  const [movingAgents, setMovingAgents] = useState<Set<AgentName>>(new Set());

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ width, height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Track location changes for movement animation
  useEffect(() => {
    const agentNames = Object.keys(agents) as AgentName[];
    const nowMoving = new Set<AgentName>();

    agentNames.forEach(name => {
      const loc = agents[name].location;
      if (prevLocations[name] !== loc) {
        nowMoving.add(name);
        prevLocations[name] = loc;
        // Clear moving state after animation
        setTimeout(() => {
          setMovingAgents(prev => {
            const next = new Set(prev);
            next.delete(name);
            return next;
          });
        }, 1500);
      }
    });

    if (nowMoving.size > 0) {
      setMovingAgents(prev => new Set([...prev, ...nowMoving]));
    }
  }, [agents]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-slate-900"
    >
      {/* Pixel Art Office Map Background */}
      <OfficeMap width={dims.width} height={dims.height} />

      {/* Room Label */}
      <div className="absolute top-3 left-3 text-slate-500/60 font-bold tracking-widest text-xs uppercase z-10">
        OFFICE FLOOR
      </div>

      {/* Meeting Room Label */}
      <div className="absolute bottom-[30%] left-[48%] text-blue-400/50 font-bold text-xs uppercase z-10">
        Meeting Room
      </div>

      {/* Pixel Avatars */}
      {(Object.entries(agents) as [AgentName, AgentInfo][]).map(([name, agent]) => {
        const loc = agent.location as keyof typeof positions;
        const pos = positions[loc]?.[name] || positions.desk[name];
        const isMoving = movingAgents.has(name);
        const direction = getDirection(name, agent.location);

        return (
          <motion.div
            key={name}
            className="absolute z-10 flex flex-col items-center"
            animate={{
              top: pos.top,
              left: pos.left,
            }}
            transition={{
              type: 'spring',
              stiffness: 40,
              damping: 12,
              duration: 1.5,
            }}
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Speech Bubble */}
            {agent.statusText && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800/90 border border-slate-600/50 text-[9px] text-slate-300 px-2 py-0.5 rounded shadow-md max-w-[140px] truncate z-20">
                {agent.statusText}
              </div>
            )}

            {/* Avatar */}
            <PixelAvatar
              agent={name}
              state={agent.state}
              size={48}
              direction={direction}
              isMoving={isMoving}
            />

            {/* Name Tag */}
            <div className="mt-0.5 px-1.5 py-0.5 bg-slate-900/80 rounded text-[10px] font-bold text-slate-300 border border-slate-700/50">
              {name}
            </div>
          </motion.div>
        );
      })}

      {/* File Transfer Animations */}
      <AnimatePresence>
        {activeTransfers.map(transfer => {
          const fromLoc = agents[transfer.from].location as keyof typeof positions;
          const toLoc = agents[transfer.to].location as keyof typeof positions;
          const fromPos = positions[fromLoc]?.[transfer.from] || positions.desk[transfer.from];
          const toPos = positions[toLoc]?.[transfer.to] || positions.desk[transfer.to];

          return (
            <motion.div
              key={transfer.id}
              className="absolute z-20 text-xl pointer-events-none"
              initial={{
                top: fromPos.top,
                left: fromPos.left,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                top: toPos.top,
                left: toPos.left,
                opacity: 1,
                scale: 1.2,
              }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              📄
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

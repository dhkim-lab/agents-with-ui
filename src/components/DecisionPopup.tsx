import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DecisionState } from '../types';

interface DecisionPopupProps {
  decision: DecisionState;
  onSelect: (index: number, reason?: string) => void;
}

export default function DecisionPopup({ decision, onSelect }: DecisionPopupProps) {
  const [timeLeft, setTimeLeft] = useState(decision.timeout);
  const [selected, setSelected] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  const totalTime = decision.timeout;
  const progress = timeLeft / totalTime;

  // Countdown timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          // Timeout — auto select
          if (intervalRef.current) clearInterval(intervalRef.current);
          handleAutoSelect();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAutoSelect = () => {
    setSelected(decision.autoChoice);
    setIsClosing(true);
    setTimeout(() => {
      onSelect(decision.autoChoice, decision.autoReason);
    }, 1000);
  };

  const handleManualSelect = (index: number) => {
    if (selected !== null || isClosing) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelected(index);
    setIsClosing(true);
    setTimeout(() => {
      onSelect(index);
    }, 800);
  };

  const seconds = Math.ceil(timeLeft / 1000);

  // Circular progress
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl w-[520px] max-w-[90vw] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg">
              🧢
            </div>
            <div>
              <div className="text-sm font-bold text-white">Alex (팀 리더)</div>
              <div className="text-[11px] text-slate-400">판단이 필요합니다</div>
            </div>
            {/* Timer */}
            <div className="ml-auto flex items-center gap-2">
              <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90">
                <circle
                  cx="26" cy="26" r={radius}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="3"
                />
                <circle
                  cx="26" cy="26" r={radius}
                  fill="none"
                  stroke={timeLeft < 10000 ? '#ef4444' : '#3b82f6'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-100"
                />
              </svg>
              <span className={`absolute ml-3.5 text-sm font-mono font-bold ${
                timeLeft < 10000 ? 'text-red-400' : 'text-blue-300'
              }`}>
                {seconds}
              </span>
            </div>
          </div>

          {/* Question */}
          <div className="px-5 py-4">
            <p className="text-sm text-slate-200 leading-relaxed">{decision.question}</p>
          </div>

          {/* Options */}
          <div className="px-5 pb-4 space-y-2">
            {decision.options.map((option, idx) => {
              const isSelected = selected === idx;
              const isOther = selected !== null && !isSelected;

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleManualSelect(idx)}
                  animate={{
                    opacity: isOther ? 0.3 : 1,
                    scale: isSelected ? 1.02 : 1,
                  }}
                  whileHover={selected === null ? { scale: 1.01 } : {}}
                  className={`w-full text-left rounded-xl border p-4 transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-600/20'
                      : 'border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
                  } ${selected !== null ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'border-blue-400 bg-blue-600 text-white' : 'border-slate-500 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">{option.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{option.description}</div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-700/50 bg-slate-800/50">
            <p className="text-[11px] text-slate-500 text-center">
              {isClosing
                ? selected === decision.autoChoice && timeLeft <= 0
                  ? `Alex가 자동 판단: "${decision.autoReason}"`
                  : '선택 반영 중...'
                : `${seconds}초 후 Alex가 자동으로 판단합니다`
              }
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

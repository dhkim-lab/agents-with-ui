import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface FinalSnsPopupProps {
  onClose: () => void;
  onNewMission: () => void;
  onRepeat: () => void;
  onPublishToBoard?: () => void;
}

export const FinalSnsPopup: React.FC<FinalSnsPopupProps> = ({ onClose, onNewMission, onRepeat, onPublishToBoard }) => {
  useEffect(() => {
    // Grand finale confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* SNS Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-100">
              AI
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">AI Marketing Team</div>
              <div className="text-xs text-slate-500">Sponsored • 🌐 Global </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* SNS Image/Video Area */}
        <div className="bg-slate-100 aspect-square flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 opacity-90 mix-blend-multiply" />
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Data Analytics" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" />
          
          <div className="relative z-10 text-center p-6">
            <h2 className="text-3xl font-black text-white mb-4 drop-shadow-md leading-tight">
              Transform Your <br/><span className="text-yellow-300">Enterprise</span> ROI
            </h2>
            <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-4 py-1.5 text-sm font-bold shadow-lg">
              [WEBINAR] D-14
            </div>
          </div>
        </div>

        {/* SNS Content */}
        <div className="p-4 bg-white">
          <div className="flex gap-4 mb-3">
            <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">❤️</span>
            <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">💬</span>
            <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">↗️</span>
          </div>
          <div className="text-sm text-slate-800 mb-2">
            <span className="font-bold mr-2">AI Marketing Team</span>
            글로벌 B2B 리드 제너레이션을 위한 완벽한 솔루션. 타겟의 페인포인트를 관통하는 핵심 전략을 지금 무료 웨비나에서 확인하세요! 🚀
          </div>
          <div className="text-blue-500 text-sm font-medium cursor-pointer hover:underline mb-4">
            #B2BMarketing #EnterpriseSaaS #Growth
          </div>
          
          {/* Feedback & Actions */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <h3 className="text-sm font-bold text-slate-800 text-center mb-1">다음 작업을 지시하시겠습니까?</h3>

            {onPublishToBoard && (
              <button
                onClick={onPublishToBoard}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-xs font-bold transition-transform hover:-translate-y-0.5 shadow-md"
              >
                📋 결과 게시판에 공유하기
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={onRepeat}
                className="flex-1 py-2.5 bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-transform hover:-translate-y-0.5"
              >
                🔄 유사 캠페인 반복 스케일링
              </button>
              <button
                onClick={onNewMission}
                className="flex-1 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-transform hover:-translate-y-0.5 shadow-md"
              >
                ✏️ 새로운 미션 부여
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

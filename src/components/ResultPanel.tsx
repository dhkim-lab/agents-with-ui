import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface ResultPanelProps {
  isReady: boolean;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ isReady }) => {
  const [content, setContent] = useState('');

  const finalMarkup = `[CONFIDENTIAL] 마케팅 캠페인 전략 보고서

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 타겟 고객 분석
• 주요 타겟: 실무 매니저 & C레벨 의사결정권자
• 집중 시장: 국내 B2B SaaS 도입 고려 기업
• 핵심 인사이트: 경쟁사 공통 약점 "도입 후 지원 부재"

2. 핵심 메시지 (차별화 포인트)
"검증된 ROI 342% 달성 기업의 선택"
— 도입 사례 기반 신뢰 구축 + ROI 시뮬레이터 CTA

3. 캠페인 퍼널
LinkedIn 광고 → 랜딩페이지(CTR 3.2%)
→ ROI 시뮬레이터(전환 8.5%) → 웨비나 등록
→ 이메일 시퀀스(오픈율 42%) → 영업팀 전달

4. 예산 배분 및 ROI 예측
• LinkedIn: 45% | Google Ads: 25%
• 웨비나: 20% | 이메일: 10%
• 예상 CAC: ₩420,000 | 예상 리드: 340건/월
• 예상 ROI: 285%

5. 실행 계획
• 1일차: 드립 이메일 시퀀스 세팅 (한국어 현지화)
• 3일차: 리드 폼 A/B 테스트 시작
• 7일차: 웨비나 라이브 (국내 시장 맞춤)
• 14일차: 성과 분석 및 2차 최적화

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
작성: AI 마케팅 팀 (Alex·Kai·Mia·Nova·Rex)
상태: 최종 승인 완료 — 자동 배포 대기 중
`;

  useEffect(() => {
    if (isReady) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });

      let i = 0;
      const timer = setInterval(() => {
        setContent(finalMarkup.slice(0, i));
        i += 4;
        if (i > finalMarkup.length) clearInterval(timer);
      }, 12);
      return () => clearInterval(timer);
    } else {
      setContent('');
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-40 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="flex flex-col md:flex-row gap-6 items-center justify-center max-w-4xl w-full"
      >
        {/* Paper Document */}
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-sm flex flex-col relative overflow-hidden text-slate-800 min-h-[500px]">
          <div className="h-7 bg-blue-600 w-full flex items-center px-4 gap-2 shrink-0">
            <span className="text-white text-xs font-bold tracking-wide">📋 마케팅 전략 보고서</span>
            <div className="ml-auto flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
            </div>
          </div>
          <div className="p-6 font-sans whitespace-pre-wrap leading-relaxed text-[12px] overflow-y-auto max-h-[500px]">
            <div className="text-lg font-black mb-3 text-slate-900 border-b-2 border-blue-200 pb-2">
              🏢 AI 마케팅 팀 — 캠페인 전략 플랜
            </div>
            {content}
            {content.length < finalMarkup.length && (
              <span className="inline-block w-2 h-4 bg-slate-800 ml-1 animate-pulse align-middle" />
            )}
          </div>
          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-100 font-bold text-5xl -rotate-45 pointer-events-none whitespace-nowrap z-0 select-none opacity-30">
            CONFIDENTIAL
          </div>
        </div>

        {/* System Message Panel */}
        <div className="w-full md:w-80 flex flex-col justify-center border-l-0 md:border-l border-slate-700 pl-0 md:pl-6 space-y-6">
          <div className="animate-in slide-in-from-right duration-500">
            <h2 className="text-xl text-emerald-400 font-bold flex items-center gap-2 mb-2">
              ✅ 최종 검토 및 시스템 이관
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800 p-4 rounded-lg border border-slate-700">
              AI 팀이 팀장님의 판단을 반영한 마케팅 플랜을 완성했습니다.<br /><br />
              현재 무결성 검증을 거치고 있으며, 시스템 승인 후 <strong>CRM 연동 및 캠페인 채널 자동 배포가 진행됩니다.</strong>
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full animate-[progress_5s_ease-in-out_forwards]" />
              </div>
              <div className="text-xs text-slate-400 text-right font-mono">배포 준비 중...</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

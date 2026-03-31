import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import type { CampaignBrief } from '../types/brief';
import { OBJECTIVE_LABELS } from '../types/brief';

interface ResultPanelProps {
  isReady: boolean;
  brief: CampaignBrief | null;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ isReady, brief }) => {
  const [content, setContent] = useState('');

  const generateMarkup = () => {
    if (!brief) return '';
    
    const objLabel = OBJECTIVE_LABELS[brief.objective] || '마케팅 캠페인';
    const channelList = brief.channels.map(c => c.toUpperCase()).join(', ');
    
    return `[CONFIDENTIAL] ${brief.productName} 전략 보고서

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 캠페인 개요
• 프로젝트명: ${brief.productName}
• 캠페인 목표: ${objLabel}
• 주력 채널: ${channelList}

2. 타겟 고객 분석
• 주요 타겟: ${brief.target.role} (${brief.target.industry})
• 지역 범위: ${brief.target.region}
• 핵심 인사이트: 시장 분석 결과, 타겟 오디언스는 '신뢰성'과 '경험' 중심의 콘텐츠에 가장 높은 반응도를 보임.

3. 핵심 메시지 (차별화 전략)
"성공적인 ${brief.productName}을 위한 AI 기반 최적화 전략"
— 데이터 기반 타겟팅 + 개인화된 메시지 자동 발송 시스템 구축

4. 채널별 예상 퍼널 및 KPI
• 유입: ${brief.channels[0] || 'SNS'} 광고 및 뉴스레터 (CTR 3.5% 목표)
• 전환: 전용 랜딩페이지 시뮬레이션 결과 전환율 9.2% 예상
• 최종 참여: 약 450~600건의 유효 리드 확보 기대

5. 실행 마일스톤
• 1일차: 데이터 동기화 및 타겟 오디언스 세팅 (한국어 최적화)
• 3일차: 모든 크리에이티브 에셋 배포 및 A/B 테스트 개시
• 7일차: 실시간 성과 모니터링 기반 예산 재분배 실행
• 14일차: 캠페인 성과 분석 및 차기 프로젝트 데이터 전이

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
작성: AI 마케팅 팀 (Alex·Kai·Mia·Nova·Rex)
상태: 최종 승인 완료 — 전 채널 자동 배포 실행 중
`;
  };

  const finalMarkup = generateMarkup();

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

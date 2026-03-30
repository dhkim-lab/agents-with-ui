import type { Scenario } from '../types';

export const demoScenario: Scenario = {
  phases: [
    // ─── Phase -1: Daily Routine (무한 루프, 사용자 입력 대기) ───
    {
      id: -1,
      name: "Daily Routine",
      duration: -1, // infinite — waits for user input
      events: [
        { t: 2000, type: 'status', agent: 'Alex', state: 'working', statusText: "어제 캠페인 성과 리포트 검토 중", taskType: 'routine' },
        { t: 2000, type: 'status', agent: 'Kai', state: 'working', statusText: "업계 뉴스 크롤링 중", taskType: 'routine' },
        { t: 2000, type: 'status', agent: 'Mia', state: 'working', statusText: "A/B 테스트 카피 성과 분석 중", taskType: 'routine' },
        { t: 2000, type: 'status', agent: 'Nova', state: 'working', statusText: "4월 캠페인 캘린더 업데이트 중", taskType: 'routine' },
        { t: 2000, type: 'status', agent: 'Rex', state: 'working', statusText: "일일 광고비 소진율 모니터링", taskType: 'routine' },
        { t: 3000, type: 'chat', agent: 'Kai', text: "오늘 오전 트렌드 리포트: SaaS 업계 AI 도입률 전월 대비 12% 상승" },
        { t: 8000, type: 'chat', agent: 'Rex', text: "어제 캠페인 일일 소진율 정상 범위. 이상치 없음" },
        { t: 13000, type: 'chat', agent: 'Nova', text: "4월 캠페인 캘린더 업데이트 완료. Alex에게 공유했습니다" },
        { t: 18000, type: 'chat', agent: 'Mia', text: "지난주 A/B 테스트 결과 — B안 CTR이 23% 높았어요. 다음 배치에 반영할게요" },
        { t: 23000, type: 'chat', agent: 'Alex', text: "확인했어요. 오전 중 주간 리뷰 돌릴게요" },
        // Loop: These repeat every ~28 seconds for continuous routine feel
        { t: 30000, type: 'chat', agent: 'Kai', text: "경쟁사 C사 신규 캠페인 감지. 링크드인 광고 예산 증가 추정" },
        { t: 35000, type: 'chat', agent: 'Rex', text: "오전 트래픽 피크 시간대 진입. 실시간 모니터링 전환합니다" },
        { t: 40000, type: 'chat', agent: 'Mia', text: "뉴스레터 다음 배치 카피 초안 작성 중이에요 ✍️" },
        { t: 45000, type: 'chat', agent: 'Nova', text: "다음주 웨비나 랜딩페이지 A/B 테스트 설계 검토 중" },
        { t: 50000, type: 'chat', agent: 'Alex', text: "주간 KPI 대시보드 업데이트 중. 전환율 전주 대비 +5% 확인" },
      ]
    },

    // ─── Phase 0: 프로젝트 수주 (5초) ───
    {
      id: 0,
      name: "프로젝트 수주",
      duration: 5000,
      events: [
        { t: 0, type: 'sound', soundType: 'notification' },
        { t: 500, type: 'chat', agent: 'Alex', text: "🚨 새 프로젝트가 들어왔습니다. 전원 루틴 업무 홀드하고 대기해주세요." },
        { t: 1500, type: 'status', agent: 'Alex', state: 'idle', statusText: "루틴 작업 저장 중...", taskType: 'project' },
        { t: 1500, type: 'status', agent: 'Kai', state: 'idle', statusText: "루틴 작업 저장 중...", taskType: 'project' },
        { t: 1500, type: 'status', agent: 'Mia', state: 'idle', statusText: "루틴 작업 저장 중...", taskType: 'project' },
        { t: 1500, type: 'status', agent: 'Nova', state: 'idle', statusText: "루틴 작업 저장 중...", taskType: 'project' },
        { t: 1500, type: 'status', agent: 'Rex', state: 'idle', statusText: "루틴 작업 저장 중...", taskType: 'project' },
        { t: 3000, type: 'chat', agent: 'Alex', text: "미션 접수 완료. 킥오프 회의 시작합니다. 회의실로 모여주세요." },
      ]
    },

    // ─── Phase 1: 킥오프 회의 (15초) ───
    {
      id: 1,
      name: "Phase 1 - 킥오프 회의",
      duration: 15000,
      events: [
        { t: 0, type: 'move', agent: 'all', to: 'meeting_room' },
        { t: 3000, type: 'chat', agent: 'Alex', text: "이번 미션을 분석해봤습니다. 각자 역할 배분하겠습니다." },
        { t: 5000, type: 'chat', agent: 'Kai', text: "시장 조사 및 경쟁사 분석 착수하겠습니다." },
        { t: 6500, type: 'chat', agent: 'Nova', text: "캠페인 퍼널 및 채널 전략 설계 맡겠습니다." },
        { t: 8000, type: 'chat', agent: 'Rex', text: "타겟 데이터 및 예산 최적화 분석 돌리겠습니다." },
        { t: 9000, type: 'chat', agent: 'Mia', text: "Kai 리서치 결과 오면 바로 카피 작업 들어갈게요." },
        { t: 10000, type: 'status', agent: 'Mia', state: 'waiting', statusText: "리서치 결과 대기 중", taskType: 'project' },
        { t: 11000, type: 'chat', agent: 'Alex', text: "좋습니다. 각자 자리로 복귀해서 시작합시다." },
      ]
    },

    // ─── Phase 2: 병렬 작업 (35초 + DP1 30초) ───
    {
      id: 2,
      name: "Phase 2 - 병렬 작업",
      duration: 60000, // 35s work + up to 30s for DP1 timeout (engine pauses during DP)
      events: [
        { t: 0, type: 'move', agent: 'all', to: 'desk' },
        { t: 2000, type: 'status', agent: 'Kai', state: 'working', progress: 10, statusText: "시장 데이터 수집 시작", taskType: 'project' },
        { t: 2000, type: 'status', agent: 'Nova', state: 'working', progress: 10, statusText: "퍼널 프레임워크 세팅", taskType: 'project' },
        { t: 2000, type: 'status', agent: 'Rex', state: 'working', progress: 15, statusText: "기존 캠페인 데이터 추출", taskType: 'project' },

        { t: 5000, type: 'chat', agent: 'Kai', text: "국내 시장 데이터부터 수집 중입니다. 2025 Q4 보고서는 최신성이 떨어져서 2026 Q1 자료로 교체합니다.", tag: 'insight' },
        { t: 7000, type: 'status', agent: 'Kai', state: 'working', progress: 35, statusText: "경쟁사 3사 전략 크롤링 중", taskType: 'project' },

        { t: 10000, type: 'chat', agent: 'Kai', text: "⚠️ 경쟁사 B사 웹사이트 크롤링 중 접근 차단 발생. 공개 IR 자료와 뉴스 데이터로 우회 분석합니다.", tag: 'error' },
        { t: 12000, type: 'status', agent: 'Kai', state: 'working', progress: 55, statusText: "[우회] 공개 데이터 기반 분석 전환", taskType: 'project' },

        { t: 14000, type: 'chat', agent: 'Nova', text: "한국 시장은 웨비나 전환율이 글로벌 평균보다 낮습니다. 카카오톡 채널 유입 경로를 병행 설계합니다.", tag: 'insight' },
        { t: 16000, type: 'status', agent: 'Rex', state: 'working', progress: 45, statusText: "이상치 필터링 후 가중치 재조정", taskType: 'project' },
        { t: 17000, type: 'chat', agent: 'Rex', text: "아시아 시장 데이터에서 계절성 이상치 발견. 필터링 후 보정 모델 적용합니다.", tag: 'insight' },

        { t: 19000, type: 'status', agent: 'Kai', state: 'done', progress: 100, statusText: "시장 분석 완료", taskType: 'project' },
        { t: 19000, type: 'sound', soundType: 'complete' },
        { t: 20000, type: 'artifact', agent: 'Kai', artifactType: 'table', title: '경쟁사 비교 분석표',
          content: `<table><thead><tr><th>항목</th><th>A사</th><th>B사</th><th>C사</th><th>우리</th></tr></thead><tbody><tr><td>시장 점유율</td><td>32%</td><td>24%</td><td>18%</td><td>12%</td></tr><tr><td>주력 채널</td><td>LinkedIn</td><td>Google Ads</td><td>웨비나</td><td>콘텐츠</td></tr><tr><td>평균 CAC</td><td>₩720,000</td><td>₩450,000</td><td>₩380,000</td><td>₩520,000</td></tr><tr><td>도입 후 지원</td><td>보통</td><td>약함</td><td>약함</td><td>강함</td></tr><tr><td>AI 기능</td><td>있음</td><td>없음</td><td>부분</td><td>있음</td></tr></tbody></table>` },

        { t: 21000, type: 'chat', agent: 'Kai', text: "분석 핵심: 경쟁사 공통 약점은 '도입 후 지원 부재'. 이걸 차별화 포인트로 가져가면 됩니다. Mia에게 전달합니다." },
        { t: 22000, type: 'file_transfer', from: 'Kai', to: 'Mia' },
        { t: 23000, type: 'status', agent: 'Mia', state: 'working', progress: 10, statusText: "리서치 수령 완료. 카피 작업 시작", taskType: 'project' },

        // DP1: 타겟 범위 선택
        { t: 25000, type: 'sound', soundType: 'notification' },
        { t: 25000, type: 'decision_point',
          question: "팀장님, Kai의 리서치 결과 C레벨과 실무 매니저 두 세그먼트 모두 가능성이 있습니다. 어디에 집중할까요?",
          options: [
            { label: "C레벨 집중", description: "딜 사이즈 크지만 전환 기간이 길어요 (예상 CAC ₩850,000)" },
            { label: "실무 매니저 포함", description: "볼륨 크고 빠르지만 단가 낮아요 (예상 CAC ₩320,000)" },
          ],
          autoChoice: 1,
          autoReason: "예산 규모와 캠페인 기간 고려 시 실무 매니저 포함이 ROI 효율적이라 판단했습니다",
          timeout: 30000
        },
        // Post-DP1
        { t: 26000, type: 'chat', agent: 'Alex', text: "방향 확인했습니다. 해당 기준으로 진행하겠습니다." },
      ]
    },

    // ─── Phase 3: 심화 작업 (30초 + DP2/DP3) ───
    {
      id: 3,
      name: "Phase 3 - 심화 작업",
      duration: 65000,
      events: [
        { t: 0, type: 'status', agent: 'Nova', state: 'working', progress: 60, statusText: "DP1 결과 반영하여 퍼널 재설계", taskType: 'project' },
        { t: 2000, type: 'status', agent: 'Mia', state: 'working', progress: 40, statusText: "카피 초안 작성 중", taskType: 'project' },

        { t: 4000, type: 'chat', agent: 'Mia', text: "B2B 타겟 특성상 '무료 체험'보다 '도입 사례 기반 ROI 시뮬레이터' CTA가 전환율이 높습니다. 이 방향으로 잡겠습니다.", tag: 'insight' },

        { t: 7000, type: 'routine_alert', agent: 'Rex', text: "💡 참고: 기존 캠페인 일일 소진율이 평소보다 12% 높습니다. 프로젝트 끝나면 확인 필요합니다." },

        { t: 10000, type: 'status', agent: 'Mia', state: 'working', progress: 75, statusText: "카피 A안/B안 작성 완료, 최종 검수", taskType: 'project' },
        { t: 12000, type: 'status', agent: 'Mia', state: 'done', progress: 100, statusText: "카피 2종 완성", taskType: 'project' },
        { t: 12000, type: 'sound', soundType: 'complete' },

        { t: 13000, type: 'artifact', agent: 'Mia', artifactType: 'copy', title: '광고 카피 A안/B안',
          content: `<div class="space-y-4"><div class="border border-emerald-500/30 rounded-lg p-4"><h4 class="text-emerald-400 font-bold mb-2">A안 — 데이터 신뢰 톤</h4><p class="text-lg font-bold text-white">"검증된 ROI 342% 달성 기업의 선택"</p><p class="text-slate-300 text-sm mt-1">도입 3개월 만에 마케팅 비용 42% 절감. 50개 엔터프라이즈가 선택한 이유를 확인하세요.</p><p class="text-blue-400 text-xs mt-2">CTA: ROI 시뮬레이터 무료 체험 →</p></div><div class="border border-amber-500/30 rounded-lg p-4"><h4 class="text-amber-400 font-bold mb-2">B안 — 위기감 소구 톤</h4><p class="text-lg font-bold text-white">"아직도 수작업으로 마케팅 하시나요?"</p><p class="text-slate-300 text-sm mt-1">경쟁사는 이미 AI로 전환했습니다. 매월 120시간의 반복 업무, 자동화할 준비 되셨나요?</p><p class="text-blue-400 text-xs mt-2">CTA: 자동화 진단 리포트 받기 →</p></div></div>` },

        // DP2: 카피 톤 선택
        { t: 15000, type: 'sound', soundType: 'notification' },
        { t: 15000, type: 'decision_point',
          question: "팀장님, Mia가 카피 초안 2종을 준비했습니다. 어느 방향으로 갈까요?",
          options: [
            { label: "데이터 신뢰 톤", description: "\"검증된 ROI 342% 달성 기업의 선택\" — B2B 신뢰 기반" },
            { label: "위기감 소구 톤", description: "\"아직도 수작업으로 마케팅 하시나요?\" — 긴급성 자극" },
          ],
          autoChoice: 0,
          autoReason: "B2B 타겟 특성상 신뢰 기반 톤이 전환율 1.8배 높다는 Kai의 데이터 근거입니다",
          timeout: 30000
        },
        { t: 16000, type: 'chat', agent: 'Mia', text: "확인! 해당 방향으로 최종 카피 확정합니다." },

        { t: 18000, type: 'status', agent: 'Nova', state: 'done', progress: 100, statusText: "퍼널 설계 완료", taskType: 'project' },
        { t: 18000, type: 'sound', soundType: 'complete' },
        { t: 19000, type: 'artifact', agent: 'Nova', artifactType: 'diagram', title: '캠페인 퍼널 다이어그램',
          content: `<div class="space-y-2"><div class="flex items-center gap-2"><div class="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg flex-1 text-center">LinkedIn 광고<br/><span class="text-blue-200">타겟 노출 10,000</span></div><div class="text-slate-500">→</div><div class="bg-blue-500 text-white text-xs px-3 py-2 rounded-lg flex-1 text-center">랜딩페이지<br/><span class="text-blue-200">CTR 3.2%</span></div><div class="text-slate-500">→</div><div class="bg-indigo-600 text-white text-xs px-3 py-2 rounded-lg flex-1 text-center">ROI 시뮬레이터<br/><span class="text-indigo-200">전환 8.5%</span></div></div><div class="flex items-center gap-2 mt-1"><div class="bg-purple-600 text-white text-xs px-3 py-2 rounded-lg flex-1 text-center">웨비나 등록<br/><span class="text-purple-200">등록률 24%</span></div><div class="text-slate-500">→</div><div class="bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg flex-1 text-center">이메일 시퀀스<br/><span class="text-emerald-200">오픈율 42%</span></div><div class="text-slate-500">→</div><div class="bg-amber-600 text-white text-xs px-3 py-2 rounded-lg flex-1 text-center">영업팀 전달<br/><span class="text-amber-200">MQL→SQL 18%</span></div></div></div>` },

        { t: 22000, type: 'status', agent: 'Rex', state: 'done', progress: 100, statusText: "예산 분석 완료", taskType: 'project' },
        { t: 22000, type: 'sound', soundType: 'complete' },
        { t: 23000, type: 'artifact', agent: 'Rex', artifactType: 'chart', title: '예산 배분 및 ROI 예측',
          content: `<div class="space-y-3"><div class="space-y-2"><div class="flex items-center gap-2"><span class="text-xs text-slate-400 w-20">LinkedIn</span><div class="flex-1 bg-slate-700 rounded-full h-5"><div class="bg-blue-500 h-5 rounded-full flex items-center justify-center text-[10px] text-white" style="width:45%">45%</div></div></div><div class="flex items-center gap-2"><span class="text-xs text-slate-400 w-20">Google Ads</span><div class="flex-1 bg-slate-700 rounded-full h-5"><div class="bg-emerald-500 h-5 rounded-full flex items-center justify-center text-[10px] text-white" style="width:25%">25%</div></div></div><div class="flex items-center gap-2"><span class="text-xs text-slate-400 w-20">웨비나</span><div class="flex-1 bg-slate-700 rounded-full h-5"><div class="bg-purple-500 h-5 rounded-full flex items-center justify-center text-[10px] text-white" style="width:20%">20%</div></div></div><div class="flex items-center gap-2"><span class="text-xs text-slate-400 w-20">이메일</span><div class="flex-1 bg-slate-700 rounded-full h-5"><div class="bg-amber-500 h-5 rounded-full flex items-center justify-center text-[10px] text-white" style="width:10%">10%</div></div></div></div><div class="border-t border-slate-600 pt-2 mt-2 grid grid-cols-3 gap-2 text-center"><div><p class="text-[10px] text-slate-400">예상 CAC</p><p class="text-sm font-bold text-white">₩420,000</p></div><div><p class="text-[10px] text-slate-400">예상 리드</p><p class="text-sm font-bold text-emerald-400">340건/월</p></div><div><p class="text-[10px] text-slate-400">예상 ROI</p><p class="text-sm font-bold text-amber-400">285%</p></div></div></div>` },

        // DP3: 예산 배분 선택
        { t: 25000, type: 'sound', soundType: 'notification' },
        { t: 25000, type: 'decision_point',
          question: "팀장님, Rex의 분석 결과 두 가지 배분 전략이 있습니다.",
          options: [
            { label: "링크드인 올인", description: "70:30 배분, 단기 리드 확보에 유리" },
            { label: "2단계 전략", description: "1차 리타겟팅 풀 확보(40%) 후 2차 집중 투입(60%) — 장기 LTV 유리" },
          ],
          autoChoice: 1,
          autoReason: "CAC 최적화 관점에서 2단계 전략이 장기 LTV에 유리합니다",
          timeout: 30000
        },
        { t: 26000, type: 'chat', agent: 'Rex', text: "확인. 해당 전략으로 최종 예산 모델 확정합니다." },
      ]
    },

    // ─── Phase 4: 결과물 통합 (15초) ───
    {
      id: 4,
      name: "Phase 4 - 결과물 통합",
      duration: 15000,
      events: [
        { t: 1000, type: 'chat', agent: 'Alex', text: "모든 작업이 완료되었습니다. 결과물 취합하겠습니다." },
        { t: 2000, type: 'file_transfer', from: 'Kai', to: 'Alex' },
        { t: 2500, type: 'file_transfer', from: 'Nova', to: 'Alex' },
        { t: 3000, type: 'file_transfer', from: 'Rex', to: 'Alex' },
        { t: 3500, type: 'file_transfer', from: 'Mia', to: 'Alex' },
        { t: 5000, type: 'status', agent: 'Alex', state: 'working', progress: 50, statusText: "최종 마케팅 플랜 컴파일 중", taskType: 'project' },
        { t: 8000, type: 'chat', agent: 'Alex', text: "팀장님의 판단이 반영된 최종 마케팅 캠페인 플랜입니다." },
        { t: 9000, type: 'status', agent: 'Alex', state: 'done', progress: 100, statusText: "최종 마케팅 플랜 완성", taskType: 'project' },
        { t: 10000, type: 'sound', soundType: 'complete' },
        { t: 10000, type: 'result_ready', resultType: 'final', content: "마케팅 플랜 문서 통합 완료" },
      ]
    },

    // ─── Phase 5: 전략 컨펌 및 뷰어 팝업 (5초) ───
    {
      id: 5,
      name: "Phase 5 - 전략 컨펌",
      duration: 5000,
      events: []
    },

    // ─── Phase 6: 배포 & 루틴 복귀 (12초) ───
    {
      id: 6,
      name: "Phase 6 - 배포 & 루틴 복귀",
      duration: 12000,
      events: [
        { t: 1000, type: 'status', agent: 'Alex', state: 'working', progress: 20, statusText: "CRM 연동 및 캠페인 에셋 업로드 중", taskType: 'project' },
        { t: 3000, type: 'chat', agent: 'Alex', text: "사내 CRM 연동 완료. 캠페인 에셋 업로드 완료." },
        { t: 4000, type: 'status', agent: 'Alex', state: 'working', progress: 80, statusText: "캠페인 채널 라이브 세팅 중", taskType: 'project' },
        { t: 6000, type: 'chat', agent: 'Alex', text: "✅ 캠페인 전 채널 온에어 배포 완료.", tag: 'success' },
        { t: 7000, type: 'chat', agent: 'Alex', text: "프로젝트 완료. 팀원들은 루틴 업무로 복귀합니다." },
        { t: 8000, type: 'status', agent: 'Alex', state: 'working', statusText: "주간 성과 리포트 업데이트", taskType: 'routine' },
        { t: 8000, type: 'status', agent: 'Kai', state: 'working', statusText: "경쟁사 모니터링 복귀", taskType: 'routine' },
        { t: 8000, type: 'status', agent: 'Mia', state: 'working', statusText: "뉴스레터 카피 작업 복귀", taskType: 'routine' },
        { t: 8000, type: 'status', agent: 'Nova', state: 'working', statusText: "캠페인 캘린더 업데이트 복귀", taskType: 'routine' },
        { t: 8000, type: 'status', agent: 'Rex', state: 'working', statusText: "일일 소진율 모니터링 복귀", taskType: 'routine' },
        { t: 10000, type: 'publish_done' },
      ]
    }
  ]
};

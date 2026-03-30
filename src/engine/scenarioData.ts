import type { Scenario, ScenarioEvent } from '../types';
import type { CampaignBrief } from '../types/brief';
import { OBJECTIVE_LABELS, BUDGET_LABELS, CHANNELS } from '../types/brief';

// Helper: get channel labels from IDs
function channelLabels(ids: string[]): string {
  return ids
    .map(id => CHANNELS.find(c => c.id === id)?.label ?? id)
    .join(', ');
}

// Helper: top 2 channels for budget allocation chart
function topChannels(ids: string[]): { name: string; pct: number; color: string }[] {
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500', 'bg-cyan-500', 'bg-red-500', 'bg-indigo-500'];
  const total = ids.length;
  return ids.map((id, i) => {
    const ch = CHANNELS.find(c => c.id === id);
    const pct = Math.round((total > 1 ? (total - i) / ((total * (total + 1)) / 2) : 1) * 100);
    return { name: ch?.label ?? id, pct, color: colors[i % colors.length] };
  });
}

function buildCardNewsSlides(productName: string, industry: string, accentColor: string): string {
  const slides = [
    {
      id: 1, type: 'cover',
      bgGradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%)',
      headline: `${productName}`,
      body: `${industry} 마케팅의 새로운 패러다임`,
      accentColor,
    },
    {
      id: 2, type: 'problem',
      bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      headline: '이런 경험 있으신가요?',
      body: `❌ 반복적인 수작업 마케팅\n❌ 예산 대비 낮은 ROI\n❌ 경쟁사 대비 느린 의사결정`,
      accentColor: '#f87171',
    },
    {
      id: 3, type: 'solution',
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      headline: `${productName}이 해결합니다`,
      body: `✅ AI 기반 자동화 마케팅\n✅ 데이터 드리븐 예산 최적화\n✅ 실시간 경쟁사 모니터링`,
      accentColor: '#34d399',
    },
    {
      id: 4, type: 'data',
      bgGradient: 'linear-gradient(135deg, #0c1222 0%, #1a1a3e 100%)',
      headline: '검증된 성과',
      body: '',
      accentColor: '#60a5fa',
      dataPoints: [
        { label: '마케팅 비용 절감', value: '42%↓' },
        { label: '평균 ROI', value: '342%' },
        { label: '전환율 향상', value: '2.3x' },
        { label: '업무 시간 단축', value: '120h/월' },
      ],
    },
    {
      id: 5, type: 'proof',
      bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)',
      headline: '"도입 3개월 만에 성과가 나왔습니다"',
      body: `— ${industry} 선도기업 마케팅 총괄\n\n50개 이상의 기업이 이미 ${productName}을 통해\n마케팅 효율을 극대화하고 있습니다.`,
      accentColor: '#c084fc',
    },
    {
      id: 6, type: 'cta',
      bgGradient: `linear-gradient(135deg, #1e293b 0%, #1e1b4b 50%, #312e81 100%)`,
      headline: '지금 시작하세요',
      body: `${productName}과 함께\n${industry} 마케팅의 미래를 경험하세요`,
      accentColor,
      ctaText: 'ROI 시뮬레이터 체험하기 →',
    },
  ];
  return JSON.stringify(slides);
}

export function buildScenarioFromBrief(brief: CampaignBrief): Scenario {
  const { productName, objective, target, budget, channels, language } = brief;
  const objLabel = OBJECTIVE_LABELS[objective];
  const budgetLabel = BUDGET_LABELS[budget];
  const channelStr = channelLabels(channels);
  const regionStr = target.region;
  const industryStr = target.industry;
  const roleStr = target.role;
  const langLabel = language === 'ko' ? '한국어' : language === 'en' ? 'English' : '다국어';

  // Build channel allocation for Rex's chart
  const chAlloc = topChannels(channels);
  const budgetChartHTML = `<div class="space-y-3"><div class="space-y-2">${chAlloc.map(c =>
    `<div class="flex items-center gap-2"><span class="text-xs text-slate-400 w-24">${c.name}</span><div class="flex-1 bg-slate-700 rounded-full h-5"><div class="${c.color} h-5 rounded-full flex items-center justify-center text-[10px] text-white" style="width:${c.pct}%">${c.pct}%</div></div></div>`
  ).join('')}</div><div class="border-t border-slate-600 pt-2 mt-2 grid grid-cols-3 gap-2 text-center"><div><p class="text-[10px] text-slate-400">예상 CAC</p><p class="text-sm font-bold text-white">₩420,000</p></div><div><p class="text-[10px] text-slate-400">예상 리드</p><p class="text-sm font-bold text-emerald-400">340건/월</p></div><div><p class="text-[10px] text-slate-400">예상 ROI</p><p class="text-sm font-bold text-amber-400">285%</p></div></div></div>`;

  // Build funnel diagram based on selected channels (show up to 6 steps)
  const funnelSteps = [
    ...channels.slice(0, 2).map(id => {
      const ch = CHANNELS.find(c => c.id === id);
      return { label: `${ch?.label ?? id} 광고`, sub: '타겟 노출', color: 'bg-blue-600' };
    }),
    { label: '랜딩페이지', sub: 'CTR 3.2%', color: 'bg-blue-500' },
    { label: 'ROI 시뮬레이터', sub: '전환 8.5%', color: 'bg-indigo-600' },
    { label: '이메일 시퀀스', sub: '오픈율 42%', color: 'bg-emerald-600' },
    { label: '영업팀 전달', sub: 'MQL→SQL 18%', color: 'bg-amber-600' },
  ];
  const funnelHTML = `<div class="space-y-2"><div class="flex items-center gap-2 flex-wrap">${funnelSteps.map((s, i) =>
    `${i > 0 ? '<div class="text-slate-500">→</div>' : ''}<div class="${s.color} text-white text-xs px-3 py-2 rounded-lg flex-1 text-center min-w-[80px]">${s.label}<br/><span class="opacity-70">${s.sub}</span></div>`
  ).join('')}</div></div>`;

  const phases: Scenario['phases'] = [
    // ─── Phase -1: Daily Routine ───
    {
      id: -1,
      name: "Daily Routine",
      duration: -1,
      events: [
        { t: 2000, type: 'status', agent: 'Alex', state: 'working', statusText: "어제 캠페인 성과 리포트 검토 중", taskType: 'routine' },
        { t: 2000, type: 'status', agent: 'Kai', state: 'working', statusText: `${industryStr} 업계 뉴스 크롤링 중`, taskType: 'routine' },
        { t: 2000, type: 'status', agent: 'Mia', state: 'working', statusText: "A/B 테스트 카피 성과 분석 중", taskType: 'routine' },
        { t: 2000, type: 'status', agent: 'Nova', state: 'working', statusText: "캠페인 캘린더 업데이트 중", taskType: 'routine' },
        { t: 2000, type: 'status', agent: 'Rex', state: 'working', statusText: "일일 광고비 소진율 모니터링", taskType: 'routine' },
        { t: 3000, type: 'chat', agent: 'Kai', text: `오늘 오전 트렌드 리포트: ${industryStr} 업계 AI 도입률 전월 대비 12% 상승` },
        { t: 8000, type: 'chat', agent: 'Rex', text: "어제 캠페인 일일 소진율 정상 범위. 이상치 없음" },
        { t: 13000, type: 'chat', agent: 'Nova', text: "캠페인 캘린더 업데이트 완료. Alex에게 공유했습니다" },
        { t: 18000, type: 'chat', agent: 'Mia', text: "지난주 A/B 테스트 결과 — B안 CTR이 23% 높았어요. 다음 배치에 반영할게요" },
        { t: 23000, type: 'chat', agent: 'Alex', text: "확인했어요. 오전 중 주간 리뷰 돌릴게요" },
        { t: 30000, type: 'chat', agent: 'Kai', text: `경쟁사 신규 캠페인 감지. ${channelStr} 광고 예산 증가 추정` },
        { t: 35000, type: 'chat', agent: 'Rex', text: "오전 트래픽 피크 시간대 진입. 실시간 모니터링 전환합니다" },
        { t: 40000, type: 'chat', agent: 'Mia', text: "뉴스레터 다음 배치 카피 초안 작성 중이에요 ✍️" },
        { t: 45000, type: 'chat', agent: 'Nova', text: "다음주 웨비나 랜딩페이지 A/B 테스트 설계 검토 중" },
        { t: 50000, type: 'chat', agent: 'Alex', text: "주간 KPI 대시보드 업데이트 중. 전환율 전주 대비 +5% 확인" },
      ] as ScenarioEvent[]
    },

    // ─── Phase 0: 프로젝트 수주 ───
    {
      id: 0,
      name: "프로젝트 수주",
      duration: 5000,
      events: [
        { t: 0, type: 'sound', soundType: 'notification' },
        { t: 500, type: 'chat', agent: 'Alex', text: `🚨 새 프로젝트: "${productName}" ${objLabel} 캠페인이 들어왔습니다. 전원 루틴 홀드!` },
        { t: 1500, type: 'status', agent: 'Alex', state: 'idle', statusText: "루틴 작업 저장 중...", taskType: 'project' },
        { t: 1500, type: 'status', agent: 'Kai', state: 'idle', statusText: "루틴 작업 저장 중...", taskType: 'project' },
        { t: 1500, type: 'status', agent: 'Mia', state: 'idle', statusText: "루틴 작업 저장 중...", taskType: 'project' },
        { t: 1500, type: 'status', agent: 'Nova', state: 'idle', statusText: "루틴 작업 저장 중...", taskType: 'project' },
        { t: 1500, type: 'status', agent: 'Rex', state: 'idle', statusText: "루틴 작업 저장 중...", taskType: 'project' },
        { t: 3000, type: 'chat', agent: 'Alex', text: "미션 접수 완료. 킥오프 회의 시작합니다. 회의실로 모여주세요." },
      ] as ScenarioEvent[]
    },

    // ─── Phase 1: 킥오프 회의 ───
    {
      id: 1,
      name: "Phase 1 - 킥오프 회의",
      duration: 15000,
      events: [
        { t: 0, type: 'move', agent: 'all', to: 'meeting_room' },
        { t: 3000, type: 'chat', agent: 'Alex', text: `브리프 분석: "${productName}" — 목표: ${objLabel}, 타겟: ${roleStr}/${industryStr}/${regionStr}, 예산: ${budgetLabel}, 채널: ${channelStr}, 언어: ${langLabel}` },
        { t: 5000, type: 'chat', agent: 'Kai', text: `${industryStr} 업계 시장 조사 및 경쟁사 분석 착수하겠습니다.` },
        { t: 6500, type: 'chat', agent: 'Nova', text: `${channelStr} 기반 캠페인 퍼널 설계 맡겠습니다.` },
        { t: 8000, type: 'chat', agent: 'Rex', text: `${roleStr} 타겟 데이터 및 ${budgetLabel} 범위 예산 최적화 분석 돌리겠습니다.` },
        { t: 9000, type: 'chat', agent: 'Mia', text: "Kai 리서치 결과 오면 바로 카피 작업 들어갈게요." },
        { t: 10000, type: 'status', agent: 'Mia', state: 'waiting', statusText: "리서치 결과 대기 중", taskType: 'project' },
        { t: 11000, type: 'chat', agent: 'Alex', text: "좋습니다. 각자 자리로 복귀해서 시작합시다." },
      ] as ScenarioEvent[]
    },

    // ─── Phase 2: 병렬 작업 + DP1 ───
    {
      id: 2,
      name: "Phase 2 - 병렬 작업",
      duration: 60000,
      events: [
        { t: 0, type: 'move', agent: 'all', to: 'desk' },
        { t: 2000, type: 'status', agent: 'Kai', state: 'working', progress: 10, statusText: `${industryStr} 시장 데이터 수집 시작`, taskType: 'project' },
        { t: 2000, type: 'status', agent: 'Nova', state: 'working', progress: 10, statusText: "퍼널 프레임워크 세팅", taskType: 'project' },
        { t: 2000, type: 'status', agent: 'Rex', state: 'working', progress: 15, statusText: "기존 캠페인 데이터 추출", taskType: 'project' },

        { t: 5000, type: 'chat', agent: 'Kai', text: `${regionStr} ${industryStr} 시장 데이터 수집 중. 최신 분기 자료로 교체합니다.`, tag: 'insight' },
        { t: 7000, type: 'status', agent: 'Kai', state: 'working', progress: 35, statusText: "경쟁사 3사 전략 크롤링 중", taskType: 'project' },

        { t: 10000, type: 'chat', agent: 'Kai', text: "⚠️ 경쟁사 B사 웹사이트 크롤링 중 접근 차단 발생. 공개 IR 자료와 뉴스 데이터로 우회 분석합니다.", tag: 'error' },
        { t: 12000, type: 'status', agent: 'Kai', state: 'working', progress: 55, statusText: "[우회] 공개 데이터 기반 분석 전환", taskType: 'project' },

        { t: 14000, type: 'chat', agent: 'Nova', text: `${regionStr} 시장 특성 반영: ${channelStr} 채널 유입 경로를 병행 설계합니다.`, tag: 'insight' },
        { t: 16000, type: 'status', agent: 'Rex', state: 'working', progress: 45, statusText: "이상치 필터링 후 가중치 재조정", taskType: 'project' },
        { t: 17000, type: 'chat', agent: 'Rex', text: `${regionStr} 시장 데이터에서 계절성 이상치 발견. 필터링 후 보정 모델 적용합니다.`, tag: 'insight' },

        { t: 19000, type: 'status', agent: 'Kai', state: 'done', progress: 100, statusText: "시장 분석 완료", taskType: 'project' },
        { t: 19000, type: 'sound', soundType: 'complete' },
        { t: 20000, type: 'artifact', agent: 'Kai', artifactType: 'table', title: `${productName} 경쟁사 비교 분석표`,
          content: `<table><thead><tr><th>항목</th><th>A사</th><th>B사</th><th>C사</th><th>${productName}</th></tr></thead><tbody><tr><td>시장 점유율</td><td>32%</td><td>24%</td><td>18%</td><td>12%</td></tr><tr><td>주력 채널</td><td>LinkedIn</td><td>Google Ads</td><td>웨비나</td><td>${channelStr}</td></tr><tr><td>평균 CAC</td><td>₩720,000</td><td>₩450,000</td><td>₩380,000</td><td>₩520,000</td></tr><tr><td>도입 후 지원</td><td>보통</td><td>약함</td><td>약함</td><td>강함</td></tr><tr><td>AI 기능</td><td>있음</td><td>없음</td><td>부분</td><td>있음</td></tr></tbody></table>` },

        // Persona cards
        { t: 20500, type: 'artifact', agent: 'Kai', artifactType: 'table', title: `${roleStr} 바이어 퍼소나 3종`,
          content: `<div class="space-y-2"><div class="border border-blue-500/30 rounded-lg p-3"><div class="flex items-center gap-2 mb-1"><span class="text-lg">👤</span><div><span class="text-sm font-bold text-blue-300">김부장 (45세)</span><span class="text-[10px] text-slate-500 ml-2">${industryStr} 기업 팀장</span></div></div><p class="text-xs text-slate-400">예산 승인 권한 보유. ROI 데이터와 동종업계 사례에 민감. 주 정보원: LinkedIn, 업계 웨비나</p></div><div class="border border-purple-500/30 rounded-lg p-3"><div class="flex items-center gap-2 mb-1"><span class="text-lg">👩</span><div><span class="text-sm font-bold text-purple-300">이과장 (32세)</span><span class="text-[10px] text-slate-500 ml-2">마케팅 실무 매니저</span></div></div><p class="text-xs text-slate-400">현업 실무자. 도구 편의성과 시간 절감에 관심. 주 정보원: 블로그, 이메일 뉴스레터</p></div><div class="border border-emerald-500/30 rounded-lg p-3"><div class="flex items-center gap-2 mb-1"><span class="text-lg">👨</span><div><span class="text-sm font-bold text-emerald-300">박대리 (28세)</span><span class="text-[10px] text-slate-500 ml-2">주니어 마케터</span></div></div><p class="text-xs text-slate-400">트렌드 민감. 무료 체험과 커뮤니티 리뷰 중시. 주 정보원: Instagram, YouTube</p></div></div>` },

        { t: 21000, type: 'chat', agent: 'Kai', text: `분석 핵심: ${industryStr} 경쟁사 공통 약점은 '도입 후 지원 부재'. 이걸 ${productName}의 차별화 포인트로 가져갑니다. 퍼소나 3종과 함께 Mia에게 전달합니다.` },
        { t: 22000, type: 'file_transfer', from: 'Kai', to: 'Mia' },
        { t: 23000, type: 'status', agent: 'Mia', state: 'working', progress: 10, statusText: "리서치 수령 완료. 카피 작업 시작", taskType: 'project' },

        // DP1: 타겟 범위 선택
        { t: 25000, type: 'sound', soundType: 'notification' },
        { t: 25000, type: 'decision_point',
          question: `팀장님, Kai의 리서치 결과 ${roleStr}과 실무 매니저 두 세그먼트 모두 가능성이 있습니다. 어디에 집중할까요?`,
          options: [
            { label: `${roleStr} 집중`, description: "딜 사이즈 크지만 전환 기간이 길어요 (예상 CAC ₩850,000)" },
            { label: "실무 매니저 포함", description: "볼륨 크고 빠르지만 단가 낮아요 (예상 CAC ₩320,000)" },
          ],
          autoChoice: 1,
          autoReason: `${budgetLabel} 예산 규모 고려 시 실무 매니저 포함이 ROI 효율적이라 판단했습니다`,
          timeout: 30000
        },
        { t: 26000, type: 'chat', agent: 'Alex', text: "방향 확인했습니다. 해당 기준으로 진행하겠습니다." },
      ] as ScenarioEvent[]
    },

    // ─── Phase 3: 심화 작업 + DP2/DP3 ───
    {
      id: 3,
      name: "Phase 3 - 심화 작업",
      duration: 65000,
      events: [
        { t: 0, type: 'status', agent: 'Nova', state: 'working', progress: 60, statusText: "DP1 결과 반영하여 퍼널 재설계", taskType: 'project' },
        { t: 2000, type: 'status', agent: 'Mia', state: 'working', progress: 40, statusText: `${productName} 카피 초안 작성 중`, taskType: 'project' },

        { t: 4000, type: 'chat', agent: 'Mia', text: `${roleStr} 타겟 특성상 '무료 체험'보다 '도입 사례 기반 ROI 시뮬레이터' CTA가 전환율이 높습니다. 이 방향으로 잡겠습니다.`, tag: 'insight' },

        { t: 7000, type: 'routine_alert', agent: 'Rex', text: "💡 참고: 기존 캠페인 일일 소진율이 평소보다 12% 높습니다. 프로젝트 끝나면 확인 필요합니다." },

        { t: 10000, type: 'status', agent: 'Mia', state: 'working', progress: 75, statusText: "카피 A안/B안 작성 완료, 최종 검수", taskType: 'project' },
        { t: 12000, type: 'status', agent: 'Mia', state: 'done', progress: 100, statusText: "카피 2종 완성", taskType: 'project' },
        { t: 12000, type: 'sound', soundType: 'complete' },

        { t: 13000, type: 'artifact', agent: 'Mia', artifactType: 'copy', title: `${productName} 광고 카피 A안/B안`,
          content: `<div class="space-y-4"><div class="border border-emerald-500/30 rounded-lg p-4"><h4 class="text-emerald-400 font-bold mb-2">A안 — 데이터 신뢰 톤</h4><p class="text-lg font-bold text-white">"검증된 ROI 342% — ${productName} 도입 기업의 선택"</p><p class="text-slate-300 text-sm mt-1">도입 3개월 만에 마케팅 비용 42% 절감. ${industryStr} 50개 기업이 선택한 이유를 확인하세요.</p><p class="text-blue-400 text-xs mt-2">CTA: ROI 시뮬레이터 무료 체험 →</p></div><div class="border border-amber-500/30 rounded-lg p-4"><h4 class="text-amber-400 font-bold mb-2">B안 — 위기감 소구 톤</h4><p class="text-lg font-bold text-white">"아직도 수작업으로 ${industryStr} 마케팅 하시나요?"</p><p class="text-slate-300 text-sm mt-1">경쟁사는 이미 AI로 전환했습니다. 매월 120시간의 반복 업무, ${productName}으로 자동화할 준비 되셨나요?</p><p class="text-blue-400 text-xs mt-2">CTA: 자동화 진단 리포트 받기 →</p></div></div>` },

        // A/B Test Simulator — Rex analyzes both copies
        { t: 14000, type: 'chat', agent: 'Rex', text: `A/B 시뮬레이션 완료. ${roleStr} 대상 과거 데이터 기반 예측 결과입니다.`, tag: 'insight' },
        { t: 14500, type: 'artifact', agent: 'Rex', artifactType: 'chart', title: 'A/B 카피 시뮬레이션 결과',
          content: `<div class="space-y-3"><div class="grid grid-cols-2 gap-3"><div class="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3 text-center"><h4 class="text-emerald-400 font-bold text-xs mb-2">A안 — 신뢰 톤</h4><div class="text-2xl font-bold text-white mb-1">CTR 3.2%</div><div class="text-[10px] text-slate-400">예상 전환율 8.5%</div><div class="text-[10px] text-emerald-400 mt-1">✅ 추천</div></div><div class="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 text-center"><h4 class="text-amber-400 font-bold text-xs mb-2">B안 — 위기감 톤</h4><div class="text-2xl font-bold text-white mb-1">CTR 2.8%</div><div class="text-[10px] text-slate-400">예상 전환율 6.2%</div><div class="text-[10px] text-slate-500 mt-1">—</div></div></div><div class="bg-slate-800 rounded-lg p-2 text-[10px] text-slate-400 text-center">📊 시뮬레이션 기반: ${industryStr} 업계 최근 6개월 캠페인 데이터 (n=1,247)</div></div>` },

        // DP2: 카피 톤 선택
        { t: 15000, type: 'sound', soundType: 'notification' },
        { t: 15000, type: 'decision_point',
          question: "팀장님, Mia가 카피 초안 2종을 준비했습니다. Rex의 시뮬레이션 결과도 참고해주세요. 어느 방향으로 갈까요?",
          options: [
            { label: "데이터 신뢰 톤", description: `"검증된 ROI 342% — ${productName} 도입 기업의 선택" — 신뢰 기반` },
            { label: "위기감 소구 톤", description: `"아직도 수작업으로 ${industryStr} 마케팅 하시나요?" — 긴급성 자극` },
          ],
          autoChoice: 0,
          autoReason: `${roleStr} 타겟 특성상 신뢰 기반 톤이 전환율 1.8배 높다는 Kai의 데이터 근거입니다`,
          timeout: 30000
        },
        { t: 16000, type: 'chat', agent: 'Mia', text: "확인! 해당 방향으로 최종 카피 확정합니다." },

        { t: 18000, type: 'status', agent: 'Nova', state: 'done', progress: 100, statusText: "퍼널 설계 완료", taskType: 'project' },
        { t: 18000, type: 'sound', soundType: 'complete' },
        { t: 19000, type: 'artifact', agent: 'Nova', artifactType: 'diagram', title: `${productName} 캠페인 퍼널`,
          content: funnelHTML },

        { t: 22000, type: 'status', agent: 'Rex', state: 'done', progress: 100, statusText: "예산 분석 완료", taskType: 'project' },
        { t: 22000, type: 'sound', soundType: 'complete' },
        { t: 23000, type: 'artifact', agent: 'Rex', artifactType: 'chart', title: `${productName} 예산 배분 및 ROI 예측`,
          content: budgetChartHTML },

        // Card News — Nova creates after Mia's copy
        { t: 24000, type: 'chat', agent: 'Nova', text: `Mia의 카피를 기반으로 ${channelStr} 채널용 카드뉴스 6장을 제작했습니다. 📸`, tag: 'success' },
        { t: 24500, type: 'artifact', agent: 'Nova', artifactType: 'cardnews', title: `${productName} 카드뉴스 (${langLabel})`,
          content: buildCardNewsSlides(productName, industryStr, '#60a5fa') },

        // DP3: 예산 배분 선택
        { t: 25000, type: 'sound', soundType: 'notification' },
        { t: 25000, type: 'decision_point',
          question: `팀장님, Rex의 ${budgetLabel} 범위 분석 결과 두 가지 배분 전략이 있습니다.`,
          options: [
            { label: `${channels[0] ? channelLabels([channels[0]]) : 'LinkedIn'} 올인`, description: "70:30 배분, 단기 리드 확보에 유리" },
            { label: "2단계 전략", description: "1차 리타겟팅 풀 확보(40%) 후 2차 집중 투입(60%) — 장기 LTV 유리" },
          ],
          autoChoice: 1,
          autoReason: "CAC 최적화 관점에서 2단계 전략이 장기 LTV에 유리합니다",
          timeout: 30000
        },
        { t: 26000, type: 'chat', agent: 'Rex', text: "확인. 해당 전략으로 최종 예산 모델 확정합니다." },
      ] as ScenarioEvent[]
    },

    // ─── Phase 4: 결과물 통합 ───
    {
      id: 4,
      name: "Phase 4 - 결과물 통합",
      duration: 15000,
      events: [
        { t: 1000, type: 'chat', agent: 'Alex', text: `"${productName}" 캠페인 모든 작업이 완료되었습니다. 결과물 취합하겠습니다.` },
        { t: 2000, type: 'file_transfer', from: 'Kai', to: 'Alex' },
        { t: 2500, type: 'file_transfer', from: 'Nova', to: 'Alex' },
        { t: 3000, type: 'file_transfer', from: 'Rex', to: 'Alex' },
        { t: 3500, type: 'file_transfer', from: 'Mia', to: 'Alex' },
        { t: 5000, type: 'status', agent: 'Alex', state: 'working', progress: 50, statusText: `${productName} 최종 마케팅 플랜 컴파일 중`, taskType: 'project' },
        { t: 8000, type: 'chat', agent: 'Alex', text: `팀장님의 판단이 반영된 "${productName}" 최종 ${objLabel} 캠페인 플랜입니다.` },
        { t: 9000, type: 'status', agent: 'Alex', state: 'done', progress: 100, statusText: "최종 마케팅 플랜 완성", taskType: 'project' },
        { t: 10000, type: 'sound', soundType: 'complete' },
        { t: 10000, type: 'result_ready', resultType: 'final', content: "마케팅 플랜 문서 통합 완료" },
      ] as ScenarioEvent[]
    },

    // ─── Phase 5: 전략 컨펌 ───
    {
      id: 5,
      name: "Phase 5 - 전략 컨펌",
      duration: 5000,
      events: []
    },

    // ─── Phase 6: 배포 & 루틴 복귀 ───
    {
      id: 6,
      name: "Phase 6 - 배포 & 루틴 복귀",
      duration: 12000,
      events: [
        { t: 1000, type: 'status', agent: 'Alex', state: 'working', progress: 20, statusText: `${channelStr} 캠페인 에셋 업로드 중`, taskType: 'project' },
        { t: 3000, type: 'chat', agent: 'Alex', text: `사내 CRM 연동 완료. "${productName}" 캠페인 에셋 업로드 완료.` },
        { t: 4000, type: 'status', agent: 'Alex', state: 'working', progress: 80, statusText: `${channelStr} 라이브 세팅 중`, taskType: 'project' },
        { t: 6000, type: 'chat', agent: 'Alex', text: `✅ "${productName}" 캠페인 전 채널 온에어 배포 완료.`, tag: 'success' },
        { t: 7000, type: 'chat', agent: 'Alex', text: "프로젝트 완료. 팀원들은 루틴 업무로 복귀합니다." },
        { t: 8000, type: 'status', agent: 'Alex', state: 'working', statusText: "주간 성과 리포트 업데이트", taskType: 'routine' },
        { t: 8000, type: 'status', agent: 'Kai', state: 'working', statusText: "경쟁사 모니터링 복귀", taskType: 'routine' },
        { t: 8000, type: 'status', agent: 'Mia', state: 'working', statusText: "뉴스레터 카피 작업 복귀", taskType: 'routine' },
        { t: 8000, type: 'status', agent: 'Nova', state: 'working', statusText: "캠페인 캘린더 업데이트 복귀", taskType: 'routine' },
        { t: 8000, type: 'status', agent: 'Rex', state: 'working', statusText: "일일 소진율 모니터링 복귀", taskType: 'routine' },
        { t: 10000, type: 'publish_done' },
      ] as ScenarioEvent[]
    }
  ];

  return { phases };
}

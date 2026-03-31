import type { Scenario, ScenarioEvent } from '../types';
import type { CampaignBrief } from '../types/brief';
import { OBJECTIVE_LABELS, CHANNELS } from '../types/brief';

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
      body: `AI 에이전트가 주도하는 ${industry} 마케팅의 미래`,
      accentColor,
    },
    {
      id: 2, type: 'problem',
      bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      headline: '웨비나 준비, 아직도 밤새시나요?',
      body: `❌ 기획부터 카피까지 수동 작업\n❌ 신청률 낮은 랜딩페이지 구성\n❌ 캠페인 데이터 분석의 한계`,
      accentColor: '#f87171',
    },
    {
      id: 3, type: 'solution',
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      headline: 'The Agents가 제안하는 해법',
      body: `✅ AI 기반 초개인화 타겟팅\n✅ 고전환 웨비나 카피 자동 생성\n✅ 실시간 등록 현황 대시보드`,
      accentColor: '#34d399',
    },
    {
      id: 4, type: 'data',
      bgGradient: 'linear-gradient(135deg, #0c1222 0%, #1a1a3e 100%)',
      headline: '검증된 웨비나 성과',
      body: '',
      accentColor: '#60a5fa',
      dataPoints: [
        { label: '평균 신청률', value: '12.4%↑' },
        { label: 'CPL(리드당 비용)', value: '35%↓' },
        { label: '참여 유지율', value: '78%' },
        { label: '기획 시간 단축', value: '90%↓' },
      ],
    },
    {
      id: 5, type: 'proof',
      bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)',
      headline: '"첫 창단 웨비나 신청자가 폭주했습니다"',
      body: `— ${industry} 커뮤니티 리더\n\n전통적인 방식보다 3배 빠른 준비 과정과\n예상치를 뛰어넘는 등록률을 경험하세요.`,
      accentColor: '#c084fc',
    },
    {
      id: 6, type: 'cta',
      bgGradient: `linear-gradient(135deg, #1e293b 0%, #1e1b4b 50%, #312e81 100%)`,
      headline: '지금 바로 신청하세요',
      body: `AI 리더십의 첫 걸음\n${productName}에서 확인하세요`,
      accentColor,
      ctaText: '웨비나 참가 신청하기 →',
    },
  ];
  return JSON.stringify(slides);
}

export function buildScenarioFromBrief(brief: CampaignBrief): Scenario {
  const { productName, objective, target, channels } = brief;
  const objLabel = OBJECTIVE_LABELS[objective];
  const channelStr = channelLabels(channels);
  const industryStr = target.industry;
  const roleStr = target.role;

  // Build channel allocation for Rex's chart
  const chAlloc = topChannels(channels);
  const budgetChartHTML = `<div class="space-y-3"><div class="space-y-2">${chAlloc.map(c =>
    `<div class="flex items-center gap-2"><span class="text-xs text-slate-400 w-24">${c.name}</span><div class="flex-1 bg-slate-700 rounded-full h-5"><div class="${c.color} h-5 rounded-full flex items-center justify-center text-[10px] text-white" style="width:${c.pct}%">${c.pct}%</div></div></div>`
  ).join('')}</div><div class="border-t border-slate-600 pt-2 mt-2 grid grid-cols-3 gap-2 text-center"><div><p class="text-[10px] text-slate-400">예상 CAC</p><p class="text-sm font-bold text-white">₩420,000</p></div><div><p class="text-[10px] text-slate-400">예상 리드</p><p class="text-sm font-bold text-emerald-400">340건/월</p></div><div><p class="text-[10px] text-slate-400">예상 ROI</p><p class="text-sm font-bold text-amber-400">285%</p></div></div></div>`;


  const phases: Scenario['phases'] = [
    // ─── Phase -1: Daily Routine ───
    {
      id: -1,
      name: "Daily Routine",
      duration: -1,
      events: [
        { t: 0, type: 'status', agent: 'Alex', state: 'working', statusText: "글로벌 캠페인 대시보드 모니터링", taskType: 'routine' },
        { t: 0, type: 'status', agent: 'Kai', state: 'working', statusText: "IT/SaaS 마케팅 오디언스 트렌드 요약", taskType: 'routine' },
        { t: 0, type: 'status', agent: 'Mia', state: 'working', statusText: "진행 중인 광고 카피 성과 A/B 테스트 로그 분석", taskType: 'routine' },
        { t: 0, type: 'status', agent: 'Nova', state: 'working', statusText: "공통 마케팅 캘린더 정합성 체크", taskType: 'routine' },
        { t: 0, type: 'status', agent: 'Rex', state: 'working', statusText: "오늘의 광고비 잔여 예산 자동 최적화 수행", taskType: 'routine' },
        
        { t: 3000, type: 'chat', agent: 'Rex', text: "평상시 광고비 소진율 98.2%. 특이사항 없습니다." },
        { t: 8000, type: 'chat', agent: 'Kai', text: `뉴스 브리핑: 링크드인 광고 알고리즘 업데이트 감지. 비용 효율 변화 주시 중입니다.` },
        { t: 13000, type: 'chat', agent: 'Mia', text: "지난주 소식지 오픈율 42% 달성. 반응 좋았던 키워드 위주로 아카이빙 완료." },
        { t: 18000, type: 'chat', agent: 'Nova', text: "다음 달 프로모션 일정 초안, 캘린더에 동기화해두었습니다." },
        { t: 23000, type: 'chat', agent: 'Alex', text: "모두 고생 많으십니다. 오전 루틴 계속 유지해주세요." },
        
        { t: 30000, type: 'status', agent: 'Rex', state: 'working', statusText: "실시간 비딩 가중치 업데이트 중", taskType: 'routine' },
        { t: 35000, type: 'status', agent: 'Kai', state: 'working', statusText: "경쟁 커뮤니티 활동 로그 수집", taskType: 'routine' },
        { t: 40000, type: 'chat', agent: 'Alex', text: "💡 참고: 오늘 오후 팀 주간 전체 리포트 자동 생성 예정입니다." },
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
        { t: 2500, type: 'chat', agent: 'Alex', text: `🚨 긴급 지시입니다. "${productName}" ${objLabel} 캠페인 착수하겠습니다.` },
        { t: 4000, type: 'chat', agent: 'Alex', text: `이번 웨비나는 커뮤니티 창단 행사로 매우 중요합니다. 타겟은 ${roleStr} 위주입니다.` },
        { t: 6000, type: 'chat', agent: 'Kai', text: "기존 AI 커뮤니티 사례들과 웨비나 등록 벤치마킹 데이터 바로 수집하겠습니다." },
        { t: 7500, type: 'chat', agent: 'Mia', text: "참가 신청을 유도할 강력한 이메일 시퀀스와 인스타 카피 맡을게요." },
        { t: 9000, type: 'chat', agent: 'Nova', text: "가장 심플하면서도 전환율이 높은 웨비나 랜딩 퍼널 설계하겠습니다." },
        { t: 10500, type: 'chat', agent: 'Rex', text: "기대 등록자 수 시뮬레이션하고 ${budgetLabel} 내 채널별 예산 최적화 돌리겠습니다." },
        { t: 12500, type: 'chat', agent: 'Alex', text: "좋습니다. 미션이 명확하니 바로 시작합시다. 퇴장!" },
      ] as ScenarioEvent[]
    },

    // ─── Phase 2: 병렬 작업 + DP1 ───
    {
      id: 2,
      name: "Phase 2 - 병렬 작업",
      duration: 60000,
      events: [
        { t: 0, type: 'move', agent: 'all', to: 'desk' },
        { t: 2000, type: 'status', agent: 'Kai', state: 'working', progress: 10, statusText: "경쟁 웨비나 사례 수집 중", taskType: 'project' },
        { t: 2000, type: 'status', agent: 'Nova', state: 'working', progress: 10, statusText: "웹이미 퍼널 로직 설계", taskType: 'project' },
        { t: 2000, type: 'status', agent: 'Rex', state: 'working', progress: 15, statusText: "오디언스 유사 타겟 추출", taskType: 'project' },

        { t: 5000, type: 'chat', agent: 'Kai', text: "해외 유사 커뮤니티 웨비나 등록 페이지 12곳 벤치마킹 완료했습니다.", tag: 'insight' },
        { t: 7000, type: 'status', agent: 'Kai', state: 'working', progress: 40, statusText: "등록 허들 요소 분석 중", taskType: 'project' },

        { t: 10000, type: 'chat', agent: 'Rex', text: "기존 타겟 풀에서 웨비나 고관심군 1.2만 명 세그먼트 생성 완료.", tag: 'success' },

        { t: 14000, type: 'chat', agent: 'Nova', text: "웨비나 신청 시 카카오 알림톡 자동 발송 엔진 연동 범위 확정 중.", tag: 'insight' },

        { t: 19000, type: 'status', agent: 'Kai', state: 'done', progress: 100, statusText: "리서치 보고서 준비 완료", taskType: 'project' },
        { t: 19000, type: 'sound', soundType: 'complete' },
        { t: 20000, type: 'artifact', agent: 'Kai', artifactType: 'table', title: `웨비나 벤치마킹 분석표`,
          content: `<table><thead><tr><th>커뮤니티명</th><th>주제</th><th>신청 페이지 구성</th><th>참여 혜택</th></tr></thead><tbody><tr><td>AI Today</td><td>도구 활용</td><td>심플 (1페이지)</td><td>체크리스트 PDF</td></tr><tr><td>Future Marketer</td><td>전략 중심</td><td>콘텐츠 중심 (길게)</td><td>VOD 다시보기</td></tr><tr><td>Growth HQ</td><td>네트워킹</td><td>대화형 (Chat flow)</td><td>커뮤니티 입장권</td></tr><tr><td><b>The Agents</b></td><td><b>리더십</b></td><td><b>혜택 강조형</b></td><td><b>조직 진단 툴킷</b></td></tr></tbody></table>` },

        { t: 21000, type: 'chat', agent: 'Kai', text: "웨비나 참가 동기 분석 결과: 단순 정보보다 '전문가와의 네트워킹'과 '진단 툴킷' 같은 실무 혜택이 중요합니다. Mia, 카피에 이 점 반영해주세요." },
        { t: 22000, type: 'file_transfer', from: 'Kai', to: 'Mia' },
        { t: 23000, type: 'status', agent: 'Mia', state: 'working', progress: 10, statusText: "웨비나 초대 이메일 초안 작성", taskType: 'project' },

        // DP1: 타겟 범위 선택
        { t: 25000, type: 'sound', soundType: 'notification' },
        { t: 25000, type: 'decision_point',
          question: `팀장님, 웨비나 타겟 세그먼트를 ${roleStr} 중심의 '소수 정예 리더'로 갈까요, 아니면 주니어까지 포함한 '대규모 확산'으로 갈까요?`,
          options: [
            { label: "소수 정예 리더", description: "퀄리티 높은 네트워킹 중심 (에너지 소모 크지만 LTV 높음)" },
            { label: "대규모 확산", description: "브랜드 인지도 확대 위주 (접근성 높은 카피 필요)" },
          ],
          autoChoice: 0,
          autoReason: `창단 웨비나인 만큼 코어 멤버가 될 ${roleStr} 집중 모집이 장기적으로 유리합니다`,
          timeout: 30000
        },
        { t: 26000, type: 'chat', agent: 'Alex', text: "초기 코어 멤버 확보가 우선입니다. 소수 정예 리더 방향으로 진행하세요." },
      ] as ScenarioEvent[]
    },

    // ─── Phase 3: 심화 작업 + DP2/DP3 ───
    {
      id: 3,
      name: "Phase 3 - 심화 작업",
      duration: 65000,
      events: [
        { t: 0, type: 'status', agent: 'Nova', state: 'working', progress: 60, statusText: "웨비나 랜딩 페이지 섹션 기획", taskType: 'project' },
        { t: 2000, type: 'status', agent: 'Mia', state: 'working', progress: 40, statusText: "웨비나 헤드라인 베리에이션 작성", taskType: 'project' },

        { t: 4000, type: 'chat', agent: 'Mia', text: "리더급 타겟에 맞춰 '커뮤니티 소속감'을 강조한 위버 테마 카피 위주로 뽑아보겠습니다.", tag: 'insight' },

        { t: 7000, type: 'routine_alert', agent: 'Rex', text: "💡 모니터링 알림: 기존 주간 광고 캠페인에서 예산 소진이 평소보다 빠릅니다. 프로젝트 완료 후 즉시 점검하겠습니다." },

        { t: 10000, type: 'status', agent: 'Mia', state: 'working', progress: 75, statusText: "최종 카피 A/B안 검수 중", taskType: 'project' },
        { t: 12000, type: 'status', agent: 'Mia', state: 'done', progress: 100, statusText: "웨비나 카피 세트 완성", taskType: 'project' },
        { t: 12000, type: 'sound', soundType: 'complete' },

        { t: 13000, type: 'artifact', agent: 'Mia', artifactType: 'copy', title: `웨비나 광고 및 이메일 카피`,
          content: `<div class="space-y-4"><div class="border border-emerald-500/30 rounded-lg p-4"><h4 class="text-emerald-400 font-bold mb-2">초대 이메일 초안</h4><p class="text-white font-bold">[초대] AI 시대를 리드하는 실무 리더들의 커뮤니티, "The Agents"에 초대합니다.</p><p class="text-slate-300 text-xs mt-2">단순한 정보 전달이 아닙니다. 조직 내 AI 도입의 실제 고민을 나누고 해결하는 멤버십의 시작, 그 첫 웨비나에 귀하를 모십니다.</p></div><div class="border border-blue-500/30 rounded-lg p-4"><h4 class="text-blue-400 font-bold mb-2">인스타그램 광고 카피</h4><p class="text-white font-bold">"나만 뒤처지는 건 아닐까?" 하는 불안감을 확신으로.</p><p class="text-slate-300 text-xs mt-1">상위 1% AI 마케터들이 모이는 곳. The Agents 창단 웨비나에서 AI 조직 진단 툴킷을 받아가세요.</p></div></div>` },

        { t: 14000, type: 'chat', agent: 'Rex', text: "시뮬레이션 결과: '리더십' 키워드 포함 시 이메일 클릭률(CTR) 12% 향상 예상됩니다.", tag: 'insight' },
        { t: 15000, type: 'decision_point',
          question: "팀장님, 웨비나 커뮤니티의 소속감을 강조하기 위해 'The Agents' 창단 멤버 혜택을 전면에 내세울까요?",
          options: [
            { label: "창단 멤버 혜택 강조", description: "얼리버드 가입 혜택 및 네트워킹 강조 (고전환 기대)" },
            { label: "실무 툴킷 강조", description: "조직 진단 PDF 등 실용적 혜택 강조 (범용 등록 기대)" },
          ],
          autoChoice: 0,
          autoReason: `실무 매니저 타겟에게는 '커뮤니티 내 지위'와 '창단 멤버십'이 가장 강력한 유인책입니다`,
          timeout: 30000
        },

        { t: 18000, type: 'status', agent: 'Nova', state: 'done', progress: 100, statusText: "랜딩 퍼널 설계 완료", taskType: 'project' },
        { t: 18000, type: 'sound', soundType: 'complete' },
        { t: 19000, type: 'artifact', agent: 'Nova', artifactType: 'diagram', title: `웨비나 고전환 유입 퍼널`,
          content: `<div class="space-y-2"><div class="flex items-center gap-2 flex-wrap flex-1 min-w-0"><div class="bg-blue-600 text-white text-[10px] px-2 py-3 rounded-lg flex-1 text-center">SNS 광고<br/><span class="opacity-70">타겟 노출</span></div><div class="text-slate-500">→</div><div class="bg-indigo-600 text-white text-[10px] px-2 py-3 rounded-lg flex-1 text-center">웨비나 랜딩<br/><span class="opacity-70">창단 멤버십 강조</span></div><div class="text-slate-500">→</div><div class="bg-purple-600 text-white text-[10px] px-2 py-3 rounded-lg flex-1 text-center">신청 폼<br/><span class="opacity-70">가입 동기 수집</span></div><div class="text-slate-500">→</div><div class="bg-emerald-600 text-white text-[10px] px-2 py-3 rounded-lg flex-1 text-center">알림톡 발송<br/><span class="opacity-70">커뮤니티 초대</span></div></div></div>` },

        { t: 22000, type: 'status', agent: 'Rex', state: 'done', progress: 100, statusText: "등록자 수 예측 분석 완료", taskType: 'project' },
        { t: 22000, type: 'sound', soundType: 'complete' },
        { t: 23000, type: 'artifact', agent: 'Rex', artifactType: 'chart', title: `웨비나 주차별 예상 등록자 추이`,
          content: budgetChartHTML },

        { t: 24000, type: 'chat', agent: 'Nova', text: "웨비나 홍보용 카드뉴스 6장 세트 제작 완료했습니다. 📸", tag: 'success' },
        { t: 24500, type: 'artifact', agent: 'Nova', artifactType: 'cardnews', title: `커뮤니티 창단 웨비나 카드뉴스`,
          content: buildCardNewsSlides(productName, industryStr, '#60a5fa') },
      ] as ScenarioEvent[]
    },

    // ─── Phase 4: 결과물 통합 ───
    {
      id: 4,
      name: "Phase 4 - 결과물 통합",
      duration: 15000,
      events: [
        { t: 1000, type: 'chat', agent: 'Alex', text: `"${productName}" 캠페인의 모든 마케팅 에셋이 준비되었습니다. 최종 패키지 통합합니다.` },
        { t: 2000, type: 'file_transfer', from: 'Kai', to: 'Alex' },
        { t: 2500, type: 'file_transfer', from: 'Nova', to: 'Alex' },
        { t: 3000, type: 'file_transfer', from: 'Rex', to: 'Alex' },
        { t: 3500, type: 'file_transfer', from: 'Mia', to: 'Alex' },
        { t: 5000, type: 'status', agent: 'Alex', state: 'working', progress: 50, statusText: "웨비나 통합 운영 플랜 컴파일 중", taskType: 'project' },
        { t: 8000, type: 'chat', agent: 'Alex', text: `팀장님, 창단 멤버 모집을 위한 "${productName}" 최종 캠페인 플랜입니다.` },
        { t: 9000, type: 'status', agent: 'Alex', state: 'done', progress: 100, statusText: "통합 마케팅 플랜 완성", taskType: 'project' },
        { t: 10000, type: 'sound', soundType: 'complete' },
        { t: 10000, type: 'result_ready', resultType: 'final', content: "웨비나 캠페인 패키지 완성" },
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
        { t: 8000, type: 'status', agent: 'Alex', state: 'working', statusText: "글로벌 캠페인 모니터링 복귀", taskType: 'routine' },
        { t: 8000, type: 'status', agent: 'Kai', state: 'working', statusText: "오디언스 트렌드 요약 복귀", taskType: 'routine' },
        { t: 8000, type: 'status', agent: 'Mia', state: 'working', statusText: "A/B 테스트 로그 분석 복귀", taskType: 'routine' },
        { t: 8000, type: 'status', agent: 'Nova', state: 'working', statusText: "마케팅 캘린더 관리 복귀", taskType: 'routine' },
        { t: 8000, type: 'status', agent: 'Rex', state: 'working', statusText: "광고비 예산 최적화 복귀", taskType: 'routine' },
        { t: 10000, type: 'publish_done' },
      ] as ScenarioEvent[]
    }
  ];

  return { phases };
}

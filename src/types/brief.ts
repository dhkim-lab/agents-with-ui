export type CampaignObjective =
  | 'lead_generation'
  | 'brand_awareness'
  | 'conversion'
  | 'retention'
  | 'launch'
  | 'other';

export type BudgetRange = 'under_5m' | '5m_to_30m' | 'over_30m';

export type OutputLanguage = 'ko' | 'en' | 'multi';

export const OBJECTIVE_LABELS: Record<CampaignObjective, string> = {
  lead_generation: '리드 제너레이션',
  brand_awareness: '브랜드 인지도',
  conversion: '전환 증대',
  retention: '리텐션 / 재구매',
  launch: '신규 런칭',
  other: '기타',
};

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  under_5m: '~₩500만',
  '5m_to_30m': '₩500만~₩3,000만',
  over_30m: '₩3,000만+',
};

export const TARGET_ROLES = ['C레벨', '실무 매니저', 'MZ세대', '전체'] as const;

export const INDUSTRIES = [
  'IT/SaaS', '금융', '헬스케어', '제조', '유통/커머스',
  '교육/에듀테크', '부동산', '엔터테인먼트', '기타',
] as const;

export const REGIONS = ['국내', '글로벌', '아시아', '북미', '유럽'] as const;

export const CHANNELS = [
  { id: 'linkedin', label: 'LinkedIn', emoji: '💼' },
  { id: 'google_ads', label: 'Google Ads', emoji: '🔍' },
  { id: 'kakao', label: '카카오톡', emoji: '💬' },
  { id: 'instagram', label: '인스타그램', emoji: '📸' },
  { id: 'webinar', label: '웨비나', emoji: '🎥' },
  { id: 'email', label: '이메일', emoji: '📧' },
  { id: 'youtube', label: 'YouTube', emoji: '▶️' },
  { id: 'blog', label: '블로그/SEO', emoji: '📝' },
] as const;

export interface CampaignBrief {
  productName: string;
  objective: CampaignObjective;
  target: {
    role: string;
    industry: string;
    region: string;
  };
  budget: BudgetRange;
  channels: string[];
  language: OutputLanguage;
  additionalNotes?: string;
}

export const DEFAULT_BRIEF: CampaignBrief = {
  productName: '',
  objective: 'lead_generation',
  target: {
    role: 'C레벨',
    industry: 'IT/SaaS',
    region: '국내',
  },
  budget: '5m_to_30m',
  channels: ['linkedin', 'google_ads'],
  language: 'ko',
};

import Anthropic from '@anthropic-ai/sdk';
import type { Scenario } from '../types';
import type { CampaignBrief } from '../types/brief';
import { OBJECTIVE_LABELS, BUDGET_LABELS } from '../types/brief';

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

let anthropic: Anthropic | null = null;
if (apiKey) {
  anthropic = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
}

export async function generateScenarioFromBrief(brief: CampaignBrief): Promise<Scenario | null> {
  if (!anthropic) {
    console.warn("Anthropic API key not found. Using mock scenario.");
    return null;
  }

  const objLabel = OBJECTIVE_LABELS[brief.objective];
  const budgetLabel = BUDGET_LABELS[brief.budget];

  const prompt = `
당신은 AI 마케팅 에이전시의 오케스트레이터입니다.
다음 캠페인 브리프를 기반으로 5명(Alex, Kai, Mia, Nova, Rex)의 협업 시나리오를 JSON 형태로 작성해주세요.

## 캠페인 브리프
- 제품/서비스명: ${brief.productName}
- 캠페인 목표: ${objLabel}
- 타겟: ${brief.target.role} / ${brief.target.industry} / ${brief.target.region}
- 예산: ${budgetLabel}
- 채널: ${brief.channels.join(', ')}
- 언어: ${brief.language === 'ko' ? '한국어' : brief.language === 'en' ? 'English' : '다국어'}
${brief.additionalNotes ? `- 추가 요청: ${brief.additionalNotes}` : ''}

각 Phase는 다음과 같아야 합니다:
- Phase 1: 킥오프 (회의실 이동 및 목표 브리핑)
- Phase 2: 병렬 작업 (자료조사, 기획, 데이터 분석 등)
- Phase 3: 중간 싱크 (파일 전달 및 피드백)
- Phase 4: 결과물 통합 (Alex에게 파일 전달)

JSON 형식은 다음과 같아야 하며, JSON 블록만 출력하세요:
{
  "phases": [
    {
      "id": 1,
      "name": "kickoff",
      "duration": 15000,
      "events": [
        { "t": 0, "type": "move", "agent": "all", "to": "meeting_room" },
        { "t": 2000, "type": "chat", "agent": "Alex", "text": "대사" },
        ...
      ]
    }
  ]
}
`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      temperature: 0.7,
      system: "You output strictly valid JSON matching the requested schema.",
      messages: [{ role: 'user', content: prompt }]
    });

    const content = 'text' in response.content[0] ? response.content[0].text : '';
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/({[\s\S]*})/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]) as Scenario;
    }
    return null;
  } catch (error) {
    console.error("Failed to generate scenario:", error);
    return null;
  }
}

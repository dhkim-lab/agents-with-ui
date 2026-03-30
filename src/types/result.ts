import type { CampaignBrief } from './brief';
import type { Artifact } from '../types';

export interface DecisionRecord {
  question: string;
  chosen: string;
  reason?: string;
}

export interface CampaignResult {
  id: string;
  brief: CampaignBrief;
  artifacts: Artifact[];
  decisions: DecisionRecord[];
  metrics: {
    totalTimeMs: number;
    tokenCost: number;
    usedTokens: number;
  };
  createdAt: string;
  userName?: string;
}

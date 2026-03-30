import type { CampaignResult } from '../types/result';
import { OBJECTIVE_LABELS, BUDGET_LABELS } from '../types/brief';

interface ResultCardProps {
  result: CampaignResult;
  onClick: () => void;
}

export default function ResultCard({ result, onClick }: ResultCardProps) {
  const { brief, metrics, createdAt } = result;
  const objLabel = OBJECTIVE_LABELS[brief.objective] ?? brief.objective;
  const budgetLabel = BUDGET_LABELS[brief.budget] ?? brief.budget;
  const copyArtifact = result.artifacts.find(a => a.artifactType === 'copy');

  const timeAgo = getTimeAgo(new Date(createdAt));

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all group"
    >
      {/* Top labels */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-500/30">
          {objLabel}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">
          {brief.target.industry}
        </span>
      </div>

      {/* Product name */}
      <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
        {brief.productName}
      </h3>

      {/* Target info */}
      <div className="text-[11px] text-slate-400 mb-2">
        타겟: {brief.target.role} · 예산: {budgetLabel}
      </div>

      {/* Copy preview */}
      {copyArtifact && (
        <div className="text-xs text-slate-500 mb-3 line-clamp-2 italic">
          {extractTextPreview(copyArtifact.content)}
        </div>
      )}

      {/* Bottom metrics */}
      <div className="flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex gap-3">
          <span>⏱ {(metrics.totalTimeMs / 1000).toFixed(0)}초</span>
          <span>🪙 {metrics.usedTokens.toLocaleString()} tokens</span>
          <span>📦 {result.artifacts.length}건</span>
        </div>
        <span>{timeAgo}</span>
      </div>
    </button>
  );
}

function extractTextPreview(html: string): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > 80 ? text.slice(0, 80) + '...' : text;
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

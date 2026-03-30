import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Artifact, AgentName } from '../types';

interface ArtifactGalleryProps {
  artifacts: Artifact[];
}

const TABS: { key: AgentName | 'all'; label: string; emoji: string }[] = [
  { key: 'all', label: '통합', emoji: '📋' },
  { key: 'Kai', label: 'Kai', emoji: '🔍' },
  { key: 'Nova', label: 'Nova', emoji: '💡' },
  { key: 'Mia', label: 'Mia', emoji: '✍️' },
  { key: 'Rex', label: 'Rex', emoji: '📊' },
];

export default function ArtifactGallery({ artifacts }: ArtifactGalleryProps) {
  const [activeTab, setActiveTab] = useState<AgentName | 'all'>('all');

  const filtered = activeTab === 'all'
    ? artifacts
    : artifacts.filter(a => a.agent === activeTab);

  return (
    <div className="h-full flex flex-col bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/50">
        <span className="text-xs font-semibold text-slate-300">📦 산출물 갤러리</span>
        <span className="text-[10px] text-slate-500">{artifacts.length}건</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-2 py-1.5 border-b border-slate-700/50 overflow-x-auto">
        {TABS.map(tab => {
          const count = tab.key === 'all'
            ? artifacts.length
            : artifacts.filter(a => a.agent === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              {count > 0 && (
                <span className="bg-slate-600/50 px-1 rounded text-[9px]">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">
              <div className="text-center">
                <div className="text-2xl mb-2">⏳</div>
                <div>작업 중... 산출물이 곧 표시됩니다</div>
              </div>
            </div>
          ) : (
            filtered.map(artifact => (
              <motion.div
                key={artifact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900/60 rounded-lg border border-slate-600/30 overflow-hidden"
              >
                {/* Artifact Header */}
                <div className="flex items-center gap-2 px-3 py-1.5 border-b border-slate-700/30 bg-slate-800/50">
                  <span className="text-[10px]">
                    {artifact.artifactType === 'table' && '📊'}
                    {artifact.artifactType === 'chart' && '📈'}
                    {artifact.artifactType === 'copy' && '✍️'}
                    {artifact.artifactType === 'diagram' && '🔀'}
                  </span>
                  <span className="text-xs font-medium text-slate-300">{artifact.title}</span>
                  <span className="text-[10px] text-slate-500 ml-auto">{artifact.agent}</span>
                </div>
                {/* Artifact Content */}
                <div
                  className="p-3 text-xs text-slate-300 artifact-content"
                  dangerouslySetInnerHTML={{ __html: artifact.content }}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

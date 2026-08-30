import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Flame, 
  ArrowDown, 
  BookOpen,
  Clock,
  Layers
} from 'lucide-react';
import type { Milestone, UserProfile } from '../../engine/types';

interface VisualFlowchartRoadmapProps {
  profile: UserProfile;
  onSelectMilestone: (milestone: Milestone) => void;
}

export const VisualFlowchartRoadmap: React.FC<VisualFlowchartRoadmapProps> = ({
  profile,
  onSelectMilestone,
}) => {
  const milestones = profile.activeRoadmap;

  // Group into logical stages/phases
  const phaseMap = React.useMemo(() => {
    const map = new Map<number, { title: string; items: Milestone[] }>();
    milestones.forEach((m) => {
      if (!map.has(m.phaseNumber)) {
        map.set(m.phaseNumber, { title: m.phaseTitle, items: [] });
      }
      map.get(m.phaseNumber)!.items.push(m);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [milestones]);

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/90 border border-white/[0.08] backdrop-blur-md space-y-10 relative overflow-hidden">
      
      {/* Background flowchart grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Legend */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              <span>Interactive Visual Flowchart</span>
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Follow the glowing path from fundamental prerequisites to mastery milestones. Click any node to study.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-ping" />
            <span className="text-white font-semibold">Active Focus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span className="text-slate-400">Prereq Locked</span>
          </div>
        </div>
      </div>

      {/* FLOWCHART SPINE & NODES */}
      <div className="relative z-10 space-y-12 max-w-4xl mx-auto">
        {phaseMap.map(([phaseNum, phaseData], pIdx) => (
          <div key={phaseNum} className="relative space-y-6">
            
            {/* Phase Node Header Badge */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-brand-500/30 text-xs font-bold text-brand-300 shadow-lg shadow-brand-500/10">
                <span className="w-2 h-2 rounded-full bg-brand-400" />
                <span>PHASE 0{phaseNum}: {phaseData.title}</span>
              </div>
            </div>

            {/* Nodes in this Phase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
              {phaseData.items.map((m) => {
                const isCompleted = m.status === 'completed';
                const isCurrent = m.status === 'in_progress' || m.status === 'unlocked';
                const isRemediation = m.isRemediation;

                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMilestone(m)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isCompleted
                        ? 'bg-gradient-to-b from-emerald-950/20 to-slate-900/90 border-emerald-500/40 hover:border-emerald-400 hover:scale-[1.02]'
                        : isRemediation
                        ? 'bg-gradient-to-b from-rose-950/30 to-slate-900 border-rose-500/60 shadow-lg shadow-rose-950/30 hover:border-rose-400 hover:scale-[1.02]'
                        : isCurrent
                        ? 'bg-gradient-to-b from-brand-950/40 to-slate-900 border-2 border-brand-500 shadow-xl shadow-brand-500/15 hover:scale-[1.02] ring-2 ring-brand-500/20'
                        : 'bg-slate-950/50 border-slate-800/80 opacity-70 hover:opacity-90 hover:border-slate-700'
                    }`}
                  >
                    {/* Top indicator */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {m.category}
                      </span>

                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isRemediation ? (
                        <span className="flex items-center gap-1 text-[10px] text-rose-300 font-bold bg-rose-500/20 px-2 py-0.5 rounded-full">
                          <Flame className="w-3 h-3 text-rose-400" />
                          <span>Remediation</span>
                        </span>
                      ) : isCurrent ? (
                        <span className="flex items-center gap-1.5 text-xs text-brand-300 font-bold">
                          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                          <span>Current</span>
                        </span>
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>

                    {/* Title & Desc */}
                    <div className="space-y-1 mb-4">
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {m.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    {/* Node Footer */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{m.estimatedHours}h</span>
                      </span>
                      <span className="text-brand-400 font-semibold flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{m.resources.length} verified</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Connecting Flow Arrow between phases */}
            {pIdx < phaseMap.length - 1 && (
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-0.5 h-6 bg-gradient-to-b from-brand-500/40 to-indigo-500/40" />
                <ArrowDown className="w-4 h-4 text-brand-400 -mt-1 animate-bounce-short" />
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};

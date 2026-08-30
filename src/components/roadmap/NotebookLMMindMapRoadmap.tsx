import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  Lock, 
  Flame, 
  ExternalLink, 
  Download, 
  Check, 
  Maximize2, 
  Minimize2
} from 'lucide-react';
import type { Milestone, UserProfile } from '../../engine/types';

interface NotebookLMMindMapRoadmapProps {
  profile: UserProfile;
  onSelectMilestone: (milestone: Milestone) => void;
}

export const NotebookLMMindMapRoadmap: React.FC<NotebookLMMindMapRoadmapProps> = ({
  profile,
  onSelectMilestone
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    // Expand root and first phase by default
    return new Set(['root', 'phase-1', 'phase-2', profile.activeRoadmap[0]?.id]);
  });

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedNodes(new Set(['root']));
      setAllExpanded(false);
    } else {
      const all = new Set<string>(['root']);
      profile.activeRoadmap.forEach(m => {
        all.add(`phase-${m.phaseNumber}`);
        all.add(m.id);
      });
      setExpandedNodes(all);
      setAllExpanded(true);
    }
  };

  // Group milestones by phase
  const phases = React.useMemo(() => {
    const map = new Map<number, { title: string; milestones: Milestone[] }>();
    profile.activeRoadmap.forEach((m) => {
      if (!map.has(m.phaseNumber)) {
        map.set(m.phaseNumber, { title: m.phaseTitle, milestones: [] });
      }
      map.get(m.phaseNumber)!.milestones.push(m);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [profile.activeRoadmap]);

  const handleSaveMindMap = () => {
    const data = {
      title: `NEXORA Mind-Map: ${profile.goalTitle}`,
      learner: profile.fullName,
      educationStage: profile.educationLevel,
      generatedDate: new Date().toLocaleDateString(),
      totalMilestones: profile.activeRoadmap.length,
      hierarchy: phases.map(([num, p]) => ({
        phase: `Phase 0${num}: ${p.title}`,
        topics: p.milestones.map(m => ({
          name: m.title,
          status: m.status,
          category: m.category,
          estimatedHours: `${m.estimatedHours}h`,
          freeResources: m.resources.map(r => `${r.title} (${r.provider} - ${r.url})`)
        }))
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEXORA_MindMap_${profile.goalTitle.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-white/[0.08] shadow-2xl relative overflow-hidden space-y-8">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
              Interactive Tree Mind-Map (NotebookLM Style)
            </span>
            <span className="text-xs text-slate-400">Click any branch to expand sub-nodes & resources</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {profile.goalTitle}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleExpandAll}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5"
          >
            {allExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
          </button>

          <button
            onClick={handleSaveMindMap}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            {downloadSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5" />}
            <span>{downloadSuccess ? 'Saved to Device!' : 'Save Mind-Map'}</span>
          </button>
        </div>
      </div>

      {/* TREE / MIND-MAP CANVAS */}
      <div className="relative z-10 pl-2 sm:pl-6 space-y-6">
        
        {/* ROOT GOAL NODE */}
        <div className="space-y-4">
          <div 
            onClick={() => toggleNode('root')}
            className="inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-brand-500/20 cursor-pointer hover:scale-[1.01] transition-transform select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>TARGET GOAL: {profile.goalTitle}</span>
            {expandedNodes.has('root') ? <ChevronDown className="w-4 h-4 opacity-80" /> : <ChevronRight className="w-4 h-4 opacity-80" />}
          </div>

          {/* PHASE BRANCHES */}
          {expandedNodes.has('root') && (
            <div className="pl-6 sm:pl-10 space-y-6 border-l-2 border-brand-500/30 ml-4 animate-fade-in">
              {phases.map(([phaseNum, phaseData]) => {
                const phaseKey = `phase-${phaseNum}`;
                const isPhaseExpanded = expandedNodes.has(phaseKey);
                const isAllCompleted = phaseData.milestones.every(m => m.status === 'completed');

                return (
                  <div key={phaseNum} className="space-y-4 relative">
                    
                    {/* Horizontal Branch line */}
                    <div className="absolute -left-6 sm:-left-10 top-5 w-6 sm:w-10 h-0.5 bg-brand-500/30" />

                    {/* PHASE NODE */}
                    <div
                      onClick={() => toggleNode(phaseKey)}
                      className={`inline-flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                        isAllCompleted
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : isPhaseExpanded
                          ? 'bg-slate-900 border-brand-500/60 text-white shadow-lg shadow-brand-500/10'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-300 text-xs font-bold flex items-center justify-center">
                        0{phaseNum}
                      </div>
                      <span className="text-xs sm:text-sm font-bold">{phaseData.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                        {phaseData.milestones.length} Topics
                      </span>
                      {isPhaseExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                    </div>

                    {/* SUB-TOPIC / MILESTONE NODES (EXPANDABLE) */}
                    {isPhaseExpanded && (
                      <div className="pl-6 sm:pl-10 space-y-4 border-l-2 border-indigo-500/30 ml-4 animate-fade-in">
                        {phaseData.milestones.map((m) => {
                          const isMilestoneExpanded = expandedNodes.has(m.id);
                          const isCompleted = m.status === 'completed';
                          const isCurrent = m.status === 'in_progress' || m.status === 'unlocked';
                          const isRemediation = m.isRemediation;

                          return (
                            <div key={m.id} className="space-y-3 relative">
                              {/* Horizontal connector line */}
                              <div className="absolute -left-6 sm:-left-10 top-4 w-6 sm:w-10 h-0.5 bg-indigo-500/30" />

                              {/* Milestone Branch Card */}
                              <div
                                onClick={() => {
                                  toggleNode(m.id);
                                  onSelectMilestone(m);
                                }}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer max-w-xl ${
                                  isCompleted
                                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400'
                                    : isRemediation
                                    ? 'bg-rose-950/30 border-rose-500/50 shadow-md shadow-rose-950/20'
                                    : isCurrent
                                    ? 'bg-slate-900 border-2 border-brand-500 shadow-lg shadow-brand-500/15'
                                    : 'bg-slate-950/60 border-slate-800/80 opacity-70 hover:opacity-100 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2.5">
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    ) : isRemediation ? (
                                      <Flame className="w-4 h-4 text-rose-400 shrink-0" />
                                    ) : isCurrent ? (
                                      <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-ping shrink-0" />
                                    ) : (
                                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                                    )}

                                    <span className="text-xs sm:text-sm font-bold text-white">
                                      {m.title}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] text-slate-400">{m.estimatedHours}h</span>
                                    {isMilestoneExpanded ? (
                                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                  </div>
                                </div>

                                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                                  {m.description}
                                </p>
                              </div>

                              {/* DEEP-DIVE SUBDIVISIONS: VERIFIED RESOURCES & PRACTICE TASKS */}
                              {isMilestoneExpanded && (
                                <div className="pl-6 sm:pl-8 space-y-2 border-l-2 border-cyan-500/30 ml-4 animate-fade-in max-w-xl">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block pt-1">
                                    Curated 100% Free Learning & Practice Sub-nodes:
                                  </span>

                                  {m.resources.map((res) => (
                                    <div 
                                      key={res.id}
                                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                                    >
                                      <div className="space-y-0.5 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold truncate">
                                            {res.provider}
                                          </span>
                                          <span className="text-[10px] text-emerald-400 font-medium shrink-0">100% Free</span>
                                        </div>
                                        <div className="font-semibold text-slate-200 truncate">{res.title}</div>
                                      </div>

                                      <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-2.5 py-1 rounded-lg bg-brand-600/20 hover:bg-brand-600/40 border border-brand-500/30 text-brand-300 font-semibold text-[11px] flex items-center gap-1 shrink-0"
                                      >
                                        <span>Open</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

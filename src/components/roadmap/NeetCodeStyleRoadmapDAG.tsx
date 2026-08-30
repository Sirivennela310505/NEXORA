import React, { useState, useMemo, useRef } from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  PlayCircle, 
  Check, 
  Download, 
  X, 
  Search, 
  Star, 
  Code2, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronRight,
  CheckSquare,
  FileText
} from 'lucide-react';
import type { Milestone, UserProfile } from '../../engine/types';
import { 
  CORE_DSA_TRACK, 
  SYSTEM_DESIGN_TRACK, 
  type NeetCodeNode, 
  type NeetCodeProblem, 
  type NeetCodeTrack 
} from './neetcodeData';

interface NeetCodeStyleRoadmapDAGProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLaunchAssessment: (skillId: string) => void;
}

export const NeetCodeStyleRoadmapDAG: React.FC<NeetCodeStyleRoadmapDAGProps> = ({
  profile,
  onUpdateProfile,
  onLaunchAssessment
}) => {
  // Track selector: 'personalized' | 'core-dsa' | 'system-design'
  const [activeTrackId, setActiveTrackId] = useState<string>('personalized');
  
  // Selected Node for the NeetCode Problem Drawer
  const [selectedNode, setSelectedNode] = useState<NeetCodeNode | null>(null);
  
  // Active problem within the modal
  const [activeProblem, setActiveProblem] = useState<NeetCodeProblem | null>(null);
  
  // Active code language tab
  const [activeLang, setActiveLang] = useState<'python' | 'typescript' | 'java' | 'cpp'>('python');
  
  // Modal active tab: 'problems' | 'video' | 'solution' | 'notes'
  const [modalTab, setModalTab] = useState<'problems' | 'video' | 'solution' | 'notes'>('problems');

  // Search & Difficulty Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  // Canvas Zoom
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Persistent Solved Problems State
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`nexora_neetcode_solved_${profile.id}`);
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // fallback
    }
    return new Set<string>(['p-contains-dup', 'p-valid-anagram']);
  });

  // Persistent Starred Problems
  const [starredProblemIds, setStarredProblemIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`nexora_neetcode_starred_${profile.id}`);
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // fallback
    }
    return new Set<string>(['p-two-sum', 'p-3sum', 'p-trapping-rain-water']);
  });

  // Persistent Problem Notes
  const [problemNotes, setProblemNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`nexora_neetcode_notes_${profile.id}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      'p-two-sum': 'Remember: hash map complement check in one pass gives O(N) time and O(N) space.',
      'p-valid-palindrome': 'Two pointers moving inward with isalnum filter.'
    };
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Toggle problem solved
  const toggleProblemSolved = (problemId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSolvedProblemIds(prev => {
      const next = new Set(prev);
      if (next.has(problemId)) next.delete(problemId);
      else next.add(problemId);
      try {
        localStorage.setItem(`nexora_neetcode_solved_${profile.id}`, JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Toggle problem starred
  const toggleProblemStarred = (problemId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setStarredProblemIds(prev => {
      const next = new Set(prev);
      if (next.has(problemId)) next.delete(problemId);
      else next.add(problemId);
      try {
        localStorage.setItem(`nexora_neetcode_starred_${profile.id}`, JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Save note
  const handleSaveNote = (problemId: string, note: string) => {
    const updated = { ...problemNotes, [problemId]: note };
    setProblemNotes(updated);
    try {
      localStorage.setItem(`nexora_neetcode_notes_${profile.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Build dynamic personalized track from active user roadmap
  const personalizedTrack: NeetCodeTrack = useMemo(() => {
    const nodes: NeetCodeNode[] = profile.activeRoadmap.map((m) => ({
      id: m.id,
      title: m.title,
      category: m.category,
      description: m.description,
      level: m.phaseNumber - 1,
      prerequisites: m.prerequisiteMilestoneIds || [],
      color: m.isRemediation ? '#f43f5e' : '#6366f1',
      badgeColor: m.isRemediation ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      problems: [
        {
          id: `prob-${m.id}-1`,
          title: `Core Theory & Foundational Axioms for ${m.title}`,
          difficulty: 'Easy',
          category: m.category,
          leetcodeUrl: m.resources[0]?.url || 'https://leetcode.com',
          videoEmbedUrl: m.resources.find(r => r.videoEmbedUrl)?.videoEmbedUrl || 'https://www.youtube.com/embed/3OamzN90kPg',
          timeComplexity: 'O(1)',
          spaceComplexity: 'O(1)',
          description: `Master fundamental principles of ${m.title}. Understand optimal approaches, edge cases, and constraint bounds.`,
          codeSolutions: {
            python: `# Concept implementation for ${m.title}\ndef solve_foundations():\n    pass`,
            typescript: `// Core implementation for ${m.title}\nexport function solveCore(): void {}`,
            java: `public class Solution {\n    // Core logic for ${m.title}\n}`,
            cpp: `// Optimized solution for ${m.title}\nclass Solution {};`
          }
        },
        {
          id: `prob-${m.id}-2`,
          title: `High-Frequency Pattern & Problem 01`,
          difficulty: 'Medium',
          category: m.category,
          leetcodeUrl: m.resources[1]?.url || 'https://leetcode.com',
          videoEmbedUrl: 'https://www.youtube.com/embed/KLlXCFG5TnA',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          description: `Apply the dominant design pattern for ${m.title} with optimal asymptotic efficiency.`,
          codeSolutions: {
            python: `def solve_pattern():\n    return True`,
            typescript: `export const solvePattern = () => true;`,
            java: `public boolean solve() { return true; }`,
            cpp: `bool solve() { return true; }`
          }
        },
        {
          id: `prob-${m.id}-3`,
          title: `Edge Cases, Boundary Limits & Stress Test Challenge`,
          difficulty: 'Hard',
          category: m.category,
          leetcodeUrl: 'https://leetcode.com',
          videoEmbedUrl: 'https://www.youtube.com/embed/ZI2z5pq0TqA',
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(1)',
          description: `Solve complex edge conditions, large dataset scaling, and corner failure states for ${m.title}.`,
          codeSolutions: {
            python: `def solve_hard():\n    pass`,
            typescript: `export function solveHard(): void {}`,
            java: `public void solveHard() {}`,
            cpp: `void solveHard() {}`
          }
        }
      ]
    }));

    return {
      id: 'personalized',
      title: `${profile.goalTitle} (Custom Adaptive)`,
      description: `Your custom personalized prerequisite pathway with ${profile.activeRoadmap.length} key milestones.`,
      icon: '🎓',
      nodes
    };
  }, [profile]);

  // Current active track
  // Current active track
  const currentTrack: NeetCodeTrack = useMemo(() => {
    if (activeTrackId === 'core-dsa') return CORE_DSA_TRACK;
    if (activeTrackId === 'system-design') return SYSTEM_DESIGN_TRACK;
    return personalizedTrack;
  }, [activeTrackId, personalizedTrack]);

  // Group nodes by level (DAG Tiers)
  const tiers = useMemo(() => {
    const map = new Map<number, NeetCodeNode[]>();
    currentTrack.nodes.forEach(node => {
      const lvl = node.level || 0;
      if (!map.has(lvl)) map.set(lvl, []);
      map.get(lvl)!.push(node);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [currentTrack]);

  // Calculate overall track completion
  const trackStats = useMemo(() => {
    let totalProblems = 0;
    let solvedProblems = 0;
    currentTrack.nodes.forEach(node => {
      node.problems.forEach(p => {
        totalProblems++;
        if (solvedProblemIds.has(p.id)) solvedProblems++;
      });
    });
    const percent = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;
    return { total: totalProblems, solved: solvedProblems, percent };
  }, [currentTrack, solvedProblemIds]);

  // Node progress calculator
  const getNodeStats = (node: NeetCodeNode) => {
    const total = node.problems.length;
    const solved = node.problems.filter(p => solvedProblemIds.has(p.id)).length;
    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
    const isCompleted = solved === total && total > 0;
    return { total, solved, percent, isCompleted };
  };

  // Export JSON
  const handleExportRoadmap = () => {
    const summary = {
      product: 'NEXORA — Interactive Architecture & Roadmap Navigator',
      learner: profile.fullName,
      track: currentTrack.title,
      overallProgress: `${trackStats.solved} / ${trackStats.total} (${trackStats.percent}%)`,
      exportedAt: new Date().toISOString(),
      nodes: currentTrack.nodes.map(node => {
        const stats = getNodeStats(node);
        return {
          title: node.title,
          category: node.category,
          progress: `${stats.solved}/${stats.total} Solved (${stats.percent}%)`,
          problems: node.problems.map(p => ({
            title: p.title,
            difficulty: p.difficulty,
            solved: solvedProblemIds.has(p.id),
            starred: starredProblemIds.has(p.id),
            url: p.leetcodeUrl
          }))
        };
      })
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEXORA_${currentTrack.id}_Roadmap.json`;
    a.click();
    URL.revokeObjectURL(url);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Open problem drawer on node click
  const handleOpenNodeModal = (node: NeetCodeNode) => {
    setSelectedNode(node);
    setActiveProblem(node.problems[0] || null);
    setModalTab('problems');
  };

  // Toggle milestone completion on active profile
  const handleToggleMastery = (nodeId: string) => {
    const updatedRoadmap = profile.activeRoadmap.map(m => {
      if (m.id === nodeId || m.title.toLowerCase() === nodeId.toLowerCase()) {
        const nextStatus = m.status === 'completed' ? 'in_progress' : 'completed';
        return {
          ...m,
          status: nextStatus as Milestone['status'],
          completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined
        };
      }
      return m;
    });

    onUpdateProfile({
      ...profile,
      activeRoadmap: updatedRoadmap,
      lastPathUpdateReason: `Mastery status updated for ${nodeId}`
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans select-none pb-24">
      
      {/* ================= TOP DARK HUD HEADER ================= */}
      {/* TOP HEADER BAR (PURE OBSIDIAN BLACK) */}
      <div className="border-b border-white/[0.08] bg-black/90 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-8 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Title & Track Selector Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 pr-3 border-r border-white/[0.08]">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold text-sm shadow-md shadow-cyan-500/10">
                N
              </div>
              <span className="font-extrabold text-white text-base tracking-tight hidden sm:inline">
                NEXORA <span className="text-cyan-400">Flowchart</span>
              </span>
            </div>

            {/* Track Switchers / Track Badge */}
            {profile.goalCategory === 'jee' || profile.goalCategory === 'neet' || profile.educationLevel === 'Class 10' || profile.educationLevel === 'Class 12' ? (
              <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-cyan-500/30 text-xs font-bold text-cyan-300 flex items-center gap-2">
                <span>{profile.goalTitle}</span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  Target Curriculum
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-black p-1 rounded-2xl border border-white/[0.08] shadow-inner">
                <button
                  onClick={() => setActiveTrackId('personalized')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTrackId === 'personalized'
                      ? 'bg-white text-black shadow-lg font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{profile.goalTitle}</span>
                </button>

                <button
                  onClick={() => setActiveTrackId('core-dsa')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTrackId === 'core-dsa'
                      ? 'bg-white text-black shadow-lg font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Core DSA</span>
                </button>

                <button
                  onClick={() => setActiveTrackId('system-design')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTrackId === 'system-design'
                      ? 'bg-white text-black shadow-lg font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>System Design</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Search, Filter, Stats & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#0e1626] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-36 sm:w-44 md:w-56"
              />
            </div>

            {/* Difficulty Filter — desktop only */}
            <div className="hidden sm:flex items-center gap-1 bg-[#0e1626] border border-slate-800 p-1 rounded-xl">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    selectedDifficulty === d
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Overall Progress Widget */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#0e1626] border border-slate-800 rounded-xl">
              <div className="w-5 h-5 rounded-full border-2 border-brand-500/30 border-t-brand-400 flex items-center justify-center text-[9px] font-bold text-white">
                {trackStats.percent}%
              </div>
              <div className="text-[11px] font-semibold text-slate-300">
                <span className="text-emerald-400 font-bold">{trackStats.solved}</span>
                <span className="text-slate-500"> / {trackStats.total}</span>
              </div>
            </div>

            {/* Zoom Controls — desktop only */}
            <div className="hidden sm:flex items-center gap-1 bg-[#0e1626] border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.1))}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-400 px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(1.35, prev + 0.1))}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 ml-0.5"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Save / Export */}
            <button
              onClick={handleExportRoadmap}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-brand-400" />}
              <span>{saveSuccess ? 'Saved!' : 'Export'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* ================= ROADMAP HERO BANNER ================= */}
      <div className="max-w-5xl mx-auto text-center px-4 pt-10 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d1424] border border-slate-800 text-[11px] font-bold text-slate-300">
          <span className="text-base">{currentTrack.icon}</span>
          <span>{currentTrack.title}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          The Interactive <span className="text-brand-400">Roadmap</span>.
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          {currentTrack.description} Click any topic box to open the full problem checklist, video masterclass, and verified multi-language solutions.
        </p>
      </div>

      {/* ================= NEETCODE DAG CANVAS WITH CONNECTORS ================= */}
      {/* Mobile scroll hint */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border-b border-white/[0.06] text-[11px] text-slate-400">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        Scroll down to explore your full roadmap. Tap any card to open details.
      </div>

      <div 
        ref={canvasRef}
        className="w-full flex-1 flex flex-col items-center py-6 px-2 sm:px-4 overflow-x-hidden transition-transform duration-200"
        style={{ transform: `scale(${typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : zoomLevel})`, transformOrigin: 'top center' }}
      >
        <div className="space-y-8 sm:space-y-12 flex flex-col items-center max-w-6xl w-full">
          
          {tiers.map(([tierLevel, nodesInTier], tierIdx) => {
            return (
              <div key={tierLevel} className="flex flex-col items-center w-full relative">
                
                {/* Node Cards Row in this tier */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-stretch gap-3 sm:gap-6 z-10 w-full">
                  {nodesInTier.map(node => {
                    const stats = getNodeStats(node);
                    const isCompleted = stats.isCompleted;
                    const isCurrent = stats.solved > 0 && !isCompleted;
                    const matchesSearch = searchQuery === '' || 
                      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      node.problems.some(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

                    if (!matchesSearch) return null;

                    return (
                      <div
                        key={node.id}
                        onClick={() => handleOpenNodeModal(node)}
                        className={`w-full sm:w-64 md:w-72 p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none relative group text-left ${
                          isCompleted
                            ? 'bg-[#0a121e] border-emerald-500/60 shadow-lg shadow-emerald-950/30 active:scale-[0.98]'
                            : isCurrent
                            ? 'bg-[#0f172a] border-brand-500/70 shadow-xl shadow-brand-500/20 active:scale-[0.98]'
                            : 'bg-[#090e18] border-slate-800/90 hover:border-slate-600 hover:bg-[#0d1424] active:scale-[0.98]'
                        }`}
                      >
                        {/* Card Header: Category & Checkmark Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${node.badgeColor}`}>
                            {node.category}
                          </span>

                          {isCompleted ? (
                            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Mastered</span>
                            </div>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-400 font-semibold">
                              {stats.solved}/{stats.total}
                            </span>
                          )}
                        </div>

                        {/* Node Title */}
                        <h3 className="text-sm font-black text-white group-hover:text-brand-300 transition-colors mb-1.5 flex items-center justify-between">
                          <span className="truncate">{node.title}</span>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </h3>

                        {/* Node Description */}
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                          {node.description}
                        </p>

                        {/* NeetCode Sleek Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                            <span>Progress</span>
                            <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                              {stats.percent}%
                            </span>
                          </div>

                          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isCompleted
                                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                                  : 'bg-gradient-to-r from-brand-500 to-indigo-500 shadow-sm shadow-brand-500'
                              }`}
                              style={{ width: `${stats.percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vertical Connector Stem line to Next Tier */}
                {tierIdx < tiers.length - 1 && (
                  <div className="w-full flex flex-col items-center mt-3 -mb-6 pointer-events-none">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-slate-700 to-slate-800" />
                    <div className="w-2 h-2 rounded-full bg-slate-600 -mt-1" />
                  </div>
                )}

              </div>
            );
          })}

        </div>
      </div>

      {/* ================= NEETCODE PROBLEM DRAWER / MODAL ================= */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
          <div className="bg-[#090e1a] border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative text-left animate-scale-in max-h-[90vh] sm:max-h-[92vh] flex flex-col overflow-y-auto">
            
            {/* Modal Top Close */}
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${selectedNode.badgeColor}`}>
                  {selectedNode.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {selectedNode.problems.length} Practice Challenges
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {selectedNode.title}
                </h2>

                <button
                  onClick={() => handleToggleMastery(selectedNode.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Toggle Mastery Status</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            {/* Modal Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 shrink-0">
              <button
                onClick={() => setModalTab('problems')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  modalTab === 'problems'
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Problem List ({selectedNode.problems.length})</span>
              </button>

              <button
                onClick={() => setModalTab('video')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  modalTab === 'video'
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <PlayCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Video Masterclass</span>
              </button>

              <button
                onClick={() => setModalTab('solution')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  modalTab === 'solution'
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Code Solutions</span>
              </button>

              <button
                onClick={() => setModalTab('notes')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  modalTab === 'notes'
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>My Notes</span>
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              
              {/* TAB 1: NEETCODE PROBLEM LIST TABLE */}
              {modalTab === 'problems' && (
                <div className="space-y-2">
                  <div className="rounded-2xl border border-slate-800/80 overflow-hidden bg-[#070b14]">
                    <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <div className="col-span-1 text-center">Status</div>
                      <div className="col-span-1 text-center">Star</div>
                      <div className="col-span-5">Problem Name</div>
                      <div className="col-span-2 text-center">Difficulty</div>
                      <div className="col-span-3 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-slate-800/60">
                      {selectedNode.problems
                        .filter(p => selectedDifficulty === 'All' || p.difficulty === selectedDifficulty)
                        .map(problem => {
                        const isSolved = solvedProblemIds.has(problem.id);
                        const isStarred = starredProblemIds.has(problem.id);

                        return (
                          <div
                            key={problem.id}
                            onClick={() => setActiveProblem(problem)}
                            className={`grid grid-cols-12 gap-2 px-4 py-3 items-center text-xs transition-colors cursor-pointer ${
                              activeProblem?.id === problem.id
                                ? 'bg-brand-950/30 border-l-2 border-brand-500'
                                : 'hover:bg-slate-900/50'
                            }`}
                          >
                            {/* Solved Checkbox */}
                            <div className="col-span-1 flex justify-center">
                              <button
                                onClick={(e) => toggleProblemSolved(problem.id, e)}
                                className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                                  isSolved
                                    ? 'bg-emerald-500 text-black font-black'
                                    : 'border border-slate-600 hover:border-brand-400 text-transparent'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>
                            </div>

                            {/* Star Toggle */}
                            <div className="col-span-1 flex justify-center">
                              <button
                                onClick={(e) => toggleProblemStarred(problem.id, e)}
                                className="text-slate-500 hover:text-amber-400 transition-colors"
                              >
                                <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                              </button>
                            </div>

                            {/* Title & Details */}
                            <div className="col-span-5 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${isSolved ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                                  {problem.title}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 flex items-center gap-2">
                                <span>Time: {problem.timeComplexity}</span>
                                <span>•</span>
                                <span>Space: {problem.spaceComplexity}</span>
                              </div>
                            </div>

                            {/* Difficulty */}
                            <div className="col-span-2 flex justify-center">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                problem.difficulty === 'Easy'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : problem.difficulty === 'Medium'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              }`}>
                                {problem.difficulty}
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="col-span-3 flex items-center justify-end gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveProblem(problem);
                                  setModalTab('video');
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                                title="Video Solution"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveProblem(problem);
                                  setModalTab('solution');
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-400"
                                title="Code Solution"
                              >
                                <Code2 className="w-3.5 h-3.5" />
                              </button>

                              <a
                                href={problem.leetcodeUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Open on LeetCode"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EMBEDDED VIDEO MASTERCLASS */}
              {modalTab === 'video' && activeProblem && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-rose-500" />
                      <span>{activeProblem.title} — Verified Walkthrough</span>
                    </div>
                    <span className="text-emerald-400 text-[11px]">Free Video Masterclass</span>
                  </div>

                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                    <iframe
                      src={activeProblem.videoEmbedUrl}
                      title={activeProblem.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed bg-[#070b14] p-4 rounded-2xl border border-slate-800">
                    <span className="font-bold text-white">Problem Statement:</span> {activeProblem.description}
                  </p>
                </div>
              )}

              {/* TAB 3: CODE SOLUTIONS IN MULTIPLE LANGUAGES */}
              {modalTab === 'solution' && activeProblem && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 bg-[#070b14] p-1 rounded-xl border border-slate-800">
                      {(['python', 'typescript', 'java', 'cpp'] as const).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setActiveLang(lang)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                            activeLang === lang
                              ? 'bg-brand-600 text-white shadow-md'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {lang === 'cpp' ? 'C++' : lang}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-emerald-400 font-mono font-bold">Time: {activeProblem.timeComplexity}</span>
                      <span>•</span>
                      <span className="text-sky-400 font-mono font-bold">Space: {activeProblem.spaceComplexity}</span>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#050811] p-4 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
                    <pre>{activeProblem.codeSolutions[activeLang]}</pre>
                  </div>
                </div>
              )}

              {/* TAB 4: PERSONAL NOTES */}
              {modalTab === 'notes' && activeProblem && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Personal Learning Notes: {activeProblem.title}</span>
                    <span className="text-slate-500 text-[11px]">Auto-saved to your browser</span>
                  </div>

                  <textarea
                    rows={6}
                    value={problemNotes[activeProblem.id] || ''}
                    onChange={(e) => handleSaveNote(activeProblem.id, e.target.value)}
                    placeholder="Write key intuition, time complexity pitfalls, or mental models for this problem..."
                    className="w-full bg-[#050811] border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                  />
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    onLaunchAssessment(selectedNode.id);
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-brand-600/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Take Diagnostic Checkpoint</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

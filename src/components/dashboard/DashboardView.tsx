import React from 'react';
import { 
  Sparkles, 
  Layers, 
  ArrowRight,
  BookOpen,
  Edit3,
  BrainCircuit,
  Quote
} from 'lucide-react';
import type { UserProfile } from '../../engine/types';
import { calculateNextBestAction } from '../../engine/nextBestAction';
import { DailyTargetsCard } from './DailyTargetsCard';

interface DashboardViewProps {
  profile: UserProfile;
  onNavigate: (tabId: string, payload?: any) => void;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  profile, 
  onNavigate,
  onUpdateProfile = () => {}
}) => {
  const nba = calculateNextBestAction(profile);

  // Motivational quote personalized to their goal
  const motivationalQuote = React.useMemo(() => {
    if (profile.goalCategory === 'jee' || profile.educationLevel === 'Class 12') {
      return `Your target is ${profile.goalTitle}. Deep conceptual clarity in every foundation topic creates unstoppable rank momentum. Stay consistent today!`;
    }
    if (profile.educationLevel === 'Class 10') {
      return `Your target is 95%+ in Class 10 Boards. Small daily mastery of formulas and NCERT drills turns board exams into a breeze.`;
    }
    if (profile.goalCategory === 'career_switch') {
      return `Your target is building full-stack production projects. Every expert engineer started by building one project at a time.`;
    }
    return `Your target is ${profile.goalTitle}. Consistent 45-90 min daily sprints beat cramming every single time. Don't forget your reason for starting!`;
  }, [profile]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* 1. WELCOME & MOTIVATIONAL HERO HEADER */}
      <div className="p-6 sm:p-10 rounded-3xl bg-zinc-950 border border-white/[0.1] backdrop-blur-md space-y-6 shadow-2xl relative overflow-hidden text-left">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Welcome to NEXORA
            </span>
            <span className="text-xs text-slate-400">Personalized Learning & Skill-Gap Console</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome, {profile.fullName.split(' ')[0]}! Start your journey with NEXORA.
          </h1>

          {/* Goal Quotation Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black border border-white/[0.08] flex items-start gap-3.5 mt-4">
            <Quote className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed italic">
              "{motivationalQuote}"
            </p>
          </div>
        </div>

        {/* Quick Action Hub */}
        <div className="flex flex-wrap items-center gap-3 pt-2 relative z-10 border-t border-white/[0.06]">
          <button
            onClick={() => onNavigate('roadmap')}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Layers className="w-4 h-4" />
            <span>Open Flowchart Roadmap</span>
          </button>

          <button
            onClick={() => onNavigate('assessments')}
            className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-900 border border-white/[0.1] text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
          >
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <span>Take Skill-Gap Quiz</span>
          </button>

          <button
            onClick={() => onNavigate('diary')}
            className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-900 border border-white/[0.1] text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-emerald-400" />
            <span>Study Diary Notebook</span>
          </button>

          <button
            onClick={() => onNavigate('resources')}
            className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-900 border border-white/[0.1] text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Free Verified Resources</span>
          </button>
        </div>

      </div>

      {/* 2. DAILY TARGETS & ACTIONABLE CHECKLIST (WITH DIRECT QUIZ TRIGGERS) */}
      <DailyTargetsCard
        profile={profile}
        nba={nba}
        onNavigate={onNavigate}
        onUpdateProfile={onUpdateProfile}
      />

      {/* 3. QUICK NEXT BEST ACTION ACCELERATOR CARD */}
      <div className="p-6 sm:p-7 rounded-3xl bg-zinc-950 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Recommended Next Step
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            {nba.title}
          </h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            {nba.whyThisIsNext}
          </p>
        </div>

        <button
          onClick={() => {
            if (nba.type === 'assessment') {
              onNavigate('assessments', { autoStartSkillId: nba.milestoneId });
            } else {
              onNavigate('roadmap', { milestoneId: nba.milestoneId });
            }
          }}
          className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-200 text-black font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 shadow-lg"
        >
          <span>{nba.primaryActionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

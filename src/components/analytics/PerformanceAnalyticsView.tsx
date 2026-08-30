import React from 'react';
import { 
  BarChart3, 
  Target, 
  Award, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import type { UserProfile } from '../../engine/types';

interface PerformanceAnalyticsViewProps {
  profile: UserProfile;
  onLaunchAssessment: (skillId: string) => void;
}

export const PerformanceAnalyticsView: React.FC<PerformanceAnalyticsViewProps> = ({
  profile,
  onLaunchAssessment
}) => {
  const masteredCount = profile.skills.filter(s => s.status === 'mastered').length;
  const inProgressCount = profile.skills.filter(s => s.status === 'in_progress').length;
  const gapCount = profile.skills.filter(s => s.status === 'critical_gap').length;

  const totalMilestones = profile.activeRoadmap.length;
  const completedMilestones = profile.activeRoadmap.filter(m => m.status === 'completed').length;
  const overallRoadmapPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-md space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
            Learner Mastery Telemetry
          </span>
          <span className="text-xs text-slate-400">Diagnostic Calibrations & Gap Analysis</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-brand-400" />
          <span>Performance & Skill Gap Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Real competency scores calibrated against target requirements for <strong>{profile.goalTitle}</strong>.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-emerald-500/30 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Mastered Skills</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{masteredCount}</div>
          <span className="text-[10px] text-emerald-300">At target competency</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-blue-500/30 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">In Progress</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">{inProgressCount}</div>
          <span className="text-[10px] text-blue-300">Currently building depth</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-rose-500/30 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Critical Gaps</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">{gapCount}</div>
          <span className="text-[10px] text-rose-300">Prerequisite remediation</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-700 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Roadmap Progress</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-400">{overallRoadmapPercent}%</div>
          <span className="text-[10px] text-slate-400">{completedMilestones}/{totalMilestones} Milestones</span>
        </div>
      </div>

      {/* Main Grid: Skill Matrix & Assessment History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Comprehensive Skill Breakdown */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-400" />
              <span>Target Competency Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400">{profile.skills.length} Competencies Evaluated</span>
          </div>

          <div className="space-y-4">
            {profile.skills.map((skill) => {
              const isMastered = skill.status === 'mastered';
              const isGap = skill.status === 'critical_gap';
              const isUnassessed = skill.currentMastery === null;
              const mastery = skill.currentMastery ?? 0;

              return (
                <div key={skill.skillId} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-white">{skill.skillName}</span>
                      <span className="text-[10px] text-slate-500 block">Baseline Level: {skill.selfReportedLevel} • Gap: {skill.gapPercentage}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUnassessed ? (
                        <button
                          onClick={() => onLaunchAssessment(skill.skillId)}
                          className="px-2.5 py-1 rounded-lg bg-brand-600/20 hover:bg-brand-600/40 border border-brand-500/30 text-xs font-semibold text-brand-300 flex items-center gap-1"
                        >
                          <span>Calibrate</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : isMastered ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                          {mastery}% Mastered
                        </span>
                      ) : isGap ? (
                        <button
                          onClick={() => onLaunchAssessment(skill.skillId)}
                          className="px-2.5 py-0.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1"
                        >
                          <span>{mastery}% Gap</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
                          {mastery}% In Progress
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {!isUnassessed && (
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isMastered ? 'bg-emerald-400' : isGap ? 'bg-rose-500' : 'bg-brand-500'
                        }`}
                        style={{ width: `${mastery}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Assessment & Diagnostic History */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-400" />
              <span>Diagnostic Checkpoints</span>
            </h3>
            <span className="text-xs text-slate-400">{profile.assessmentHistory.length} Recorded</span>
          </div>

          <div className="space-y-3">
            {profile.assessmentHistory.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950 text-center space-y-2">
                <AlertCircle className="w-6 h-6 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No diagnostic drills completed yet.</p>
                <button
                  onClick={() => onLaunchAssessment(profile.skills[0]?.skillId)}
                  className="px-3 py-1.5 rounded-xl bg-brand-600 text-xs font-bold text-white"
                >
                  Start First Drill
                </button>
              </div>
            ) : (
              profile.assessmentHistory.map((att) => (
                <div key={att.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{att.skillName}</span>
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                      att.scorePercentage >= 75 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {att.scorePercentage}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {att.feedbackNotes}
                  </p>

                  <div className="text-[10px] text-brand-400 font-semibold pt-1 border-t border-slate-900">
                    Impact: {att.impactOnPath}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

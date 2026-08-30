import React, { useState } from 'react';
import { 
  GitCompare, 
  AlertTriangle, 
  TrendingUp 
} from 'lucide-react';
import type { UserProfile } from '../../engine/types';
import { simulateWhatIfScenario } from '../../engine/aiNavigator';

interface WhatIfViewProps {
  profile: UserProfile;
}

export const WhatIfView: React.FC<WhatIfViewProps> = ({ profile }) => {
  const currentDailyHours = (profile.dailyAvailabilityMinutes || 60) / 60;
  
  const [hoursPerDay, setHoursPerDay] = useState<number>(currentDailyHours);
  const [alternateRole, setAlternateRole] = useState<string>(profile.goalTitle);
  const [skipOptionalProjects, setSkipOptionalProjects] = useState<boolean>(false);

  const scenario = React.useMemo(() => {
    return simulateWhatIfScenario(profile, {
      hoursPerDay,
      alternateRole,
      skipOptionalProjects
    });
  }, [profile, hoursPerDay, alternateRole, skipOptionalProjects]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-md space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider text-brand-400 uppercase">Interactive Scenario Simulator</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300">
            Real-Time Pacing Model
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          What-If Path Simulator
        </h1>
        <p className="text-xs text-slate-400">
          Simulate how changes in your daily study investment, career destination, or project depth impact your timeline and prerequisite readiness.
        </p>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Input Controls */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-brand-400" />
            <span>Scenario Parameters</span>
          </h2>

          {/* Slider: Daily Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Daily Study Investment:</span>
              <span className="font-bold text-brand-400">{hoursPerDay} hours / day</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5h (Casual)</span>
              <span>Baseline ({currentDailyHours}h)</span>
              <span>6h (Intensive)</span>
            </div>
          </div>

          {/* Alternate Domain Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300">
              Simulate Target Career / Exam Switch:
            </label>
            <select
              value={alternateRole}
              onChange={(e) => setAlternateRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="Software Engineering Internship">Software Engineering Internship</option>
              <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
              <option value="Full-Stack Backend Engineer">Full-Stack Backend Engineer</option>
              <option value="Data Science & Analytics">Data Science & Analytics</option>
              <option value="Crack JEE (Main & Advanced)">Crack JEE (Main & Advanced)</option>
            </select>
          </div>

          {/* Toggle: Skip Optional Projects */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-white">Fast-Track (Skip Capstone Projects)</span>
              <p className="text-[11px] text-slate-400">Reduces timeline but impacts portfolio strength</p>
            </div>
            <input
              type="checkbox"
              checked={skipOptionalProjects}
              onChange={(e) => setSkipOptionalProjects(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-slate-900 border-slate-700"
            />
          </div>
        </div>

        {/* Right: Calculated Impact & Trade-Offs */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Simulated Outcome & Trade-Offs</span>
          </h2>

          {/* Key Metric Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Completion</span>
              <div className="text-2xl font-black text-white">
                ~{scenario.calculatedCompletionWeeks} <span className="text-sm font-normal text-slate-400">weeks</span>
              </div>
              <span className="text-[10px] text-brand-400 font-medium">({scenario.targetDateMonths} months)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Weekly Study Hours</span>
              <div className="text-2xl font-black text-white">
                {Math.round(hoursPerDay * 7)} <span className="text-sm font-normal text-slate-400">hrs/wk</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">Realistic Schedule</span>
            </div>
          </div>

          {/* Dynamic Explanation */}
          <div className="p-4 rounded-xl bg-brand-950/30 border border-brand-500/20 text-xs text-slate-300 leading-relaxed">
            <strong className="text-brand-300 font-semibold block mb-1">Pacing Analysis:</strong>
            {scenario.paceChangeExplanation}
          </div>

          {/* Trade-Offs Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Strategic Trade-Offs:
            </h3>
            <div className="space-y-1.5">
              {scenario.tradeOffs.map((to, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{to}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

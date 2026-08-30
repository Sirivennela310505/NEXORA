import React, { useState } from 'react';
import { 
  Compass, 
  Trophy, 
  ArrowRight, 
  Target,
  Award
} from 'lucide-react';
import type { UserProfile } from '../../engine/types';

interface DayByDayJourneyCardProps {
  profile: UserProfile;
  onNavigate: (tabId: string, payload?: any) => void;
}

export const DayByDayJourneyCard: React.FC<DayByDayJourneyCardProps> = ({
  profile,
  onNavigate
}) => {
  const isJEE = profile.goalCategory === 'jee' || profile.educationLevel === 'Class 10' || profile.educationLevel === 'Class 12';
  
  // Day-by-Day structured phase roadmap from Day 1 to Goal
  const journeyPhases = [
    {
      range: 'Day 1 — Day 7',
      title: 'Foundation Calibration & Baseline Diagnostics',
      badge: 'Current Stage',
      desc: isJEE 
        ? 'Establish fundamental roots in Quadratic Equations and 1D Kinematics through daily NCERT & Khan Academy drills.'
        : 'Master core memory models, Java/Python primitives, and establish your Git development environment.',
      challenge: isJEE ? 'Solve 25 Quadratic Inequality problems & 15 Kinematics vector questions.' : 'Implement 10 Array Two-Pointer problems on LeetCode / NeetCode.',
      competitions: isJEE ? ['National Science Olympiad (NSO)', 'JEE Weekly Speed Drills'] : ['LeetCode Weekly Contest', 'HackerRank 30 Days of Code']
    },
    {
      range: 'Day 8 — Day 30',
      title: 'Core Deep-Dive & Prerequisite Problem Solving',
      badge: 'Upcoming Phase',
      desc: isJEE 
        ? 'Transition into Trigonometric identities, Newton Laws of Motion, and Atomic Orbital hybridization.'
        : 'Deep dive into Hashing, Hash Maps, Relational SQL schemas, and REST API microservices.',
      challenge: isJEE ? 'Complete full-length 60-question timed Physics-Math diagnostic.' : 'Build a functional CRUD REST API with SQLite/Postgres backend.',
      competitions: isJEE ? ['KVPY / Regional Math Olympiad Mocks', 'JEE Main Chapter-wise Test Series'] : ['Smart India Hackathon (SIH 2026)', 'Devpost Open Web Hackathons']
    },
    {
      range: 'Month 2 — Month 3',
      title: 'Advanced Applications, Systems & Exam Mock Drills',
      badge: 'Goal Readiness',
      desc: isJEE 
        ? 'Calculus (Differential & Integral), Rotational Dynamics, and Organic Reaction Mechanisms.'
        : 'Trees, Graphs, System Design Basics, Docker, and ATS-optimized technical resume preparation.',
      challenge: isJEE ? 'Achieve 80%+ consistency on 3-hour full syllabus JEE simulation papers.' : 'Deploy a fullstack capstone project with Docker and quantify resume metrics.',
      competitions: isJEE ? ['JEE Advanced Rank Booster Series', 'All India Test Series (AITS)'] : ['Google Summer of Code (GSoC 2026)', 'Razorpay & Google Internship Drives']
    }
  ];

  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-md space-y-6 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
              Long-Term Pathway
            </span>
            <span className="text-xs text-slate-400">Day 1 to Goal Destination Blueprint</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-400" />
            <span>Structured Path: Day 1 until {profile.goalTitle}</span>
          </h2>
        </div>

        {/* Phase selector tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          {journeyPhases.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhaseIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePhaseIndex === idx
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.range}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Phase Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Phase Blueprint & Actionable Challenges */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-400">{journeyPhases[activePhaseIndex].range}</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-300 font-bold">
                {journeyPhases[activePhaseIndex].badge}
              </span>
            </div>

            <h3 className="text-base font-bold text-white">
              {journeyPhases[activePhaseIndex].title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {journeyPhases[activePhaseIndex].desc}
            </p>

            <div className="p-3.5 rounded-xl bg-brand-950/40 border border-brand-500/30 text-xs text-slate-200 space-y-1">
              <strong className="text-brand-300 font-bold block flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Phase Milestone Challenge:</span>
              </strong>
              <p>{journeyPhases[activePhaseIndex].challenge}</p>
            </div>
          </div>
        </div>

        {/* Right Col: Competitions & Hackathons to Participate In */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Competitions & Drives</span>
            </h4>

            <div className="space-y-2">
              {journeyPhases[activePhaseIndex].competitions.map((comp, cIdx) => (
                <div key={cIdx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold">{comp}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold shrink-0">Target</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('career')}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View All Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};

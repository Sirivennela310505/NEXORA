import React, { useState } from 'react';
import { 
  Briefcase, 
  FileText, 
  Sparkles,
  CheckCircle2, 
  Copy, 
  Check,
  Building2,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import type { ResumeData, UserProfile } from '../../engine/types';
import { calculateOpportunityMatches, evaluateResumeATS, getInitialResume } from '../../engine/careerEngine';

interface CareerViewProps {
  profile: UserProfile;
}

export const CareerView: React.FC<CareerViewProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'resume'>('opportunities');
  const opportunities = React.useMemo(() => calculateOpportunityMatches(profile), [profile]);
  
  // Resume state
  const [resume, setResume] = useState<ResumeData>(() => getInitialResume(profile));
  const [copied, setCopied] = useState(false);

  const atsReport = React.useMemo(() => evaluateResumeATS(resume), [resume]);

  const handleUpdateSummary = (newSummary: string) => {
    setResume(prev => ({ ...prev, summary: newSummary }));
  };

  const handleCopyResumeText = () => {
    const text = `${resume.fullName}\n${resume.email} | ${resume.linkedin} | ${resume.github}\n\nTARGET ROLE: ${resume.targetRole}\n\nPROFESSIONAL SUMMARY:\n${resume.summary}\n\nEDUCATION:\n${resume.education.map(e => `${e.degree} - ${e.institution} (${e.year}) | CGPA: ${e.cgpaOrScore}`).join('\n')}\n\nEXPERIENCE:\n${resume.experience.map(e => `${e.title} @ ${e.company} (${e.duration})\n${e.bullets.map(b => `• ${b}`).join('\n')}`).join('\n\n')}\n\nPROJECTS:\n${resume.projects.map(p => `${p.title} (${p.technologies})\n${p.bullets.map(b => `• ${b}`).join('\n')}`).join('\n\n')}\n\nCORE SKILLS:\n${resume.skillsList.join(', ')}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/[0.08] backdrop-blur-md shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Career Readiness & Placement Suite
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Opportunities & ATS Resume Optimizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Real-world internship alignments, matching explanations, and ATS resume scoring calibrated to your <strong>{profile.goalTitle}</strong> roadmap.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800 shrink-0 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'opportunities'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Target Opportunities</span>
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'resume'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ATS Resume Builder</span>
          </button>
        </div>
      </div>

      {/* 1. OPPORTUNITIES TAB */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-6 rounded-3xl bg-zinc-950 border border-white/[0.08] hover:border-cyan-500/40 transition-all hover:scale-[1.01] shadow-xl space-y-4 flex flex-col justify-between group text-left"
              >
                <div className="space-y-3.5">
                  {/* Top Row: Type & Match Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-cyan-400 font-bold uppercase tracking-wider">
                        {opp.type}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {opp.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1 font-medium text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          {opp.organization}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {opp.location}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-base font-black text-emerald-400">{opp.matchScore}%</div>
                      <div className="text-[9px] font-semibold text-emerald-300/80 uppercase tracking-wider">Match</div>
                    </div>
                  </div>

                  {/* Why this matches callout */}
                  <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 space-y-1">
                    <strong className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      Why this matches your profile:
                    </strong>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {opp.matchReason}
                    </p>
                  </div>

                  {/* Required Roadmap Competencies */}
                  <div className="space-y-1.5">
                    <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-500" />
                      Required roadmap competencies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.requiredSkills.map(req => {
                        const isMastered = profile.skills.some(s => s.skillName === req && (s.status === 'mastered' || (s.currentMastery && s.currentMastery >= 70)));
                        return (
                          <span
                            key={req}
                            className={`text-[10px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                              isMastered 
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                                : 'bg-zinc-900 text-slate-400 border border-zinc-800'
                            }`}
                          >
                            {req} {isMastered && '✓'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    Deadline: <strong className="text-slate-300 font-normal">{opp.deadline}</strong>
                  </span>
                  
                  <a
                    href={opp.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-white/10"
                  >
                    <span>Apply / View Listing</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ATS RESUME BUILDER TAB */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Left 2 Cols: Form & Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/[0.08] space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Resume Content & Target Alignment</span>
                </h3>
                <button
                  onClick={handleCopyResumeText}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Plaintext'}</span>
                </button>
              </div>

              {/* Summary Editor */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Professional Target Summary (Quantified):
                </label>
                <textarea
                  value={resume.summary}
                  onChange={(e) => handleUpdateSummary(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 leading-relaxed transition-colors"
                />
              </div>

              {/* Projects Snippet */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Featured Technical Projects ({resume.projects.length})
                </h4>
                {resume.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-sm">{proj.title}</strong>
                      <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        {proj.technologies}
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 leading-relaxed">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Mastered Skills List */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Verified Skills from Roadmap ({resume.skillsList.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skillsList.map((skill, sIdx) => (
                    <span key={sIdx} className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-slate-200 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: ATS Score & Actionable Feedback */}
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/[0.08] space-y-6 shadow-2xl">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-cyan-400 text-2xl font-black text-white shadow-xl shadow-cyan-500/10">
                  {atsReport.atsScore}
                </div>
                <h3 className="text-sm font-bold text-white">ATS Impact & Match Score</h3>
                <p className="text-xs text-slate-400">
                  Calculated based on quantifiable metrics, active action verbs, and target-role keywords.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI ATS Optimization Feedback</span>
                </h4>

                {atsReport.feedback.length === 0 ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Your resume matches top-tier technical screening standards!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {atsReport.feedback.map((fb, fbIdx) => (
                      <div key={fbIdx} className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-slate-300 space-y-1">
                        <span className="text-amber-400 font-semibold block">• Recommendation</span>
                        <p className="text-slate-400">{fb}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-slate-200 block">Target Role Alignment:</span>
                <span>{profile.goalTitle} (Standard Product Company Bar)</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

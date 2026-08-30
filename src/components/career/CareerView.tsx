import React, { useState } from 'react';
import { 
  Briefcase, 
  FileText, 
  Sparkles,
  CheckCircle2,
  ExternalLink, 
  Copy, 
  Check
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
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-brand-400 uppercase">Career Readiness & Placement Suite</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Opportunities & ATS Resume Optimizer
          </h1>
          <p className="text-xs text-slate-400">
            Real internship alignments, match explanations, and ATS resume scoring calibrated to your roadmap.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'opportunities'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Target Opportunities</span>
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'resume'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ATS Resume Builder</span>
          </button>
        </div>
      </div>

      {/* 1. OPPORTUNITIES TAB */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold uppercase">
                        {opp.type}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">{opp.title}</h3>
                      <p className="text-xs text-brand-400 font-semibold">{opp.organization} • {opp.location}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-emerald-400">{opp.matchScore}%</div>
                      <div className="text-[10px] text-slate-400">Match Score</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <strong className="text-brand-300 font-semibold block mb-0.5">Why this matches your profile:</strong>
                    {opp.matchReason}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-slate-400 text-[11px]">Required roadmap competencies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.requiredSkills.map(req => {
                        const isMastered = profile.skills.some(s => s.skillName === req && (s.status === 'mastered' || (s.currentMastery && s.currentMastery >= 70)));
                        return (
                          <span
                            key={req}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                              isMastered ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {req} {isMastered && '✓'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Deadline: {opp.deadline}</span>
                  <a
                    href={opp.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/40 border border-brand-500/30 text-brand-300 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Apply / View Listing</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ATS RESUME BUILDER TAB */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Form & Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-400" />
                  <span>Resume Content & Alignment</span>
                </h3>
                <button
                  onClick={handleCopyResumeText}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500 leading-relaxed"
                />
              </div>

              {/* Projects Snippet */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Featured Technical Projects ({resume.projects.length})
                </h4>
                {resume.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-sm">{proj.title}</strong>
                      <span className="text-[10px] text-brand-400 font-mono">{proj.technologies}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Mastered Skills List */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Verified Skills from Roadmap ({resume.skillsList.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skillsList.map((skill, sIdx) => (
                    <span key={sIdx} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: ATS Score & Actionable Feedback */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-500/10 border-2 border-brand-500/40 text-2xl font-black text-white shadow-lg shadow-brand-500/10">
                  {atsReport.atsScore}
                </div>
                <h3 className="text-sm font-bold text-white">ATS Impact & Match Score</h3>
                <p className="text-xs text-slate-400">
                  Calculated based on quantifiable metrics, active action verbs, and target-role keywords.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  <span>AI ATS Optimization Feedback</span>
                </h4>

                {atsReport.feedback.length === 0 ? (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Your resume matches top-tier technical screening standards!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {atsReport.feedback.map((fb, fbIdx) => (
                      <div key={fbIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <span className="text-amber-400 font-semibold block">• Recommendation</span>
                        <p className="text-slate-400">{fb}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
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

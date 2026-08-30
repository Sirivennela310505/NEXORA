import React, { useState } from 'react';
import { 
  User, 
  Target, 
  Clock, 
  Save, 
  Check, 
  RotateCcw,
  Download
} from 'lucide-react';
import type { EducationLevel, UserProfile } from '../../engine/types';
import { jsPDF } from 'jspdf';
import { generatePersonalizedRoadmap } from '../../engine/adaptiveEngine';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetOnboarding: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onResetOnboarding
}) => {
  const [fullName, setFullName] = useState(profile.fullName);
  const [dailyMinutes, setDailyMinutes] = useState(profile.dailyAvailabilityMinutes);
  const [learningPreference, setLearningPreference] = useState(profile.learningPreference);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(profile.educationLevel);
  const [branchOrStream, setBranchOrStream] = useState(profile.branchOrStream || '');
  
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const partial: Partial<UserProfile> = {
      ...profile,
      fullName,
      dailyAvailabilityMinutes: dailyMinutes,
      learningPreference,
      educationLevel,
      branchOrStream
    };

    // Re-generate roadmap based on updated time/style if changed
    const roadmap = generatePersonalizedRoadmap(partial);

    const updated: UserProfile = {
      ...partial,
      activeRoadmap: roadmap,
      pathVersion: profile.pathVersion + 1,
      lastPathUpdateReason: 'Profile updated: Daily availability and learning style refreshed.'
    } as UserProfile;

    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Export human-readable natural language PDF report
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    const checkPageBreak = (neededHeight: number) => {
      if (yPos + neededHeight > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
    };

    // Top Header Banner
    doc.setFillColor(15, 23, 42); // dark navy
    doc.rect(0, 0, pageWidth, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('NEXORA — Personalized Career & Learning Plan', 14, 18);
    
    yPos = 38;

    // Section 1: Learner Overview
    doc.setTextColor(14, 165, 233); // Cyan accent
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Learner Profile & Goal Objectives', 14, yPos);
    yPos += 7;

    doc.setTextColor(51, 65, 85); // Slate 700
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');

    const learnerDetails = [
      `Learner Name: ${profile.fullName || 'Student'}`,
      `Account Email: ${profile.email || 'N/A'}`,
      `Target Career Goal: ${profile.goalTitle || 'Software Engineering'}`,
      `Education Level: ${profile.educationLevel || 'Undergraduate'} ${profile.branchOrStream ? `(${profile.branchOrStream})` : ''}`,
      `Daily Study Allocation: ${profile.dailyAvailabilityMinutes || 90} Minutes per day`,
      `Preferred Learning Style: ${profile.learningPreference || 'Mixed'}`,
      `Target Completion: ${profile.targetDate || 'Upcoming Milestone Cycle'}`,
      `Plan Version: v${profile.pathVersion || 1} (Engine: NEXORA Adaptive Pathfinder)`
    ];

    learnerDetails.forEach(detail => {
      checkPageBreak(6);
      doc.text(`•  ${detail}`, 16, yPos);
      yPos += 5.5;
    });

    yPos += 4;

    // Section 2: Step-by-Step Milestones Roadmap
    checkPageBreak(15);
    doc.setTextColor(14, 165, 233);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Step-by-Step Learning Roadmap & Milestones', 14, yPos);
    yPos += 7;

    if (profile.activeRoadmap && profile.activeRoadmap.length > 0) {
      profile.activeRoadmap.forEach((m, idx) => {
        checkPageBreak(22);
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.text(`Milestone ${idx + 1}: ${m.title} (${m.estimatedHours} Hours — ${m.status.toUpperCase()})`, 16, yPos);
        yPos += 5.5;

        doc.setTextColor(71, 85, 105);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(`Description: ${m.description}`, pageWidth - 32);
        doc.text(descLines, 18, yPos);
        yPos += descLines.length * 4.5 + 2;

        if (m.resources && m.resources.length > 0) {
          checkPageBreak(12);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 116, 139);
          const resSummary = `Curated Materials: ${m.resources.map(r => `${r.title} [${r.provider}]`).join(', ')}`;
          const resLines = doc.splitTextToSize(resSummary, pageWidth - 32);
          doc.text(resLines, 18, yPos);
          yPos += resLines.length * 4.5 + 2;
        }
        yPos += 2;
      });
    } else {
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9.5);
      doc.text('No active milestones configured yet. Run the onboarding diagnostic to initialize your path.', 16, yPos);
      yPos += 7;
    }

    yPos += 4;

    // Section 3: Skill Competency Matrix
    checkPageBreak(18);
    doc.setTextColor(14, 165, 233);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Skill Competency Assessment', 14, yPos);
    yPos += 7;

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');

    if (Array.isArray(profile.skills) && profile.skills.length > 0) {
      profile.skills.forEach(state => {
        checkPageBreak(6);
        const masteryText = state.currentMastery !== null ? `${state.currentMastery}%` : 'Unassessed';
        doc.text(`•  ${state.skillName}: Self-Reported: ${state.selfReportedLevel} | Verified Mastery: ${masteryText} (Status: ${state.status})`, 16, yPos);
        yPos += 5.5;
      });
    } else {
      doc.text('•  Skill levels are calibrated dynamically through quizzes & practice challenges.', 16, yPos);
      yPos += 5.5;
    }

    yPos += 5;

    // Section 4: AI Recommendations
    checkPageBreak(20);
    doc.setTextColor(14, 165, 233);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Adaptive AI Pathfinder Recommendations', 14, yPos);
    yPos += 7;

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const aiGuidance = `Based on your goal (${profile.goalTitle}) and ${profile.dailyAvailabilityMinutes} min/day allocation, maintain consistent daily study intervals. Complete milestone prerequisites in sequence, solve interactive challenges, and re-run diagnostic tests to trigger automatic roadmap updates.`;
    const guidanceLines = doc.splitTextToSize(aiGuidance, pageWidth - 28);
    doc.text(guidanceLines, 16, yPos);

    // Numbered Footer on all pages
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`NEXORA AI Learning Platform • Exported on ${new Date().toLocaleDateString()} • Page ${i} of ${totalPages}`, 14, pageHeight - 8);
    }

    doc.save(`NEXORA_Learning_Plan_${profile.fullName ? profile.fullName.replace(/\s+/g, '_') : 'Learner'}.pdf`);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-md space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider text-brand-400 uppercase">Learner Identity & Configuration</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-brand-400" />
          <span>Learner Profile & Settings</span>
        </h1>
        <p className="text-xs text-slate-400">
          Manage your educational background, pacing preferences, and target goal milestones.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-brand-400" />
            <span>Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-400" />
            <span>Target Destination & Education Stage</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Active Goal Category</label>
              <input
                type="text"
                disabled
                value={profile.goalTitle}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-brand-400 font-semibold cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Education Stage</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                {[
                  'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12',
                  'Diploma', 'Undergraduate', 'Postgraduate', 'Graduate', 'Working Professional'
                ].map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-slate-300">Branch / Specialization</label>
              <input
                type="text"
                value={branchOrStream}
                onChange={(e) => setBranchOrStream(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" />
            <span>Pacing & Learning Modality</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Daily Study Time (Minutes)</label>
              <input
                type="number"
                min="15"
                max="480"
                step="15"
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(parseInt(e.target.value) || 60)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Learning Resource Preference</label>
              <select
                value={learningPreference}
                onChange={(e) => setLearningPreference(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="Mixed">Mixed (Balanced)</option>
                <option value="Practice">Practice & Problem Solving</option>
                <option value="Video">Video Lectures</option>
                <option value="Reading">Documentation & Books</option>
                <option value="Projects">Hands-on Projects</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onResetOnboarding}
            className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-rose-400 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset & Re-run Onboarding Diagnostic</span>
          </button>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Settings Saved & Roadmap Synced!' : 'Save & Sync Journey'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-cyan-500/30 hover:border-cyan-400 text-xs font-semibold text-cyan-300 transition-all flex items-center gap-2 shadow-md shadow-cyan-500/10"
              title="Download human-readable Learning & Career Plan PDF"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Download Learning Plan (PDF)</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};

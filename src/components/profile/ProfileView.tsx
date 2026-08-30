import React, { useState } from 'react';
import { 
  User, 
  Target, 
  Clock, 
  Save, 
  Check, 
  RotateCcw
} from 'lucide-react';
import type { EducationLevel, UserProfile } from '../../engine/types';
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

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Settings Saved & Roadmap Synced!' : 'Save & Sync Journey'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

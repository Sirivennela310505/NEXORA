import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Check, 
  Laptop, 
  FolderGit2, 
  BrainCircuit, 
  Compass 
} from 'lucide-react';
import type { EducationLevel, GoalCategory, UserProfile } from '../../engine/types';
import { initializeSkillsForGoal } from '../../engine/skillGapEngine';
import { generatePersonalizedRoadmap } from '../../engine/adaptiveEngine';

interface OnboardingWizardProps {
  userFullName: string;
  userEmail: string;
  userId: string;
  onComplete: (profile: UserProfile) => void;
}

interface GoalOption {
  id: GoalCategory;
  title: string;
  desc: string;
  categoryBadge: string;
  icon: any;
  targetLevel: EducationLevel;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'internship',
    title: 'B.Tech SWE Placements & Internships',
    desc: 'Master Core DSA, LeetCode patterns, and high-scale System Design for top tech companies.',
    categoryBadge: 'B.Tech / College',
    icon: Laptop,
    targetLevel: 'Undergraduate'
  },
  {
    id: 'jee',
    title: 'JEE Main & Advanced / NEET',
    desc: 'High-yield Physics, Chemistry, Calculus, and Biology with deep prerequisite mastery.',
    categoryBadge: '11th / 12th / Inter',
    icon: GraduationCap,
    targetLevel: 'Class 12'
  },
  {
    id: 'swe',
    title: 'Class 10 Board Exam Excellence (95%+)',
    desc: 'CBSE / State board foundations in Mathematics, Science, and analytical problem-solving.',
    categoryBadge: 'Class 10th',
    icon: BookOpen,
    targetLevel: 'Class 10'
  },
  {
    id: 'career_switch',
    title: 'Full-Stack Project Builder & Portfolio',
    desc: 'Build and deploy real-world production projects from scratch with clean architecture.',
    categoryBadge: 'Project Builder',
    icon: FolderGit2,
    targetLevel: 'Working Professional'
  },
  {
    id: 'ai_ml',
    title: 'AI & Machine Learning Specialist',
    desc: 'Linear algebra, neural networks, PyTorch, and generative AI systems.',
    categoryBadge: 'AI & Data',
    icon: BrainCircuit,
    targetLevel: 'Undergraduate'
  }
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  userFullName,
  userEmail,
  userId,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Form State
  const [selectedGoal, setSelectedGoal] = useState<GoalOption>(GOAL_OPTIONS[0]);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('Undergraduate');
  const [learningPreference, setLearningPreference] = useState<'Video' | 'Reading' | 'Practice' | 'Projects' | 'Mixed'>('Mixed');
  const [dailyMinutes, setDailyMinutes] = useState<number>(60);
  const [primaryInterests, setPrimaryInterests] = useState<string[]>(['Data Structures', 'Web Systems']);
  const [customGoalNote, setCustomGoalNote] = useState('');

  // Loading Screen State (ReactBits 3D Neural Path Builder)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);

  const analysisSteps = [
    'Analyzing your educational background and target goal...',
    'Synthesizing optimal prerequisite graph nodes...',
    'Filtering 100% free verified video lessons and practice problems...',
    'Structuring Day 1 to Day 30 milestones & Daily Notebook...',
    'Your personalized NEXORA path is ready!'
  ];

  const handleSelectGoal = (goal: GoalOption) => {
    setSelectedGoal(goal);
    setEducationLevel(goal.targetLevel);
  };

  const toggleInterest = (interest: string) => {
    setPrimaryInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleStartGeneration = () => {
    setIsAnalyzing(true);
    setAnalysisStepIndex(0);

    const stepInterval = setInterval(() => {
      setAnalysisStepIndex(prev => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 700);

    setTimeout(() => {
      clearInterval(stepInterval);

      const skills = initializeSkillsForGoal(selectedGoal.id, {});
      
      const partialProfile: Partial<UserProfile> = {
        id: userId,
        fullName: userFullName || 'Learner',
        email: userEmail,
        createdAt: new Date().toISOString(),
        onboardingCompleted: true,
        educationLevel,
        branchOrStream: educationLevel === 'Class 10' ? 'Class 10 Board' : educationLevel === 'Class 12' ? 'PCM / Science' : 'Computer Science',
        goalCategory: selectedGoal.id,
        goalTitle: selectedGoal.title,
        goalNaturalLanguage: customGoalNote || `My goal is ${selectedGoal.title}`,
        targetDate: '2026-12-31',
        dailyAvailabilityMinutes: dailyMinutes,
        learningPreference,
        struggles: primaryInterests,
        skills,
        baselineDiagnosticCompleted: false,
        assessmentHistory: [],
        pathVersion: 1,
        lastPathUpdateReason: 'Personalized adaptive roadmap initialized.',
        feedbackLog: []
      };

      const roadmap = generatePersonalizedRoadmap(partialProfile);
      
      const finalProfile: UserProfile = {
        ...partialProfile,
        activeRoadmap: roadmap
      } as UserProfile;

      onComplete(finalProfile);
    }, 3800);
  };

  // ================= 3D NEURAL PATH BUILDER LOADING SCREEN =================
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-slate-100 selection:bg-brand-500 selection:text-white">
        <div className="max-w-lg w-full bg-zinc-950 border border-white/[0.1] rounded-3xl p-8 sm:p-10 backdrop-blur-xl text-center shadow-2xl space-y-8 relative overflow-hidden">
          
          {/* Animated Ambient Glowing Orb */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Glowing Animated Icon */}
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 animate-spin-slow blur-md opacity-70" />
            <div className="relative w-16 h-16 rounded-2xl bg-black border border-white/[0.15] flex items-center justify-center text-cyan-400">
              <BrainCircuit className="w-8 h-8 animate-pulse text-cyan-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-white">
              Building Your Learning Pathway
            </h2>
            <p className="text-xs sm:text-sm text-cyan-300 font-mono min-h-[40px] flex items-center justify-center">
              {analysisSteps[analysisStepIndex]}
            </p>
          </div>

          {/* Progress Multi-step Indicator */}
          <div className="space-y-3 pt-2">
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-white/[0.08]">
              <div 
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 h-full transition-all duration-700 ease-out"
                style={{ width: `${((analysisStepIndex + 1) / analysisSteps.length) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Step {analysisStepIndex + 1} of {analysisSteps.length}</span>
              <span>{Math.round(((analysisStepIndex + 1) / analysisSteps.length) * 100)}%</span>
            </div>
          </div>

          {/* Generated Highlights Preview */}
          <div className="p-4 rounded-2xl bg-black border border-white/[0.06] text-left space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Target: {selectedGoal.title}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Daily Commitment: {dailyMinutes} mins/day</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Curated Free Resources: 100% Verified</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-brand-500 selection:text-white">
      
      <div className="max-w-3xl w-full bg-zinc-950 border border-white/[0.1] rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
        
        {/* Top Header & Step Tracker */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                NEXORA Goal Setup
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Step {step} of {totalSteps}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-white/[0.06]">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* ================= STEP 1: CHOOSE TARGET GOAL ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome, {userFullName.split(' ')[0] || 'Learner'}! What is your main goal?
              </h2>
              <p className="text-sm text-slate-400">
                Select your current focus so NEXORA can configure the right prerequisite graph and free resources.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {GOAL_OPTIONS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoal.id === goal.id;
                return (
                  <div
                    key={goal.id}
                    onClick={() => handleSelectGoal(goal)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 text-left ${
                      isSelected
                        ? 'bg-zinc-900 border-cyan-400 shadow-lg shadow-cyan-500/10'
                        : 'bg-black border-white/[0.08] hover:border-white/[0.2]'
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${isSelected ? 'bg-cyan-500 text-black' : 'bg-zinc-900 text-slate-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{goal.title}</h4>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.06] text-slate-400">
                          {goal.categoryBadge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{goal.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 2: EDUCATION STAGE & INTERESTS ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tell us about your background & interests
              </h2>
              <p className="text-sm text-slate-400">
                This helps customize the difficulty and depth of your daily challenges.
              </p>
            </div>

            {/* Education Level */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Educational Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Class 10', 'Class 12', 'Undergraduate', 'Working Professional'] as EducationLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEducationLevel(level)}
                    className={`p-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                      educationLevel === level
                        ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                        : 'bg-black border-white/[0.08] text-slate-300 hover:border-white/[0.2]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain Interests */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Topics You Want to Master (Select Multiple)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Data Structures & Algorithms',
                  'System Architecture',
                  'Full-Stack Web Dev',
                  'Mechanics & Physics',
                  'Calculus & Trigonometry',
                  'Chemical Reactions',
                  'Machine Learning & Python',
                  'Database & SQL'
                ].map((topic) => {
                  const isChecked = primaryInterests.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleInterest(topic)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                          : 'bg-black text-slate-400 border-white/[0.08] hover:border-white/[0.2]'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                      <span>{topic}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Any specific project or target exam you're aiming for? (Optional)
              </label>
              <input
                type="text"
                value={customGoalNote}
                onChange={(e) => setCustomGoalNote(e.target.value)}
                placeholder="e.g. Build an AI-powered SaaS / Crack JEE Advanced / Score 95% in Class 10 Boards"
                className="w-full px-4 py-3 rounded-xl bg-black border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

          </div>
        )}

        {/* ================= STEP 3: LEARNING PATTERN & MODALITY ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                How do you learn best?
              </h2>
              <p className="text-sm text-slate-400">
                NEXORA will tailor whether your milestones emphasize video lessons, hands-on coding, or interactive diagrams.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'Mixed', label: 'Balanced (Recommended)', desc: 'Mix of video walkthroughs, flowchart nodes, and problem sets.' },
                { id: 'Practice', label: 'Hands-on Problem Solving', desc: 'Focus heavily on coding problems and practice drills.' },
                { id: 'Video', label: 'Video Masterclasses', desc: 'Step-by-step verified video tutorials from top instructors.' },
                { id: 'Projects', label: 'Project-First Building', desc: 'Build production-ready codebases with guided blueprints.' }
              ].map((pref) => {
                const isSelected = learningPreference === pref.id;
                return (
                  <div
                    key={pref.id}
                    onClick={() => setLearningPreference(pref.id as any)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-zinc-900 border-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'bg-black border-white/[0.08] hover:border-white/[0.2]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white">{pref.label}</h4>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{pref.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 4: DAILY TIME COMMITMENT ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Set your daily study commitment
              </h2>
              <p className="text-sm text-slate-400">
                NEXORA dynamically spaces your milestones to fit your schedule without burnout.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { mins: 30, label: '30 mins/day', desc: 'Light & Steady' },
                { mins: 60, label: '1 hour/day', desc: 'Optimal Momentum' },
                { mins: 90, label: '1.5 hours/day', desc: 'Intensive Sprint' },
                { mins: 120, label: '2+ hours/day', desc: 'Full-Time Mastery' }
              ].map((t) => (
                <button
                  key={t.mins}
                  type="button"
                  onClick={() => setDailyMinutes(t.mins)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    dailyMinutes === t.mins
                      ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                      : 'bg-black border-white/[0.08] text-slate-300 hover:border-white/[0.2]'
                  }`}
                >
                  <div className="text-sm font-bold">{t.label}</div>
                  <div className="text-[11px] opacity-80 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900 border border-white/[0.08] flex items-center gap-4">
              <Clock className="w-8 h-8 text-cyan-400 shrink-0" />
              <div className="text-xs text-slate-300 leading-relaxed">
                You can adjust your daily commitment anytime in your profile settings. NEXORA automatically adjusts milestone targets if you fall behind or want to move faster.
              </div>
            </div>

          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl bg-black border border-white/[0.1] text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-7 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleStartGeneration}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:opacity-90 text-black font-extrabold text-sm flex items-center gap-2 transition-all shadow-xl shadow-cyan-500/25 animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate My Personalized Roadmap</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

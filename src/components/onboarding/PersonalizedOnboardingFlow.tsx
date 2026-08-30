import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BrainCircuit, 
  Mic, 
  MicOff,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Laptop,
  Briefcase
} from 'lucide-react';
import type { EducationLevel, GoalCategory, UserProfile } from '../../engine/types';
import { initializeSkillsForGoal } from '../../engine/skillGapEngine';
import { generatePersonalizedRoadmap } from '../../engine/adaptiveEngine';

interface PersonalizedOnboardingFlowProps {
  userFullName: string;
  userEmail: string;
  userId: string;
  onComplete: (profile: UserProfile) => void;
}

export const PersonalizedOnboardingFlow: React.FC<PersonalizedOnboardingFlowProps> = ({
  userFullName,
  userEmail,
  userId,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Form State
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('Class 12');
  const [goalCategory, setGoalCategory] = useState<GoalCategory>('jee');
  const [goalTitle, setGoalTitle] = useState<string>('Crack JEE Main & Advanced');
  const [naturalLanguageGoal, setNaturalLanguageGoal] = useState<string>('');
  const [selectedStruggles, setSelectedStruggles] = useState<string[]>([]);
  const [dailyMinutes, setDailyMinutes] = useState<number>(90);
  const [learningModality, setLearningModality] = useState<'Mixed' | 'Practice' | 'Video' | 'Reading'>('Mixed');

  // AI Loading & Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(1);
  const [showRecommendationScreen, setShowRecommendationScreen] = useState<boolean>(false);
  const [recommendedTracks, setRecommendedTracks] = useState<{ id: string; title: string; category: GoalCategory; desc: string; matchScore: number }[]>([]);

  // Dynamic Goal Presets based on Education Level
  const goalPresets = React.useMemo(() => {
    if (educationLevel === 'Class 10') {
      return [
        { title: 'Score 95%+ in Class 10 Board Exams', cat: 'swe' as GoalCategory, desc: 'Complete NCERT Math & Science with board question drills' },
        { title: 'Class 10 Foundation for JEE / NEET', cat: 'jee' as GoalCategory, desc: 'Deep prerequisite grounding in Algebra, Physics & Chemistry' },
        { title: 'National Science / Math Olympiads (NTSE/NSO)', cat: 'jee' as GoalCategory, desc: 'Advanced analytical problem solving and competitive foundations' }
      ];
    }
    if (educationLevel === 'Class 12') {
      return [
        { title: 'Crack JEE Main & Advanced', cat: 'jee' as GoalCategory, desc: 'Calculus, Mechanics, Organic Chemistry & negative-marking MCQs' },
        { title: 'Crack NEET Medical Entrance', cat: 'neet' as GoalCategory, desc: 'High-yield Biology, Organic Chemistry & Physics numericals' },
        { title: 'Class 12 Board PCM/PCB 95%+ Mastery', cat: 'jee' as GoalCategory, desc: 'Derivations, numerical drills, and NCERT theory' }
      ];
    }
    if (educationLevel === 'Undergraduate') {
      return [
        { title: 'Java Backend & Microservices Developer', cat: 'swe' as GoalCategory, desc: 'Core Java, Spring Boot, Hibernate ORM, REST APIs, Kafka & MySQL' },
        { title: 'B.Tech SWE Placements & Internships', cat: 'internship' as GoalCategory, desc: 'Core DSA (NeetCode 150), System Design & Top Tech Interviews' },
        { title: 'Full-Stack Web & Systems Developer', cat: 'swe' as GoalCategory, desc: 'React, Node/Express, TypeScript, PostgreSQL & Cloud Deployment' },
        { title: 'AI / Machine Learning & LLM Engineer', cat: 'ai_ml' as GoalCategory, desc: 'NumPy, PyTorch, Neural Networks, LangChain & Vector RAG' },
        { title: 'Cloud & DevOps Engineer', cat: 'swe' as GoalCategory, desc: 'Docker, Kubernetes, CI/CD Pipelines, AWS & Microservices' },
        { title: 'Data Engineer & Analytics Specialist', cat: 'data_science' as GoalCategory, desc: 'Advanced SQL, Python ETL, Apache Spark, Kafka & Data Warehousing' }
      ];
    }
    return [
      { title: 'Full-Stack Production Project Builder', cat: 'career_switch' as GoalCategory, desc: 'Build and deploy scalable portfolio applications' },
      { title: 'Non-Tech to Software Engineering Transition', cat: 'career_switch' as GoalCategory, desc: 'Zero-to-one programming fundamentals & data structures' },
      { title: 'Java & Cloud Backend Engineering', cat: 'swe' as GoalCategory, desc: 'Spring Boot, Distributed Microservices, Docker & Redis' },
      { title: 'Applied AI Systems & Agentic Engineering', cat: 'ai_ml' as GoalCategory, desc: 'FastAPI, LLM Fine-Tuning, Multi-Agent Systems & Vector Search' }
    ];
  }, [educationLevel]);

  // Dynamic Struggle / Bottleneck options based on Education Level & Goal
  const struggleOptions = React.useMemo(() => {
    if (educationLevel === 'Class 10') {
      return [
        'Trigonometric Identities & Polynomial Formulas',
        'Physics: Ray Optics & Electricity Circuit Numericals',
        'Chemistry: Balancing Chemical Equations & Carbon Compounds',
        'Biology: Life Processes & Heredity Diagrams',
        'Board Exam Time Management & Step-by-Step Writing',
        'Solving Application & Word Problems Independently'
      ];
    }
    if (educationLevel === 'Class 12' || goalCategory === 'jee' || goalCategory === 'neet') {
      return [
        'Calculus: Definite Integrals & Differential Equations',
        'Physics: Mechanics, Rotational Dynamics & Electromagnetism',
        'Chemistry: Organic Reaction Mechanisms (SN1/SN2/E1/E2)',
        'Physical Chemistry: Thermodynamics & Equilibrium Numericals',
        'NEET Biology: Genetics & Human Physiology Retention',
        'Negative Marking & Exam Speed in Mock Tests'
      ];
    }
    if (educationLevel === 'Undergraduate' || goalCategory === 'internship' || goalCategory === 'swe') {
      return [
        'Java / Spring Boot Microservices & Database Indexing',
        'Solving Medium/Hard LeetCode DSA Problems independently',
        'Dynamic Programming & Graph Traversal Patterns',
        'High-Scale System Design, Caching & Database Sharding',
        'Building Full-Stack projects with clean backend architecture',
        'Resume Shortlisting & Tech Placement Coding Rounds'
      ];
    }
    return [
      'Learning Programming Fundamentals from Zero',
      'Understanding Database Schemas, Indexing & REST APIs',
      'Deploying Full-Stack Code to Production (Vercel/Render)',
      'Staying Consistent with Daily Coding Habit',
      'Building Portfolio Projects that Impress Recruiters'
    ];
  }, [educationLevel, goalCategory]);

  // Speech to Text handler
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your response.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNaturalLanguageGoal(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);

    setTimeout(() => setAnalysisStep(2), 700);
    setTimeout(() => setAnalysisStep(3), 1500);
    setTimeout(() => setAnalysisStep(4), 2200);

    setTimeout(() => {
      setIsAnalyzing(false);

      const customInput = naturalLanguageGoal.toLowerCase().trim();

      if (educationLevel === 'Class 10') {
        setRecommendedTracks([
          {
            id: 'class10-board-excel',
            title: 'Class 10 CBSE/State Board Mastery (95%+ Target)',
            category: 'swe',
            desc: 'Step-by-step NCERT Mathematics, Physics, and Chemistry roadmap with board question drills.',
            matchScore: 98
          },
          {
            id: 'jee-foundation-10',
            title: 'Class 10 Early JEE / NEET Foundation',
            category: 'jee',
            desc: 'Master Polynomials, Kinematics, and Chemical Bonding prerequisites for high-yield competitive success.',
            matchScore: 94
          }
        ]);
      } else if (educationLevel === 'Class 12' || goalCategory === 'jee' || goalCategory === 'neet') {
        setRecommendedTracks([
          {
            id: 'jee-crash-target',
            title: 'JEE Main & Advanced Mastery Path',
            category: 'jee',
            desc: 'Calculus, Rotational Mechanics, and Organic Chemistry with prerequisite diagnostic remediation.',
            matchScore: 98
          },
          {
            id: 'neet-track',
            title: 'NEET Medical Entrance Pathway',
            category: 'neet',
            desc: 'High-yield Biology, Organic Chemistry, and Physics concept consolidation with PYQs.',
            matchScore: 92
          }
        ]);
      } else if (customInput.includes('java') || goalTitle.includes('Java')) {
        setRecommendedTracks([
          {
            id: 'java-backend-track',
            title: 'Java Backend & Spring Boot Microservices Specialist',
            category: 'swe',
            desc: 'Core Java, OOP/JVM, Spring Boot, Hibernate ORM, REST APIs, Kafka, MySQL & Docker containerization.',
            matchScore: 99
          },
          {
            id: 'swe-internship',
            title: 'B.Tech SWE Placements & Core Java DSA',
            category: 'internship',
            desc: 'NeetCode 150 DSA in Java, System Design & top tech placement rounds.',
            matchScore: 94
          }
        ]);
      } else if (customInput.includes('ai') || customInput.includes('ml') || goalTitle.includes('AI')) {
        setRecommendedTracks([
          {
            id: 'aiml-track',
            title: 'AI / Machine Learning & Generative AI Engineer',
            category: 'ai_ml',
            desc: 'NumPy, Linear Algebra, PyTorch Neural Networks, LangChain & Vector RAG Pipelines.',
            matchScore: 99
          },
          {
            id: 'fullstack-dev',
            title: 'Full-Stack AI Application Developer',
            category: 'swe',
            desc: 'FastAPI backend, React frontend, OpenAI/Claude APIs & cloud deployment.',
            matchScore: 92
          }
        ]);
      } else if (customInput.length > 3) {
        // Dynamic track matching user's exact typed aspiration
        const formattedTitle = naturalLanguageGoal.charAt(0).toUpperCase() + naturalLanguageGoal.slice(1);
        setRecommendedTracks([
          {
            id: 'custom-user-track',
            title: formattedTitle.includes('Developer') || formattedTitle.includes('Engineer') ? formattedTitle : `${formattedTitle} Mastery Track`,
            category: 'swe',
            desc: `Custom synthesized prerequisite roadmap tailored for ${formattedTitle} with structured practice.`,
            matchScore: 99
          },
          {
            id: 'swe-internship',
            title: 'B.Tech SWE Placements & Tech Readiness',
            category: 'internship',
            desc: 'Core DSA (NeetCode 150), System Design, and resume interview readiness.',
            matchScore: 92
          }
        ]);
      } else {
        setRecommendedTracks([
          {
            id: 'swe-internship',
            title: goalTitle,
            category: goalCategory,
            desc: 'Structured prerequisite roadmap with verified video lessons, practice problems, and diagnostic checkpoints.',
            matchScore: 98
          },
          {
            id: 'fullstack-dev',
            title: 'Full-Stack Production Project Builder',
            category: 'swe',
            desc: 'End-to-end React, Node/Express, PostgreSQL, Docker, and portfolio deployment.',
            matchScore: 93
          }
        ]);
      }

      setShowRecommendationScreen(true);
    }, 2800);
  };

  const handleFinalizeRoadmap = (chosenTrack: { title: string; category: GoalCategory }) => {
    const skills = initializeSkillsForGoal(chosenTrack.category);

    const baseProfile: Partial<UserProfile> = {
      id: userId,
      fullName: userFullName,
      email: userEmail,
      createdAt: new Date().toISOString(),
      onboardingCompleted: true,
      educationLevel,
      branchOrStream: `${educationLevel} Stage`,
      goalCategory: chosenTrack.category,
      goalTitle: chosenTrack.title,
      goalNaturalLanguage: naturalLanguageGoal || `Targeting: ${chosenTrack.title} at ${educationLevel} level.`,
      dailyAvailabilityMinutes: dailyMinutes,
      learningPreference: learningModality,
      struggles: selectedStruggles.length > 0 ? selectedStruggles : ['Concept Depth', 'Time Consistency'],
      skills,
      baselineDiagnosticCompleted: false,
      assessmentHistory: [],
      pathVersion: 1,
      lastPathUpdateReason: `AI synthesized customized prerequisite flowchart for ${chosenTrack.title}.`,
      feedbackLog: []
    };

    const roadmap = generatePersonalizedRoadmap(baseProfile);

    const finalProfile: UserProfile = {
      ...baseProfile,
      activeRoadmap: roadmap
    } as UserProfile;

    onComplete(finalProfile);
  };

  // 1. AI LOADING SCREEN (PURE BLACK & CYAN)
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-slate-100 selection:bg-brand-500 selection:text-white">
        <div className="max-w-md w-full bg-zinc-950 border border-white/[0.1] rounded-3xl p-8 backdrop-blur-2xl text-center shadow-2xl space-y-6 animate-scale-in">
          
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/20">
            <BrainCircuit className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-cyan-400">
              AI Prerequisite Synthesizer
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Analyzing Your Requirements
            </h2>
            <p className="text-xs text-slate-400 h-8 flex items-center justify-center font-mono">
              {analysisStep === 1 && '1. Evaluating learning profile & stage...'}
              {analysisStep === 2 && '2. Identifying target prerequisite bottlenecks...'}
              {analysisStep === 3 && '3. Filtering 100% free verified curricula...'}
              {analysisStep === 4 && '4. Synthesizing personalized flowchart roadmap!'}
            </p>
          </div>

          {/* Animated loading nodes */}
          <div className="space-y-2.5 pt-2 text-left text-xs">
            <div className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
              analysisStep >= 1 ? 'border-cyan-500/50 bg-zinc-900 text-white' : 'border-white/[0.06] bg-black text-slate-500'
            }`}>
              <CheckCircle2 className={`w-4 h-4 ${analysisStep >= 1 ? 'text-cyan-400' : 'text-slate-600'}`} />
              <span>Learner Stage: <strong>{educationLevel}</strong></span>
            </div>

            <div className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
              analysisStep >= 2 ? 'border-cyan-500/50 bg-zinc-900 text-white' : 'border-white/[0.06] bg-black text-slate-500'
            }`}>
              <CheckCircle2 className={`w-4 h-4 ${analysisStep >= 2 ? 'text-cyan-400' : 'text-slate-600'}`} />
              <span>Prerequisite DAG Sequencing Active</span>
            </div>

            <div className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
              analysisStep >= 3 ? 'border-cyan-500/50 bg-zinc-900 text-white' : 'border-white/[0.06] bg-black text-slate-500'
            }`}>
              <CheckCircle2 className={`w-4 h-4 ${analysisStep >= 3 ? 'text-cyan-400' : 'text-slate-600'}`} />
              <span>Free Curated Masterclasses Matched</span>
            </div>
          </div>

          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-white/[0.08]">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${analysisStep * 25}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. AI TRACK RECOMMENDATION CONFIRMATION SCREEN
  if (showRecommendationScreen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-slate-100 selection:bg-brand-500 selection:text-white">
        <div className="max-w-2xl w-full bg-zinc-950 border border-white/[0.1] rounded-3xl p-8 backdrop-blur-2xl space-y-6 shadow-2xl animate-fade-in text-left">
          
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Pathway Confirmed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recommended Learning Tracks For You
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Based on your <strong>{educationLevel}</strong> profile and target goal, NEXORA prepared these specialized prerequisite paths:
            </p>
          </div>

          {/* Recommended track options */}
          <div className="space-y-3 pt-2">
            {recommendedTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => handleFinalizeRoadmap(track)}
                className="p-5 rounded-2xl bg-black border border-white/[0.08] hover:border-cyan-400 transition-all cursor-pointer flex items-center justify-between gap-4 group hover:scale-[1.01] shadow-lg"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {track.matchScore}% Match
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {track.category.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {track.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {track.desc}
                  </p>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-black transition-colors flex items-center gap-1.5 shrink-0 shadow-md shadow-cyan-500/20"
                >
                  <span>Select & Generate</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => {
                setShowRecommendationScreen(false);
                setCurrentStep(1);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              ← Edit My Responses
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 3. STEP-BY-STEP QUESTIONNAIRE (PURE OBSIDIAN BLACK)
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 text-slate-100 selection:bg-brand-500 selection:text-white">
      <div className="max-w-2xl w-full bg-zinc-950 border border-white/[0.1] rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-8 text-left">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Step 0{currentStep} of 04</span>
            <span className="text-cyan-400 font-bold">
              {currentStep === 1 && 'Education Stage'}
              {currentStep === 2 && 'Goal & Target'}
              {currentStep === 3 && 'Strengths & Bottlenecks'}
              {currentStep === 4 && 'Pacing & Modality'}
            </span>
          </div>
          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-white/[0.06]">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: EDUCATION STAGE */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Welcome, {userFullName.split(' ')[0] || 'Learner'}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                What is your current education level or stage?
              </h2>
              <p className="text-xs text-slate-400">
                NEXORA tailors your questions and flowchart roadmap based on your exact stage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { level: 'Class 10' as EducationLevel, label: 'Class 10 Student', desc: 'Secondary school, NCERT math & science board preparation', icon: BookOpen },
                { level: 'Class 12' as EducationLevel, label: 'Class 11 / 12 (Junior College)', desc: 'JEE Main/Advanced, NEET & board exam preparation', icon: GraduationCap },
                { level: 'Undergraduate' as EducationLevel, label: 'B.Tech / College Undergraduate', desc: 'SDE placements, core DSA, system design & projects', icon: Laptop },
                { level: 'Working Professional' as EducationLevel, label: 'Career Switcher / Project Builder', desc: 'Full-stack development, software transition & AI systems', icon: Briefcase }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = educationLevel === item.level;
                return (
                  <div
                    key={item.level}
                    onClick={() => {
                      setEducationLevel(item.level);
                      if (item.level === 'Class 10') {
                        setGoalCategory('swe');
                        setGoalTitle('Score 95%+ in Class 10 Board Exams');
                      } else if (item.level === 'Class 12') {
                        setGoalCategory('jee');
                        setGoalTitle('Crack JEE Main & Advanced');
                      } else if (item.level === 'Undergraduate') {
                        setGoalCategory('internship');
                        setGoalTitle('B.Tech SWE Placements & Internships');
                      } else {
                        setGoalCategory('career_switch');
                        setGoalTitle('Full-Stack Production Project Builder');
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-zinc-900 border-cyan-400 shadow-md shadow-cyan-500/10 text-white'
                        : 'bg-black border-white/[0.08] text-slate-300 hover:border-white/[0.2]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-black shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GOAL & TARGET (TAILORED TO EDUCATION LEVEL) */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Aspirations for {educationLevel}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                What is your primary target goal?
              </h2>
              <p className="text-xs text-slate-400">
                Choose a goal tailored for {educationLevel} or describe your target in your own words.
              </p>
            </div>

            {/* Presets Tailored to Stage */}
            <div className="space-y-2.5">
              {goalPresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setGoalTitle(preset.title);
                    setGoalCategory(preset.cat);
                    setNaturalLanguageGoal(`Targeting: ${preset.title}`);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    goalTitle === preset.title
                      ? 'bg-zinc-900 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-black border-white/[0.08] hover:border-white/[0.2]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-white">{preset.title}</div>
                    <div className="text-xs text-slate-400">{preset.desc}</div>
                  </div>
                  {goalTitle === preset.title && (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Custom Notes */}
            <div className="p-3 bg-black rounded-2xl border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Specific target details / notes (Optional):</span>
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                    isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-zinc-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
                </button>
              </div>

              <textarea
                value={naturalLanguageGoal}
                onChange={e => setNaturalLanguageGoal(e.target.value)}
                rows={2}
                placeholder={`e.g. Aiming for top 1,000 rank in JEE Advanced or 95%+ in Class 10 board exams...`}
                className="w-full p-2 bg-transparent text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl bg-black border border-white/[0.1] text-xs font-semibold text-slate-300"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-black shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: STRENGTHS & BOTTLENECKS (DYNAMICALLY MATCHED TO GOAL) */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Skill Gap Profiling</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                What topics in {goalTitle} do you find challenging?
              </h2>
              <p className="text-xs text-slate-400">
                NEXORA will insert targeted prerequisite remediation nodes to build your foundation in these exact areas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {struggleOptions.map((item, idx) => {
                const isSelected = selectedStruggles.includes(item);
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (isSelected) setSelectedStruggles(selectedStruggles.filter(s => s !== item));
                      else setSelectedStruggles([...selectedStruggles, item]);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs font-semibold flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-black border-white/[0.08] text-slate-400 hover:border-white/[0.2]'
                    }`}
                  >
                    <span>{item}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 rounded-xl bg-black border border-white/[0.1] text-xs font-semibold text-slate-300"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-black shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PACING & LEARNING MODALITY */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Pacing & Modality</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                How much daily time can you commit?
              </h2>
              <p className="text-xs text-slate-400">
                NEXORA will space your prerequisite milestones to keep you on schedule without burnout.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { mins: 30, label: '30 mins/day' },
                { mins: 60, label: '1 hour/day' },
                { mins: 90, label: '1.5 hours/day' },
                { mins: 120, label: '2+ hours/day' }
              ].map((t) => (
                <button
                  key={t.mins}
                  type="button"
                  onClick={() => setDailyMinutes(t.mins)}
                  className={`p-3.5 rounded-2xl border text-center text-xs font-bold transition-all ${
                    dailyMinutes === t.mins
                      ? 'bg-cyan-500 text-black border-cyan-400'
                      : 'bg-black border-white/[0.08] text-slate-300 hover:border-white/[0.2]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Learning Preference:</span>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'Mixed', label: 'Balanced (Videos + Flowchart + Problems)' },
                  { id: 'Practice', label: 'Practice-Heavy (Problem Drills)' },
                  { id: 'Video', label: 'Video Masterclasses Focus' },
                  { id: 'Reading', label: 'Theory & Conceptual Notes' }
                ].map((pref) => (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setLearningModality(pref.id as any)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                      learningModality === pref.id
                        ? 'bg-zinc-900 border-cyan-400 text-white'
                        : 'bg-black border-white/[0.08] text-slate-400 hover:border-white/[0.2]'
                    }`}
                  >
                    {pref.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2.5 rounded-xl bg-black border border-white/[0.1] text-xs font-semibold text-slate-300"
              >
                Back
              </button>
              <button
                onClick={handleStartAnalysis}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:opacity-90 text-xs sm:text-sm font-black text-black shadow-xl shadow-cyan-500/25 flex items-center gap-2 animate-pulse"
              >
                <Sparkles className="w-4 h-4" />
                <span>Synthesize My Adaptive Pathway</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

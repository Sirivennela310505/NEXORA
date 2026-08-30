import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  BrainCircuit, 
  User
} from 'lucide-react';
import type { EducationLevel, GoalCategory, UserProfile } from '../../engine/types';
import { initializeSkillsForGoal } from '../../engine/skillGapEngine';
import { generatePersonalizedRoadmap } from '../../engine/adaptiveEngine';

interface ConversationalAIAssistantProps {
  userFullName: string;
  userEmail: string;
  userId: string;
  onComplete: (profile: UserProfile) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  options?: { label: string; value: string; icon?: string }[];
  field?: 'goal' | 'education' | 'skills' | 'struggles' | 'time';
}

export const ConversationalAIAssistant: React.FC<ConversationalAIAssistantProps> = ({
  userFullName,
  userEmail,
  userId,
  onComplete
}) => {
  // Captured Profile State
  const [capturedGoal, setCapturedGoal] = useState<string>('');
  const [capturedCategory, setCapturedCategory] = useState<GoalCategory>('internship');
  const [capturedEducation, setCapturedEducation] = useState<EducationLevel>('Undergraduate');
  const [capturedSkills, setCapturedSkills] = useState<string[]>([]);
  const [capturedStruggles, setCapturedStruggles] = useState<string[]>([]);
  const [capturedDailyMinutes, setCapturedDailyMinutes] = useState<number>(90);
  const [capturedPref, setCapturedPref] = useState<'Mixed' | 'Practice' | 'Video' | 'Reading' | 'Projects'>('Mixed');

  // Chat stage tracker (0: Goal, 1: Education, 2: Current Skills, 3: Bottlenecks, 4: Time, 5: Done)
  const [stage, setStage] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);

  // Live Real-Time Generation Screen state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'ai-1',
      sender: 'ai',
      text: `Hello ${userFullName.split(' ')[0]}! 👋 I'm **NEXORA AI**, your personal learning pathfinder.\n\n` +
        `To build your personalized roadmap and mind-map, let's understand where you want to go.\n\n` +
        `**What is your primary goal or dream target right now?**`,
      options: [
        { label: 'Software Engineering Internship', value: 'Software Engineering Internship at top product companies', icon: '💼' },
        { label: 'Crack JEE Main & Advanced', value: 'Crack JEE Main & Advanced with top 1000 rank', icon: '🎯' },
        { label: 'Crack NEET (Medical)', value: 'Crack NEET Medical Entrance with 680+ score', icon: '🩺' },
        { label: 'AI & Machine Learning Engineer', value: 'Become an AI & Machine Learning Engineer building RAG and models', icon: '🤖' },
        { label: 'Full-Stack Web Development', value: 'Full-Stack Web & Backend Systems Engineer', icon: '🚀' },
        { label: 'Non-Tech to Software Career Switch', value: 'Transition from non-tech domain into Software Engineering', icon: '🔄' }
      ],
      field: 'goal'
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Voice / Speech Recognition handler
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your answer.');
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
        setInputVal(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-msg-${messages.length + 1}`,
      sender: 'user',
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsAiTyping(true);

    // AI Progression Logic
    setTimeout(() => {
      progressConversation(text);
    }, 600);
  };

  const progressConversation = (userResponse: string) => {
    const lower = userResponse.toLowerCase();

    if (stage === 0) {
      // Process Goal
      setCapturedGoal(userResponse);
      let cat: GoalCategory = 'swe';
      if (lower.includes('jee') || lower.includes('iit') || lower.includes('10th') || lower.includes('12th')) cat = 'jee';
      else if (lower.includes('neet') || lower.includes('medical') || lower.includes('doctor')) cat = 'neet';
      else if (lower.includes('internship') || lower.includes('placement')) cat = 'internship';
      else if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('ml')) cat = 'ai_ml';
      else if (lower.includes('switch') || lower.includes('transition')) cat = 'career_switch';
      setCapturedCategory(cat);

      setStage(1);
      setIsAiTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-edu`,
          sender: 'ai',
          text: `Got it! Targeting **"${userResponse}"**.\n\n` +
            `**Where are you right now in your educational or career journey?**`,
          options: [
            { label: 'Class 9 / 10 Student', value: 'Class 10', icon: '🏫' },
            { label: 'Class 11 / 12 (Junior College)', value: 'Class 12', icon: '📐' },
            { label: 'B.Tech / College Undergraduate (1st-4th Yr)', value: 'Undergraduate', icon: '🎓' },
            { label: 'College Graduate', value: 'Graduate', icon: '📜' },
            { label: 'Working Professional', value: 'Working Professional', icon: '💼' }
          ],
          field: 'education'
        }
      ]);
    } else if (stage === 1) {
      // Process Education Stage
      let edu: EducationLevel = 'Undergraduate';
      if (lower.includes('10')) edu = 'Class 10';
      else if (lower.includes('11') || lower.includes('12')) edu = 'Class 12';
      else if (lower.includes('professional') || lower.includes('working')) edu = 'Working Professional';
      else if (lower.includes('graduate')) edu = 'Graduate';
      setCapturedEducation(edu);

      setStage(2);
      setIsAiTyping(false);

      const isHighSchool = edu === 'Class 10' || edu === 'Class 12' || capturedCategory === 'jee' || capturedCategory === 'neet';

      setMessages(prev => [
        ...prev,
        {
          id: `ai-skills`,
          sender: 'ai',
          text: isHighSchool
            ? `Understood! As a **${edu}** learner:\n\n**Which core subjects or topics do you feel relatively comfortable with so far?**`
            : `Great! For your **${edu}** background:\n\n**What programming languages or technical topics have you already touched?**`,
          options: isHighSchool ? [
            { label: 'Basic Algebra & Quadratic Roots', value: 'Basic Algebra & Quadratic Equations', icon: '📐' },
            { label: 'Newtonian Kinematics', value: 'Kinematics & Newton Laws', icon: '⚡' },
            { label: 'Atomic Structure Basics', value: 'Atomic Structure & Bonding', icon: '🔬' },
            { label: 'Starting completely from scratch', value: 'Starting fresh from basics', icon: '🌱' }
          ] : [
            { label: 'Java Basics', value: 'Java Programming Fundamentals', icon: '☕' },
            { label: 'Python Fundamentals', value: 'Python Basics & Scripting', icon: '🐍' },
            { label: 'Basic C++ & Loops', value: 'C++ Basics', icon: '⚙️' },
            { label: 'HTML, CSS & JS Basics', value: 'Frontend Basics', icon: '🌐' },
            { label: 'Complete Beginner / Zero Prior Code', value: 'Zero prior coding experience', icon: '🌱' }
          ],
          field: 'skills'
        }
      ]);
    } else if (stage === 2) {
      // Process Skills
      setCapturedSkills(prev => [...prev, userResponse]);
      setStage(3);
      setIsAiTyping(false);

      // Goal-aware struggle options
      const getStruggleOptions = () => {
        const cat = capturedCategory;
        if (cat === 'jee' || cat === 'neet') {
          return [
            { label: 'Calculus & Integration', value: 'Calculus derivations and integration problems', icon: '📐' },
            { label: 'Organic Chemistry Mechanisms', value: 'Organic chemistry reaction mechanisms and named reactions', icon: '🧪' },
            { label: 'Physics Numericals & Formulas', value: 'Physics numerical problems and formula application', icon: '⚡' },
            { label: 'Time Management in Exam Hall', value: 'Managing time during 3-hour exam sessions', icon: '⏳' },
            { label: 'Inorganic Chemistry & P-Block', value: 'Inorganic chemistry p-block and coordination compounds', icon: '🔬' }
          ];
        }
        if (cat === 'ai_ml') {
          return [
            { label: 'Linear Algebra & Matrix Math', value: 'Linear algebra, eigenvalues and matrix operations for ML', icon: '🔢' },
            { label: 'Understanding Neural Networks', value: 'Backpropagation and neural network architecture', icon: '🧠' },
            { label: 'Implementing Models from Scratch', value: 'Coding ML models without libraries', icon: '💻' },
            { label: 'Statistics & Probability', value: 'Bayesian stats and probability for ML', icon: '📊' },
            { label: 'Productionizing & Deploying AI', value: 'Moving from notebooks to production ML pipelines', icon: '🚀' }
          ];
        }
        if (cat === 'internship' || cat === 'swe') {
          return [
            { label: 'Solving Hard DSA Problems', value: 'Struggling to solve medium/hard LeetCode problems independently', icon: '🧩' },
            { label: 'Trees, Graphs & DP', value: 'Dynamic programming and graph traversal algorithms', icon: '🌳' },
            { label: 'System Design Concepts', value: 'System design, scalability and distributed systems basics', icon: '🏗️' },
            { label: 'Time Management & Consistency', value: 'Daily consistency and pacing for placements', icon: '⏳' },
            { label: 'Resume & Project Building', value: 'Building resume-worthy projects and open source contributions', icon: '📁' }
          ];
        }
        if (cat === 'career_switch') {
          return [
            { label: 'Starting Programming from Zero', value: 'Learning programming fundamentals from scratch', icon: '🌱' },
            { label: 'Building a Portfolio', value: 'Creating projects to showcase to employers', icon: '📁' },
            { label: 'Understanding CS Fundamentals', value: 'Data structures, algorithms and CS theory basics', icon: '💻' },
            { label: 'Imposter Syndrome & Confidence', value: 'Self-doubt and feeling behind peers from CS background', icon: '🧠' },
            { label: 'Finding the Right Learning Path', value: 'Too many resources, unclear where to start', icon: '🗺️' }
          ];
        }
        // Default / full-stack / data engineering / other
        return [
          { label: 'Database & SQL Optimization', value: 'Complex SQL queries, indexing and query optimization', icon: '🗄️' },
          { label: 'Building Scalable Pipelines', value: 'Designing ETL pipelines and data workflows', icon: '🔄' },
          { label: 'Frontend & API Integration', value: 'Connecting backend APIs with frontend frameworks', icon: '🌐' },
          { label: 'Time Management & Consistency', value: 'Daily consistency and structured learning', icon: '⏳' },
          { label: 'Deploying & DevOps', value: 'Docker, CI/CD pipelines and cloud deployment', icon: '🚀' }
        ];
      };

      setMessages(prev => [
        ...prev,
        {
          id: `ai-struggles`,
          sender: 'ai',
          text: `Thanks for sharing your baseline.\n\n` +
            `**What do you find most challenging or where do you get stuck the most?**\n` +
            `(NEXORA will build targeted prerequisite paths around exactly these bottlenecks!)`,
          options: getStruggleOptions(),
          field: 'struggles'
        }
      ]);
    } else if (stage === 3) {
      // Process Struggles
      setCapturedStruggles(prev => [...prev, userResponse]);
      setStage(4);
      setIsAiTyping(false);

      setMessages(prev => [
        ...prev,
        {
          id: `ai-time`,
          sender: 'ai',
          text: `Almost ready to generate your flowchart mind-map!\n\n` +
            `**How much time can you realistically invest daily, and what's your preferred study style?**`,
          options: [
            { label: '1 Hour / Day (Practice Focus)', value: '60 mins Practice', icon: '⚡' },
            { label: '1.5 Hours / Day (Balanced Mixed)', value: '90 mins Mixed', icon: '🔥' },
            { label: '3+ Hours / Day (Intensive Fast-Track)', value: '180 mins Intensive', icon: '🚀' }
          ],
          field: 'time'
        }
      ]);
    } else if (stage === 4) {
      // Final step: trigger live AI Mindmap Generation
      let mins = 90;
      if (lower.includes('60') || lower.includes('1 hour')) mins = 60;
      else if (lower.includes('180') || lower.includes('3')) mins = 180;
      setCapturedDailyMinutes(mins);

      if (lower.includes('practice')) setCapturedPref('Practice');
      else if (lower.includes('video')) setCapturedPref('Video');
      else setCapturedPref('Mixed');

      setIsAiTyping(false);
      startLiveGeneration();
    }
  };

  const startLiveGeneration = () => {
    setIsGenerating(true);
    setGenerationStep(1);

    setTimeout(() => setGenerationStep(2), 700);
    setTimeout(() => setGenerationStep(3), 1500);
    setTimeout(() => setGenerationStep(4), 2200);
    setTimeout(() => {
      // Synthesize complete user profile
      const isJEE = capturedCategory === 'jee' || capturedEducation === 'Class 10' || capturedEducation === 'Class 12';
      const goalCat = isJEE ? 'jee' : capturedCategory;
      const goalTitle = capturedGoal || (isJEE ? 'Crack JEE Main & Advanced' : 'Software Engineering Internship');

      const skills = initializeSkillsForGoal(goalCat);

      const partialProfile: Partial<UserProfile> = {
        id: userId,
        fullName: userFullName,
        email: userEmail,
        createdAt: new Date().toISOString(),
        onboardingCompleted: true,
        educationLevel: capturedEducation,
        branchOrStream: `${capturedEducation} Pathway`,
        goalCategory: goalCat,
        goalTitle,
        goalNaturalLanguage: `Targeting: ${goalTitle}. Current level: ${capturedEducation}. Strengths: ${capturedSkills.join(', ')}. Challenges: ${capturedStruggles.join(', ')}.`,
        dailyAvailabilityMinutes: capturedDailyMinutes,
        learningPreference: capturedPref,
        struggles: capturedStruggles.length > 0 ? capturedStruggles : ['Consistency', 'Core Problem Solving'],
        skills,
        baselineDiagnosticCompleted: false,
        assessmentHistory: [],
        pathVersion: 1,
        lastPathUpdateReason: `AI synthesized a personalized Mindmap Roadmap for ${goalTitle}.`,
        feedbackLog: []
      };

      const roadmap = generatePersonalizedRoadmap(partialProfile);

      const finalProfile: UserProfile = {
        ...partialProfile,
        activeRoadmap: roadmap
      } as UserProfile;

      onComplete(finalProfile);
    }, 3000);
  };

  // LIVE AI GENERATION SCREEN
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-6 text-slate-100">
        <div className="max-w-md w-full bg-slate-900/90 border border-brand-500/30 rounded-3xl p-8 backdrop-blur-2xl text-center shadow-2xl space-y-6 animate-fade-in">
          
          <div className="w-20 h-20 rounded-3xl bg-brand-500/15 border border-brand-500/40 mx-auto flex items-center justify-center text-brand-400 shadow-xl shadow-brand-500/20">
            <BrainCircuit className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-brand-400">
              AI Path Synthesizer
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Generating Your Mind-Map
            </h2>
            <p className="text-xs text-slate-400 h-8 flex items-center justify-center">
              {generationStep === 1 && '1. Parsing natural language requirements & goals...'}
              {generationStep === 2 && '2. Mapping prerequisite dependencies & skill gaps...'}
              {generationStep === 3 && '3. Curating 100% verified free resources & daily targets...'}
              {generationStep === 4 && '4. Building interactive NotebookLM tree nodes!'}
            </p>
          </div>

          {/* Animated step nodes */}
          <div className="space-y-2.5 pt-2 text-left text-xs">
            <div className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
              generationStep >= 1 ? 'border-brand-500/50 bg-brand-950/40 text-white' : 'border-slate-800 bg-slate-950 text-slate-500'
            }`}>
              <CheckCircle2 className={`w-4 h-4 ${generationStep >= 1 ? 'text-brand-400' : 'text-slate-600'}`} />
              <span>Goal Destination: <strong>{capturedGoal || 'Target Goal'}</strong></span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
              generationStep >= 2 ? 'border-brand-500/50 bg-brand-950/40 text-white' : 'border-slate-800 bg-slate-950 text-slate-500'
            }`}>
              <CheckCircle2 className={`w-4 h-4 ${generationStep >= 2 ? 'text-brand-400' : 'text-slate-600'}`} />
              <span>Prerequisite Branching & Remediation Mapped</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
              generationStep >= 3 ? 'border-brand-500/50 bg-brand-950/40 text-white' : 'border-slate-800 bg-slate-950 text-slate-500'
            }`}>
              <CheckCircle2 className={`w-4 h-4 ${generationStep >= 3 ? 'text-brand-400' : 'text-slate-600'}`} />
              <span>Day 1 to Goal Daily Actionable To-Do Breakdown</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div 
              className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${generationStep * 25}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-8 px-4 sm:px-6 flex flex-col justify-between max-w-4xl mx-auto">
      
      {/* Header bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>NEXORA Requirement Gathering AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Interactive Mode
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Tell us your goal via voice or text — AI builds your visual roadmap in real-time.</p>
          </div>
        </div>

        <button
          onClick={startLiveGeneration}
          className="text-xs px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
        >
          Skip & Auto-Generate
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-2 pb-6 min-h-[420px]">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div key={msg.id} className={`flex gap-3.5 ${isAi ? 'justify-start' : 'justify-end'}`}>
              {isAi && (
                <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-3 ${isAi ? 'items-start' : 'items-end'}`}>
                <div className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isAi
                    ? 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                    : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-brand-500/20'
                }`}>
                  <div className="whitespace-pre-line space-y-1.5">
                    {msg.text}
                  </div>

                  {/* Interactive Quick Response Options */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
                      {msg.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSend(opt.value)}
                          className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-brand-950/60 border border-slate-800 hover:border-brand-500/40 text-left text-xs font-medium text-slate-200 transition-all flex items-center gap-2.5 hover:scale-[1.01]"
                        >
                          {opt.icon && <span className="text-base shrink-0">{opt.icon}</span>}
                          <span className="truncate">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isAiTyping && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
              <Bot className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Console: Typing + Voice / Speech-to-Text */}
      <div className="p-3 bg-slate-900/90 border border-white/[0.08] rounded-2xl backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-3 rounded-xl border transition-all shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak your answer'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isListening ? "Listening to your voice..." : "Type your answer or speak your goal in natural language..."}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isAiTyping}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};

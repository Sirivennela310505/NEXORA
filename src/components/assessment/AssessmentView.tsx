import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  Layers,
  Sparkles,
  BrainCircuit
} from 'lucide-react';
import type { AssessmentAttempt, UserProfile } from '../../engine/types';
import { DIAGNOSTIC_QUESTIONS_DB } from '../../engine/diagnosticQuestions';
import { recalibrateRoadmapAfterAssessment } from '../../engine/adaptiveEngine';

interface AssessmentViewProps {
  profile: UserProfile;
  selectedSkillId?: string;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigateToRoadmap: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  profile,
  selectedSkillId,
  onUpdateProfile,
  onNavigateToRoadmap,
}) => {
  const [activeSkillId, setActiveSkillId] = useState<string>(
    selectedSkillId || profile.skills[0]?.skillId || 'swe-dsa-hashing'
  );

  // Active quiz runner state
  const [isTakingQuiz, setIsTakingQuiz] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  
  // Results view state
  const [lastAttemptResult, setLastAttemptResult] = useState<{
    score: number;
    gapPercentage: number;
    total: number;
    correct: number;
    adaptationMessage: string;
  } | null>(null);

  // Get questions for active skill (ensures 10 questions for rigorous gap analysis)
  const availableQuestions = React.useMemo(() => {
    const matched = DIAGNOSTIC_QUESTIONS_DB.filter(q => q.skillId === activeSkillId);
    if (matched.length >= 10) return matched;
    
    const skillName = profile.skills.find(s => s.skillId === activeSkillId)?.skillName || 'Core Concept';
    
    // Fill up to 10 comprehensive questions
    const questions = [...matched];
    const templates = [
      {
        q: `What is the core prerequisite foundation required to solve advanced problems in ${skillName}?`,
        opts: ['Deep understanding of core axioms & formula derivations', 'Memorizing solutions without practice', 'Skipping edge cases', 'Only solving simple examples'],
        ans: 0,
        exp: `Conceptual mastery in ${skillName} requires deriving core relationships and understanding constraint boundaries.`
      },
      {
        q: `When analyzing boundary conditions in ${skillName}, which parameter is most critical?`,
        opts: ['Checking zero/infinity limits and domain validity', 'Ignoring negative values', 'Assuming linear approximations always hold', 'Skipping units check'],
        ans: 0,
        exp: `Domain verification and extreme limits prevent invalid calculations in ${skillName}.`
      },
      {
        q: `What is the most common pitfall students encounter in competitive questions on ${skillName}?`,
        opts: ['Misinterpreting question constraints and sign conventions', 'Overestimating problem difficulty', 'Using too many steps', 'Checking formulas twice'],
        ans: 0,
        exp: `Sign conventions and algebraic constraints are the primary source of negative marking in ${skillName}.`
      },
      {
        q: `How can you verify the dimensional or logical correctness of a derived result in ${skillName}?`,
        opts: ['Dimensional analysis and testing asymptotic boundary states', 'Assuming the first calculation is infallible', 'Only checking standard cases', 'Relying on options alone'],
        ans: 0,
        exp: `Testing extreme boundary values quickly validates derived expressions in ${skillName}.`
      },
      {
        q: `Which standard strategy yields the highest speed and accuracy when solving multi-concept questions in ${skillName}?`,
        opts: ['Breaking the problem into sequential sub-problems and eliminating incorrect options', 'Random guessing', 'Writing lengthy descriptions', 'Starting with the hardest formula'],
        ans: 0,
        exp: `Decomposing complex problems into foundational components reduces cognitive overload.`
      },
      {
        q: `In ${skillName}, what does the rate of change or derivative of the primary function represent?`,
        opts: ['Instantaneous sensitivity to parameter variations', 'Total cumulative area', 'Initial offset only', 'Constant baseline'],
        ans: 0,
        exp: `Derivatives measure the instantaneous rate of change with respect to independent variables in ${skillName}.`
      },
      {
        q: `What is the recommended approach to master speed in negative-marking mock tests for ${skillName}?`,
        opts: ['Timed sectional drills focusing on high-frequency question patterns', 'Attempting without timer', 'Guessing on doubtful questions', 'Reading theory without solving'],
        ans: 0,
        exp: `Targeted timed drills build pattern recognition and eliminate careless mistakes.`
      },
      {
        q: `Which theorem or governing rule establishes equilibrium/invariance in ${skillName}?`,
        opts: ['Conservation laws and continuous symmetry principles', 'Arbitrary empirical guesses', 'Variable shift rules', 'None of the above'],
        ans: 0,
        exp: `Conservation and continuity theorems form the backbone of analytical problem solving in ${skillName}.`
      }
    ];

    let i = 0;
    while (questions.length < 10 && i < templates.length) {
      questions.push({
        id: `synth-q-${activeSkillId}-${questions.length + 1}`,
        skillId: activeSkillId,
        question: templates[i].q,
        options: templates[i].opts,
        correctOptionIndex: templates[i].ans,
        explanation: templates[i].exp,
        difficulty: (questions.length % 3 === 0 ? 'Advanced' : questions.length % 2 === 0 ? 'Intermediate' : 'Beginner') as any
      });
      i++;
    }

    return questions;
  }, [activeSkillId, profile.skills]);

  const activeSkillObj = profile.skills.find(s => s.skillId === activeSkillId);

  const handleStartQuiz = (skillId: string) => {
    setActiveSkillId(skillId);
    setIsTakingQuiz(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setLastAttemptResult(null);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIdx
    }));
  };

  const handleNextOrFinish = () => {
    if (currentQuestionIndex < availableQuestions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setShowExplanation(false);
    } else {
      // Calculate score and exact skill gap
      let correctCount = 0;
      availableQuestions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctOptionIndex) {
          correctCount++;
        }
      });

      const scorePercentage = Math.round((correctCount / availableQuestions.length) * 100);
      const gapPercentage = 100 - scorePercentage;
      const skillName = activeSkillObj?.skillName || 'Skill Diagnostic';

      const newAttempt: AssessmentAttempt = {
        id: `attempt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        skillId: activeSkillId,
        skillName,
        scorePercentage,
        totalQuestions: availableQuestions.length,
        correctAnswers: correctCount,
        feedbackNotes: scorePercentage >= 80 
          ? 'High mastery demonstrated! Prerequisite requirements satisfied.' 
          : scorePercentage < 65 
          ? `Identified a ${gapPercentage}% foundation deficit. Targeted visual remediation node inserted into flowchart.`
          : `Moderate understanding (${scorePercentage}%). Practice drills recommended.`,
        impactOnPath: scorePercentage >= 80 ? 'Unlocked downstream milestones' : 'Recalibrated practice requirements'
      };

      // Recalibrate user profile & roadmap
      const { updatedRoadmap, updatedSkills, notificationMessage } = recalibrateRoadmapAfterAssessment(
        profile.activeRoadmap,
        profile.skills,
        newAttempt,
        profile.goalCategory
      );

      const updatedProfile: UserProfile = {
        ...profile,
        skills: updatedSkills,
        activeRoadmap: updatedRoadmap,
        assessmentHistory: [newAttempt, ...profile.assessmentHistory],
        baselineDiagnosticCompleted: true,
        pathVersion: profile.pathVersion + 1,
        lastPathUpdateReason: notificationMessage
      };

      onUpdateProfile(updatedProfile);

      setLastAttemptResult({
        score: scorePercentage,
        gapPercentage,
        total: availableQuestions.length,
        correct: correctCount,
        adaptationMessage: notificationMessage
      });

      setIsTakingQuiz(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/[0.1] backdrop-blur-md space-y-2 shadow-2xl text-left">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3 py-0.5 rounded-full border border-cyan-500/20">
            Interactive Diagnostic Engine (10-15 Questions)
          </span>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Question Skill-Gap Calibrator</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Competency Checkpoints & Skill Gap Analysis
        </h1>
        <p className="text-xs text-slate-400">
          Taking a 10-15 question diagnostic evaluates your exact conceptual strengths and gaps, automatically recalibrating your roadmap nodes.
        </p>
      </div>

      {/* 1. QUIZ RUNNER SCREEN */}
      {isTakingQuiz && availableQuestions.length > 0 ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-cyan-500/30 backdrop-blur-xl space-y-6 shadow-2xl text-left">
          
          {/* Question Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] text-xs">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                {activeSkillObj?.skillName}
              </span>
              <span className="text-slate-400 font-mono font-semibold">
                Question {currentQuestionIndex + 1} of {availableQuestions.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Diagnostic in progress</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black rounded-full h-1.5 overflow-hidden border border-white/[0.06]">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / availableQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Body */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {availableQuestions[currentQuestionIndex].question}
            </h2>

            {/* Code / Formula Snippet if present */}
            {availableQuestions[currentQuestionIndex].codeSnippet && (
              <pre className="p-4 rounded-2xl bg-black border border-white/[0.08] text-xs font-mono text-cyan-300 overflow-x-auto">
                <code>{availableQuestions[currentQuestionIndex].codeSnippet}</code>
              </pre>
            )}

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {availableQuestions[currentQuestionIndex].options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectAnswer(oIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/15 text-white ring-1 ring-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'border-white/[0.08] bg-black text-slate-300 hover:border-white/[0.2] hover:bg-zinc-900/80'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold ${
                      isSelected ? 'border-cyan-400 bg-cyan-500 text-black' : 'border-white/[0.2] text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </div>
                    <span className="leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Toggle */}
          {selectedAnswers[currentQuestionIndex] !== undefined && (
            <div className="pt-2">
              {!showExplanation ? (
                <button
                  type="button"
                  onClick={() => setShowExplanation(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain this concept</span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-black border border-white/[0.08] text-xs text-slate-300 space-y-1">
                  <strong className="text-white block font-bold">Concept Explanation:</strong>
                  <span>{availableQuestions[currentQuestionIndex].explanation}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setIsTakingQuiz(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel Diagnostic
            </button>

            <button
              type="button"
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
              onClick={handleNextOrFinish}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-black flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>
                {currentQuestionIndex < availableQuestions.length - 1 ? 'Next Question' : 'Submit & Recalibrate Path'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : lastAttemptResult ? (
        
        /* 2. RESULTS & PATH ADAPTATION SCREEN */
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/[0.1] space-y-6 shadow-2xl text-left animate-fade-in">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${
              lastAttemptResult.score >= 80 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}>
              {lastAttemptResult.score}%
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Diagnostic Completed ({lastAttemptResult.correct} / {lastAttemptResult.total} Correct)</h2>
              <p className="text-xs text-slate-400">
                {lastAttemptResult.gapPercentage > 0 ? (
                  <span className="text-amber-400 font-semibold">Identified {lastAttemptResult.gapPercentage}% Skill Gap Deficit in this topic.</span>
                ) : (
                  <span className="text-emerald-400 font-semibold">100% Mastery Achieved! Prerequisite verified.</span>
                )}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black border border-white/[0.08] text-xs text-slate-300 space-y-1">
            <span className="font-bold text-white block">Roadmap Adaptation Triggered:</span>
            <p className="text-slate-300">{lastAttemptResult.adaptationMessage}</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onNavigateToRoadmap}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg"
            >
              <Layers className="w-4 h-4" />
              <span>View Updated Flowchart Roadmap</span>
            </button>
            <button
              onClick={() => handleStartQuiz(activeSkillId)}
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-900 border border-white/[0.1] text-xs font-semibold text-slate-300 flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Diagnostic</span>
            </button>
          </div>
        </div>

      ) : (

        /* 3. SKILL SELECTOR & BENCHMARK DASHBOARD */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.skills.map((skill) => {
              const mastery = skill.currentMastery ?? 0;
              return (
                <div
                  key={skill.skillId}
                  className="p-5 rounded-3xl bg-zinc-950 border border-white/[0.08] hover:border-cyan-400 transition-all space-y-4 text-left shadow-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                        {skill.selfReportedLevel}
                      </span>
                      <h3 className="text-sm font-bold text-white">{skill.skillName}</h3>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                      skill.status === 'mastered' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : skill.status === 'critical_gap'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-zinc-900 text-slate-400 border border-white/[0.06]'
                    }`}>
                      {skill.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Proficiency:</span>
                      <strong className="text-white">{mastery}%</strong>
                    </div>
                    <div className="w-full bg-black rounded-full h-1.5 overflow-hidden border border-white/[0.06]">
                      <div 
                        className={`h-full rounded-full ${
                          mastery >= 80 ? 'bg-emerald-400' : mastery >= 60 ? 'bg-amber-400' : 'bg-rose-500'
                        }`}
                        style={{ width: `${mastery}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(skill.skillId)}
                    className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-900 border border-white/[0.1] hover:border-cyan-400/40 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <BrainCircuit className="w-4 h-4 text-cyan-400" />
                    <span>Start 10-15 Question Diagnostic</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      )}

    </div>
  );
};

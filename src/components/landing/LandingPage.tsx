import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  GraduationCap, 
  Laptop,
  Layers,
  BookOpen,
  Target
} from 'lucide-react';
import { InteractiveGlobeConstellation } from './InteractiveGlobeConstellation';

interface LandingPageProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  return (
    <div className="relative min-h-screen bg-black text-slate-100 overflow-hidden font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Subtle pitch-black background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* ================= 1. HERO SECTION (2-COLUMN SPLIT) ================= */}
      <section id="hero" className="relative pt-4 pb-12 md:pt-8 md:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: HERO MATTER & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
              <span>AI Personal Learning Navigator</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Don't just learn more.<br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-200 to-cyan-400 bg-clip-text text-transparent">
                Know exactly what to do next.
              </span>
            </h1>

            {/* Simple, Inspiring Subheading */}
            <p className="text-sm sm:text-base text-slate-400 max-w-xl font-normal leading-relaxed">
              NEXORA maps your exact starting point to your dream goal. It builds a clear prerequisite path with verified free video lessons and step-by-step practice.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-8 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onOpenAuth('signin')}
                className="px-7 py-3.5 rounded-2xl bg-black hover:bg-zinc-900 text-slate-200 hover:text-white font-semibold text-sm border border-white/[0.12] hover:border-white/[0.25] transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to Account</span>
              </button>
            </div>

            {/* Feature Checkmarks */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Free Resources
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Interactive Flowchart
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Diagnostic Checkpoints
              </span>
            </div>

            {/* Key trust strip */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Continuous Real-Time Adaptive Graph Engine Active</span>
            </div>

          </div>

          {/* RIGHT COLUMN: 3D CONSTELLATION GRAPH & IMAGE VISUALIZER */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="w-full max-w-lg lg:max-w-none">
              <InteractiveGlobeConstellation />
            </div>
          </div>

        </div>
      </section>

      {/* ================= 3. HOW IT WORKS SECTION ================= */}
      <section id="how-it-works" className="py-20 border-t border-white/[0.06] bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>How NEXORA Works</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              A clear roadmap from day one.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              No generic playlists or random videos. NEXORA connects topics in the order your brain needs them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-7 rounded-3xl bg-zinc-950/80 border border-white/[0.08] hover:border-brand-500/40 transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                Tell Us Your Goal
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Choose your exam or career target — Class 10, JEE, SWE Interviews, GATE, or a custom target. NEXORA identifies all prerequisite nodes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-7 rounded-3xl bg-zinc-950/80 border border-white/[0.08] hover:border-brand-500/40 transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                Diagnostic Skill Check
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Take quick 5-question checks. If you have gaps in underlying foundations, NEXORA inserts targeted remediation steps before advanced topics.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-7 rounded-3xl bg-zinc-950/80 border border-white/[0.08] hover:border-brand-500/40 transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                Daily Step-by-Step Mastery
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Follow your visual flowchart. Check off solved practice challenges, watch verified video lessons, and track overall completion percentages.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= 4. TARGET TRACKS SHOWCASE ================= */}
      <section id="tracks" className="py-20 border-t border-white/[0.06] bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Curated for Every Stage of Learning
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Explore specialized roadmaps built with rigorous prerequisite structures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Track 1 */}
            <div 
              onClick={() => onOpenAuth('signup')}
              className="p-6 rounded-3xl bg-zinc-950 border border-white/[0.08] hover:border-blue-500/50 transition-all cursor-pointer space-y-3 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Laptop className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                Software Engineering & DSA
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Arrays, Trees, Dynamic Programming, and High-Scale System Design for interviews.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
                <span>Start Free Track</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Track 2 */}
            <div 
              onClick={() => onOpenAuth('signup')}
              className="p-6 rounded-3xl bg-zinc-950 border border-white/[0.08] hover:border-amber-500/50 transition-all cursor-pointer space-y-3 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                JEE Main & Advanced
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mechanics, Calculus, Organic Chemistry, and Thermodynamics with deep foundations.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                <span>Start Free Track</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Track 3 */}
            <div 
              onClick={() => onOpenAuth('signup')}
              className="p-6 rounded-3xl bg-zinc-950 border border-white/[0.08] hover:border-emerald-500/50 transition-all cursor-pointer space-y-3 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Class 10 Board Mastery
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Polynomials, Trigonometry, Chemical Equations, Light & Electricity.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <span>View Track</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Track 4 */}
            <div 
              onClick={() => onOpenAuth('signup')}
              className="p-6 rounded-3xl bg-zinc-950 border border-white/[0.08] hover:border-purple-500/50 transition-all cursor-pointer space-y-3 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                Custom Career Switch
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI/ML, Data Science, Web Development, or custom syllabus designed for your timeline.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
                <span>Customize Path</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= 5. ABOUT NEXORA & BOTTOM CTA ================= */}
      <section id="about" className="py-20 border-t border-white/[0.06] bg-black text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to start?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Build your personalized learning roadmap today.
          </h2>

          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Free forever. No credit card required. Experience structured learning without guesswork.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all inline-flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

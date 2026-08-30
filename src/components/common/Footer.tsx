import React from 'react';
import { NexoraLogo } from './NexoraLogo';
import { ShieldCheck, Compass } from 'lucide-react';

interface FooterProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth }) => {
  return (
    <footer className="border-t border-white/[0.08] bg-black text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4 text-left">
            <NexoraLogo size="md" />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              NEXORA transforms a learner's goal, current abilities, and assessment progress into a living, adaptive journey — from where they stand today to where they want to be.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/[0.08] text-xs text-slate-300">
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>"Don't just learn more. Know exactly what to do next."</span>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onOpenAuth('signup')} className="hover:text-cyan-400 transition-colors">Start Free Roadmap</button></li>
              <li><button onClick={() => onOpenAuth('signin')} className="hover:text-slate-200 transition-colors">Sign In to Account</button></li>
              <li><a href="#how-it-works" className="hover:text-slate-200 transition-colors">Adaptive Engine</a></li>
              <li><a href="#tracks" className="hover:text-slate-200 transition-colors">Learning Tracks</a></li>
              <li><a href="#about" className="hover:text-slate-200 transition-colors">About NEXORA</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Supported Tracks</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onOpenAuth('signup')} className="hover:text-cyan-400 transition-colors">Class 10 / 12 JEE & NEET</button></li>
              <li><button onClick={() => onOpenAuth('signup')} className="hover:text-cyan-400 transition-colors">B.Tech SWE Placements & Internships</button></li>
              <li><button onClick={() => onOpenAuth('signup')} className="hover:text-cyan-400 transition-colors">Full-Stack Project Blueprints</button></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Security & Privacy</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Isolated User Tenancy</span>
              </li>
              <li><span className="text-slate-500">Zero Client-Side Secrets</span></li>
              <li><span className="text-slate-500">Row Level Data Privacy</span></li>
              <li><span className="text-slate-500">Deterministic ML Scoring</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 NEXORA. Engineered for the Next-Gen Personalized Learning Challenge.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span className="text-brand-400">Status: All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

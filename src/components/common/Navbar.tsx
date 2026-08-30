import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  CheckSquare, 
  Briefcase, 
  GitCompare, 
  Bot, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight
} from 'lucide-react';
import { NexoraLogo } from './NexoraLogo';
import type { UserProfile } from '../../engine/types';

interface NavbarProps {
  currentUser: UserProfile | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onOpenAuth,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const authNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Learning Path', icon: Map },
    { id: 'assessments', label: 'Assessments', icon: CheckSquare },
    { id: 'career', label: 'Opportunities & Resume', icon: Briefcase },
    { id: 'whatif', label: 'What-If Simulator', icon: GitCompare },
    { id: 'ai-navigator', label: 'AI Navigator', icon: Bot },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div 
          onClick={() => currentUser ? onSelectTab('dashboard') : scrollToSection('hero')} 
          className="cursor-pointer transition-transform hover:scale-[1.01]"
        >
          <NexoraLogo size="md" />
        </div>

        {/* Center: Public Links OR Authenticated Navigation */}
        {!currentUser ? (
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('tracks')} 
              className="hover:text-white transition-colors"
            >
              Learning Tracks
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="hover:text-white transition-colors"
            >
              About NEXORA
            </button>
          </nav>
        ) : (
          <nav className="hidden lg:flex items-center space-x-1">
            {authNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!currentUser ? (
            <>
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-all"
              >
                Sign In
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-black bg-cyan-500 hover:bg-cyan-400 rounded-xl transition-all shadow-lg shadow-cyan-500/25"
              >
                <span>Get Started Free</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectTab('profile')}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] transition-all text-left"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-black uppercase">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-semibold text-slate-200 leading-tight">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-none truncate max-w-[110px]">
                    {currentUser.goalTitle || 'In Onboarding'}
                  </span>
                </div>
              </button>

              <button
                onClick={onSignOut}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {!currentUser && (
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-3 py-1.5 text-xs font-bold text-black bg-cyan-500 rounded-lg"
            >
              Get Started
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-zinc-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-black/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3">
          {!currentUser ? (
            <div className="flex flex-col space-y-2 text-sm font-medium">
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-left py-2 text-slate-300 hover:text-white"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('tracks')} 
                className="text-left py-2 text-slate-300 hover:text-white"
              >
                Learning Tracks
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-left py-2 text-slate-300 hover:text-white"
              >
                About NEXORA
              </button>
              
              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onOpenAuth('signin'); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-xs font-semibold text-slate-300 bg-slate-800/80 rounded-lg text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-xs font-semibold text-white bg-brand-600 rounded-lg text-center"
                >
                  Get Started
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-1">
              <div className="pb-2 mb-2 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{currentUser.fullName}</div>
                    <div className="text-[10px] text-slate-400">{currentUser.goalTitle}</div>
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  className="text-xs text-rose-400 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>

              {authNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                        : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { 
  LayoutDashboard,
  GitBranch, 
  BookOpen, 
  BarChart3, 
  Edit3, 
  Bot, 
  Sliders,
  LogOut,
  Trophy,
  X
} from 'lucide-react';
import { NexoraLogo } from '../common/NexoraLogo';
import type { UserProfile } from '../../engine/types';

interface AppSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  profile: UserProfile;
  onSignOut: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  onSignOut,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const isTechStudent = profile.goalCategory === 'internship' || profile.goalCategory === 'swe' || profile.educationLevel === 'Undergraduate' || profile.goalCategory === 'career_switch';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard & Targets',
      icon: LayoutDashboard,
      desc: 'Daily targets & quizzes'
    },
    {
      id: 'roadmap',
      label: 'Flowchart Roadmap',
      icon: GitBranch,
      badge: 'Prerequisite DAG'
    },
    {
      id: 'resources',
      label: 'Free Books & Resources',
      icon: BookOpen,
      badge: profile.goalCategory === 'jee' ? 'Disha / HCV' : '100% Free'
    },
    {
      id: 'diary',
      label: 'Study Diary & Notes',
      icon: Edit3
    },
    {
      id: 'analytics',
      label: 'Skill Gaps & Quizzes',
      icon: BarChart3
    },
    ...(isTechStudent ? [{
      id: 'career',
      label: 'Internships & Drives',
      icon: Trophy,
      badge: 'Phase 1 DSA'
    }] : []),
    {
      id: 'ai-navigator',
      label: 'AI Pathfinder Tutor',
      icon: Bot
    },
    {
      id: 'profile',
      label: 'Profile & Settings',
      icon: Sliders
    }
  ];

  const handleTabClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="w-72 h-full bg-black border-r border-white/[0.08] flex flex-col justify-between p-4 selection:bg-brand-500 selection:text-white overflow-y-auto">
      {/* Top Section: Logo, Mobile Close & Profile */}
      <div className="space-y-5">
        
        {/* Brand Logo Header */}
        <div className="px-2 py-2 border-b border-white/[0.06] flex items-center justify-between">
          <NexoraLogo size="sm" />
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              PRO
            </span>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-zinc-900 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Student Mini Profile Box */}
        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-2.5 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-extrabold text-xs shadow-md shadow-cyan-500/20">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-white truncate">{profile.fullName}</h3>
              <span className="text-[11px] text-slate-400 block truncate">{profile.educationLevel}</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-black border border-white/[0.06] text-[11px] space-y-0.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>Target:</span>
              <span className="text-cyan-400 font-bold">{profile.dailyAvailabilityMinutes}m/day</span>
            </div>
            <div className="font-semibold text-slate-200 truncate text-[11px]">{profile.goalTitle}</div>
          </div>
        </div>

        {/* Navigation Buttons List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between gap-3 text-left ${
                  isActive
                    ? 'bg-white text-black shadow-lg shadow-white/10 font-extrabold scale-[1.01]'
                    : 'text-slate-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                    isActive
                      ? 'bg-black text-white'
                      : 'bg-zinc-900 text-cyan-400 border border-white/[0.08]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Section: Sign Out */}
      <div className="pt-4 border-t border-white/[0.06] space-y-2">
        <button
          onClick={onSignOut}
          className="w-full p-3 rounded-2xl bg-zinc-950 hover:bg-zinc-900 border border-white/[0.06] hover:border-white/[0.12] text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex h-screen shrink-0 sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer with Backdrop */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          {/* Sliding Content */}
          <div className="relative z-50 h-full max-w-[85vw] shadow-2xl animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

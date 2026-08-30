import { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { PersonalizedOnboardingFlow } from './components/onboarding/PersonalizedOnboardingFlow';
import { AppSidebar } from './components/layout/AppSidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { AssessmentView } from './components/assessment/AssessmentView';
import { CareerView } from './components/career/CareerView';
import { WhatIfView } from './components/whatif/WhatIfView';
import { AINavigatorView } from './components/ai/AINavigatorView';
import { ProfileView } from './components/profile/ProfileView';
import { StudentStudyDiary } from './components/diary/StudentStudyDiary';
import { FreeResourcesCatalogView } from './components/resources/FreeResourcesCatalogView';
import { PerformanceAnalyticsView } from './components/analytics/PerformanceAnalyticsView';

import type { UserProfile } from './engine/types';
import { 
  getActiveSessionUserId, 
  setActiveSession, 
  getUserProfile, 
  saveUserProfile
} from './engine/storage';
import type { StoredUserAccount } from './engine/storage';

export function App() {
  // Authentication & Session State initialized from storage
  const [currentAccount, setCurrentAccount] = useState<StoredUserAccount | null>(() => {
    const activeUserId = getActiveSessionUserId();
    if (activeUserId) {
      const profile = getUserProfile(activeUserId);
      if (profile) {
        return {
          id: profile.id,
          fullName: profile.fullName,
          email: profile.email,
          passwordHash: '',
          createdAt: profile.createdAt
        };
      }
    }
    return null;
  });

  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(() => {
    const activeUserId = getActiveSessionUserId();
    if (activeUserId) {
      return getUserProfile(activeUserId);
    }
    return null;
  });

  // Modals & Navigation
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [tabPayload, setTabPayload] = useState<any>(null);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' | 'forgot' = 'signin') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (account: StoredUserAccount, isNewSignUp: boolean) => {
    setCurrentAccount(account);
    setActiveSession(account.id);
    setAuthModalOpen(false);

    if (isNewSignUp) {
      setCurrentUserProfile(null);
      triggerToast(`Welcome to NEXORA, ${account.fullName}! Let's build your personalized path.`);
    } else {
      const existing = getUserProfile(account.id);
      if (existing) {
        setCurrentUserProfile(existing);
        setActiveTab('dashboard');
        triggerToast(`Welcome back, ${account.fullName}!`);
      } else {
        setCurrentUserProfile(null);
      }
    }
  };

  const handleSignOut = () => {
    setActiveSession(null);
    setCurrentAccount(null);
    setCurrentUserProfile(null);
    setActiveTab('dashboard');
    triggerToast('You have been securely signed out.');
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    saveUserProfile(newProfile);
    setCurrentUserProfile(newProfile);
    setActiveTab('dashboard');
    triggerToast('Your personalized goal path & daily targets are ready!');
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    saveUserProfile(updatedProfile);
    setCurrentUserProfile(updatedProfile);
    if (updatedProfile.lastPathUpdateReason) {
      triggerToast(updatedProfile.lastPathUpdateReason);
    }
  };

  const handleNavigateWithPayload = (tabId: string, payload?: any) => {
    setActiveTab(tabId);
    setTabPayload(payload);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl bg-zinc-900 border border-cyan-400/40 text-xs text-slate-200 shadow-2xl shadow-cyan-500/20 backdrop-blur-md animate-bounce-short">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <strong className="text-white font-semibold">NEXORA System:</strong>
          </div>
          <p className="mt-1 text-slate-300">{toastMessage}</p>
        </div>
      )}

      {/* RENDER UNAUTHENTICATED OR AUTHENTICATED */}
      {!currentUserProfile ? (
        <div className="flex flex-col min-h-screen bg-black">
          {/* Public Top Navbar */}
          <Navbar
            currentUser={null}
            activeTab={activeTab}
            onSelectTab={handleNavigateWithPayload}
            onOpenAuth={handleOpenAuth}
            onSignOut={handleSignOut}
          />

          <main className="flex-1">
            {currentAccount ? (
              // Step-by-Step AI Requirement Gathering & Goal Setup Flow
              <PersonalizedOnboardingFlow
                userFullName={currentAccount.fullName}
                userEmail={currentAccount.email}
                userId={currentAccount.id}
                onComplete={handleOnboardingComplete}
              />
            ) : (
              // Public Landing Page
              <LandingPage
                onOpenAuth={handleOpenAuth}
              />
            )}
          </main>

          <Footer 
            onOpenAuth={handleOpenAuth}
          />
        </div>
      ) : (
        // AUTHENTICATED FULL-SCREEN WORKSPACE WITH PINNED SIDEBAR
        <div className="flex h-screen w-screen overflow-hidden bg-black text-slate-100">
          
          {/* Pinned Left Sidebar */}
          <AppSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            profile={currentUserProfile}
            onSignOut={handleSignOut}
          />

          {/* Full-bleed Scrollable Main Content */}
          <main className="flex-1 h-screen overflow-y-auto bg-black p-4 sm:p-8">
            
            {/* Active Workspace View */}
            <div className="w-full min-w-0">
              {activeTab === 'dashboard' && (
                <DashboardView
                  profile={currentUserProfile}
                  onNavigate={handleNavigateWithPayload}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}

              {activeTab === 'roadmap' && (
                <RoadmapView
                  profile={currentUserProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onLaunchAssessment={(skillId) => handleNavigateWithPayload('assessments', { autoStartSkillId: skillId })}
                />
              )}

              {activeTab === 'resources' && (
                <FreeResourcesCatalogView
                  profile={currentUserProfile}
                />
              )}

              {activeTab === 'diary' && (
                <StudentStudyDiary
                  profile={currentUserProfile}
                />
              )}

              {activeTab === 'analytics' && (
                <PerformanceAnalyticsView
                  profile={currentUserProfile}
                  onLaunchAssessment={(skillId) => handleNavigateWithPayload('assessments', { autoStartSkillId: skillId })}
                />
              )}

              {activeTab === 'assessments' && (
                <AssessmentView
                  profile={currentUserProfile}
                  selectedSkillId={tabPayload?.autoStartSkillId}
                  onUpdateProfile={handleUpdateProfile}
                  onNavigateToRoadmap={() => handleNavigateWithPayload('roadmap')}
                />
              )}

              {activeTab === 'career' && (
                <CareerView
                  profile={currentUserProfile}
                />
              )}

              {activeTab === 'whatif' && (
                <WhatIfView
                  profile={currentUserProfile}
                />
              )}

              {activeTab === 'ai-navigator' && (
                <AINavigatorView
                  profile={currentUserProfile}
                  onNavigate={handleNavigateWithPayload}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView
                  profile={currentUserProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onResetOnboarding={() => {
                    setCurrentUserProfile(null);
                    triggerToast('Onboarding reset. Please complete the setup diagnostic.');
                  }}
                />
              )}
            </div>

          </main>

        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authInitialMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}

export default App;

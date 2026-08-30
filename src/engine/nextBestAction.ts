import type { NextBestAction, UserProfile } from './types';

export function calculateNextBestAction(profile: UserProfile): NextBestAction {
  // 1. New user with no baseline diagnostic completed
  if (!profile.baselineDiagnosticCompleted) {
    return {
      id: 'nba-baseline-diagnostic',
      title: 'Establish Your Baseline Diagnostic',
      type: 'assessment',
      durationEstimateMinutes: 10,
      skillName: profile.skills[0]?.skillName || 'Core Diagnostic',
      milestoneId: profile.activeRoadmap[0]?.id || 'ms-baseline',
      whyThisIsNext: 'We need to measure your current abilities across your goal requirements to calibrate your prerequisites and eliminate fake assumptions.',
      primaryActionLabel: 'Start Baseline Diagnostic'
    };
  }

  // 2. Check for active Remediation milestone
  const activeRemediation = profile.activeRoadmap.find(m => m.isRemediation && m.status !== 'completed');
  if (activeRemediation) {
    const skill = profile.skills.find(s => s.skillId === activeRemediation.skillId);
    const score = skill?.currentMastery ?? 45;
    return {
      id: `nba-remediation-${activeRemediation.id}`,
      title: `Practice & Remediate ${activeRemediation.title}`,
      type: 'remediation',
      durationEstimateMinutes: 25,
      skillName: skill?.skillName || activeRemediation.title,
      milestoneId: activeRemediation.id,
      whyThisIsNext: `Your latest assessment scored ${score}%. Remediating this topic is a strict prerequisite before your next major milestone.`,
      primaryActionLabel: 'Start Remediation Drills'
    };
  }

  // 3. Check for In-Progress milestone
  const inProgressMilestone = profile.activeRoadmap.find(m => m.status === 'in_progress');
  if (inProgressMilestone) {
    return {
      id: `nba-continue-${inProgressMilestone.id}`,
      title: `Complete ${inProgressMilestone.title} Milestone`,
      type: 'milestone_practice',
      durationEstimateMinutes: Math.min(45, profile.dailyAvailabilityMinutes),
      skillName: inProgressMilestone.title,
      milestoneId: inProgressMilestone.id,
      whyThisIsNext: `You are currently progressing through this milestone. Completing the remaining practice problems will unlock the next phase on your roadmap.`,
      primaryActionLabel: 'Resume Practice'
    };
  }

  // 4. Check for first Unlocked milestone
  const unlockedMilestone = profile.activeRoadmap.find(m => m.status === 'unlocked');
  if (unlockedMilestone) {
    return {
      id: `nba-start-${unlockedMilestone.id}`,
      title: `Learn & Practice ${unlockedMilestone.title}`,
      type: 'milestone_learn',
      durationEstimateMinutes: Math.min(30, profile.dailyAvailabilityMinutes),
      skillName: unlockedMilestone.title,
      milestoneId: unlockedMilestone.id,
      whyThisIsNext: `All prerequisites are satisfied. Mastering this topic brings your overall goal readiness closer to target.`,
      primaryActionLabel: 'Start Milestone'
    };
  }

  // 5. Fallback for all completed milestones (Career readiness / mock interviews)
  return {
    id: 'nba-career-mocks',
    title: 'Run Full-Length Career Simulation & Mock',
    type: 'project',
    durationEstimateMinutes: 60,
    skillName: 'Career Readiness',
    milestoneId: 'ms-career-readiness',
    whyThisIsNext: 'You have mastered all core roadmap milestones! Conduct a live mock interview or optimize your technical resume for applications.',
    primaryActionLabel: 'Open Career Suite'
  };
}

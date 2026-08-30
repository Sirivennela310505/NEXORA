import { calculateNextBestAction } from './nextBestAction';
import { calculateSkillGaps } from './skillGapEngine';
import type { UserProfile, WhatIfScenario } from './types';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; actionType: string; payload?: any }[];
}

export function generateContextAwareAIResponse(userMessage: string, profile: UserProfile): AIMessage {
  const lower = userMessage.toLowerCase();
  const nba = calculateNextBestAction(profile);
  const gaps = calculateSkillGaps(profile.skills, profile.goalCategory);
  const activeMilestone = profile.activeRoadmap.find(m => m.status === 'in_progress' || m.status === 'unlocked');

  let replyText = '';
  let actions: AIMessage['suggestedActions'] = [];

  if (lower.includes('what should i learn') || lower.includes('where to start') || lower.includes('what next')) {
    replyText = `Based on your target goal **${profile.goalTitle}** and current profile:\n\n` +
      `🎯 **Immediate Priority:** ${nba.title}\n` +
      `⏱️ **Estimated Investment:** ${nba.durationEstimateMinutes} minutes\n` +
      `💡 **Why this is recommended:** ${nba.whyThisIsNext}\n\n` +
      `Your current skill gap analysis indicates that **${gaps.criticalGaps[0]?.skillName || 'Prerequisite Foundations'}** represents your highest-leverage growth area.`;
    
    actions = [
      { label: nba.primaryActionLabel, actionType: 'START_NBA', payload: nba }
    ];
  } else if (lower.includes('react') || lower.includes('web dev') || lower.includes('frontend')) {
    if (profile.goalCategory === 'swe' || profile.goalCategory === 'internship') {
      replyText = `While React is an excellent frontend library, let's look at your target roadmap for **${profile.goalTitle}**:\n\n` +
        `1. **Prerequisite Check:** Your core diagnostic shows **${gaps.criticalGaps[0]?.skillName || 'Data Structures'}** is currently at ${gaps.criticalGaps[0]?.currentMastery ?? 42}% mastery.\n` +
        `2. **Recruiter Standard:** Most initial screening rounds for software engineering internships filter candidates primarily on DSA and Problem Solving before assessing specific web frameworks.\n\n` +
        `👉 **Recommendation:** Complete your current **${activeMilestone?.title || 'Core DSA'}** milestone first before branching into React frontend development.`;
      
      actions = [
        { label: 'View Roadmap', actionType: 'NAVIGATE_ROADMAP' },
        { label: 'Simulate React Path in What-If', actionType: 'SIMULATE_SCENARIO' }
      ];
    } else {
      replyText = `React is a great tool for building dynamic user interfaces. It requires familiarity with modern JavaScript (ES6+), component state, and RESTful API integration.`;
    }
  } else if (lower.includes('hashing') || lower.includes('hash map') || lower.includes('two sum')) {
    replyText = `**Hashing Mastery Intuition:**\n\n` +
      `• A Hash Map converts a key to a numeric index in $O(1)$ constant time using a hash function.\n` +
      `• **Collision Handling:** In Separate Chaining, duplicate hash buckets store items in a linked list or Red-Black Tree.\n` +
      `• **Key Pattern:** For Two-Sum problems, instead of checking every pair ($O(N^2)$), we store seen elements and look up $(target - current)$ in $O(1)$ time.\n\n` +
      `Since your diagnostic indicated room for improvement here, I recommend running through the high-yield hashing drills on your roadmap!`;
    
    actions = [
      { label: 'Start Hashing Drills', actionType: 'START_PRACTICE', payload: { skillId: 'swe-dsa-hashing' } }
    ];
  } else if (lower.includes('jee') || lower.includes('exam') || lower.includes('class 10') || lower.includes('class 12')) {
    replyText = `For competitive exam preparation like **${profile.goalTitle}**, consistency and prerequisite mastery are vital:\n\n` +
      `• Focus on high-yield conceptual mastery rather than rote formula memorization.\n` +
      `• Maintain an error log for every incorrect practice attempt.\n` +
      `• Your next action is scheduled around **${nba.title}** (${nba.durationEstimateMinutes} mins).`;
  } else if (lower.includes('resume') || lower.includes('ats') || lower.includes('interview')) {
    replyText = `To elevate your technical resume for **${profile.goalTitle}**:\n\n` +
      `1. **Quantify Everything:** Use the formula *Accomplished [X], as measured by [Y], by doing [Z]*.\n` +
      `2. **Tech Stack Keywords:** Ensure your mastered roadmap skills (e.g. ${profile.skills.filter(s => s.currentMastery && s.currentMastery >= 70).map(s => s.skillName).join(', ') || 'Core Programming'}) are prominently highlighted in your skills section.\n` +
      `3. Open our built-in **ATS Resume Builder** to check your real-time score and review bullet improvements.`;
    
    actions = [
      { label: 'Open ATS Resume Builder', actionType: 'NAVIGATE_RESUME' }
    ];
  } else {
    // General context-aware fallback
    replyText = `I am tracking your learning journey toward **${profile.goalTitle}**.\n\n` +
      `• **Current Focus:** ${activeMilestone?.title || 'Core Foundations'}\n` +
      `• **Next Best Action:** ${nba.title} (${nba.durationEstimateMinutes} mins)\n` +
      `• **Reasoning:** ${nba.whyThisIsNext}\n\n` +
      `How can I assist your study session today? You can ask me to explain concepts, suggest practice problems, or simulate path changes.`;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    content: replyText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedActions: actions
  };
}

export function simulateWhatIfScenario(profile: UserProfile, scenario: {
  hoursPerDay: number;
  alternateRole?: string;
  skipOptionalProjects: boolean;
}): WhatIfScenario {
  const currentDailyHours = profile.dailyAvailabilityMinutes / 60 || 1.5;
  const totalMilestones = profile.activeRoadmap.length;
  const completedMilestones = profile.activeRoadmap.filter(m => m.status === 'completed').length;
  const remainingMilestones = Math.max(1, totalMilestones - completedMilestones);

  const baselineWeeks = Math.round((remainingMilestones * 12) / (currentDailyHours * 7));
  const simulatedWeeks = Math.round((remainingMilestones * 12) / (scenario.hoursPerDay * 7));

  const weekDiff = simulatedWeeks - baselineWeeks;
  let paceChangeExplanation = '';
  const tradeOffs: string[] = [];

  if (weekDiff > 0) {
    paceChangeExplanation = `Investing ${scenario.hoursPerDay}h/day (down from ${currentDailyHours}h/day) extends your target milestone completion date by approximately ${weekDiff} weeks.`;
    tradeOffs.push('Milestone pacing will slow down; higher risk of retaining early prerequisite details.');
    tradeOffs.push('Reduced daily practice time per concept.');
  } else if (weekDiff < 0) {
    paceChangeExplanation = `Increasing your daily commitment to ${scenario.hoursPerDay}h/day accelerates your completion date by ${Math.abs(weekDiff)} weeks!`;
    tradeOffs.push('Fast-track progression allows earlier commencement of mock interviews and internship applications.');
    tradeOffs.push('Requires rigorous consistency of ~' + Math.round(scenario.hoursPerDay * 7) + ' hours per week.');
  } else {
    paceChangeExplanation = `Your current pace of ${scenario.hoursPerDay}h/day keeps you on track for target goal achievement within ~${simulatedWeeks} weeks.`;
  }

  if (scenario.alternateRole && scenario.alternateRole !== profile.goalTitle) {
    tradeOffs.push(`Switching target domain to "${scenario.alternateRole}" requires recalibrating ${Math.round(totalMilestones * 0.6)} milestones to match new industry skill requirements.`);
  }

  if (scenario.skipOptionalProjects) {
    tradeOffs.push('Skipping capstone projects saves ~3 weeks but reduces your ATS portfolio competitiveness for Tier-1 companies.');
  }

  return {
    hoursPerDay: scenario.hoursPerDay,
    targetDateMonths: Math.ceil(simulatedWeeks / 4),
    alternateRole: scenario.alternateRole,
    skipOptionalProjects: scenario.skipOptionalProjects,
    calculatedCompletionWeeks: simulatedWeeks,
    paceChangeExplanation,
    tradeOffs
  };
}

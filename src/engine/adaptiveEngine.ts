import { DOMAIN_SKILL_NODES, VERIFIED_RESOURCE_CATALOG } from './prerequisitesGraph';
import { getDomainKeyForGoal } from './skillGapEngine';
import type { AssessmentAttempt, GoalCategory, Milestone, UserProfile, UserSkillState } from './types';

export function generatePersonalizedRoadmap(profile: Partial<UserProfile>): Milestone[] {
  const goalCategory = profile.goalCategory || 'swe';
  const domainKey = getDomainKeyForGoal(goalCategory, profile.educationLevel);
  const nodes = DOMAIN_SKILL_NODES[domainKey] || DOMAIN_SKILL_NODES.swe;
  
  const dailyMinutes = profile.dailyAvailabilityMinutes || 60;
  const learningPreference = profile.learningPreference || 'Mixed';

  const milestones: Milestone[] = [];

  nodes.forEach((node, index) => {
    // Determine phase based on index and node category
    let phaseNumber = 1;
    let phaseTitle = 'Phase 1: Foundations & Fundamentals';

    if (domainKey === 'class10') {
      if (index <= 2) {
        phaseNumber = 1;
        phaseTitle = 'Phase 1: Real Numbers, Polynomials & Algebra';
      } else if (index <= 4) {
        phaseNumber = 2;
        phaseTitle = 'Phase 2: Trigonometry & Coordinate Geometry';
      } else if (index <= 7) {
        phaseNumber = 3;
        phaseTitle = 'Phase 3: Chemical Reactions & Carbon Compounds';
      } else {
        phaseNumber = 4;
        phaseTitle = 'Phase 4: Light Optics, Electricity & Magnetism';
      }
    } else if (domainKey === 'swe') {
      if (index <= 2) {
        phaseNumber = 1;
        phaseTitle = 'Phase 1: Arrays, Hashing & Pointers';
      } else if (index <= 5) {
        phaseNumber = 2;
        phaseTitle = 'Phase 2: Stacks, Binary Search & Linked Lists';
      } else if (index <= 8) {
        phaseNumber = 3;
        phaseTitle = 'Phase 3: Trees, Heaps, Graphs & DP';
      } else {
        phaseNumber = 4;
        phaseTitle = 'Phase 4: Backend Databases & Fullstack Systems';
      }
    } else if (domainKey === 'jee') {
      if (index <= 2) {
        phaseNumber = 1;
        phaseTitle = 'Phase 1: High-Yield Mathematics';
      } else if (index <= 4) {
        phaseNumber = 2;
        phaseTitle = 'Phase 2: Physics Fundamentals';
      } else {
        phaseNumber = 3;
        phaseTitle = 'Phase 3: Physical & Organic Chemistry';
      }
    } else {
      phaseNumber = Math.floor(index / 2) + 1;
      phaseTitle = `Phase ${phaseNumber}: ${node.category}`;
    }

    // Curate verified resources for this skill
    const baseResources = VERIFIED_RESOURCE_CATALOG[node.id] || [
      {
        id: `res-${node.id}-default`,
        title: `${node.name} Masterclass & Core Principles`,
        provider: 'NEXORA Verified Curriculum',
        type: learningPreference === 'Video' ? 'Video' : 'Course',
        difficulty: 'Intermediate',
        durationMinutes: Math.round(1800 / dailyMinutes) * 10,
        url: 'https://ocw.mit.edu',
        isFree: true,
        whyRecommended: `Core competency required for your target milestone in ${node.name}.`
      }
    ];

    // Check if user already marked this as advanced
    const existingSkill = profile.skills?.find(s => s.skillId === node.id);
    const isMastered = existingSkill?.currentMastery && existingSkill.currentMastery >= node.targetMasteryForGoal;
    
    // Status resolution based on prerequisites
    let status: Milestone['status'] = 'locked';
    if (index === 0 || node.prerequisites.length === 0) {
      status = isMastered ? 'completed' : 'unlocked';
    } else {
      status = 'locked';
    }

    milestones.push({
      id: `ms-${node.id}`,
      phaseNumber,
      phaseTitle,
      title: node.name,
      description: node.description,
      skillId: node.id,
      category: node.category === 'Career' ? 'Career' : node.category === 'Foundation' ? 'Foundation' : 'Core',
      estimatedHours: Math.max(4, Math.round(300 / dailyMinutes)),
      status,
      prerequisiteMilestoneIds: node.prerequisites.map(p => `ms-${p}`),
      resources: baseResources,
      practiceProblemsCount: 15,
      diagnosticQuestionCount: 5,
      completedAt: isMastered ? new Date().toISOString() : undefined
    });
  });

  // Reconcile unlock statuses based on completed milestones
  return reconcileMilestoneStatuses(milestones);
}

export function reconcileMilestoneStatuses(milestones: Milestone[]): Milestone[] {
  const completedIds = new Set(milestones.filter(m => m.status === 'completed').map(m => m.id));

  return milestones.map((m) => {
    if (m.status === 'completed') return m;

    const allPrereqsCompleted = m.prerequisiteMilestoneIds.length === 0 || 
      m.prerequisiteMilestoneIds.every(id => completedIds.has(id));

    if (allPrereqsCompleted) {
      // If it was locked, unlock it
      return {
        ...m,
        status: m.status === 'locked' ? 'unlocked' : m.status
      };
    } else {
      return {
        ...m,
        status: 'locked'
      };
    }
  });
}

export function recalibrateRoadmapAfterAssessment(
  currentRoadmap: Milestone[],
  skills: UserSkillState[],
  attempt: AssessmentAttempt,
  _goalCategory?: GoalCategory
): {
  updatedRoadmap: Milestone[];
  updatedSkills: UserSkillState[];
  notificationMessage: string;
} {
  const score = attempt.scorePercentage;
  
  // 1. Update skill state
  const updatedSkills = skills.map(skill => {
    if (skill.skillId === attempt.skillId) {
      const status: UserSkillState['status'] = score >= 80 ? 'mastered' : score < 60 ? 'critical_gap' : 'in_progress';
      const gap = Math.max(0, 80 - score);
      return {
        ...skill,
        currentMastery: score,
        status,
        gapPercentage: gap,
        lastAssessedDate: attempt.timestamp
      };
    }
    return skill;
  });

  let updatedRoadmap = [...currentRoadmap];
  let notificationMessage = '';

  const relatedMilestoneIndex = updatedRoadmap.findIndex(m => m.skillId === attempt.skillId && !m.isRemediation);

  if (score < 65) {
    // Remediation required! Insert or update remediation milestone
    const remediationId = `remediation-${attempt.skillId}`;
    const alreadyHasRemediation = updatedRoadmap.some(m => m.id === remediationId);

    if (!alreadyHasRemediation && relatedMilestoneIndex !== -1) {
      const baseMilestone = updatedRoadmap[relatedMilestoneIndex];
      const remediationMilestone: Milestone = {
        id: remediationId,
        phaseNumber: baseMilestone.phaseNumber,
        phaseTitle: `${baseMilestone.phaseTitle} (Adaptive Remediation)`,
        title: `${baseMilestone.title}: Targeted Remediation & Practice`,
        description: `Your assessment indicated a ${100 - score}% gap in ${baseMilestone.title}. Complete targeted concept reviews and practice sets before proceeding to dependent topics.`,
        skillId: baseMilestone.skillId,
        category: 'Remediation',
        estimatedHours: 3,
        status: 'unlocked',
        isRemediation: true,
        remediationReason: `Assessment score ${score}% fell below target 80% baseline.`,
        prerequisiteMilestoneIds: [],
        resources: [
          {
            id: `res-remediation-${attempt.skillId}`,
            title: `Remediation Guide: Mastering ${baseMilestone.title} Edge Cases`,
            provider: 'NEXORA Adaptive Diagnostic Engine',
            type: 'Practice',
            difficulty: 'Intermediate',
            durationMinutes: 45,
            url: 'https://neetcode.io',
            isFree: true,
            whyRecommended: `Directly targets errors identified in your recent ${score}% assessment.`
          }
        ],
        practiceProblemsCount: 10,
        diagnosticQuestionCount: 5
      };

      // Insert immediately after current milestone
      updatedRoadmap.splice(relatedMilestoneIndex + 1, 0, remediationMilestone);
    }

    notificationMessage = `Your learning path has adapted! Because your ${attempt.skillName} diagnostic was ${score}%, we have inserted a targeted Remediation milestone to solidify prerequisites before advancing.`;
  } else if (score >= 80) {
    // Mastery achieved! Mark milestone completed, unlock downstream
    updatedRoadmap = updatedRoadmap.map(m => {
      if (m.skillId === attempt.skillId) {
        return {
          ...m,
          status: 'completed' as const,
          completedAt: new Date().toISOString()
        };
      }
      return m;
    });

    // Remove any lingering remediation milestone for this skill if cleared
    updatedRoadmap = updatedRoadmap.filter(m => !(m.isRemediation && m.skillId === attempt.skillId));

    notificationMessage = `Mastery confirmed! You scored ${score}% in ${attempt.skillName}. Downstream milestones on your roadmap have been unlocked.`;
  } else {
    // In progress (65% - 79%)
    updatedRoadmap = updatedRoadmap.map(m => {
      if (m.skillId === attempt.skillId && m.status !== 'completed') {
        return {
          ...m,
          status: 'in_progress' as const
        };
      }
      return m;
    });

    notificationMessage = `Progress recorded! You achieved ${score}% in ${attempt.skillName}. Continue targeted practice to reach 80%+ mastery.`;
  }

  // Reconcile all unlock and lock dependencies
  updatedRoadmap = reconcileMilestoneStatuses(updatedRoadmap);

  return {
    updatedRoadmap,
    updatedSkills,
    notificationMessage
  };
}

import { DOMAIN_SKILL_NODES } from './prerequisitesGraph';
import type { GoalCategory, SkillProficiency, UserSkillState } from './types';

export function initializeSkillsForGoal(
  goalCategory: GoalCategory,
  selfReportedLevels: Record<string, SkillProficiency> = {},
  educationLevel?: string
): UserSkillState[] {
  const domainKey = getDomainKeyForGoal(goalCategory, educationLevel);
  const nodes = DOMAIN_SKILL_NODES[domainKey] || DOMAIN_SKILL_NODES.swe;

  return nodes.map((node) => {
    const reported = selfReportedLevels[node.name] || selfReportedLevels[node.id] || 'None';
    
    // Initial estimation from self-reported proficiency if not tested yet
    let initialMastery: number | null = null;
    if (reported === 'Beginner') initialMastery = 40;
    else if (reported === 'Basic') initialMastery = 55;
    else if (reported === 'Intermediate') initialMastery = 70;
    else if (reported === 'Advanced') initialMastery = 85;

    const gap = initialMastery !== null ? Math.max(0, node.targetMasteryForGoal - initialMastery) : node.targetMasteryForGoal;
    
    let status: UserSkillState['status'] = 'unassessed';
    if (initialMastery !== null) {
      if (initialMastery >= node.targetMasteryForGoal) {
        status = 'mastered';
      } else if (gap >= 25) {
        status = 'critical_gap';
      } else {
        status = 'in_progress';
      }
    }

    return {
      skillId: node.id,
      skillName: node.name,
      currentMastery: initialMastery,
      selfReportedLevel: reported,
      status,
      gapPercentage: gap
    };
  });
}

export function calculateSkillGaps(
  skills: UserSkillState[], 
  goalCategory: GoalCategory,
  educationLevel?: string
): {
  criticalGaps: UserSkillState[];
  inProgressSkills: UserSkillState[];
  masteredSkills: UserSkillState[];
  unassessedSkills: UserSkillState[];
  overallReadinessPercentage: number | null;
} {
  const domainKey = getDomainKeyForGoal(goalCategory, educationLevel);
  const nodes = DOMAIN_SKILL_NODES[domainKey] || DOMAIN_SKILL_NODES.swe;
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  const criticalGaps: UserSkillState[] = [];
  const inProgressSkills: UserSkillState[] = [];
  const masteredSkills: UserSkillState[] = [];
  const unassessedSkills: UserSkillState[] = [];

  let totalWeight = 0;
  let accumulatedMastery = 0;
  let assessedCount = 0;

  for (const skill of skills) {
    const target = nodeMap.get(skill.skillId)?.targetMasteryForGoal || 80;
    
    if (skill.currentMastery === null) {
      unassessedSkills.push(skill);
    } else {
      assessedCount++;
      totalWeight += target;
      accumulatedMastery += (skill.currentMastery / target) * target;

      if (skill.currentMastery >= target) {
        masteredSkills.push(skill);
      } else if (skill.gapPercentage >= 25 || skill.currentMastery < 60) {
        criticalGaps.push(skill);
      } else {
        inProgressSkills.push(skill);
      }
    }
  }

  const overallReadinessPercentage = assessedCount > 0 && totalWeight > 0 
    ? Math.round((accumulatedMastery / totalWeight) * 100) 
    : null;

  return {
    criticalGaps,
    inProgressSkills,
    masteredSkills,
    unassessedSkills,
    overallReadinessPercentage
  };
}

export function getDomainKeyForGoal(goal: GoalCategory, educationLevel?: string, goalTitle?: string): string {
  if (educationLevel === 'Class 10' || goal === 'academic') {
    return 'class10';
  }
  if (goalTitle) {
    const t = goalTitle.toLowerCase();
    if (t.includes('java') || t.includes('spring') || t.includes('hibernate')) {
      return 'java_backend';
    }
    if (t.includes('ai') || t.includes('ml') || t.includes('machine learning') || t.includes('data science') || t.includes('deep learning')) {
      return 'ai_ml';
    }
    if (t.includes('10th') || t.includes('class 10')) {
      return 'class10';
    }
    if (t.includes('jee') || t.includes('neet') || t.includes('iit') || t.includes('12th')) {
      return 'jee';
    }
  }

  switch (goal) {
    case 'jee':
    case 'neet':
      return 'jee';
    case 'ai_ml':
    case 'data_science':
      return 'ai_ml';
    case 'internship':
    case 'job':
    case 'swe':
    case 'career_switch':
    default:
      return 'swe';
  }
}

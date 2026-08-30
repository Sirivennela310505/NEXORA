export type EducationLevel = 
  | 'Class 8'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12'
  | 'Diploma'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'Graduate'
  | 'Working Professional';

export type GoalCategory =
  | 'jee'
  | 'neet'
  | 'internship'
  | 'job'
  | 'swe'
  | 'ai_ml'
  | 'data_science'
  | 'career_switch'
  | 'academic'
  | 'custom';

export type SkillProficiency = 'None' | 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced';

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  domain: string;
  description: string;
  prerequisites: string[]; // IDs of prerequisite skills
  targetMasteryForGoal: number; // e.g. 80 (%)
}

export interface UserSkillState {
  skillId: string;
  skillName: string;
  currentMastery: number | null; // null if unassessed
  selfReportedLevel: SkillProficiency;
  lastAssessedDate?: string;
  status: 'unassessed' | 'critical_gap' | 'in_progress' | 'mastered';
  gapPercentage: number;
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string; // e.g. MIT OpenCourseWare, NeetCode, CS50, Khan Academy, freeCodeCamp
  type: 'Video' | 'Course' | 'Documentation' | 'Practice' | 'Article' | 'Project';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  url: string;
  videoEmbedUrl?: string; // YouTube or direct video embed player URL
  isFree: boolean;
  whyRecommended: string;
}

export interface Milestone {
  id: string;
  phaseNumber: number;
  phaseTitle: string;
  title: string;
  description: string;
  skillId: string;
  category: 'Foundation' | 'Core' | 'Practice' | 'Remediation' | 'Project' | 'Career';
  estimatedHours: number;
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
  isRemediation?: boolean;
  remediationReason?: string;
  prerequisiteMilestoneIds: string[];
  resources: LearningResource[];
  practiceProblemsCount: number;
  diagnosticQuestionCount: number;
  completedAt?: string;
}

export interface DiagnosticQuestion {
  id: string;
  skillId: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AssessmentAttempt {
  id: string;
  timestamp: string;
  skillId: string;
  skillName: string;
  scorePercentage: number;
  totalQuestions: number;
  correctAnswers: number;
  feedbackNotes: string;
  impactOnPath: string;
}

export interface NextBestAction {
  id: string;
  title: string;
  type: 'assessment' | 'milestone_learn' | 'milestone_practice' | 'remediation' | 'project';
  durationEstimateMinutes: number;
  skillName: string;
  milestoneId: string;
  whyThisIsNext: string;
  primaryActionLabel: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  isDemoUser?: boolean;
  
  // Onboarding state
  onboardingCompleted: boolean;
  educationLevel: EducationLevel;
  branchOrStream?: string;
  goalCategory: GoalCategory;
  goalTitle: string;
  goalNaturalLanguage: string;
  targetDate?: string;
  dailyAvailabilityMinutes: number;
  learningPreference: 'Video' | 'Reading' | 'Practice' | 'Projects' | 'Mixed';
  struggles: string[];
  
  // Skills & Diagnostic state
  skills: UserSkillState[];
  baselineDiagnosticCompleted: boolean;
  assessmentHistory: AssessmentAttempt[];
  
  // Dynamic Roadmap
  activeRoadmap: Milestone[];
  pathVersion: number;
  lastPathUpdateReason?: string;
  
  // Feedback
  feedbackLog: {
    resourceId?: string;
    milestoneId?: string;
    isHelpful: boolean;
    reason?: string;
    timestamp: string;
  }[];
}

export interface OpportunityItem {
  id: string;
  title: string;
  organization: string;
  type: 'Internship' | 'Full-time' | 'Hackathon' | 'Fellowship' | 'Competition';
  location: string;
  eligibility: string;
  deadline: string;
  matchScore: number;
  matchReason: string;
  url: string;
  requiredSkills: string[];
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
  targetRole: string;
  education: {
    institution: string;
    degree: string;
    year: string;
    cgpaOrScore: string;
  }[];
  experience: {
    title: string;
    company: string;
    duration: string;
    bullets: string[];
  }[];
  projects: {
    title: string;
    technologies: string;
    description: string;
    bullets: string[];
  }[];
  skillsList: string[];
  atsScore: number;
  atsFeedback: string[];
}

export interface WhatIfScenario {
  hoursPerDay: number;
  targetDateMonths: number;
  alternateRole?: string;
  skipOptionalProjects: boolean;
  calculatedCompletionWeeks: number;
  paceChangeExplanation: string;
  tradeOffs: string[];
}

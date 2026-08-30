import { generatePersonalizedRoadmap } from './adaptiveEngine';
import { initializeSkillsForGoal } from './skillGapEngine';
import type { UserProfile } from './types';

export interface StoredUserAccount {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string; // Simulated SHA-256 / hashed string
  createdAt: string;
}

const ACCOUNTS_KEY = 'nexora_registered_accounts_v1';
const SESSION_KEY = 'nexora_active_session_v1';
const USER_PROFILE_PREFIX = 'nexora_profile_';

// Simple hash utility for client-side demo security (avoids storing plaintext)
export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `nex_hash_${Math.abs(hash).toString(16)}_${password.length}`;
}

export function getRegisteredAccounts(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRegisteredAccounts(accounts: StoredUserAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getActiveSessionUserId(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setActiveSession(userId: string | null): void {
  if (userId) {
    localStorage.setItem(SESSION_KEY, userId);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getUserProfile(userId: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(`${USER_PROFILE_PREFIX}${userId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(`${USER_PROFILE_PREFIX}${profile.id}`, JSON.stringify(profile));
}

// ---------------- DEMO PERSONAS ---------------- //
export function createAlexMorganDemoProfile(): UserProfile {
  const skills = initializeSkillsForGoal('internship', {
    'Programming Fundamentals': 'Intermediate',
    'Object-Oriented Programming': 'Intermediate',
    'Arrays & Strings': 'Intermediate',
    'Hashing & Hash Maps': 'Beginner', // Intentional gap
    'Relational Databases & SQL': 'Basic',
  });

  // Specifically calibrate Alex Morgan's starting state
  skills[0].currentMastery = 85;
  skills[0].status = 'mastered';
  skills[1].currentMastery = 82;
  skills[1].status = 'mastered';
  skills[2].currentMastery = 78;
  skills[2].status = 'in_progress';
  skills[3].currentMastery = 42; // Gap!
  skills[3].status = 'critical_gap';
  skills[6].currentMastery = 50; // SQL
  skills[6].status = 'in_progress';

  const baseProfile: Partial<UserProfile> = {
    id: 'demo-alex-morgan',
    fullName: 'Alex Morgan',
    email: 'alex.morgan@stanford.edu',
    createdAt: new Date().toISOString(),
    isDemoUser: true,
    onboardingCompleted: true,
    educationLevel: 'Undergraduate',
    branchOrStream: 'Computer Science (3rd Year B.Tech)',
    goalCategory: 'internship',
    goalTitle: 'Software Engineering Internship',
    goalNaturalLanguage: 'I am in 3rd year B.Tech and want to crack a top-tier software engineering internship at a product company.',
    dailyAvailabilityMinutes: 90,
    learningPreference: 'Mixed',
    struggles: ['DSA Hashing', 'Complex SQL JOINs', 'System Design Basics'],
    skills,
    baselineDiagnosticCompleted: true,
    assessmentHistory: [
      {
        id: 'attempt-alex-1',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        skillId: 'swe-prog-basics',
        skillName: 'Programming Fundamentals',
        scorePercentage: 85,
        totalQuestions: 5,
        correctAnswers: 4,
        feedbackNotes: 'Solid grasp of loops and references.',
        impactOnPath: 'Unlocked Advanced DSA'
      },
      {
        id: 'attempt-alex-2',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        skillId: 'swe-dsa-hashing',
        skillName: 'Hashing & Hash Maps',
        scorePercentage: 42,
        totalQuestions: 5,
        correctAnswers: 2,
        feedbackNotes: 'Struggled with collision resolution mechanics and two-sum hash mapping.',
        impactOnPath: 'Inserted Hashing Remediation Milestone'
      }
    ],
    pathVersion: 2,
    lastPathUpdateReason: 'Path adapted: Hashing diagnostic score (42%) triggered remediation block.',
    feedbackLog: []
  };

  const initialRoadmap = generatePersonalizedRoadmap(baseProfile);
  
  // Set Alex Morgan's roadmap state
  initialRoadmap[0].status = 'completed'; // Programming Basics
  initialRoadmap[1].status = 'completed'; // OOP
  initialRoadmap[2].status = 'in_progress'; // Arrays & Strings
  
  return {
    ...baseProfile,
    activeRoadmap: initialRoadmap
  } as UserProfile;
}

export function createAaravSharmaDemoProfile(): UserProfile {
  const skills = initializeSkillsForGoal('jee', {
    'Basic Algebra & Quadratic Equations': 'Intermediate',
    'Trigonometry & Coordinate Geometry': 'Basic',
    'Differential & Integral Calculus': 'None',
    'Kinematics & Newton Laws of Motion': 'Basic',
    'Thermodynamics & Oscillations': 'None',
    'Atomic Structure & Chemical Bonding': 'Beginner',
  });

  // Specifically calibrate Aarav Sharma's JEE starting competencies
  if (skills[0]) { skills[0].currentMastery = 75; skills[0].status = 'in_progress'; }
  if (skills[1]) { skills[1].currentMastery = 48; skills[1].status = 'critical_gap'; }
  if (skills[2]) { skills[2].currentMastery = null; skills[2].status = 'unassessed'; }
  if (skills[3]) { skills[3].currentMastery = 62; skills[3].status = 'in_progress'; }
  if (skills[4]) { skills[4].currentMastery = null; skills[4].status = 'unassessed'; }
  if (skills[5]) { skills[5].currentMastery = 38; skills[5].status = 'critical_gap'; }

  const baseProfile: Partial<UserProfile> = {
    id: 'demo-aarav-sharma',
    fullName: 'Aarav Sharma',
    email: 'aarav.jee2027@gmail.com',
    createdAt: new Date().toISOString(),
    isDemoUser: true,
    onboardingCompleted: true,
    educationLevel: 'Class 10',
    branchOrStream: 'Secondary High School (Class 10 — Preparing for Science Stream & JEE 2027)',
    goalCategory: 'jee',
    goalTitle: 'Crack JEE Main & Advanced (Engineering Entrance)',
    goalNaturalLanguage: 'I am in Class 10 and want to build a rock-solid foundation in Math and Physics to rank in top 1,000 in JEE Advanced.',
    dailyAvailabilityMinutes: 120,
    learningPreference: 'Practice',
    struggles: ['Calculus Foundations', 'Chemical Bonding Concept Depth', 'JEE Speed & Accuracy'],
    skills,
    baselineDiagnosticCompleted: true,
    assessmentHistory: [
      {
        id: 'attempt-aarav-1',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        skillId: 'jee-math-algebra',
        skillName: 'Basic Algebra & Quadratic Equations',
        scorePercentage: 75,
        totalQuestions: 4,
        correctAnswers: 3,
        feedbackNotes: 'Strong roots analysis; recommend practicing quadratic inequalities and sign schemes.',
        impactOnPath: 'Continued to Trigonometry & Coordinate Geometry'
      },
      {
        id: 'attempt-aarav-2',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        skillId: 'jee-chem-atomic-bonding',
        skillName: 'Atomic Structure & Chemical Bonding',
        scorePercentage: 38,
        totalQuestions: 4,
        correctAnswers: 1,
        feedbackNotes: 'Struggled with orbital hybridization and VSEPR molecular shapes.',
        impactOnPath: 'Inserted Chemical Bonding Remediation'
      }
    ],
    pathVersion: 2,
    lastPathUpdateReason: 'Path updated: Atomic Structure & Bonding (38%) flagged for high-yield concept remediation.',
    feedbackLog: []
  };

  const initialRoadmap = generatePersonalizedRoadmap(baseProfile);
  if (initialRoadmap[0]) initialRoadmap[0].status = 'in_progress'; // Algebra
  if (initialRoadmap[1]) initialRoadmap[1].status = 'unlocked'; // Trig
  if (initialRoadmap[3]) initialRoadmap[3].status = 'unlocked'; // Physics Mechanics

  return {
    ...baseProfile,
    activeRoadmap: initialRoadmap
  } as UserProfile;
}

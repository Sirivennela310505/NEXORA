import type { OpportunityItem, ResumeData, UserProfile } from './types';

export const VERIFIED_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-1',
    title: 'Software Engineering Intern — Summer 2026',
    organization: 'Google',
    type: 'Internship',
    location: 'Hybrid / Bangalore, Hyderabad',
    eligibility: 'B.Tech / B.E. / M.Tech in CS or related technical field graduating in 2027',
    deadline: 'Rolling (Apply Early)',
    matchScore: 88,
    matchReason: 'High overlap with your Java/C++ programming foundation and DSA milestone completion.',
    url: 'https://careers.google.com/students',
    requiredSkills: ['Programming Fundamentals', 'Arrays & Strings', 'Hashing & Hash Maps', 'OOP']
  },
  {
    id: 'opp-2',
    title: 'Backend Engineering Intern',
    organization: 'Razorpay',
    type: 'Internship',
    location: 'Bangalore, India',
    eligibility: 'Pre-final & Final year undergrads with strong SQL and REST API fundamentals',
    deadline: 'April 30, 2026',
    matchScore: 82,
    matchReason: 'Matches your SQL and Backend API roadmap target milestones.',
    url: 'https://razorpay.com/jobs',
    requiredSkills: ['Relational Databases & SQL', 'REST APIs & Backend Engineering']
  },
  {
    id: 'opp-3',
    title: 'Google Summer of Code (GSoC) Contributor',
    organization: 'Open Source Initiative / Google',
    type: 'Fellowship',
    location: 'Remote / Global',
    eligibility: 'Open to all students & open-source beginners age 18+',
    deadline: 'May 15, 2026',
    matchScore: 94,
    matchReason: 'Perfect milestone alignment for building real-world open-source contributions before placement season.',
    url: 'https://summerofcode.withgoogle.com',
    requiredSkills: ['Programming Fundamentals', 'Git', 'OOP']
  },
  {
    id: 'opp-4',
    title: 'Smart India Hackathon 2026',
    organization: 'Ministry of Education & AICTE',
    type: 'Hackathon',
    location: 'National / Pan-India Nodal Centers',
    eligibility: 'Teams of college undergraduates across recognized universities',
    deadline: 'September 2026',
    matchScore: 90,
    matchReason: 'Direct pathway to accelerate project portfolio readiness and recruiter visibility.',
    url: 'https://www.sih.gov.in',
    requiredSkills: ['Programming Fundamentals', 'REST APIs & Backend Engineering']
  }
];

export function calculateOpportunityMatches(profile: UserProfile): OpportunityItem[] {
  const masteredSkillNames = new Set(
    profile.skills
      .filter(s => s.status === 'mastered' || (s.currentMastery && s.currentMastery >= 70))
      .map(s => s.skillName)
  );

  return VERIFIED_OPPORTUNITIES.map(opp => {
    const totalRequired = opp.requiredSkills.length;
    const matchingCount = opp.requiredSkills.filter(req => masteredSkillNames.has(req)).length;
    
    // Calculated match percentage
    let calculatedMatch = Math.round((matchingCount / (totalRequired || 1)) * 60) + 35;
    calculatedMatch = Math.min(98, Math.max(40, calculatedMatch));

    let reason = opp.matchReason;
    if (matchingCount === totalRequired) {
      reason = `You have mastered 100% (${matchingCount}/${totalRequired}) of the required core skills for this position.`;
    } else {
      const missing = opp.requiredSkills.filter(req => !masteredSkillNames.has(req));
      reason = `You meet ${matchingCount}/${totalRequired} skill prerequisites. Completing ${missing[0] || 'your next milestone'} will increase your interview readiness.`;
    }

    return {
      ...opp,
      matchScore: calculatedMatch,
      matchReason: reason
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

export function evaluateResumeATS(resume: ResumeData): { atsScore: number; feedback: string[] } {
  const feedback: string[] = [];
  let score = 50; // Baseline for basic structure

  if (resume.fullName.trim()) score += 5;
  if (resume.email.includes('@')) score += 5;
  if (resume.github.includes('github.com')) {
    score += 10;
  } else {
    feedback.push('Add a valid GitHub link with active project commits.');
  }

  if (resume.summary.length > 50) {
    score += 5;
  } else {
    feedback.push('Add a concise 2-line target summary highlighting your core tech stack and problem-solving focus.');
  }

  const allBullets = [
    ...resume.experience.flatMap(e => e.bullets),
    ...resume.projects.flatMap(p => p.bullets)
  ];

  const hasMetrics = allBullets.some(b => /\d+%|\d+ms|\d+x|\$\d+|\d+ users/i.test(b));
  if (hasMetrics) {
    score += 15;
  } else {
    feedback.push('Quantify your project and work impact with measurable metrics (e.g. "Reduced query latency by 35% using B-Tree indexing").');
  }

  const actionVerbRegex = /^(Engineered|Architected|Developed|Optimized|Implemented|Built|Designed|Streamlined|Refactored)/i;
  const hasStrongVerbs = allBullets.some(b => actionVerbRegex.test(b.trim()));
  if (hasStrongVerbs) {
    score += 10;
  } else {
    feedback.push('Begin every bullet point with strong technical action verbs (e.g. "Architected", "Engineered", "Optimized").');
  }

  return {
    atsScore: Math.min(100, score),
    feedback
  };
}

export function getInitialResume(profile: UserProfile): ResumeData {
  return {
    fullName: profile.fullName || 'Alex Morgan',
    email: profile.email || 'alex.morgan@stanford.edu',
    phone: '+1 (555) 234-5678',
    linkedin: 'linkedin.com/in/alexmorgan-dev',
    github: 'github.com/alexmorgan',
    summary: 'Aspiring Software Engineer with strong foundations in Data Structures, Algorithms, and RESTful Microservices. Eager to contribute high-performance code to scalable product teams.',
    targetRole: profile.goalTitle || 'Software Engineering Intern',
    education: [
      {
        institution: 'Indian Institute of Technology / Stanford Engineering',
        degree: profile.educationLevel === 'Class 10' ? 'Secondary High School' : 'B.Tech in Computer Science & Engineering',
        year: '2023 - 2027',
        cgpaOrScore: '8.8 / 10.0'
      }
    ],
    experience: [
      {
        title: 'Open Source Contributor',
        company: 'Dev Community Projects',
        duration: 'Jan 2025 - Present',
        bullets: [
          'Engineered optimized data cache reducing repetitive API fetch overhead by 40%.',
          'Collaborated with 6 core maintainers to resolve critical memory leaks in Java core services.'
        ]
      }
    ],
    projects: [
      {
        title: 'Distributed Task Queue & Execution Engine',
        technologies: 'Java, Spring Boot, Redis, Docker',
        description: 'High-throughput async job processor supporting retry backoff and dead-letter queues.',
        bullets: [
          'Implemented concurrency worker pools processing up to 2,500 tasks/second with sub-50ms latency.',
          'Integrated Redis pub/sub for real-time failure alerting and heartbeat tracking.'
        ]
      }
    ],
    skillsList: profile.skills.map(s => s.skillName),
    atsScore: 82,
    atsFeedback: [
      'Strong quantifiable metrics present in projects.',
      'Recommend adding 1 more backend microservice project to align 100% with top-tier product company requirements.'
    ]
  };
}

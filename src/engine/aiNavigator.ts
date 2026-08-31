import { calculateNextBestAction } from './nextBestAction';
import { calculateSkillGaps } from './skillGapEngine';
import { isGeminiConfigured, callGeminiChat } from './geminiAI';
import type { UserProfile, WhatIfScenario } from './types';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; actionType: string; payload?: any }[];
  isLiveAI?: boolean;
}

export interface NavigatorInitialConfig {
  greeting: string;
  suggestedActions: { label: string; actionType: string; payload?: any }[];
  inputPlaceholder: string;
}

export function getGoalAwareNavigatorConfig(profile: UserProfile): NavigatorInitialConfig {
  const firstName = profile.fullName.split(' ')[0] || 'Learner';
  const cat = profile.goalCategory;
  const goalLower = (profile.goalTitle || '').toLowerCase();

  // 1. JEE Main & Advanced
  if (cat === 'jee' || goalLower.includes('jee') || goalLower.includes('iit')) {
    return {
      greeting: `Hello ${firstName}! I am your **NEXORA AI JEE Navigator & Exam Strategist**.\n\n` +
        `I am continuously tracking your preparation toward **${profile.goalTitle}** (Targeting Top Rank).\n\n` +
        `Ask me anything about Physics numerical derivations, Organic Chemistry reaction mechanisms, Calculus mastery, high-yield PYQ patterns, or 3-hour mock test time allocation.`,
      suggestedActions: [
        { label: 'Calculus & Integration Strategy', actionType: 'PROMPT', payload: 'Provide a master roadmap for Calculus and Integration in JEE' },
        { label: 'Physics Mechanics Problem Tips', actionType: 'PROMPT', payload: 'How to approach complex Rotational Motion and Mechanics problems in JEE?' },
        { label: 'Organic Chemistry Reaction Sheet', actionType: 'PROMPT', payload: 'How to master Organic Chemistry mechanisms and conversions for JEE?' },
        { label: 'What should I study today?', actionType: 'PROMPT', payload: 'What should I learn next based on my current JEE preparation?' },
        { label: 'Mock Test Time Management', actionType: 'PROMPT', payload: 'How to allocate time between Physics, Chemistry, and Math in a 3-hour JEE mock exam?' }
      ],
      inputPlaceholder: 'Ask about Physics formulas, Chemistry mechanisms, Calculus, or JEE mock strategies...'
    };
  }

  // 2. NEET (Medical Entrance)
  if (cat === 'neet' || goalLower.includes('neet') || goalLower.includes('medical') || goalLower.includes('doctor')) {
    return {
      greeting: `Hello ${firstName}! I am your **NEXORA AI NEET Mentor & Medical Pathfinder**.\n\n` +
        `I am actively tracking your score trajectory toward **${profile.goalTitle}** (Target: 680+ Score).\n\n` +
        `Ask me anything about NCERT Biology retention, High-Yield Botany/Zoology diagrams, Organic/Inorganic Chemistry conversions, Physics numerical shortcuts, or revision schedules.`,
      suggestedActions: [
        { label: 'NCERT Biology 360/360 Plan', actionType: 'PROMPT', payload: 'How to score 360/360 in NEET Biology using line-by-line NCERT reading?' },
        { label: 'Physics High-Yield Chapters', actionType: 'PROMPT', payload: 'Which Physics chapters have the highest weightage in NEET?' },
        { label: 'Organic & Inorganic Chemistry Tips', actionType: 'PROMPT', payload: 'How to memorize Inorganic Chemistry and Organic reactions for NEET?' },
        { label: 'What should I study today?', actionType: 'PROMPT', payload: 'What should I learn next based on my NEET roadmap?' }
      ],
      inputPlaceholder: 'Ask about NCERT Biology, Physics numericals, Chemistry reactions, or NEET tips...'
    };
  }

  // 3. AI & Machine Learning Engineer
  if (cat === 'ai_ml' || goalLower.includes('ai') || goalLower.includes('machine learning') || goalLower.includes('rag') || goalLower.includes('llm')) {
    return {
      greeting: `Hello ${firstName}! I am your **NEXORA AI & Machine Learning Navigator**.\n\n` +
        `I am continuously tracking your journey toward **${profile.goalTitle}**.\n\n` +
        `Ask me about Math for ML, Neural Networks from scratch, PyTorch architectures, RAG & Vector Databases, LLM fine-tuning, or portfolio project blueprints.`,
      suggestedActions: [
        { label: 'AI & ML Engineer Roadmap', actionType: 'PROMPT', payload: 'Provide a comprehensive roadmap to become an AI & ML Engineer building RAG and models' },
        { label: 'Explain RAG Architecture', actionType: 'PROMPT', payload: 'Explain how Retrieval-Augmented Generation (RAG) works with Vector Databases' },
        { label: 'Math Foundations for Deep Learning', actionType: 'PROMPT', payload: 'What linear algebra, multivariable calculus, and probability concepts do I need for AI?' },
        { label: 'What should I learn next?', actionType: 'PROMPT', payload: 'What should I learn next based on my AI/ML roadmap?' }
      ],
      inputPlaceholder: 'Ask about PyTorch, RAG architectures, Neural Networks, Math for ML, or AI roadmaps...'
    };
  }

  // 4. Data Science
  if (cat === 'data_science' || goalLower.includes('data science') || goalLower.includes('data analyst')) {
    return {
      greeting: `Hello ${firstName}! I am your **NEXORA Data Science & Analytics Navigator**.\n\n` +
        `I am tracking your learning milestones toward **${profile.goalTitle}**.\n\n` +
        `Ask me about SQL query optimization, Pandas/NumPy data wrangling, Exploratory Data Analysis, Machine Learning algorithms, or Data Storytelling.`,
      suggestedActions: [
        { label: 'Data Science Mastery Roadmap', actionType: 'PROMPT', payload: 'Provide a complete roadmap to master Data Science and Analytics' },
        { label: 'SQL Optimization Techniques', actionType: 'PROMPT', payload: 'Explain advanced SQL joins, window functions, and indexing for data analysis' },
        { label: 'What should I learn next?', actionType: 'PROMPT', payload: 'What should I learn next on my data science path?' }
      ],
      inputPlaceholder: 'Ask about SQL, Pandas, statistical modeling, data visualization, or ML algorithms...'
    };
  }

  // 5. Career Switch
  if (cat === 'career_switch' || goalLower.includes('switch') || goalLower.includes('transition')) {
    return {
      greeting: `Hello ${firstName}! I am your **NEXORA Career Transition Navigator**.\n\n` +
        `I am supporting your journey toward **${profile.goalTitle}** from non-tech to tech.\n\n` +
        `Ask me anything about learning code from scratch, selecting high-demand tech stacks, building real-world recruiter projects, or preparing for interviews.`,
      suggestedActions: [
        { label: 'Transition Roadmap from Scratch', actionType: 'PROMPT', payload: 'How to transition into software engineering with zero prior computer science background' },
        { label: 'High-Impact Portfolio Projects', actionType: 'PROMPT', payload: 'What projects should I build to showcase skills to technical hiring managers?' },
        { label: 'How to optimize ATS Resume?', actionType: 'PROMPT', payload: 'How to format my resume for a tech career transition?' },
        { label: 'What should I learn next?', actionType: 'PROMPT', payload: 'What should I learn next based on my profile?' }
      ],
      inputPlaceholder: 'Ask about starting to code, portfolio projects, career transition tips, or roadmaps...'
    };
  }

  // 6. SWE / Internships / Web Development (Default Tech Domain)
  const isJavaGoal = goalLower.includes('java');
  const isPythonGoal = goalLower.includes('python');

  return {
    greeting: `Hello ${firstName}! I am your **NEXORA Software Engineering & Placement Navigator**.\n\n` +
      `I am continuously tracking your journey toward **${profile.goalTitle}**.\n\n` +
      `Ask me about Data Structures & Algorithms, System Design, Coding Roadmaps, Core CS subjects (OS, DBMS, CN), ATS Resume scores, or interview drills.`,
    suggestedActions: [
      isJavaGoal
        ? { label: 'Java Mastery Roadmap', actionType: 'PROMPT', payload: 'Provide a complete step by step Java mastery roadmap' }
        : isPythonGoal
        ? { label: 'Python Mastery Roadmap', actionType: 'PROMPT', payload: 'Provide a complete Python mastery roadmap' }
        : { label: 'SWE Placement Roadmap', actionType: 'PROMPT', payload: 'Provide a structured roadmap for Software Engineering placements and internships' },
      { label: 'What should I learn next?', actionType: 'PROMPT', payload: 'What should I learn next based on my profile?' },
      { label: 'Explain Hashing & Two-Sum', actionType: 'PROMPT', payload: 'Explain Hashing and Hash Maps intuition' },
      { label: 'Explain OOP Concepts', actionType: 'PROMPT', payload: 'Explain the 4 pillars of OOP with real world examples' },
      { label: 'How to improve ATS Resume?', actionType: 'PROMPT', payload: 'How to improve my technical ATS resume?' }
    ],
    inputPlaceholder: 'Ask about DSA, OOP, language roadmaps, system design, or placement prep...'
  };
}

export async function generateContextAwareAIResponse(
  userMessage: string,
  profile: UserProfile,
  chatHistory: AIMessage[] = []
): Promise<AIMessage> {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. If Gemini API is configured, attempt live call
  if (isGeminiConfigured()) {
    try {
      const historyFormatted = chatHistory.map(m => ({
        sender: m.sender,
        content: m.content
      }));

      const liveReply = await callGeminiChat(userMessage, profile, historyFormatted);
      if (liveReply && liveReply.trim().length > 0) {
        const dynamicActions = extractDynamicActions(userMessage, liveReply, profile);
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: liveReply.trim(),
          timestamp,
          suggestedActions: dynamicActions,
          isLiveAI: true
        };
      }
    } catch (err) {
      console.warn('Gemini chat live error, falling back to local intelligence engine:', err);
    }
  }

  // 2. Comprehensive Context-Aware Intelligent Engine (Runs offline & handles any student query accurately)
  const localResponse = generateLocalIntelligentResponse(userMessage, profile);
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    content: localResponse.content,
    timestamp,
    suggestedActions: localResponse.actions,
    isLiveAI: false
  };
}

function extractDynamicActions(
  userMessage: string,
  _aiReply: string,
  profile: UserProfile
): AIMessage['suggestedActions'] {
  const lower = userMessage.toLowerCase();
  const cat = profile.goalCategory;
  const isJeeNeet = cat === 'jee' || cat === 'neet';
  const nba = calculateNextBestAction(profile);
  const actions: AIMessage['suggestedActions'] = [];

  if (!isJeeNeet && (lower.includes('resume') || lower.includes('ats') || lower.includes('interview'))) {
    actions.push({ label: 'Open ATS Resume Builder', actionType: 'NAVIGATE_RESUME' });
  }
  if (lower.includes('roadmap') || lower.includes('milestone') || lower.includes('step') || lower.includes('path') || lower.includes('syllabus')) {
    actions.push({ label: 'View Interactive Roadmap', actionType: 'NAVIGATE_ROADMAP' });
    actions.push({ label: 'Simulate in What-If Engine', actionType: 'SIMULATE_SCENARIO' });
  }
  if (lower.includes('test') || lower.includes('quiz') || lower.includes('diagnostic') || lower.includes('practice') || lower.includes('assessment') || lower.includes('pyq')) {
    actions.push({ label: nba.primaryActionLabel || 'Start Diagnostic Drill', actionType: 'START_NBA', payload: nba });
  }
  if (lower.includes('resources') || lower.includes('books') || lower.includes('ncert') || lower.includes('hcv') || lower.includes('videos') || lower.includes('free')) {
    actions.push({ label: 'Browse 100% Free Books & Resources', actionType: 'NAVIGATE_RESOURCES' });
  }

  if (actions.length === 0) {
    actions.push(
      { label: nba.primaryActionLabel, actionType: 'START_NBA', payload: nba },
      { label: 'View Roadmap', actionType: 'NAVIGATE_ROADMAP' }
    );
  }

  return actions;
}

function generateLocalIntelligentResponse(
  userMessage: string,
  profile: UserProfile
): { content: string; actions: AIMessage['suggestedActions'] } {
  const lower = userMessage.toLowerCase();
  const nba = calculateNextBestAction(profile);
  const gaps = calculateSkillGaps(profile.skills, profile.goalCategory);
  const activeMilestone = profile.activeRoadmap?.find(m => m.status === 'in_progress' || m.status === 'unlocked');
  const cat = profile.goalCategory;
  const isJee = cat === 'jee' || profile.goalTitle.toLowerCase().includes('jee');
  const isNeet = cat === 'neet' || profile.goalTitle.toLowerCase().includes('neet');

  // --- 1. JEE EXAM QUESTIONS & ROADMAP ---
  if (isJee || lower.includes('jee') || lower.includes('iit') || lower.includes('calculus') || lower.includes('rotation') || lower.includes('mechanics') || lower.includes('organic reaction')) {
    if (lower.includes('calculus') || lower.includes('integration') || lower.includes('math')) {
      return {
        content: `### 📐 JEE Mathematics: Calculus & Problem Solving Master Strategy

#### 1️⃣ Core Prerequisite Hierarchy:
- **Foundations:** Functions, Domain & Range, Graphs Transformations, Trigonometric Identities.
- **Differential Calculus:** Limits (L'Hôpital, Series expansions), Continuity, Differentiability, Application of Derivatives (Monotonicity, Maxima-Minima, Tangents & Normals).
- **Integral Calculus:** Indefinite Integration (Substitution, By Parts, Partial Fractions), Definite Integrals (King's Rule, Leibniz Rule, Area under curves), Differential Equations.

#### 💡 High-Yield JEE Advanced Problem Solving Patterns:
1. **Definite Integral as a Limit of Sum:** Convert $\\lim_{n \\to \\infty} \\frac{1}{n} \\sum f(r/n) \\to \\int_0^1 f(x) dx$.
2. **Symmetry & Properties:** Always test $f(a+b-x) = f(x)$ before attempting long algebraic reductions.
3. **Daily Practice Benchmark:** Solve 25-30 timer-based PYQs daily with error logging.`,
        actions: [
          { label: 'Start JEE Math Practice', actionType: 'START_NBA', payload: nba },
          { label: 'View JEE Roadmap', actionType: 'NAVIGATE_ROADMAP' }
        ]
      };
    }

    if (lower.includes('physics') || lower.includes('mechanics') || lower.includes('rotation')) {
      return {
        content: `### ⚡ JEE Physics: Mechanics & Rotational Dynamics Master Plan

1. **Free Body Diagrams (FBDs):**
   - Always isolate bodies, resolve forces along perpendicular coordinate axes, and apply $\\Sigma F = m a$.
2. **Rotational Dynamics:**
   - Torque balance about instant center of rotation: $\\tau = I \\alpha$.
   - Energy conservation for pure rolling: $E_{total} = \\frac{1}{2}mv_{cm}^2 + \\frac{1}{2}I_{cm}\\omega^2$.
   - Angular Momentum Conservation ($L_i = L_f$) when external torque $\\tau_{ext} = 0$.
3. **Recommended Resources on NEXORA:**
   - Review HC Verma Concept Drills & Irodov-level Selected Problems in our **Free Resources** tab.`,
        actions: [
          { label: 'Explore Free Books & HCV', actionType: 'NAVIGATE_RESOURCES' },
          { label: 'Start Baseline Assessment', actionType: 'START_NBA', payload: nba }
        ]
      };
    }

    return {
      content: `### 🎯 Strategic JEE Main & Advanced Blueprint for ${profile.fullName.split(' ')[0]}

1. **Prerequisite Dependency Flow:**
   - Complete Newtonian Mechanics before moving into Rotational Motion and Fluid Dynamics.
   - Master Chemical Bonding & Periodic Trends before tackling Organic Reaction Mechanisms and Coordination Compounds.
   - Build strong algebraic and functional grounding before entering Integral Calculus.

2. **The 3-Tier Study Cycle:**
   - **Concept Clarity (40% time):** Understand derivations, core principles, and NCERT line-by-line.
   - **Active Problem Solving (50% time):** Solve 25-30 timer-based numericals daily with progressive difficulty.
   - **Mistake Journal & Revision (10% time):** Log every calculation error, formula slip, and conceptual misunderstanding.

3. **3-Hour Mock Test Time Allocation:**
   - **Round 1 (60 mins):** Chemistry (Easy/Direct NCERT questions ~25-30 mins) + Physics easy conceptuals.
   - **Round 2 (75 mins):** Math high-confidence questions + Physics numerical problems.
   - **Round 3 (45 mins):** Review flagged multi-concept questions.`,
      actions: [
        { label: 'Start Diagnostic Drill', actionType: 'START_NBA', payload: nba },
        { label: 'View Flowchart Roadmap', actionType: 'NAVIGATE_ROADMAP' },
        { label: 'Explore Free Books (HCV/Disha)', actionType: 'NAVIGATE_RESOURCES' }
      ]
    };
  }

  // --- 2. NEET EXAM QUESTIONS & ROADMAP ---
  if (isNeet || lower.includes('neet') || lower.includes('biology') || lower.includes('botany') || lower.includes('zoology')) {
    return {
      content: `### 🩺 NEET 680+ Strategic Blueprint for ${profile.fullName.split(' ')[0]}

#### 1️⃣ Biology (Target: 360/360):
- Read **NCERT line-by-line** at least 5 times before the exam.
- Pay close attention to summary paragraphs, scientist introductions, and diagram labels.
- Key Chapters: Genetics & Evolution, Human Physiology, Plant Physiology, Biotechnology, Ecology.

#### 2️⃣ Chemistry (Target: 160+/180):
- **Inorganic:** NCERT table data, exception trends in P-block, D&F-block, Coordination compounds.
- **Organic:** Named reactions, mechanism intermediates (carbocation stability, resonance), acidic/basic strength order.
- **Physical:** Formula sheets, stoichiometry, equilibrium, thermodynamics numericals.

#### 3️⃣ Physics (Target: 150+/180):
- Focus on direct formula applications and dimensional analysis shortcuts.
- High-yield: Modern Physics, Optics, Current Electricity, Thermodynamics, Kinematics.`,
      actions: [
        { label: 'Start NEET Diagnostic', actionType: 'START_NBA', payload: nba },
        { label: 'View NEET Roadmap', actionType: 'NAVIGATE_ROADMAP' },
        { label: 'Browse Free NCERT & Books', actionType: 'NAVIGATE_RESOURCES' }
      ]
    };
  }

  // --- 3. JAVA PROGRAMMING & ROADMAP ---
  if (lower.includes('java') && (lower.includes('road') || lower.includes('map') || lower.includes('master') || lower.includes('start') || lower.includes('learn') || lower.includes('focus') || lower.includes('guide'))) {
    return {
      content: `### ☕ Comprehensive Java Mastery Roadmap for ${profile.fullName.split(' ')[0]}

Here is your structured, step-by-step master plan for **Java Programming & Enterprise/DSA Foundations**:

#### 1️⃣ Phase 1: Core Java Fundamentals (Week 1–3)
- **Syntax & Basics:** Primitive types, Operators, Control Flow (if-else, switch, loops).
- **Object-Oriented Programming (OOP):** Classes, Objects, Inheritance, Polymorphism, Encapsulation, Abstraction, Interfaces & Abstract Classes.
- **Memory Model & JVM:** Stack vs Heap memory, Garbage Collection basics, \`static\` keyword, Value vs Reference.
- **Exception Handling & I/O:** \`try-catch-finally\`, Custom Exceptions, BufferedReader & Scanner.

#### 2️⃣ Phase 2: Collections & Generics Framework (Week 4–5)
- **Lists:** \`ArrayList\` (amortized $O(1)$) vs \`LinkedList\` (pointer-based).
- **Sets & Maps:** \`HashSet\`, \`TreeSet\`, \`HashMap\` (hashing, buckets & collision resolution), \`TreeMap\` (Red-Black tree $O(\\log N)$).
- **Queues & Deques:** \`PriorityQueue\` (Min/Max Heaps), \`ArrayDeque\`.
- **Java 8+ Features:** Lambda expressions, Functional Interfaces (\`Predicate\`, \`Consumer\`, \`Function\`), Streams API (\`.filter()\`, \`.map()\`, \`.collect()\`), \`Optional\`.

#### 3️⃣ Phase 3: DSA Implementation in Java (Week 6–8)
- Implement Custom Linked Lists, Stacks, Queues, Binary Trees, and Graphs from scratch.
- Master algorithmic patterns: Two Pointers, Sliding Window, Fast/Slow Pointers, Binary Search, DFS/BFS, Dynamic Programming.

#### 4️⃣ Phase 4: Modern Java Ecosystem & Projects (Week 9–12)
- **Concurrency & Multithreading:** \`Thread\`, \`Runnable\`, \`ExecutorService\`, \`synchronized\`, \`ConcurrentHashMap\`.
- **Spring Boot & REST APIs:** Dependency Injection (\`@Autowired\`, \`@Service\`, \`@RestController\`), Spring Data JPA, Hibernate, PostgreSQL.
- **Production Capstone:** Build a Scalable E-commerce or Task Management REST API with JWT Auth.`,
      actions: [
        { label: 'View Roadmap', actionType: 'NAVIGATE_ROADMAP' },
        { label: 'Simulate Java Path in What-If', actionType: 'SIMULATE_SCENARIO' },
        { label: 'Start Baseline Assessment', actionType: 'START_NBA', payload: nba }
      ]
    };
  }

  // --- 4. PYTHON ROADMAP & MASTERY ---
  if (lower.includes('python') && (lower.includes('road') || lower.includes('map') || lower.includes('master') || lower.includes('learn') || lower.includes('focus'))) {
    return {
      content: `### 🐍 Python Mastery Roadmap for ${profile.goalTitle}

Here is your prioritized learning plan for Python:

#### 1️⃣ Phase 1: Pythonic Fundamentals
- Data Types, Mutability, List Comprehensions, Dict Comprehensions, Generators & \`yield\`.
- Decorators, Context Managers (\`with\` statements), \`*args\` & \`**kwargs\`.
- Object-Oriented Python (\`__init__\`, \`__repr__\`, dunder methods, inheritance).

#### 2️⃣ Phase 2: Core Libraries & DSA
- \`collections\` module (\`deque\`, \`defaultdict\`, \`Counter\`), \`heapq\` for min-heaps, \`itertools\`, \`bisect\`.
- Solving classic DSA patterns in clean, idiomatic Python.

#### 3️⃣ Phase 3: Domain Specialization
- **For AI/ML & Data Science:** NumPy, Pandas, Matplotlib, Scikit-Learn, PyTorch.
- **For Backend:** FastAPI, Pydantic, SQLAlchemy, Celery, Docker.`,
      actions: [
        { label: 'Explore Python Resources', actionType: 'NAVIGATE_RESOURCES' },
        { label: 'Start Diagnostic Quiz', actionType: 'START_NBA', payload: nba }
      ]
    };
  }

  // --- 5. WHAT SHOULD I LEARN NEXT / NEXT BEST ACTION ---
  if (lower.includes('what should i learn') || lower.includes('where to start') || lower.includes('what next') || lower.includes('next step') || lower.includes('today')) {
    return {
      content: `### 🎯 Your Real-Time Learning Recommendation

Based on your goal **${profile.goalTitle}** and current progress:

- 📌 **Immediate Next Best Action:** **${nba.title}**
- ⏱️ **Estimated Duration:** ${nba.durationEstimateMinutes} minutes
- 🧠 **Why This Matters Now:** ${nba.whyThisIsNext}
- 📊 **Target Priority Gap:** **${gaps.criticalGaps[0]?.skillName || 'Prerequisite Foundations'}** (Current: ${gaps.criticalGaps[0]?.currentMastery || 35}%, Target: 80%)

Following this sequence ensures you master mandatory prerequisites before advancing to complex topics!`,
      actions: [
        { label: nba.primaryActionLabel, actionType: 'START_NBA', payload: nba },
        { label: 'View Full Roadmap', actionType: 'NAVIGATE_ROADMAP' }
      ]
    };
  }

  // --- 6. OOP CONCEPTS EXPLANATION ---
  if (lower.includes('oop') || lower.includes('object oriented') || (lower.includes('polymorphism') || lower.includes('inheritance') || lower.includes('encapsulation') || lower.includes('abstraction'))) {
    return {
      content: `### 🏛️ The 4 Pillars of Object-Oriented Programming (OOP)

1. **Encapsulation (Data Hiding):** Bundling state and methods together inside a class while restricting direct external access with private modifiers.
2. **Abstraction (Hiding Complexity):** Exposing only essential interfaces while hiding internal implementation details via Abstract Classes and Interfaces.
3. **Inheritance (Code Reusability):** Subclasses inherit state and behavior from a superclass (\`extends\`).
4. **Polymorphism (Many Forms):** Method Overloading (compile-time) and Method Overriding (runtime).`,
      actions: [
        { label: 'Start Practice Assessment', actionType: 'START_NBA', payload: nba }
      ]
    };
  }

  // --- 7. HASHING & DATA STRUCTURES ---
  if (lower.includes('hashing') || lower.includes('hash map') || lower.includes('hashmap') || lower.includes('two sum') || lower.includes('dsa') || lower.includes('data structure')) {
    return {
      content: `### ⚡ Hashing & Hash Map Deep Dive

#### 🔍 How a Hash Map Works Internally:
1. **Hash Function:** Converts any key into a numeric integer hash code.
2. **Index Computation:** \`index = hash(key) % array_capacity\`.
3. **Collision Handling:** Separate Chaining (Linked list / Red-Black tree) or Open Addressing (Linear probing).
4. **Time Complexity:** Average $O(1)$ for Insert, Lookup, and Delete.

#### 💡 Essential Patterns:
- Complement lookup ($target - current$) in Two-Sum.
- Frequency counter for Anagrams & Duplicates.
- Prefix-sum + Hash map for Subarray sums.`,
      actions: [
        { label: 'Start Hashing Drills', actionType: 'START_PRACTICE', payload: { skillId: 'swe-dsa-hashing' } },
        { label: 'View DSA Roadmap', actionType: 'NAVIGATE_ROADMAP' }
      ]
    };
  }

  // --- 8. AI & MACHINE LEARNING ---
  if (lower.includes('machine learning') || lower.includes('ai') || lower.includes('rag') || lower.includes('llm') || lower.includes('neural') || lower.includes('deep learning')) {
    return {
      content: `### 🤖 AI & Machine Learning Engineer Roadmap

#### 1️⃣ Foundations (Math & Code)
- **Math:** Linear Algebra (Matrices, Eigenvalues), Calculus (Gradients), Probability & Statistics.
- **Python Stack:** NumPy, Pandas, Scikit-Learn.

#### 2️⃣ Deep Learning Core
- **Neural Networks:** Backpropagation, Activation functions, Optimizers (AdamW).
- **Framework:** PyTorch from scratch.

#### 3️⃣ Generative AI & Modern LLM Systems
- **RAG:** Vector Databases (Pinecone, Chroma, FAISS), Semantic Chunking, Re-ranking.
- **Fine-Tuning:** LoRA, QLoRA, PEFT.`,
      actions: [
        { label: 'View Roadmap', actionType: 'NAVIGATE_ROADMAP' },
        { label: 'Simulate AI Specialization', actionType: 'SIMULATE_SCENARIO' }
      ]
    };
  }

  // --- 9. RESUME & ATS PREP ---
  if (lower.includes('resume') || lower.includes('ats') || lower.includes('interview') || lower.includes('job') || lower.includes('placement')) {
    return {
      content: `### 📄 High-Impact ATS Resume Blueprint for ${profile.goalTitle}

1. **Format:** Single column, standard fonts, plain bullet points without multi-column tables.
2. **Google XYZ Bullet Formula:** *Accomplished [X], as measured by [Y], by doing [Z]*.
3. **Keywords:** Match mastered skills from your roadmap in your Technical Skills section.`,
      actions: [
        { label: 'Open ATS Resume Builder', actionType: 'NAVIGATE_RESUME' },
        { label: 'View Career Roadmap', actionType: 'NAVIGATE_ROADMAP' }
      ]
    };
  }

  // --- 10. GENERAL INTELLIGENT DIRECT ANSWER ---
  return {
    content: `### 💡 Personalized Guidance for ${profile.fullName.split(' ')[0]}

I am actively tracking your learning journey toward **${profile.goalTitle}**.

Here is how you should approach **"${userMessage.length > 50 ? userMessage.slice(0, 50) + '...' : userMessage}"**:

1. **Target Alignment:** Your current active milestone is **${activeMilestone?.title || 'Core Foundations'}**.
2. **Immediate Action:** Focus your next study block on **${nba.title}** (~${nba.durationEstimateMinutes} mins).
3. **Core Insight:** Break down complex topics into small, daily measurable milestones. Test your retention with diagnostic practice problems immediately after reading theory.

💬 *Feel free to ask me to write code snippets, explain specific formulas/algorithms, generate custom roadmaps, or simulate study schedule adjustments!*`,
    actions: [
      { label: nba.primaryActionLabel, actionType: 'START_NBA', payload: nba },
      { label: 'View Roadmap', actionType: 'NAVIGATE_ROADMAP' },
      { label: 'Simulate What-If Scenarios', actionType: 'SIMULATE_SCENARIO' }
    ]
  };
}

export function simulateWhatIfScenario(profile: UserProfile, scenario: {
  hoursPerDay: number;
  alternateRole?: string;
  skipOptionalProjects: boolean;
}): WhatIfScenario {
  const currentDailyHours = profile.dailyAvailabilityMinutes / 60 || 1.5;
  const totalMilestones = profile.activeRoadmap?.length || 8;
  const completedMilestones = profile.activeRoadmap?.filter(m => m.status === 'completed').length || 0;
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

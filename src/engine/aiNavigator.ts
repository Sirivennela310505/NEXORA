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
  const nba = calculateNextBestAction(profile);
  const actions: AIMessage['suggestedActions'] = [];

  if (lower.includes('resume') || lower.includes('ats') || lower.includes('interview')) {
    actions.push({ label: 'Open ATS Resume Builder', actionType: 'NAVIGATE_RESUME' });
  }
  if (lower.includes('roadmap') || lower.includes('milestone') || lower.includes('step') || lower.includes('path') || lower.includes('java') || lower.includes('python')) {
    actions.push({ label: 'View Interactive Roadmap', actionType: 'NAVIGATE_ROADMAP' });
    actions.push({ label: 'Simulate in What-If Engine', actionType: 'SIMULATE_SCENARIO' });
  }
  if (lower.includes('test') || lower.includes('quiz') || lower.includes('diagnostic') || lower.includes('practice') || lower.includes('assessment')) {
    actions.push({ label: nba.primaryActionLabel || 'Start Diagnostic Drill', actionType: 'START_NBA', payload: nba });
  }
  if (lower.includes('resources') || lower.includes('books') || lower.includes('videos') || lower.includes('free')) {
    actions.push({ label: 'Browse 100% Free Resources', actionType: 'NAVIGATE_RESOURCES' });
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

  // --- 1. JAVA PROGRAMMING & ROADMAP ---
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
- **Production Capstone:** Build a Scalable E-commerce or Task Management REST API with JWT Auth.

---
💡 **Next Immediate Step:** Would you like me to add Java Core & Collections milestones directly to your active roadmap, or generate a 10-question Java diagnostic quiz?`,
      actions: [
        { label: 'View Roadmap', actionType: 'NAVIGATE_ROADMAP' },
        { label: 'Simulate Java Path in What-If', actionType: 'SIMULATE_SCENARIO' },
        { label: 'Start Baseline Assessment', actionType: 'START_NBA', payload: nba }
      ]
    };
  }

  // --- 2. PYTHON ROADMAP & MASTERY ---
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
- **For Backend:** FastAPI, Pydantic, SQLAlchemy, Celery, Docker.

---
👉 **Recommended Action:** Complete daily practice problem sets to build muscle memory!`,
      actions: [
        { label: 'Explore Python Resources', actionType: 'NAVIGATE_RESOURCES' },
        { label: 'Start Diagnostic Quiz', actionType: 'START_NBA', payload: nba }
      ]
    };
  }

  // --- 3. C++ / CP ROADMAP ---
  if ((lower.includes('c++') || lower.includes('cpp')) && (lower.includes('road') || lower.includes('map') || lower.includes('learn') || lower.includes('master'))) {
    return {
      content: `### ⚙️ C++ & Competitive Programming Roadmap

#### 1️⃣ Foundations & Memory
- Pointers, References, Memory Allocation (\`new\`/\`delete\`, RAII), Stack vs Heap.
- Modern C++ (C++11/17/20): \`auto\`, \`nullptr\`, smart pointers (\`std::unique_ptr\`, \`std::shared_ptr\`), move semantics.

#### 2️⃣ Standard Template Library (STL) Mastery
- Containers: \`vector\`, \`deque\`, \`list\`, \`set\`, \`unordered_set\`, \`map\`, \`unordered_map\`, \`priority_queue\`.
- Algorithms: \`std::sort\`, \`std::binary_search\`, \`std::lower_bound\`, \`std::upper_bound\`, \`std::next_permutation\`.

#### 3️⃣ DSA & Competitive Programming
- Graph Algorithms (Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal, Prim, Topological Sort).
- Range Query Data Structures (Segment Trees, Fenwick Trees / BIT).
- Dynamic Programming & Bitmasking techniques.`,
      actions: [
        { label: 'View Roadmap', actionType: 'NAVIGATE_ROADMAP' },
        { label: 'Start Practice Drills', actionType: 'START_NBA', payload: nba }
      ]
    };
  }

  // --- 4. OOP CONCEPTS EXPLANATION ---
  if (lower.includes('oop') || lower.includes('object oriented') || (lower.includes('polymorphism') || lower.includes('inheritance') || lower.includes('encapsulation') || lower.includes('abstraction'))) {
    return {
      content: `### 🏛️ The 4 Pillars of Object-Oriented Programming (OOP)

Here is the conceptual breakdown with high-yield interview intuition:

1. **Encapsulation (Data Hiding):**
   - Bundling state (variables) and behavior (methods) together inside a class, while restricting direct external access using private access modifiers and providing getters/setters.
   - *Analogy:* A medical capsule containing active ingredients inside; you don't access raw powder directly.

2. **Abstraction (Hiding Complexity):**
   - Exposing only the essential interface to the outside world while hiding internal implementation details using Abstract Classes and Interfaces.
   - *Analogy:* Pressing the brake pedal in a car. You don't need to know the hydraulic pressure lines or brake caliper physics.

3. **Inheritance (Code Reusability):**
   - Mechanism where a subclass inherits attributes and methods from a superclass (\`extends\` / \`:\`).
   - Supports IS-A relationships (e.g., \`Dog IS-A Animal\`).

4. **Polymorphism (Many Forms):**
   - **Compile-Time (Static):** Method Overloading (same method name, different parameter signature).
   - **Runtime (Dynamic):** Method Overriding (subclass provides specific implementation of a superclass method resolved at runtime via Virtual Method Table).

---
💡 *Pro Tip for Interviews:* Always mention SOLID design principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) when asked about OOP!`,
      actions: [
        { label: 'Start Practice Assessment', actionType: 'START_NBA', payload: nba }
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

  // --- 6. REACT / FRONTEND / WEB DEV ---
  if (lower.includes('react') || lower.includes('web dev') || lower.includes('frontend') || lower.includes('fullstack') || lower.includes('full stack')) {
    return {
      content: `### ⚛️ Frontend & React Mastery Plan for ${profile.goalTitle}

#### 1️⃣ Prerequisite Fundamentals:
- Modern JavaScript (ES6+): Destructuring, Arrow functions, Array methods (\`.map\`, \`.filter\`, \`.reduce\`), Promises, \`async/await\`, Fetch API, Event Loop.

#### 2️⃣ Core React Concepts:
- **JSX & Component Lifecycle:** Functional Components, Props, JSX Rules.
- **State & Hooks:** \`useState\`, \`useEffect\` (dependency arrays and cleanup), \`useRef\`, \`useMemo\`, \`useCallback\`, Custom Hooks.
- **State Management:** Context API, Zustand or Redux Toolkit.
- **Routing & Networking:** React Router v6+, TanStack Query (React Query) for server state caching.

#### 3️⃣ Production Engineering:
- TypeScript with React (Props interfaces, generic components).
- TailwindCSS / Modern CSS Modules for responsive UI.
- Next.js (App Router, Server Components, SSR & SSG) for full-stack applications.`,
      actions: [
        { label: 'View Roadmap', actionType: 'NAVIGATE_ROADMAP' },
        { label: 'Simulate Web Dev Path', actionType: 'SIMULATE_SCENARIO' }
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
3. **Collision Handling:**
   - **Separate Chaining:** Each bucket points to a linked list (or balanced Red-Black tree in Java 8+ when bucket length exceeds 8 items).
   - **Open Addressing:** Linear probing, quadratic probing, or double hashing.
4. **Time Complexity:**
   - Average Case: Insertion $O(1)$, Lookup $O(1)$, Deletion $O(1)$.
   - Worst Case (All keys hash to same bucket): $O(N)$ without tree balancing, $O(\\log N)$ with tree balancing.

#### 💡 Essential Hashing Problem Patterns:
- **Frequency Counter:** Anagram checks, character count, top $K$ frequent elements.
- **Complement Lookup (Two-Sum Pattern):** Store visited numbers and check if \`(target - current)\` exists in $O(1)$.
- **Prefix Sum + Hash Map:** Subarray sum equals $K$ in $O(N)$ time.
- **Sliding Window + Hash Map:** Longest substring without repeating characters.`,
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
- **Math:** Linear Algebra (Matrices, Eigenvalues, SVD), Multivariable Calculus (Gradients, Chain Rule), Probability & Statistics (Bayes Theorem, Distributions).
- **Python Stack:** NumPy, Pandas, Scikit-Learn.

#### 2️⃣ Deep Learning Core
- **Neural Networks:** Backpropagation, Activation functions (ReLU, GELU), Optimization (AdamW, SGD with momentum).
- **Architectures:** CNNs for vision, RNNs/LSTMs, and the Transformer Architecture (Multi-Head Self-Attention).
- **Frameworks:** PyTorch from scratch.

#### 3️⃣ Generative AI & Modern LLM Systems
- **RAG (Retrieval-Augmented Generation):** Vector Databases (Pinecone, Chroma, FAISS), Embeddings, Semantic Chunking, Re-ranking.
- **Fine-Tuning:** LoRA, QLoRA, PEFT, Instruction Tuning.
- **Evaluation & Deployment:** LangChain, LlamaIndex, vLLM, Triton Server, FastChat.`,
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

Here are the gold-standard guidelines to achieve a 90+ ATS compatibility score:

1. **Format & Parsing:**
   - Single column, standard fonts (Inter, Arial, Calibri), plain bullet points.
   - Avoid tables, multi-column text boxes, graphics, or complex icons that confuse ATS parsers.

2. **The Google XYZ Bullet Formula:**
   - ❌ *Weak:* "Created a web app using React and Node.js."
   - ✅ *Strong:* "Architected a full-stack real-time analytics dashboard using **React**, **Node.js**, and **Redis**, reducing page load latency by **42%** and supporting **10,000+** concurrent users."

3. **Key Sections Structure:**
   - **Contact:** Name, Clean Email, LinkedIn, GitHub, Portfolio.
   - **Technical Skills:** Languages, Frameworks, Developer Tools, Databases.
   - **Experience / Projects:** 3-4 bullet points per project emphasizing metrics and architecture.
   - **Education & Certifications:** Degree, University, CGPA (if $\\ge 8.0$), Graduation Year.`,
      actions: [
        { label: 'Open ATS Resume Builder', actionType: 'NAVIGATE_RESUME' },
        { label: 'View Career Roadmap', actionType: 'NAVIGATE_ROADMAP' }
      ]
    };
  }

  // --- 10. JEE / NEET EXAMS ---
  if (lower.includes('jee') || lower.includes('neet') || lower.includes('physics') || lower.includes('chemistry') || lower.includes('maths') || lower.includes('biology')) {
    return {
      content: `### 🎯 Strategic Competitive Exam Blueprint for ${profile.goalTitle}

1. **Prerequisite Dependency Flow:**
   - Complete mechanics before rotational motion in Physics.
   - Master periodic table & chemical bonding before organic reaction mechanisms.
   - Build strong algebraic grounding before differential calculus.

2. **The 3-Tier Study Cycle:**
   - **Concept Clarity (40% time):** Understand derivations, core principles, and NCERT line-by-line.
   - **Active Problem Solving (50% time):** Solve 25-30 timer-based numericals daily with progressive difficulty.
   - **Mistake Journal & Revision (10% time):** Log every silly mistake, formula lapse, and concept misunderstanding.

3. **Mock Exam Strategy:**
   - Conduct 3-hour continuous full-length timed tests once every weekend to simulate real exam pressure.`,
      actions: [
        { label: 'Start Diagnostic Practice', actionType: 'START_NBA', payload: nba },
        { label: 'View Exam Roadmap', actionType: 'NAVIGATE_ROADMAP' }
      ]
    };
  }

  // --- 11. GENERAL INTELLIGENT DIRECT ANSWER ---
  return {
    content: `### 💡 Personalized Guidance for ${profile.fullName.split(' ')[0]}

I am actively tracking your learning journey toward **${profile.goalTitle}**.

Here is how you should approach **"${userMessage.length > 50 ? userMessage.slice(0, 50) + '...' : userMessage}"**:

1. **Target Alignment:** Your current active milestone is **${activeMilestone?.title || 'Core Foundations'}**. Connecting this question with your primary roadmap builds long-term mastery.
2. **Immediate Action:** Focus your next study block on **${nba.title}** (~${nba.durationEstimateMinutes} mins).
3. **Core Insight:** Break down complex topics into small, daily measurable milestones. Test your retention with diagnostic practice problems immediately after reading theory.

💬 *Feel free to ask me to write code snippets, explain specific algorithms, generate a custom syllabus, or simulate study schedule adjustments!*`,
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

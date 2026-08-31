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
        `Ask me anything! Whether you have specific doubts in Physics/Chemistry/Maths, need PYQ problem solving strategies, or want a 3-hour mock test time allocation — I'm here to help.`,
      suggestedActions: [
        { label: 'Calculus & Integration Strategy', actionType: 'PROMPT', payload: 'How to master Calculus and Integration for JEE Advanced?' },
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
        `Ask me about Math for ML, Neural Networks from scratch, PyTorch architectures, RAG & Vector Databases, LLM fine-tuning, or career guidance.`,
      suggestedActions: [
        { label: 'Which is better: Web Dev or ML?', actionType: 'PROMPT', payload: 'Which is better: web development or machine learning for career growth?' },
        { label: 'Explain RAG Architecture', actionType: 'PROMPT', payload: 'Explain how Retrieval-Augmented Generation (RAG) works with Vector Databases' },
        { label: 'Math Foundations for Deep Learning', actionType: 'PROMPT', payload: 'What linear algebra, multivariable calculus, and probability concepts do I need for AI?' },
        { label: 'What should I learn next?', actionType: 'PROMPT', payload: 'What should I learn next based on my AI/ML roadmap?' }
      ],
      inputPlaceholder: 'Ask about PyTorch, RAG architectures, Neural Networks, Math for ML, or AI career advice...'
    };
  }

  // 4. Data Science
  if (cat === 'data_science' || goalLower.includes('data science') || goalLower.includes('data analyst')) {
    return {
      greeting: `Hello ${firstName}! I am your **NEXORA Data Science & Analytics Navigator**.\n\n` +
        `I am tracking your learning milestones toward **${profile.goalTitle}**.\n\n` +
        `Ask me about SQL query optimization, Pandas/NumPy data wrangling, Exploratory Data Analysis, Machine Learning algorithms, or Data Storytelling.`,
      suggestedActions: [
        { label: 'SQL vs Python for Data Analysis', actionType: 'PROMPT', payload: 'Should I learn SQL or Python first for Data Science?' },
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
        { label: 'Which path is best for beginners?', actionType: 'PROMPT', payload: 'Which tech domain has the fastest hiring timeline for career switchers?' },
        { label: 'High-Impact Portfolio Projects', actionType: 'PROMPT', payload: 'What projects should I build to showcase skills to technical hiring managers?' },
        { label: 'How to optimize ATS Resume?', actionType: 'PROMPT', payload: 'How to format my resume for a tech career transition?' },
        { label: 'What should I learn next?', actionType: 'PROMPT', payload: 'What should I learn next based on my profile?' }
      ],
      inputPlaceholder: 'Ask about starting to code, portfolio projects, career transition tips, or roadmaps...'
    };
  }

  // 6. SWE / Internships / Web Development (Default Tech Domain)
  return {
    greeting: `Hello ${firstName}! I am your **NEXORA Software Engineering & Placement Navigator**.\n\n` +
      `I am continuously tracking your journey toward **${profile.goalTitle}**.\n\n` +
      `Ask me about Data Structures & Algorithms, comparisons between technologies, System Design, Core CS concepts, ATS Resume scores, or interview drills.`,
    suggestedActions: [
      { label: 'Web Dev vs Machine Learning', actionType: 'PROMPT', payload: 'Which is better: web development or machine learning?' },
      { label: 'What should I learn next?', actionType: 'PROMPT', payload: 'What should I learn next based on my profile?' },
      { label: 'Explain Hashing Intuition', actionType: 'PROMPT', payload: 'Explain Hashing and Hash Maps intuition' },
      { label: 'Explain OOP Concepts', actionType: 'PROMPT', payload: 'Explain the 4 pillars of OOP with real world examples' },
      { label: 'How to improve ATS Resume?', actionType: 'PROMPT', payload: 'How to improve my technical ATS resume?' }
    ],
    inputPlaceholder: 'Ask any question, comparison, concept doubt, or placement prep tip...'
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
    actions.push({ label: 'Browse Free Resources', actionType: 'NAVIGATE_RESOURCES' });
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
  const lower = userMessage.toLowerCase().trim();
  const nba = calculateNextBestAction(profile);
  const gaps = calculateSkillGaps(profile.skills, profile.goalCategory);
  const isRoadmapExplicitRequest = lower.includes('roadmap') || lower.includes('study plan') || lower.includes('syllabus') || lower.includes('provide the roadmap') || lower.includes('give me a roadmap');

  // ==========================================
  // 1. COMPARISON QUESTIONS ("Which is better", "vs", "Difference between")
  // ==========================================

  // Web Dev vs Machine Learning
  if ((lower.includes('web dev') || lower.includes('web development') || lower.includes('frontend') || lower.includes('full stack') || lower.includes('fullstack')) &&
      (lower.includes('machine learning') || lower.includes('ml') || lower.includes('ai') || lower.includes('data science'))) {
    return {
      content: `### ⚖️ Web Development vs Machine Learning: Which is Better for You?

Neither is objectively "better" — they serve different career paths, skill sets, and timelines. Here is the direct breakdown:

| Dimension | 🌐 Web Development | 🤖 Machine Learning / AI |
| :--- | :--- | :--- |
| **Learning Curve** | **Moderate:** You can build and deploy working full-stack apps in 2–4 months. | **Steep:** Requires solid linear algebra, calculus, probability, Python, and PyTorch. |
| **Entry Barrier** | **Lower:** High volume of entry-level and junior software roles. | **Higher:** Many roles prefer strong math foundations or specialized degrees/experience. |
| **Job Market Volume** | **Massive:** Every company needs websites, internal tools, and web apps. | **High Growth:** High demand for applied ML, RAG, and AI engineers. |
| **What You Actually Build** | Interactive user interfaces, APIs, database architectures, scalable cloud services. | Data pipelines, model training, fine-tuning LLMs, recommendation engines, predictive models. |
| **Visual Feedback** | Instant visual feedback (you code and see the UI update). | Abstract and mathematical (loss curves, metrics, tensor matrices). |

---

### 💡 Recommendation Based on Your Goals:
1. **Choose Web Development if:** You want faster job readiness, love building user-facing products, and want tangible projects quickly.
2. **Choose Machine Learning if:** You love mathematics, research, statistical analysis, and working with data/algorithms.
3. **The Best Modern Hybrid (Full-Stack AI Engineer):** Master Web Development (React/Next.js/FastAPI) and integrate AI APIs (OpenAI/Gemini/LangChain) into full-stack apps!`,
      actions: [
        { label: 'View Web Dev Path in What-If', actionType: 'SIMULATE_SCENARIO' },
        { label: 'View Active Roadmap', actionType: 'NAVIGATE_ROADMAP' }
      ]
    };
  }

  // Java vs Python
  if ((lower.includes('java') && lower.includes('python')) && (lower.includes('better') || lower.includes('vs') || lower.includes('difference') || lower.includes('choose') || lower.includes('which'))) {
    return {
      content: `### ⚖️ Java vs Python: Which Should You Learn?

- **Java:**
  - **Pros:** Strongly typed, high performance, industry standard for enterprise backend systems (Spring Boot), Android development, and campus placement coding rounds.
  - **Best For:** Software Engineering roles, Backend engineering, Scalable enterprise systems.
- **Python:**
  - **Pros:** Highly readable syntax, fastest prototyping, dominant language for AI, Machine Learning, Data Science, and Scripting.
  - **Best For:** AI/ML Engineers, Data Analysts, Automation, Fast MVP development.

👉 **Verdict:** If targeting **Enterprise SWE / Placements**, start with **Java**. If targeting **AI/ML or Data Science**, start with **Python**.`,
      actions: [
        { label: 'View Roadmap', actionType: 'NAVIGATE_ROADMAP' }
      ]
    };
  }

  // C++ vs Java
  if ((lower.includes('c++') || lower.includes('cpp')) && lower.includes('java') && (lower.includes('better') || lower.includes('vs') || lower.includes('difference'))) {
    return {
      content: `### ⚖️ C++ vs Java for DSA & Placements

- **C++:** Faster raw execution speed, STL (Standard Template Library) is concise, manual memory pointers. Highly favored for competitive programming (Codeforces, ICPC).
- **Java:** Automatic Garbage Collection, strictly object-oriented, cross-platform JVM, rich built-in Collections framework. Widely used in Big Tech and enterprise backend interviews.

👉 **Verdict:** Pick **C++** if your primary focus is Competitive Programming. Pick **Java** if you want to use the same language for both DSA interviews and enterprise development.`,
      actions: [
        { label: 'View Roadmap', actionType: 'NAVIGATE_ROADMAP' }
      ]
    };
  }

  // ==========================================
  // 2. DIRECT CONCEPT QUESTIONS & EXPLANATIONS
  // ==========================================

  // Recursion
  if (lower.includes('recursion') || lower.includes('recursive')) {
    return {
      content: `### 🔁 Understanding Recursion Intuition

Recursion occurs when a function calls itself to solve a smaller instance of the same problem until reaching a **base case**.

#### 🔑 The 3 Essential Components:
1. **Base Case:** The stopping condition that prevents infinite recursion (e.g. \`if (n <= 1) return 1;\`).
2. **Recursive Step:** Dividing the problem into a smaller subproblem (\`return n * factorial(n - 1);\`).
3. **Call Stack:** Every recursive call is pushed onto the system call stack in memory until the base case is reached, then unwinds.

\`\`\`java
// Classic Factorial Example in Java
public static int factorial(int n) {
    // 1. Base Case
    if (n <= 1) return 1;
    // 2. Recursive Step
    return n * factorial(n - 1);
}
\`\`\`

💡 *Memory Tip:* Always ensure your recursion reaches a base case to avoid a \`StackOverflowError\`!`,
      actions: [
        { label: 'Start DSA Diagnostic', actionType: 'START_NBA', payload: nba }
      ]
    };
  }

  // OOP Pillars
  if (lower.includes('oop') || lower.includes('object oriented') || lower.includes('polymorphism') || lower.includes('encapsulation') || lower.includes('abstraction') || lower.includes('inheritance')) {
    return {
      content: `### 🏛️ The 4 Pillars of Object-Oriented Programming (OOP)

1. **Encapsulation (Data Hiding):** Bundling data variables and methods together inside a class and restricting direct access using \`private\` modifiers.
2. **Abstraction (Hiding Complexity):** Exposing only essential interfaces while hiding internal logic (using Abstract classes & Interfaces).
3. **Inheritance (Code Reusability):** Allowing a subclass to inherit methods and fields from a parent class (\`extends\`).
4. **Polymorphism (Many Forms):**
   - *Compile-Time (Static):* Method Overloading (same name, different arguments).
   - *Runtime (Dynamic):* Method Overriding (subclass provides custom implementation of a parent method).`,
      actions: [
        { label: 'Start Baseline Assessment', actionType: 'START_NBA', payload: nba }
      ]
    };
  }

  // Hashing & Two Sum
  if (lower.includes('hashing') || lower.includes('hash map') || lower.includes('hashmap') || lower.includes('two sum')) {
    return {
      content: `### ⚡ Hashing & Hash Map Intuition

A **Hash Map** stores Key-Value pairs with an average **$O(1)$ constant time** lookup, insertion, and deletion.

#### 🔍 How It Works:
1. A **Hash Function** takes your key (e.g. \`"user123"\`) and converts it to an array bucket index.
2. If two keys hash to the same bucket (**Collision**), it handles it via **Separate Chaining** (linked list / balanced Red-Black tree) or **Open Addressing**.

#### 💡 The Two-Sum Pattern:
Instead of a slow $O(N^2)$ nested loop, use a Hash Map to store seen numbers. For each number, check if $(target - current)$ exists in the map in $O(1)$!`,
      actions: [
        { label: 'Start Hashing Drills', actionType: 'START_PRACTICE', payload: { skillId: 'swe-dsa-hashing' } }
      ]
    };
  }

  // RAG / LLMs
  if (lower.includes('rag') || lower.includes('retrieval augmented')) {
    return {
      content: `### 🤖 What is RAG (Retrieval-Augmented Generation)?

**RAG** is a technique that gives LLMs access to custom, up-to-date, or private data without needing to retrain or fine-tune the model.

#### 🔄 How the RAG Pipeline Works:
1. **Ingestion:** Documents (PDFs, docs) are split into chunks.
2. **Embedding:** Each chunk is converted into numerical vector embeddings (e.g. 1536-dimensional vectors).
3. **Vector Database:** Embeddings are stored in vector DBs like Chroma, Pinecone, or FAISS.
4. **Retrieval:** When a user asks a question, the question is embedded, and the vector DB finds the top $K$ most semantically relevant chunks (Cosine Similarity).
5. **Generation:** The retrieved chunks + user question are passed into the LLM prompt to generate an accurate, hallucination-free answer.`,
      actions: [
        { label: 'View AI/ML Roadmap', actionType: 'NAVIGATE_ROADMAP' }
      ]
    };
  }

  // ==========================================
  // 3. EXPLICIT ROADMAP REQUESTS ONLY
  // ==========================================

  if (isRoadmapExplicitRequest) {
    if (lower.includes('java')) {
      return {
        content: `### ☕ Step-by-Step Java Mastery Roadmap for ${profile.fullName.split(' ')[0]}

#### 1️⃣ Phase 1: Core Java Fundamentals (Week 1–3)
- Syntax, Loops, Conditions, Methods, Memory Model (Stack vs Heap).
- OOP Pillars: Classes, Objects, Inheritance, Polymorphism, Interfaces.

#### 2️⃣ Phase 2: Collections Framework & Generics (Week 4–5)
- \`ArrayList\`, \`LinkedList\`, \`HashSet\`, \`HashMap\`, \`PriorityQueue\`.
- Java 8+ Streams API (\`.filter()\`, \`.map()\`, \`.collect()\`), Lambdas, \`Optional\`.

#### 3️⃣ Phase 3: DSA in Java (Week 6–8)
- Implement Trees, Graphs, Sorting, Dynamic Programming in Java.

#### 4️⃣ Phase 4: Enterprise Frameworks & Projects (Week 9–12)
- Spring Boot, REST APIs, Hibernate, PostgreSQL, JWT Authentication.`,
        actions: [
          { label: 'View Flowchart Roadmap', actionType: 'NAVIGATE_ROADMAP' },
          { label: 'Simulate in What-If', actionType: 'SIMULATE_SCENARIO' }
        ]
      };
    }

    if (lower.includes('web dev') || lower.includes('frontend') || lower.includes('fullstack')) {
      return {
        content: `### 🌐 Full-Stack Web Development Roadmap

#### 1️⃣ Phase 1: Foundations (HTML, CSS, JavaScript)
- Semantic HTML, Modern CSS (Flexbox, Grid, TailwindCSS), Responsive Design.
- JavaScript ES6+: Async/Await, Promises, Closures, DOM Manipulation, Fetch API.

#### 2️⃣ Phase 2: Frontend Engineering (React / Next.js)
- Components, Props, State, Hooks (\`useState\`, \`useEffect\`, custom hooks).
- Next.js (App Router, Server Components, SSR, API routes).

#### 3️⃣ Phase 3: Backend & Databases
- Node.js & Express / Python FastAPI, RESTful API architecture.
- PostgreSQL / MongoDB, Prisma ORM, Authentication (JWT/OAuth).

#### 4️⃣ Phase 4: Production & Deployment
- Docker, CI/CD, Vercel/AWS deployment.`,
        actions: [
          { label: 'View Roadmap', actionType: 'NAVIGATE_ROADMAP' }
        ]
      };
    }
  }

  // ==========================================
  // 4. "WHAT SHOULD I LEARN NEXT" / ADVICE
  // ==========================================
  if (lower.includes('what should i learn') || lower.includes('where to start') || lower.includes('what next') || lower.includes('next step') || lower.includes('study today')) {
    return {
      content: `### 🎯 Real-Time Recommendation for ${profile.fullName.split(' ')[0]}

Based on your target goal **${profile.goalTitle}**:

- 📌 **Immediate Next Best Action:** **${nba.title}**
- ⏱️ **Estimated Duration:** ${nba.durationEstimateMinutes} minutes
- 🧠 **Why This Matters Now:** ${nba.whyThisIsNext}
- 📊 **Target Priority Gap:** **${gaps.criticalGaps[0]?.skillName || 'Core Foundations'}** (Current: ${gaps.criticalGaps[0]?.currentMastery || 35}%, Benchmark: 80%)

Focus on completing this milestone before branching into secondary topics!`,
      actions: [
        { label: nba.primaryActionLabel, actionType: 'START_NBA', payload: nba },
        { label: 'View Full Roadmap', actionType: 'NAVIGATE_ROADMAP' }
      ]
    };
  }

  // ==========================================
  // 5. DIRECT QUESTION FALLBACK (Natural Chatbot)
  // ==========================================
  return {
    content: `### 💬 Answer regarding "${userMessage.length > 40 ? userMessage.slice(0, 40) + '...' : userMessage}"

To address your question directly in the context of **${profile.goalTitle}**:

1. **Direct Insight:** When considering this topic, align it with your current target priority (**${nba.title}**).
2. **Key Takeaway:** Master the core underlying fundamentals first before moving into advanced tooling or theoretical edge cases.
3. **Next Action:** Spend ~${nba.durationEstimateMinutes} minutes completing your active diagnostic practice to measure retention.

💡 *Tip: Connect your free Google Gemini API key using the Key button at the top for real-time generative responses to any custom topic!*`,
    actions: [
      { label: nba.primaryActionLabel, actionType: 'START_NBA', payload: nba },
      { label: 'View Roadmap', actionType: 'NAVIGATE_ROADMAP' }
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
